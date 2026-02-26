export interface TechnicalFingerprint {
  os: string;
  browser: string;
  deviceType: "desktop" | "mobile" | "tablet" | "ipad";
  ip?: string;
  city?: string;
  country?: string;
  userAgent: string;
}

export const fingerprintService = {
  getBrowserFingerprint: (): TechnicalFingerprint => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    let browser = "Unknown Browser";
    let deviceType: TechnicalFingerprint["deviceType"] = "desktop";

    // OS Detection
    if (ua.indexOf("Win") !== -1) os = "Windows";
    if (ua.indexOf("Mac") !== -1) os = "macOS";
    if (ua.indexOf("Linux") !== -1) os = "Linux";
    if (ua.indexOf("Android") !== -1) os = "Android";
    if (ua.indexOf("like Mac") !== -1 || ua.indexOf("iOS") !== -1) os = "iOS";

    // Browser Detection
    if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Safari";
    else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("Edge") !== -1) browser = "Edge";

    // Device Detection
    const isMobile = /Mobile|Android|iP(hone|od)/.test(ua);
    const isTablet = /Tablet|iPad|PlayBook/.test(ua);
    
    if (isMobile) deviceType = "mobile";
    if (isTablet) deviceType = "tablet";

    // Specific iPad detection (Modern iPads report as Macintosh/MacIntel)
    const isIPad = 
      ua.includes("iPad") || 
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    
    if (isIPad) deviceType = "ipad";

    return {
      os,
      browser,
      deviceType,
      userAgent: ua
    };
  },

  getGeoData: async () => {
    try {
      // Using a privacy-focused, one-way lookup that doesn't leak data
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("Geo-fetch failed");
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city,
        country: data.country_name
      };
    } catch (error) {
      console.error("Geo-lookup failed:", error);
      return {};
    }
  }
};