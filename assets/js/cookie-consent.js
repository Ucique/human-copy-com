/*
  Cookie consent banner + settings modal for human-copy.com.
  Stores choice in localStorage under hc_cookie_consent.
*/

(function () {
  const STORAGE_KEY = 'hc_cookie_consent';
  let bannerEl = null;
  let modalEl = null;

  function setChoice(value) {
    localStorage.setItem(STORAGE_KEY, value);
    document.dispatchEvent(new CustomEvent('hc-consent-updated', { detail: { value } }));
  }

  function closeBanner() {
    if (bannerEl) {
      bannerEl.hidden = true;
      bannerEl.setAttribute('aria-hidden', 'true');
    }
  }

  function closeModal() {
    if (modalEl) {
      modalEl.classList.remove('is-open');
      modalEl.setAttribute('aria-hidden', 'true');
    }
  }

  function openModal() {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
  }

  function buildBanner() {
    if (bannerEl) return;
    bannerEl = document.createElement('div');
    bannerEl.className = 'consent';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-modal', 'true');
    bannerEl.setAttribute('aria-labelledby', 'cookieBannerTitle');
    bannerEl.hidden = true;
    bannerEl.setAttribute('aria-hidden', 'true');
    bannerEl.innerHTML = `
      <div class="consent__panel">
        <div class="consent__content">
          <h2 id="cookieBannerTitle">Cookies</h2>
          <p class="muted">Wir verwenden notwendige Cookies, um diese Seite bereitzustellen. Optional: Statistik.</p>
        </div>
        <div class="consent__actions">
          <button class="btn btn--ghost" type="button" data-cookie-deny>Ablehnen</button>
            <button class="btn btn--primary" type="button" data-cookie-accept>Akzeptieren</button>
          <button class="btn btn--ghost" type="button" data-cookie-settings>Cookie-Einstellungen</button>
        </div>
      </div>
    `;
    document.body.appendChild(bannerEl);

    bannerEl.querySelector('[data-cookie-accept]').addEventListener('click', () => {
      setChoice('accepted');
      closeBanner();
    });

    bannerEl.querySelector('[data-cookie-deny]').addEventListener('click', () => {
      setChoice('rejected');
      closeBanner();
    });

    bannerEl.querySelector('[data-cookie-settings]').addEventListener('click', () => {
      openModal();
    });
  }

  function buildModal() {
    if (modalEl) return;
    modalEl = document.createElement('div');
    modalEl.className = 'cookie-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.innerHTML = `
      <div class="cookie-modal__panel" role="document">
        <div class="cookie-modal__header">
          <h2>Cookie-Einstellungen</h2>
          <button class="cookie-modal__close" type="button" aria-label="Schließen">×</button>
        </div>
        <div class="cookie-modal__content">
          <p>Wir verwenden notwendige Cookies, um die Website bereitzustellen. Statistik wird nur nach Einwilligung geladen.</p>
        </div>
        <div class="cookie-modal__actions">
          <button class="btn btn--ghost" type="button" data-cookie-deny>Nur notwendige</button>
          <button class="btn btn--primary" type="button" data-cookie-accept>Akzeptieren</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.querySelector('.cookie-modal__close').addEventListener('click', closeModal);
    modalEl.addEventListener('click', event => {
      if (event.target === modalEl) closeModal();
    });

    modalEl.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal();
    });

    modalEl.querySelectorAll('[data-cookie-accept]').forEach(btn => {
      btn.addEventListener('click', () => {
        setChoice('accepted');
        closeModal();
        closeBanner();
      });
    });

    modalEl.querySelectorAll('[data-cookie-deny]').forEach(btn => {
      btn.addEventListener('click', () => {
        setChoice('rejected');
        closeModal();
        closeBanner();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildBanner();
    buildModal();

    const choice = localStorage.getItem(STORAGE_KEY);
    if (!choice) {
      bannerEl.hidden = false;
      bannerEl.setAttribute('aria-hidden', 'false');
    } else {
      closeBanner();
    }

    document.querySelectorAll('[data-open-cookie-settings="true"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        openModal();
      });
    });
  });
})();
