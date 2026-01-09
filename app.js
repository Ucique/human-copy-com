/*
  app.js – Interactivity for Human Copy landing page.

  Handles:
  - UTM query parameter preservation across same-page anchor links.
  - Mini-audit form submission: POST to Formspree if endpoint set, otherwise mailto fallback.
*/

(function () {
  // Preserve query parameters on same-page anchor links for attribution
  const query = window.location.search;
  if (query) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (!href.includes('?')) {
        anchor.setAttribute('href', href + query);
      }
    });
  }

  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('formStatus');

  const FORMSPREE_ENDPOINT = "";

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? 'rgba(242, 239, 233, 0.9)' : 'rgba(242, 239, 233, 0.7)';
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const goal = String(formData.get('goal') || '').trim();

      if (!name || !email || !message) {
        setStatus('Bitte fülle alle Pflichtfelder aus.', false);
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
        const subject = encodeURIComponent('Mini-Audit Anfrage — Human Copy');
        const body = encodeURIComponent(
          `Hallo,\n\nText oder Link:\n${message}\n\nZiel:\n${goal || '-'}\n\nKontakt:\n${name} — ${email}\n\nViele Grüße,\n${name}`
        );
        window.location.href = `mailto:hello@human-copy.com?subject=${subject}&body=${body}`;
        setStatus('Öffne E‑Mail … (wenn nichts passiert: bitte manuell mailen).');
      }
    });
  }
})();
