import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  Building2,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  GraduationCap,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useAuth } from "../context/AuthContext";
import {
  getPartnerProfile,
  fetchPartnerInstitutionPrograms,
  createPartnerProgram,
  updatePartnerProgram,
  deletePartnerProgram,
  createPartnerProgramsBulk,
} from "../services/api";
import { trackEvent } from "../utils/analytics";

const PartnerPrograms = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [institution, setInstitution] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const initialForm = {
    name: "",
    university: "",
    faculty: "",
    campus: "",
    durations: "3",
    tuitionFee: "",
    requiresConcour: "false",
    requiredALSubjects: "",
    portalUrl: "",
    degreeObtained: "",
    careers: "",
    descriptions: "",
  };

  const [formData, setFormData] = useState(initialForm);
  // Bulk upload state
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const CSV_TEMPLATE = 
    "name,faculty,campus,durations,tuitionFee,requiresConcour,degreeObtained,requiredALSubjects,careers,descriptions\n" +
    '"Software Engineering","Faculty of Engineering & Technology","Main Campus",4,350000,false,"B.Tech","Mathematics, Physics","Software Engineer, DevOps Engineer, Fullstack Developer","Learn modern software engineering concepts and build scalable applications."\n' +
    '"Computer Science","Faculty of Science","Molyko Campus",3,200000,false,"B.Sc","Mathematics","Data Scientist, System Administrator, IT Consultant","Deep dive into computer architecture, programming, algorithms, and theory."\n' +
    '"Medicine and Surgery","Faculty of Health Sciences","Main Campus",7,900000,true,"M.D.","Biology, Chemistry","Medical Doctor, Surgeon, General Practitioner","Become a certified medical practitioner equipped to serve local communities."';

  const downloadSampleCsv = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "klarify_programs_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        handleCsvFile(file);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  const handleCsvFile = (file) => {
    setCsvFile(file || null);
    setCsvPreview([]);
  };

  const parseCSVText = (text) => {
    // Simple CSV parser that handles quoted fields
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length === 0) return [];
    const parseLine = (line) => {
      const result = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++; // skip escaped quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          result.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      result.push(cur);
      return result.map((s) => s.trim());
    };

    const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      if (cols.length === 0) continue;
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = cols[j] || "";
      }
      rows.push(obj);
    }
    return rows;
  };

  const parseCsvPreview = async () => {
    if (!csvFile) return;
    setParsing(true);
    try {
      const text = await csvFile.text();
      const rows = parseCSVText(text);
      setCsvPreview(rows);
      trackEvent("partner_programs_bulk_preview", { rows: rows.length });
    } catch (err) {
      console.error("CSV parse error", err);
      setCsvPreview([]);
    } finally {
      setParsing(false);
    }
  };

  const uploadCsv = async () => {
    if (!csvPreview || csvPreview.length === 0) return;
    setUploading(true);
    try {
      const payload = csvPreview.map((r) => ({
        ...r,
        university: r.university || institution?.name,
        institutionId: institution?.id || null,
      }));
      const resp = await createPartnerProgramsBulk(payload);
      trackEvent("partner_programs_bulk_uploaded", {
        uploaded: Array.isArray(resp) ? resp.length : 0,
      });
      // Refresh list
      await loadData();
      setCsvFile(null);
      setCsvPreview([]);
      alert("Programs uploaded successfully");
    } catch (err) {
      console.error("Bulk upload failed", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/partner/login");
      } else if (user.user_metadata?.user_type !== "INSTITUTION_ADMIN") {
        navigate("/");
      }
    }
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    if (user) {
      setLoading(true);
      try {
        const profile = await getPartnerProfile(user.id);
        const inst = profile || {
          name: user.user_metadata?.full_name
            ? `${user.user_metadata.full_name}'s Institute`
            : "Private University Partner",
          city: "Douala",
          campus: "Main Campus",
        };
        setInstitution(inst);

        const progs = await fetchPartnerInstitutionPrograms(inst.id, inst.name);
        setPrograms(progs);
        setFormData((f) => ({
          ...f,
          university: inst.name,
          campus: inst.campus || "Main Campus",
        }));
      } catch (err) {
        console.error("Failed to load programs:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenModal = (program = null) => {
    setFormError("");
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name || "",
        university: program.university || institution?.name || "",
        faculty: program.faculty || "",
        campus: program.campus || institution?.campus || "Main Campus",
        durations: String(program.durations || program.durationsNum || 3),
        tuitionFee: program.tuition_fee_xaf
          ? String(program.tuition_fee_xaf)
          : program.tuitionFee || "",
        requiresConcour: program.requires_concour ? "true" : "false",
        requiredALSubjects:
          program.required_al_subjects || program.requiredALSubjects || "",
        portalUrl: program.portal_url || program.portalUrl || "",
        degreeObtained: program.degree_obtained || program.degreeObtained || "",
        careers: Array.isArray(program.careers)
          ? program.careers.join(", ")
          : program.careers || "",
        descriptions: program.descriptions || "",
      });
    } else {
      setEditingProgram(null);
      setFormData({
        ...initialForm,
        university: institution?.name || "",
        campus: institution?.campus || "Main Campus",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.faculty) {
      setFormError("Program Name and Faculty / School are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingProgram) {
        await updatePartnerProgram(editingProgram.id, {
          ...formData,
          institutionId: institution?.id,
        });
      } else {
        await createPartnerProgram({
          ...formData,
          institutionId: institution?.id,
        });
      }

      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error("Save program error:", err);
      setFormError(err.message || "Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (programId) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await deletePartnerProgram(programId);
        setPrograms((prev) => prev.filter((p) => p.id !== programId));
      } catch (err) {
        console.error("Delete program error:", err);
      }
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-28">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Manage Listed Courses | Klarify Partner Portal"
        description="Add, edit, or remove your academic programs, tuition fees, and campus information."
      />

      <main className="py-6 pb-20 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/partner/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic Programs Studio
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Managing courses for{" "}
              <strong className="text-slate-800">{institution?.name}</strong>
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-orange-500/25 shrink-0 cursor-pointer"
          >
            <Plus size={18} />
            Add New Program
          </button>
        </div>

        {/* Bulk CSV Upload */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="text-orange-500" size={22} />
                  Bulk Upload Academic Programs
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a CSV file to add multiple Bachelor's degrees, HNDs, or Master's programs at once.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="inline-flex items-center gap-2 px-4 py-2 border border-orange-200 text-orange-600 font-bold text-xs rounded-xl hover:bg-orange-50 transition-colors cursor-pointer shrink-0"
              >
                <Download size={14} />
                Download Sample CSV
              </button>
            </div>

            {/* Custom Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("csv-file-input").click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                isDragging
                  ? "border-orange-500 bg-orange-50/20"
                  : csvFile
                  ? "border-green-400 bg-green-50/10"
                  : "border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/10"
              }`}
            >
              <input
                id="csv-file-input"
                type="file"
                accept="text/csv"
                className="hidden"
                onChange={(e) => handleCsvFile(e.target.files && e.target.files[0])}
              />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                csvFile ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
              }`}>
                {csvFile ? <CheckCircle2 size={24} /> : <Upload size={24} />}
              </div>
              {csvFile ? (
                <div>
                  <p className="text-sm font-bold text-slate-900">{csvFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(csvFile.size / 1024).toFixed(1)} KB &bull; File ready to parse
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Drag & drop your CSV file here, or <span className="text-orange-500">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Only CSV format is supported. Max file size: 10MB.
                  </p>
                </div>
              )}
            </div>

            {/* Collapsible Headers Guide */}
            <div className="mt-4 border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-slate-700 text-xs hover:bg-slate-55 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={15} className="text-orange-500" />
                  View CSV File Format & Columns Guide
                </span>
                {showInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showInstructions && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-[11px] text-slate-650 leading-relaxed space-y-4">
                  <p>
                    Ensure your CSV file contains the following column header row exactly as listed. The columns can be in any order:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-100">
                    <div>
                      <strong className="text-slate-900">name*</strong>: Name of the course (e.g. <code>Software Engineering</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">faculty*</strong>: Faculty name (e.g. <code>Faculty of Engineering</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">tuitionFee</strong>: Tuition amount in XAF (e.g. <code>350000</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">campus</strong>: Campus location (e.g. <code>Main Campus</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">durations</strong>: Duration in years (e.g. <code>4</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">requiresConcour</strong>: <code>true</code> or <code>false</code>
                    </div>
                    <div>
                      <strong className="text-slate-900">degreeObtained</strong>: Degree title (e.g. <code>B.Tech</code>, <code>HND</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">requiredALSubjects</strong>: Comma-separated (e.g. <code>Mathematics, Physics</code>)
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-orange-50 text-orange-850 p-3.5 rounded-xl border border-orange-100 text-xs">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <strong>Note:</strong> Columns marked with (*) are required. Download our sample CSV template using the button above to get started immediately.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Parse / Action Buttons */}
            {csvFile && (
              <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => handleCsvFile(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Clear File
                </button>
                <button
                  type="button"
                  onClick={parseCsvPreview}
                  disabled={parsing}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {parsing ? "Parsing File..." : "Preview Program List"}
                </button>
              </div>
            )}

            {/* Preview Section */}
            {csvPreview.length > 0 && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-bold text-slate-900">
                    Previewing {csvPreview.length} Programs
                  </div>
                  <button
                    type="button"
                    onClick={() => setCsvPreview([])}
                    className="text-[11px] font-semibold text-red-500 hover:text-red-400 cursor-pointer"
                  >
                    Clear Preview
                  </button>
                </div>
                
                <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/30 mb-4 max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        <th className="py-2.5 px-4">Name</th>
                        <th className="py-2.5 px-4">Faculty</th>
                        <th className="py-2.5 px-4">Tuition (XAF)</th>
                        <th className="py-2.5 px-4">Campus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvPreview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 bg-white transition-colors">
                          <td className="py-2 px-4 font-semibold text-slate-900">{row.name}</td>
                          <td className="py-2 px-4 text-slate-600">{row.faculty}</td>
                          <td className="py-2 px-4 text-slate-600">
                            {row.tuition_fee_xaf || row.tuitionFee || "N/A"}
                          </td>
                          <td className="py-2 px-4 text-slate-500">{row.campus || "Main Campus"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={uploadCsv}
                    disabled={uploading}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {uploading ? "Uploading Programs..." : `Confirm & Upload ${csvPreview.length} Programs`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Programs Data Table */}
        {programs.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Program & Faculty</th>
                    <th className="py-4 px-4">Campus</th>
                    <th className="py-4 px-4">Duration</th>
                    <th className="py-4 px-4">Tuition Fee (XAF)</th>
                    <th className="py-4 px-4">Entry Type</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {programs.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500 font-normal">
                          {p.faculty || "Faculty"}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          {p.campus || institution?.campus || "Main Campus"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {p.durations || p.durationsNum || 3} Years
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {p.tuition_fee_xaf
                          ? `${Number(p.tuition_fee_xaf).toLocaleString()} XAF`
                          : "Contact Campus"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            p.requires_concour || p.requiresConcours
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-green-50 text-green-700 border border-green-100"
                          }`}
                        >
                          {p.requires_concour || p.requiresConcours
                            ? "Concours Exam"
                            : "Direct Entry"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Program"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Program"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
            <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No programs listed yet
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Start adding your university's degree programs, tuition fees, and
              campus locations so A-Level students can find you.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus size={16} />
              Add Your First Program
            </button>
          </div>
        )}

        {/* Modal Dialog for Add / Edit Program */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingProgram
                      ? "Edit Program Details"
                      : "Add New Academic Program"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Enter the course specifications as displayed in your
                    official university prospectus.
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                    {formError}
                  </div>
                )}

                {/* University Name & Program Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      University / Institution Name *
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Program Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. BSc Software Engineering"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* School/Faculty & Campus Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School or Faculty *
                    </label>
                    <input
                      type="text"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleFormChange}
                      placeholder="e.g. School of Business / COLTECH"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      School Campus Location *
                    </label>
                    <input
                      type="text"
                      name="campus"
                      value={formData.campus}
                      onChange={handleFormChange}
                      placeholder="e.g. Akwa Campus / Molyko Campus"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Duration, Tuition Fee, & Entry Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Program Duration (Years) *
                    </label>
                    <select
                      name="durations"
                      value={formData.durations}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="1">1 Year</option>
                      <option value="2">2 Years (HND / Dip)</option>
                      <option value="3">3 Years (Bachelor's)</option>
                      <option value="4">4 Years (Engineering/BTech)</option>
                      <option value="5">5+ Years (Medicine/Specialist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tuition Fee per Year (XAF)
                    </label>
                    <input
                      type="number"
                      name="tuitionFee"
                      value={formData.tuitionFee}
                      onChange={handleFormChange}
                      placeholder="e.g. 350000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admission Entry Mode *
                    </label>
                    <select
                      name="requiresConcour"
                      value={formData.requiresConcour}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="false">Direct Admission (No Exam)</option>
                      <option value="true">Entrance Exam (Concours)</option>
                    </select>
                  </div>
                </div>

                {/* Degree Obtained & Required A-Level Subjects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Degree Obtained *
                    </label>
                    <select
                      name="degreeObtained"
                      value={formData.degreeObtained}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select Degree Type...</option>
                      <option value="HND">Higher National Diploma (HND)</option>
                      <option value="BSc">Bachelor of Science (BSc)</option>
                      <option value="BA">Bachelor of Arts (BA)</option>
                      <option value="BTech">Bachelor of Technology (BTech)</option>
                      <option value="BEng">Bachelor of Engineering (BEng)</option>
                      <option value="Master">Master's Degree</option>
                      <option value="PhD">Doctorate (PhD)</option>
                      <option value="Other">Other Certificate / Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Required GCE A-Level Subjects
                    </label>
                    <input
                      type="text"
                      name="requiredALSubjects"
                      value={formData.requiredALSubjects}
                      onChange={handleFormChange}
                      placeholder="e.g. Mathematics, Physics, Chemistry"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Application Portal Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Portal URL
                  </label>
                  <input
                    type="url"
                    name="portalUrl"
                    value={formData.portalUrl}
                    onChange={handleFormChange}
                    placeholder="https://youruniversity.cm/apply"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Career Pathways */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Career Pathways (comma separated)
                  </label>
                  <input
                    type="text"
                    name="careers"
                    value={formData.careers}
                    onChange={handleFormChange}
                    placeholder="e.g. Software Developer, Systems Architect, QA Tester"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Program Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Program Overview / Description
                  </label>
                  <textarea
                    name="descriptions"
                    rows={3}
                    value={formData.descriptions}
                    onChange={handleFormChange}
                    placeholder="Provide a brief summary of what students will learn in this degree program..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>
                          {editingProgram ? "Save Changes" : "Publish Program"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default PartnerPrograms;
