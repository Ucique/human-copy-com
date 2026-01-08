/*
  app.js – Interactivity for Human Copy landing page.

  Handles:
  - Mobile menu toggling with ARIA state updates.
  - Modal open/close for Impressum und Datenschutz dialogs.
  - Footer year update.
  - UTM query parameter preservation across same-page anchor links.
  - Contact form submission: POST to Formspree if endpoint set, otherwise mailto fallback.
*/

(function () {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
    // Close mobile menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  // Modal functionality
  const imprintLink = document.getElementById('imprintLink');
  const privacyLink = document.getElementById('privacyLink');
  const imprintModal = document.getElementById('imprintModal');
  const privacyModal = document.getElementById('privacyModal');

  function openModal(modal) {
    if (!modal) return;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.removeAttribute('hidden');
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.setAttribute('hidden', 'true');
    }
  }

  if (imprintLink) {
    imprintLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(imprintModal);
    });
  }
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  }
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('dialog');
      closeModal(modal);
    });
  });

  // Preserve query parameters on same-page anchor links for attribution
  const query = window.location.search;
  if (query) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      // Avoid double-appending query
      if (!href.includes('?')) {
        anchor.setAttribute('href', href + query);
      }
    });
  }

  // Form submission handling
  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('formStatus');

  // Placeholder Formspree endpoint – replace with your own in production
  const FORMSPREE_ENDPOINT = "";

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? 'rgba(242, 239, 233, 0.9)' : 'rgba(242, 239, 233, 0.7)';
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Gather form data
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      if (!name || !email || !message) {
        setStatus('Bitte fülle alle Felder aus.', false);
        return;
      }

      setStatus('Sende …', true);

      if (FORMSPREE_ENDPOINT) {
        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData,
          });
          if (response.ok) {
            form.reset();
            setStatus('Danke! Ich melde mich zeitnah zurück.');
          } else {
            setStatus('Senden fehlgeschlagen. Bitte nutze die E‑Mail‑Option.', false);
          }
        } catch (err) {
          setStatus('Senden fehlgeschlagen. Bitte nutze die E‑Mail‑Option.', false);
        }
      } else {
        // mailto fallback
        const subject = encodeURIComponent('Anfrage — AI → Human Copy');
        const body = encodeURIComponent(
          `Hallo Charlotte,\n\nProjekt:\n\nLink oder Text:\n${message}\n\nKontakt:\n${name} — ${email}\n\nZiel:\n\nDeadline:\n\nViele Grüße,\n${name}`
        );
        // Compose mailto URL
        window.location.href = `mailto:hello@human-copy.com?subject=${subject}&body=${body}`;
        setStatus('Öffne E‑Mail … (wenn nichts passiert: bitte manuell mailen).');
      }
    });
  }
})();
