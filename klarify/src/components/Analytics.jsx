import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Analytics = () => {
  const location = useLocation();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Only initialize if we have an ID and we haven't already added the script
    if (measurementId && !document.getElementById("google-analytics-script")) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script1.id = "google-analytics-script";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.id = "google-analytics-init";
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', { send_page_view: false });
      `;
      document.head.appendChild(script2);
    }
  }, [measurementId]);

  useEffect(() => {
    // Track page views on route change
    if (measurementId && typeof window !== "undefined" && window.gtag) {
      window.gtag("config", measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);

  return null; // This component doesn't render anything
};

export default Analytics;
