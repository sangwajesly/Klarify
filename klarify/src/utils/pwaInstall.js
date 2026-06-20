const DISMISS_KEY = "klarify-pwa-install-dismissed";
const INSTALLED_KEY = "klarify-pwa-installed";
export const REMIND_AFTER_DAYS = 4;

let deferredPrompt = null;

export function initPwaInstallListener() {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    window.dispatchEvent(new Event("pwa-install-available"));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    localStorage.setItem(INSTALLED_KEY, "true");
    window.dispatchEvent(new Event("pwa-installed"));
  });
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function clearDeferredPrompt() {
  deferredPrompt = null;
}

export function isPwaInstalled() {
  if (typeof window === "undefined") return false;

  if (localStorage.getItem(INSTALLED_KEY) === "true") return true;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function shouldShowInstallPrompt() {
  if (typeof window === "undefined") return false;
  if (isPwaInstalled()) return false;

  const dismissedAt = localStorage.getItem(DISMISS_KEY);
  if (!dismissedAt) return true;

  const daysSinceDismiss =
    (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);

  return daysSinceDismiss >= REMIND_AFTER_DAYS;
}

export function dismissInstallPrompt() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export function isIosSafari() {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);

  return isIOS && isSafari;
}

export function isInstallPromptSupported() {
  return getDeferredPrompt() !== null || isIosSafari();
}
