/**
 * Comprehensive Skills, Career Roles, and Fulfillment Catalog
 * Powers the Skill Assessment & Career Gap Bridge Engine
 * Covers both Remote (Global/Pan-African) and Onsite (Cameroon) pathways.
 */

export const SKILL_CATEGORIES = {
  "Data & AI": [
    { id: "excel", name: "Microsoft Excel / Spreadsheets", popular: true },
    { id: "sql", name: "SQL & Relational Databases", popular: true },
    { id: "powerbi", name: "Power BI", popular: true },
    { id: "tableau", name: "Tableau" },
    { id: "python_data", name: "Python for Data Analysis (Pandas, NumPy)", popular: true },
    { id: "statistics", name: "Applied Business Statistics" },
    { id: "machine_learning", name: "Machine Learning Foundations" },
    { id: "data_scraping", name: "Data Cleaning & ETL" }
  ],
  "Software & Web": [
    { id: "html_css", name: "HTML5 & Modern CSS", popular: true },
    { id: "javascript", name: "JavaScript / TypeScript", popular: true },
    { id: "react", name: "React.js", popular: true },
    { id: "nodejs", name: "Node.js & Express" },
    { id: "python_backend", name: "Python / Django / FastAPI", popular: true },
    { id: "git_github", name: "Git & Version Control", popular: true },
    { id: "mobile_flutter", name: "Flutter / Mobile Development" },
    { id: "api_design", name: "REST API Integration" }
  ],
  "Business & Finance": [
    { id: "financial_accounting", name: "Financial Accounting & Bookkeeping", popular: true },
    { id: "sage_saari", name: "Sage / Saari Accounting Software (OHADA)", popular: true },
    { id: "financial_modeling", name: "Financial Modeling & Valuation" },
    { id: "virtual_assistance", name: "Virtual Assistance & Executive Support", popular: true },
    { id: "project_management", name: "Project Management (Agile / Scrum)" },
    { id: "customer_support", name: "Customer Service & CRM (Zendesk, HubSpot)", popular: true },
    { id: "sales_negotiation", name: "B2B Sales & Lead Generation" }
  ],
  "Design & Creative": [
    { id: "ui_ux_figma", name: "UI/UX Design in Figma", popular: true },
    { id: "graphic_design", name: "Graphic Design (Photoshop / Illustrator)", popular: true },
    { id: "video_editing", name: "Video Editing (Premiere / CapCut)", popular: true },
    { id: "content_writing", name: "Copywriting & Content Strategy", popular: true },
    { id: "digital_marketing", name: "Social Media & Performance Ads (Meta, Google)", popular: true },
    { id: "seo", name: "Search Engine Optimization (SEO)" }
  ],
  "Vocational & TVEE": [
    { id: "solar_installation", name: "Solar PV Installation & Renewable Energy", popular: true },
    { id: "electrical_wiring", name: "Domestic & Industrial Electrical Wiring", popular: true },
    { id: "network_admin", name: "Computer Networking & Maintenance (Cisco / CCNA)" },
    { id: "automotive_diagnostics", name: "Automotive Electronic Diagnostics" },
    { id: "welding_fabrication", name: "Metal Fabrication & Welding" }
  ],
  "Languages & Soft Skills": [
    { id: "bilingual_en_fr", name: "Bilingual Professional Fluency (English & French)", popular: true },
    { id: "business_writing", name: "Professional Report & Proposal Writing" },
    { id: "remote_work_tools", name: "Remote Team Tools (Slack, Notion, Asana, Loom)", popular: true }
  ]
};

export const CAREER_ROLES = [
  {
    id: "data_analyst",
    title: "Data & Business Intelligence Analyst",
    domain: "Data & AI",
    description: "Analyze business metrics, design interactive dashboards, and help organizations make data-driven decisions.",
    workModes: ["remote", "onsite"],
    localDemand: "High (Douala, Yaoundé financial and telecom sectors)",
    remoteDemand: "Very High (Global remote contracts in USD/EUR)",
    salaryRange: "250,000 - 750,000 XAF/mo (Local) | $1,200 - $3,500/mo (Remote)",
    requiredSkills: [
      { id: "excel", name: "Microsoft Excel / Spreadsheets", minLevel: "Advanced" },
      { id: "sql", name: "SQL & Relational Databases", minLevel: "Intermediate" },
      { id: "powerbi", name: "Power BI", minLevel: "Intermediate" },
      { id: "statistics", name: "Applied Business Statistics", minLevel: "Beginner" }
    ],
    optionalSkills: ["python_data", "tableau", "bilingual_en_fr"]
  },
  {
    id: "frontend_developer",
    title: "Junior Frontend Developer",
    domain: "Software & Web",
    description: "Build user-facing web applications, responsive websites, and interactive portals using modern web technologies.",
    workModes: ["remote", "onsite"],
    localDemand: "High (Tech agencies, startups in Buea & Douala)",
    remoteDemand: "Very High (Global remote tech jobs)",
    salaryRange: "200,000 - 600,000 XAF/mo (Local) | $1,000 - $3,000/mo (Remote)",
    requiredSkills: [
      { id: "html_css", name: "HTML5 & Modern CSS", minLevel: "Advanced" },
      { id: "javascript", name: "JavaScript / TypeScript", minLevel: "Intermediate" },
      { id: "react", name: "React.js", minLevel: "Intermediate" },
      { id: "git_github", name: "Git & Version Control", minLevel: "Intermediate" }
    ],
    optionalSkills: ["ui_ux_figma", "api_design", "remote_work_tools"]
  },
  {
    id: "accounting_assistant",
    title: "Accounting & Financial Operations Associate",
    domain: "Business & Finance",
    description: "Manage journals, balance sheets, payroll processing, and OHADA tax compliance for corporate enterprises.",
    workModes: ["onsite"],
    localDemand: "Very High (Crucial in all Cameroonian private & state companies)",
    remoteDemand: "Moderate (Remote bookkeeping for francophone/pan-African firms)",
    salaryRange: "180,000 - 500,000 XAF/mo (Local)",
    requiredSkills: [
      { id: "financial_accounting", name: "Financial Accounting & Bookkeeping", minLevel: "Intermediate" },
      { id: "excel", name: "Microsoft Excel / Spreadsheets", minLevel: "Intermediate" },
      { id: "sage_saari", name: "Sage / Saari Accounting Software (OHADA)", minLevel: "Intermediate" }
    ],
    optionalSkills: ["bilingual_en_fr", "financial_modeling"]
  },
  {
    id: "virtual_assistant",
    title: "Executive Virtual Assistant & Operations Specialist",
    domain: "Business & Finance",
    description: "Support international founders and businesses with administrative tasks, scheduling, inbox management, and CRM maintenance.",
    workModes: ["remote"],
    localDemand: "Moderate",
    remoteDemand: "Extremely High (Direct USD contracts from US/Europe/UK)",
    salaryRange: "$600 - $2,200/mo (Remote USD)",
    requiredSkills: [
      { id: "virtual_assistance", name: "Virtual Assistance & Executive Support", minLevel: "Intermediate" },
      { id: "remote_work_tools", name: "Remote Team Tools (Slack, Notion, Asana, Loom)", minLevel: "Intermediate" },
      { id: "bilingual_en_fr", name: "Bilingual Professional Fluency (English & French)", minLevel: "Intermediate" },
      { id: "excel", name: "Microsoft Excel / Spreadsheets", minLevel: "Beginner" }
    ],
    optionalSkills: ["customer_support", "content_writing", "project_management"]
  },
  {
    id: "ui_ux_designer",
    title: "Product (UI/UX) Designer",
    domain: "Design & Creative",
    description: "Design mobile apps, SaaS dashboards, wireframes, and design systems with seamless user journeys.",
    workModes: ["remote", "onsite"],
    localDemand: "Moderate (Digital agencies and fintechs)",
    remoteDemand: "Very High (Global remote contracts)",
    salaryRange: "250,000 - 700,000 XAF/mo (Local) | $1,200 - $4,000/mo (Remote)",
    requiredSkills: [
      { id: "ui_ux_figma", name: "UI/UX Design in Figma", minLevel: "Advanced" },
      { id: "graphic_design", name: "Graphic Design (Photoshop / Illustrator)", minLevel: "Intermediate" },
      { id: "html_css", name: "HTML5 & Modern CSS", minLevel: "Beginner" }
    ],
    optionalSkills: ["content_writing", "remote_work_tools"]
  },
  {
    id: "digital_marketer",
    title: "Digital Growth & Performance Marketer",
    domain: "Design & Creative",
    description: "Drive customer acquisition, run targeted ad campaigns, optimize conversion funnels, and manage brand community.",
    workModes: ["remote", "onsite"],
    localDemand: "High (E-commerce, consumer brands, agencies in Douala/Yaoundé)",
    remoteDemand: "High (Global marketing teams)",
    salaryRange: "200,000 - 550,000 XAF/mo (Local) | $800 - $2,500/mo (Remote)",
    requiredSkills: [
      { id: "digital_marketing", name: "Social Media & Performance Ads (Meta, Google)", minLevel: "Intermediate" },
      { id: "content_writing", name: "Copywriting & Content Strategy", minLevel: "Intermediate" },
      { id: "graphic_design", name: "Graphic Design (Photoshop / Illustrator)", minLevel: "Beginner" }
    ],
    optionalSkills: ["video_editing", "seo", "excel"]
  },
  {
    id: "solar_technician",
    title: "Solar PV & Energy Systems Specialist",
    domain: "Vocational & TVEE",
    description: "Design, size, install, and service decentralized solar power systems for homes, hospitals, and agro-industries across Cameroon.",
    workModes: ["onsite"],
    localDemand: "Extremely High (Booming off-grid energy demand across CEMAC)",
    remoteDemand: "Low (Field technical execution)",
    salaryRange: "200,000 - 650,000 XAF/mo + Independent Contracting",
    requiredSkills: [
      { id: "solar_installation", name: "Solar PV Installation & Renewable Energy", minLevel: "Intermediate" },
      { id: "electrical_wiring", name: "Domestic & Industrial Electrical Wiring", minLevel: "Intermediate" }
    ],
    optionalSkills: ["project_management", "sales_negotiation"]
  }
];

export const FULFILLMENT_RESOURCES = [
  // SQL
  {
    skillId: "sql",
    title: "SQL for Data Science Specialization",
    provider: "Coursera (UC Davis)",
    type: "course",
    deliveryMode: "remote",
    cost: "Free Audit / Paid Cert",
    duration: "4 weeks (Self-paced)",
    url: "https://www.coursera.org/specializations/learn-sql-basics-data-science",
    description: "Learn SQL fundamentals, data aggregation, filtering, subqueries, and relational table joins."
  },
  {
    skillId: "sql",
    title: "Practical SQL Bootcamp",
    provider: "Seven Academy (Douala)",
    type: "bootcamp",
    deliveryMode: "onsite",
    city: "Douala",
    cost: "Paid (Installments)",
    duration: "8 weeks",
    url: "https://sevenadvancedacademy.com",
    description: "In-person hands-on database modeling, PostgreSQL queries, and real company case studies."
  },
  {
    skillId: "sql",
    title: "SQL in 10 Minutes, Sams Teach Yourself",
    provider: "Ben Forta (Book)",
    type: "book",
    deliveryMode: "remote",
    cost: "Book / PDF",
    duration: "Self-paced",
    url: "https://www.amazon.com/SQL-Minutes-Sams-Teach-Yourself/dp/0672336073",
    description: "Concise, zero-fluff manual on everyday SQL syntax used by top analysts."
  },

  // Power BI
  {
    skillId: "powerbi",
    title: "Microsoft Power BI Data Analyst Professional Certificate (PL-300)",
    provider: "Coursera (Microsoft)",
    type: "course",
    deliveryMode: "remote",
    cost: "Free Audit / Paid Cert",
    duration: "6 weeks",
    url: "https://www.coursera.org/professional-certificates/microsoft-power-bi-data-analyst",
    description: "Official Microsoft certification curriculum: data modeling, DAX formulas, and interactive KPI dashboards."
  },
  {
    skillId: "powerbi",
    title: "Business Intelligence Junior Internship",
    provider: "Klarify Partner Tech Lab",
    type: "internship",
    deliveryMode: "remote",
    cost: "Paid Stipend (80,000 XAF/mo)",
    duration: "3 months",
    url: "/partners",
    description: "Work on live analytics dashboards for regional Cameroonian e-commerce and logistics partners."
  },

  // Sage Saari
  {
    skillId: "sage_saari",
    title: "Pratique Comptable sur Sage 100 Comptabilité (Système OHADA)",
    provider: "Institut Professionnel de Gestion (Douala & Yaoundé)",
    type: "bootcamp",
    deliveryMode: "onsite",
    city: "Douala / Yaoundé",
    cost: "Paid Training",
    duration: "4 weeks intensive",
    url: "/partners",
    description: "Saisie des écritures, rapprochements bancaires, balance générale, et liasse fiscale DSF selon les normes OHADA."
  },

  // React & Web
  {
    skillId: "react",
    title: "Meta Front-End Developer Professional Certificate",
    provider: "Coursera (Meta)",
    type: "course",
    deliveryMode: "remote",
    cost: "Financial Aid Available",
    duration: "7 months",
    url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    description: "HTML, CSS, modern JavaScript, React components, state management, and capstone portfolio projects."
  },
  {
    skillId: "react",
    title: "Frontend Engineering Immersion Bootcamp",
    provider: "ActivSpaces Silicon Mountain (Buea)",
    type: "bootcamp",
    deliveryMode: "onsite",
    city: "Buea",
    cost: "Paid (Scholarships available)",
    duration: "12 weeks",
    url: "https://activspaces.com",
    description: "Full immersive cohort building production React applications with senior mentor code reviews."
  },
  {
    skillId: "react",
    title: "Remote Junior Frontend Internship",
    provider: "Pan-African Fintech Partner",
    type: "internship",
    deliveryMode: "remote",
    cost: "Paid Stipend ($250/mo)",
    duration: "4 months",
    url: "/partners",
    description: "Collaborate with a remote engineering team across Lagos, Nairobi, and Douala building React web apps."
  },

  // Virtual Assistance & Remote Tools
  {
    skillId: "virtual_assistance",
    title: "The Complete Virtual Assistant Accelerator",
    provider: "ALX Africa / Remote Learning Hub",
    type: "bootcamp",
    deliveryMode: "remote",
    cost: "Sponsored / Free",
    duration: "8 weeks",
    url: "https://www.alxafrica.com",
    description: "Master calendar management, asynchronous communication, Notion, executive travel planning, and international client etiquette."
  },
  {
    skillId: "remote_work_tools",
    title: "Remote Work Operations & Productivity",
    provider: "GitLab Remote Guides / Coursera",
    type: "course",
    deliveryMode: "remote",
    cost: "Free",
    duration: "1 week",
    url: "https://about.gitlab.com/company/culture/all-remote/guide/",
    description: "Industry-standard handbook on documentation, async task delegation, Slack etiquette, and accountability."
  },

  // Solar Energy
  {
    skillId: "solar_installation",
    title: "Formation Pratique Dimensionnement et Pose Systèmes Solaires Photovoltaïques",
    provider: "Centre des Métiers Techniques (Douala - Bassa)",
    type: "vocational_training",
    deliveryMode: "onsite",
    city: "Douala",
    cost: "Paid (Financed via MINEFOP credits)",
    duration: "6 weeks",
    url: "/partners",
    description: "Dimensionnement des panneaux, régulateurs MPPT, parcs de batteries lithium et onduleurs hybrides sur bancs d'essai réels."
  },

  // UI/UX Figma
  {
    skillId: "ui_ux_figma",
    title: "Google UX Design Professional Certificate",
    provider: "Coursera (Google)",
    type: "course",
    deliveryMode: "remote",
    cost: "Financial Aid Available",
    duration: "6 months",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    description: "User research, wireframing, high-fidelity prototypes in Figma, and creating a 3-project design portfolio."
  },
  {
    skillId: "ui_ux_figma",
    title: "Refactoring UI",
    provider: "Adam Wathan & Steve Schoger (Book)",
    type: "book",
    deliveryMode: "remote",
    cost: "Digital Book",
    duration: "Self-paced",
    url: "https://www.refactoringui.com",
    description: "The definitive practical handbook for developers and designers to build polished interfaces from scratch."
  }
];
