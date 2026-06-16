declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, string | number | boolean>,
    ) => void;
  }
}

export {};

export function trackCTAClick(label: string, destination?: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "cta_click", {
      event_label: label,
      ...(destination ? { link_url: destination } : {}),
    });
  }
}

export function trackFormSubmit(success: boolean) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "form_submit", { event_label: success ? "success" : "error" });
  }
}
