import { useEffect, useState, useCallback } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export interface UseRecaptchaOptions {
  lazy?: boolean;
}

export function useRecaptcha(options?: UseRecaptchaOptions) {
  const [isReady, setIsReady] = useState(false);

  const hideBadge = () => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.id = "recaptcha-badge-hide";
    style.textContent = `.grecaptcha-badge { visibility: hidden !important; opacity: 0 !important; }`;
    if (!document.getElementById("recaptcha-badge-hide")) {
      document.head.appendChild(style);
    }
  };

  const loadRecaptcha = useCallback(() => {
    if (typeof document === "undefined" || !SITE_KEY) return;

    if (document.getElementById("recaptcha-v3-script")) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setIsReady(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "recaptcha-v3-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
          hideBadge();
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!options?.lazy) {
      loadRecaptcha();
    }
  }, [options?.lazy, loadRecaptcha]);

  const waitForRecaptcha = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve();
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => resolve());
      } else {
        const interval = setInterval(() => {
          if (window.grecaptcha) {
            clearInterval(interval);
            window.grecaptcha.ready(() => resolve());
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 10000);
      }
    });
  };

  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      if (!SITE_KEY) {
        return null;
      }
      try {
        loadRecaptcha();
        await waitForRecaptcha();
        if (!window.grecaptcha) {
          throw new Error("grecaptcha not loaded");
        }
        const token = await window.grecaptcha.execute(SITE_KEY, { action });
        return token;
      } catch (err) {
        console.error("reCAPTCHA token generation failed:", err);
        return null;
      }
    },
    [loadRecaptcha]
  );

  return { getToken, isReady, loadRecaptcha };
}
