import React from "react";

const Layout = ({ children, noPadding = false }) => {
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
            <span className="text-xs text-slate-500 font-medium">
              Academic Guidance
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <a
              href="/gce-results"
              className="px-6 py-2.5 mx-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Check GCE Results
            </a>
            <a
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="md:hidden">
          <a
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sign In
          </a>
        </div>
      </header>

      <main
        className={`flex-1 ${noPadding ? "" : "max-w-5xl w-full mx-auto p-6 md:p-12"}`}
      >
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                K
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Klarify
              </span>
            </div>
            <p className="text-sm max-w-sm mb-6">
              AI-powered academic recommendations to help students find the
              right university programs and career paths based on their unique
              strengths.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  A/L Student Path
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  University Path
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Self Learner
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
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
