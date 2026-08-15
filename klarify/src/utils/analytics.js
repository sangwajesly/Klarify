export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, params);
    } else {
      // Fallback: push to dataLayer if available
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: name, ...params });
      }
    }
  } catch (e) {
    // swallow errors to avoid breaking UI
    console.warn("trackEvent error", e);
  }
}

export function partnerUtm(url, source = "site", medium = "nav") {
  const u = new URL(url, window.location.origin);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", "partner_acquisition");
  return u.toString();
}
