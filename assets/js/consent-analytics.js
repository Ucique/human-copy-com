/*
  Consent-gated GA4 loader for human-copy.com.
  Verification: open site in incognito → accept → GA Realtime/Test installation should show activity.
  Ensure no googletagmanager requests fire before consent (check Network tab).
*/

(function () {
  const STORAGE_KEY = 'hc_cookie_consent';
  const GA_ID = 'G-2DBL2MMR17';
  const SCRIPT_ID = 'hc-ga4-script';

  function loadGa4() {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    script.id = SCRIPT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const choice = localStorage.getItem(STORAGE_KEY);
    if (choice === 'accepted') {
      loadGa4();
    }
  });

  document.addEventListener('hc-consent-updated', event => {
    if (event.detail?.value === 'accepted') {
      loadGa4();
    }
  });
})();
