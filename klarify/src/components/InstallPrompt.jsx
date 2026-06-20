import React, { useCallback, useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import {
  clearDeferredPrompt,
  dismissInstallPrompt,
  getDeferredPrompt,
  isIosSafari,
  isPwaInstalled,
  shouldShowInstallPrompt,
} from "../utils/pwaInstall";

const SHOW_DELAY_MS = 2500;

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  const evaluatePrompt = useCallback(() => {
    if (isPwaInstalled() || !shouldShowInstallPrompt()) return false;

    if (getDeferredPrompt()) {
      setIosMode(false);
      setCanInstall(true);
      return true;
    }

    if (isIosSafari()) {
      setIosMode(true);
      setCanInstall(true);
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    if (isPwaInstalled()) return;

    const showIfEligible = () => {
      if (evaluatePrompt()) {
        setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      }
    };

    showIfEligible();

    const onAvailable = () => showIfEligible();
    const onInstalled = () => {
      setVisible(false);
      setCanInstall(false);
    };

    window.addEventListener("pwa-install-available", onAvailable);
    window.addEventListener("pwa-installed", onInstalled);

    return () => {
      window.removeEventListener("pwa-install-available", onAvailable);
      window.removeEventListener("pwa-installed", onInstalled);
    };
  }, [evaluatePrompt]);

  const handleInstall = async () => {
    const prompt = getDeferredPrompt();
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    clearDeferredPrompt();
    setVisible(false);

    if (outcome === "dismissed") {
      dismissInstallPrompt();
    }
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
    setVisible(false);
  };

  if (!visible || !canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-6 md:max-w-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/40 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
            K
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-base leading-tight">
                Install Klarify
              </h3>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-slate-400 hover:text-white transition-colors shrink-0 -mt-0.5"
                aria-label="Dismiss install prompt"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {iosMode
                ? "Add Klarify to your home screen for quick access to GCE results and orientation tools."
                : "Install the app for faster access to GCE results, orientation, and career guides — even offline."}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {iosMode ? (
            <div className="flex items-center gap-2 text-sm text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2.5 w-full">
              <Share size={16} className="shrink-0" />
              <span>Tap Share, then &quot;Add to Home Screen&quot;</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstall}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all"
            >
              <Download size={16} />
              Install App
            </button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
