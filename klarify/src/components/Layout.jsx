import React from "react";

const Layout = ({ children, noPadding = false }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
            K
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            <a href="#">Klarify</a>
          </span>
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
