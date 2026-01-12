/*
  Consent-gated GA4 loader for human-copy.com.
  Verification: open site in incognito → accept → GA Realtime/Test installation should show activity.
  Ensure no googletagmanager requests fire before consent (check Network tab).
*/

(function () {
  const STORAGE_KEY = 'hc_consent_analytics';
  const GA_ID = 'G-2DBL2MMR17';
  const SCRIPT_ID = 'hc-ga4-script';
  let bannerEl = null;

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

  function setChoice(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  function hideBanner() {
    if (bannerEl) {
      bannerEl.setAttribute('aria-hidden', 'true');
      bannerEl.hidden = true;
    }
  }

  function showBanner() {
    if (!bannerEl) {
      bannerEl = document.createElement('div');
      bannerEl.className = 'consent consent--analytics';
      bannerEl.setAttribute('role', 'dialog');
      bannerEl.setAttribute('aria-modal', 'true');
      bannerEl.setAttribute('aria-labelledby', 'hcConsentTitle');
      bannerEl.innerHTML = `
        <div class="consent__panel">
          <div class="consent__content">
            <h2 id="hcConsentTitle">Cookie-Einstellungen</h2>
            <p class="muted">Wir nutzen Google Analytics 4 nur nach deiner Einwilligung, um die Website zu messen und zu verbessern.</p>
          </div>
          <div class="consent__actions">
            <button class="btn btn--ghost" type="button" data-consent-deny>Ablehnen</button>
            <button class="btn" type="button" data-consent-accept>Akzeptieren</button>
          </div>
        </div>
      `;
      document.body.appendChild(bannerEl);

      bannerEl.querySelector('[data-consent-accept]').addEventListener('click', () => {
        setChoice('granted');
        loadGa4();
        hideBanner();
      });

      bannerEl.querySelector('[data-consent-deny]').addEventListener('click', () => {
        setChoice('denied');
        hideBanner();
      });
    }

    bannerEl.hidden = false;
    bannerEl.setAttribute('aria-hidden', 'false');
  }

  window.HC_openCookieSettings = function () {
    showBanner();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const choice = localStorage.getItem(STORAGE_KEY);
    if (choice === 'granted') {
      loadGa4();
    } else if (choice !== 'denied') {
      showBanner();
    }

    document.querySelectorAll('[data-consent-open]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        showBanner();
      });
    });
  });
})();
