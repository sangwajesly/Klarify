import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children, noPadding = false }) => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200/60 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-slate-900 tracking-tight leading-none">
              <a href="/" className="hover:text-orange-600 transition-colors">
                Klarify
              </a>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link
              to="/gce-results"
              className="px-6 py-2.5 mx-6 bg-linear-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Check GCE Results
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            {!loading && user ? (
              <>
                <span className="text-sm text-slate-600 hidden lg:inline">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden">
          {!loading && user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main
        className={`flex-1 ${noPadding ? "" : "max-w-5xl w-full mx-auto p-6 md:p-12"}`}
      >
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                K
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Klarify
              </span>
            </div>
            <p className="text-sm max-w-xs mb-6">
              AI-powered academic recommendations to help students find the
              right university programs and career paths based on their unique
              strengths.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/flow" className="hover:text-white transition-colors">
                  A/L Student Path
                </Link>
              </li>
              <li>
                <Link
                  to="/gce-results"
                  className="hover:text-white transition-colors"
                >
                  Check GCE Results
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Klarify
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-semibold mb-4">Contacts & Community</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <span className="text-slate-400">Call/WhatsApp: 672-507-711 / 678-557-731</span>
              </li>
              <li className="pt-2">
                <a
                  className="px-6 py-2 hover:text-white transition-colors bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium shadow-sm inline-block"
                  href="https://chat.whatsapp.com/IJt9zyMnPj0Gm4q2V7fdLj"
                >
                  Join WhatsApp Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/universities" className="hover:text-white transition-colors">Universities</Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-white transition-colors">Academic Programs</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-white transition-colors">Educational Guides</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Klarify Academic Platform. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
