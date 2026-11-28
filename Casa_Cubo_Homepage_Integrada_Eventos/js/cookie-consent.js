
(function () {
  "use strict";

  const MEASUREMENT_ID = "G-3V2LC5PP17";
  const STORAGE_KEY = "cc_cookie_consent_v1";

  let analyticsLoaded = false;
  let currentConsent = null;

  // Configuración inicial: seguimiento desactivado.

  window["ga-disable-" + MEASUREMENT_ID] = true;

  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  // Recuperar preferencias guardadas.

  function getConsent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved === "accepted" || saved === "rejected") {
        return saved;
      }
    } catch (error) {
      // Mantener el seguimiento desactivado.
    }

    return null;
  }

  // Guardar preferencias.

  function saveConsent(value) {
    currentConsent = value;

    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // La decisión se mantiene durante esta visita.
    }
  }

  // Activar Google Analytics.

  function enableAnalytics() {
    window["ga-disable-" + MEASUREMENT_ID] = false;

    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    if (analyticsLoaded) return;

    analyticsLoaded = true;

    window.gtag("js", new Date());

    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement("script");

    script.async = true;

    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      MEASUREMENT_ID;

    script.id = "cc-google-analytics";

    script.onerror = function () {
      analyticsLoaded = false;
      script.remove();
    };

    document.head.appendChild(script);
  }

  // Eliminar cookies analíticas accesibles.

  function deleteAnalyticsCookies() {
    const cookies = document.cookie.split(";");

    const domains = [
      "",
      window.location.hostname,
      ".casacubo.com.ar",
      "casacubo.com.ar"
    ];

    cookies.forEach(function (cookie) {
      const name = cookie.split("=")[0].trim();

      if (
        name === "_ga" ||
        name.startsWith("_ga_") ||
        name === "_gid" ||
        name.startsWith("_gat")
      ) {
        domains.forEach(function (domain) {
          document.cookie =
            name +
            "=; Max-Age=0; path=/" +
            (domain ? "; domain=" + domain : "");
        });
      }
    });
  }

  // Desactivar Google Analytics.

  function disableAnalytics() {
    window["ga-disable-" + MEASUREMENT_ID] = true;

    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    deleteAnalyticsCookies();
  }

  // Mostrar u ocultar el banner.

  function showBanner() {
    const banner = document.getElementById(
      "cc-cookie-banner"
    );

    if (banner) {
      banner.hidden = false;

      const button = banner.querySelector("button");

      if (button) button.focus();
    }
  }

  function hideBanner() {
    const banner = document.getElementById(
      "cc-cookie-banner"
    );

    if (banner) banner.hidden = true;
  }

  // Aceptar cookies analíticas.

  function acceptCookies() {
    saveConsent("accepted");
    enableAnalytics();
    hideBanner();
  }

  // Rechazar o retirar el consentimiento.

  function rejectCookies() {
    const wasActive = analyticsLoaded;

    saveConsent("rejected");
    disableAnalytics();
    hideBanner();

    if (wasActive) {
      window.location.reload();
    }
  }

  // Inicialización.

  function init() {
    const acceptButton = document.getElementById(
      "cc-cookie-accept"
    );

    const rejectButton = document.getElementById(
      "cc-cookie-reject"
    );

    const settingsButton = document.getElementById(
      "cc-cookie-settings"
    );

    if (!acceptButton || !rejectButton || !settingsButton) {
      return;
    }

    acceptButton.addEventListener("click", acceptCookies);

    rejectButton.addEventListener("click", rejectCookies);

    settingsButton.addEventListener("click", showBanner);

    currentConsent = getConsent();

    if (currentConsent === "accepted") {
      enableAnalytics();
      hideBanner();
    } else if (currentConsent === "rejected") {
      disableAnalytics();
      hideBanner();
    } else {
      showBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
