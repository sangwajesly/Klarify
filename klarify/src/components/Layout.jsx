import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "../utils/analytics";

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors duration-200 relative pb-0.5 ${
        isActive
          ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-orange-500"
          : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
};

// ── Language Toggle Button ────────────────────────────────────────────────────
const LanguageToggle = ({ language, setLanguage, compact = false }) => (
  <div
    className={`flex items-center rounded-lg overflow-hidden border ${compact ? "border-slate-200" : "border-white/20"} shrink-0`}
  >
    {["en", "fr"].map((lang) => (
      <button
        key={lang}
        type="button"
        onClick={() => setLanguage(lang)}
        aria-label={`Switch to ${lang === "en" ? "English" : "French"}`}
        className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors duration-150 ${
          language === lang
            ? compact
              ? "bg-orange-500 text-white"
              : "bg-orange-500 text-white"
            : compact
              ? "bg-transparent text-slate-500 hover:text-slate-800"
              : "bg-transparent text-slate-400 hover:text-white"
        }`}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
);

const GoogleTranslateWidget = () => {
  useEffect(() => {
    const scriptId = "google-translate-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      );
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="hidden md:inline text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Translate
      </span>
      <div id="google_translate_element" className="min-w-27.5" />
    </div>
  );
};

const Layout = ({ children, noPadding = false }) => {
  const { user, loading, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 py-3.5 sticky top-0 z-50">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              K
            </div>
            <Link
              to="/"
              className="font-bold text-lg text-slate-900 tracking-tight hover:text-slate-700 transition-colors"
            >
              Klarify
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-7">
              <NavLink to="/">{t("nav.home")}</NavLink>
              <NavLink
                to="/partners"
                onClick={() =>
                  trackEvent("partner_cta_click", { location: "header_nav" })
                }
              >
                {t("nav.partner")}
              </NavLink>
              <NavLink to="/about">{t("nav.about")}</NavLink>
            </nav>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <LanguageToggle
                language={language}
                setLanguage={setLanguage}
                compact={true}
              />
              <GoogleTranslateWidget />
              {!loading && user ? (
                <>
                  <span className="text-sm text-slate-500 hidden lg:inline truncate max-w-40">
                    {user.email}
                  </span>
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {t("nav.profile")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {t("nav.signIn")}
                  </Link>
                  <Link
                    to="/flow"
                    className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {t("nav.getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200/60 shadow-lg fixed top-14.25 left-0 right-0 z-50 overflow-hidden max-h-[calc(100vh-60px)]"
          >
            <nav className="flex flex-col px-6 py-4 space-y-4">
              {/* Language Switcher */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {t("common.language")}
                </span>
                <LanguageToggle
                  language={language}
                  setLanguage={setLanguage}
                  compact={true}
                />
              </div>

              <div className="pb-2 border-b border-slate-100">
                <GoogleTranslateWidget />
              </div>

              <Link
                to="/"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent("nav_click", {
                    label: "home",
                    location: "mobile_menu",
                  });
                }}
                className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/universities"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent("nav_click", {
                    label: "universities",
                    location: "mobile_menu",
                  });
                }}
                className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
              >
                {t("nav.universities")}
              </Link>
              <Link
                to="/programs"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent("nav_click", {
                    label: "programs",
                    location: "mobile_menu",
                  });
                }}
                className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
              >
                {t("nav.programs")}
              </Link>
              <Link
                to="/guides"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent("nav_click", {
                    label: "guides",
                    location: "mobile_menu",
                  });
                }}
                className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
              >
                {t("nav.guides")}
              </Link>
              <Link
                to="/partners?utm_source=site&utm_medium=mobile_menu&utm_campaign=partner_acquisition"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent("partner_cta_click", { location: "mobile_menu" });
                }}
                className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
              >
                {t("nav.partner")}
              </Link>
              <Link
                to="/about"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackEvent("nav_click", {
                    label: "about",
                    location: "mobile_menu",
                  });
                }}
                className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
              >
                {t("nav.about")}
              </Link>

              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                {!loading && user ? (
                  <>
                    <span className="text-sm text-slate-500 truncate">
                      {user.email}
                    </span>
                    <Link
                      to="/profile"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        trackEvent("nav_click", {
                          label: "profile",
                          location: "mobile_menu",
                        });
                      }}
                      className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
                    >
                      {t("nav.profile")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-base font-medium text-red-500 hover:text-red-600 transition-colors"
                    >
                      {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        trackEvent("nav_click", {
                          label: "sign_in",
                          location: "mobile_menu",
                        });
                      }}
                      className="text-base font-medium text-slate-700 hover:text-orange-500 transition-colors"
                    >
                      {t("nav.signIn")}
                    </Link>
                    <Link
                      to="/flow"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        trackEvent("nav_click", {
                          label: "get_started",
                          location: "mobile_menu",
                        });
                      }}
                      className="inline-block text-center px-5 py-3 bg-slate-900 text-white text-base font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      {t("nav.getStarted")}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Partner FAB (A/B test): only show on small screens and when variant == 'fab' */}
      {typeof window !== "undefined" &&
        (() => {
          try {
            let ab = localStorage.getItem("partner_ab");
            if (!ab) {
              ab = Math.random() < 0.5 ? "fab" : "nav";
              localStorage.setItem("partner_ab", ab);
            }
            // Hide WhatsApp card for partner users (institution admins)
            if (
              user &&
              user.user_metadata &&
              user.user_metadata.user_type === "INSTITUTION_ADMIN"
            ) {
              return null;
            }

            if (ab === "fab") {
              return (
                <button
                  onClick={() => {
                    trackEvent("whatsapp_join_click", {
                      location: "mobile_whatsapp_card",
                    });
                    try {
                      window.open(
                        "https://chat.whatsapp.com/IJt9zyMnPj0Gm4q2V7fdLj",
                        "_blank",
                      );
                    } catch (e) {
                      window.location.href =
                        "https://chat.whatsapp.com/IJt9zyMnPj0Gm4q2V7fdLj";
                    }
                  }}
                  className="md:hidden fixed bottom-6 right-4 z-50 bg-[#25D366] text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg hover:bg-[#20ba56]"
                  aria-label="Join Klarify WhatsApp Community"
                >
                  <span className="text-lg">💬</span>
                  <span className="text-sm font-semibold">Join WhatsApp</span>
                </button>
              );
            }
            return null;
          } catch (e) {
            return null;
          }
        })()}

      {/* ── Page Content ── */}
      <main
        className={`flex-1 ${noPadding ? "" : "max-w-6xl w-full mx-auto p-6 md:p-12"}`}
      >
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 pt-14 pb-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Footer grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-4 md:pr-8 md:border-r md:border-slate-800">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  K
                </div>
                <span className="font-bold text-base text-white tracking-tight">
                  Klarify
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs text-slate-400">
                Personalized academic recommendations to help students find the
                right university programs and career paths based on their unique
                strengths.
              </p>
            </div>

            {/* Platform col */}
            <div className="col-span-1 md:col-span-2 md:pl-6">
              <h4 className="text-white text-sm font-semibold mb-4 tracking-tight">
                {t("footer.platform")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/flow"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("footer.alPath")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/partners"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("footer.partners")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("footer.aboutKlarify")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources col */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white text-sm font-semibold mb-4 tracking-tight">
                {t("footer.resources")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/universities"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("nav.universities")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/programs"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("nav.programs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("footer.careers")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("nav.guides")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacts col */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white text-sm font-semibold mb-4 tracking-tight">
                {t("footer.contact")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="text-slate-400 leading-relaxed">
                  672-507-711 <br />
                  678-557-731
                </li>
                <li className="pt-1">
                  <a
                    href="https://chat.whatsapp.com/IJt9zyMnPj0Gm4q2V7fdLj"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    {t("footer.joinWhatsapp")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal col */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white text-sm font-semibold mb-4 tracking-tight">
                {t("footer.legal")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("footer.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors duration-150"
                  >
                    {t("footer.terms")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
