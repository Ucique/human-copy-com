/*
  Consent banner + tracking loader (Google Ads / GA4 / Meta) with Consent Mode v2.
  Tracking is only loaded after explicit opt-in.
*/

(function () {
  const STORAGE_KEY = 'consent_v1';

  const IDS = {
    googleAdsConversionId: '[GOOGLE_ADS_CONVERSION_ID]',
    googleAdsConversionLabel: '[GOOGLE_ADS_CONVERSION_LABEL]',
    ga4MeasurementId: '[GA4_MEASUREMENT_ID]',
    metaPixelId: '[META_PIXEL_ID]'
  };

  const banner = document.getElementById('consentBanner');
  const settings = document.getElementById('consentSettings');
  const acceptAllBtn = document.getElementById('consentAcceptAll');
  const rejectBtn = document.getElementById('consentReject');
  const settingsBtn = document.getElementById('consentOpenSettings');
  const saveBtn = document.getElementById('consentSave');
  const closeBtn = document.getElementById('consentClose');
  const marketingCheckbox = document.getElementById('consentMarketing');
  const analyticsCheckbox = document.getElementById('consentAnalytics');

  const openLinks = document.querySelectorAll('[data-consent-open]');

  function isPlaceholder(value) {
    return !value || value.includes('[') || value.includes(']');
  }

  function readStoredConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function storeConsent(consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...consent,
      necessary: true,
      timestamp: new Date().toISOString()
    }));
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    if (settings) settings.hidden = true;
  }

  function showSettings() {
    if (!settings) return;
    settings.hidden = false;
    showBanner();
  }

  function applyConsent(consent) {
    const marketing = Boolean(consent.marketing);
    const analytics = Boolean(consent.analytics);

    if (marketingCheckbox) marketingCheckbox.checked = marketing;
    if (analyticsCheckbox) analyticsCheckbox.checked = analytics;

    updateConsentMode({ marketing, analytics });
    loadTracking({ marketing, analytics });
  }

  function updateConsentMode({ marketing, analytics }) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });

    if (marketing || analytics) {
      gtag('consent', 'update', {
        ad_storage: marketing ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
        analytics_storage: analytics ? 'granted' : 'denied'
      });
    }
  }

  function loadScript(src, id) {
    if (id && document.getElementById(id)) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    if (id) script.id = id;
    document.head.appendChild(script);
  }

  function loadGoogleTag() {
    if (isPlaceholder(IDS.googleAdsConversionId) && isPlaceholder(IDS.ga4MeasurementId)) {
      return false;
    }
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      !isPlaceholder(IDS.ga4MeasurementId) ? IDS.ga4MeasurementId : IDS.googleAdsConversionId
    )}`, 'gtag-js');

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());

    if (!isPlaceholder(IDS.googleAdsConversionId)) {
      gtag('config', IDS.googleAdsConversionId);
    }
    if (!isPlaceholder(IDS.ga4MeasurementId)) {
      gtag('config', IDS.ga4MeasurementId, { anonymize_ip: true });
    }
    return true;
  }

  function loadMetaPixel() {
    if (isPlaceholder(IDS.metaPixelId)) return;
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', IDS.metaPixelId);
    window.fbq('track', 'PageView');
  }

  function loadTracking({ marketing, analytics }) {
    if (!marketing && !analytics) return;
    const hasGoogleTag = loadGoogleTag();

    if (hasGoogleTag && marketing && !isPlaceholder(IDS.googleAdsConversionId)) {
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }

    if (hasGoogleTag && analytics && !isPlaceholder(IDS.ga4MeasurementId)) {
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }

    if (marketing) {
      loadMetaPixel();
    }
  }

  function init() {
    const stored = readStoredConsent();
    if (stored) {
      applyConsent(stored);
      hideBanner();
      return;
    }
    showBanner();
  }

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', () => {
      const consent = { marketing: true, analytics: true };
      storeConsent(consent);
      applyConsent(consent);
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      const consent = { marketing: false, analytics: false };
      storeConsent(consent);
      applyConsent(consent);
      hideBanner();
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      showSettings();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const consent = {
        marketing: marketingCheckbox ? marketingCheckbox.checked : false,
        analytics: analyticsCheckbox ? analyticsCheckbox.checked : false
      };
      storeConsent(consent);
      applyConsent(consent);
      hideBanner();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideBanner();
    });
  }

  openLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSettings();
    });
  });

  init();
})();
