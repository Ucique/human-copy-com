/*
  Form intent handling for package vs. mini-audit requests.
  Sets hidden fields, updates the subject, and posts to Formspree via AJAX.
*/

(function () {
  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('formStatus');
  const requestTypeInput = document.getElementById('requestType');
  const selectedPackageInput = document.getElementById('selectedPackage');
  const subjectInput = document.getElementById('formSubject');

  const intentBox = document.getElementById('formIntent');
  const intentText = document.getElementById('formIntentText');
  const intentReset = document.getElementById('formIntentReset');

  const packageLinks = document.querySelectorAll('[data-package]');

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? 'rgba(242, 239, 233, 0.9)' : 'rgba(242, 239, 233, 0.7)';
  }

  function setIntent({ type, packageName }) {
    if (requestTypeInput) requestTypeInput.value = type;
    if (selectedPackageInput) selectedPackageInput.value = packageName || '';

    if (intentBox && intentText) {
      if (packageName) {
        intentText.textContent = `Ausgewählt: ${packageName}`;
        intentBox.hidden = false;
      } else {
        intentText.textContent = '';
        intentBox.hidden = true;
      }
    }
  }

  function buildSubject(name, type, packageName) {
    const safeName = name || '';
    if (type === 'package' && packageName) {
      return `[Paket] ${packageName} – Anfrage von ${safeName}`;
    }
    return `[Mini-Audit] – Anfrage von ${safeName}`;
  }

  function resetIntent() {
    setIntent({ type: 'mini_audit', packageName: '' });
  }

  resetIntent();

  if (intentReset) {
    intentReset.addEventListener('click', () => {
      resetIntent();
    });
  }

  packageLinks.forEach(link => {
    link.addEventListener('click', () => {
      const packageName = link.getAttribute('data-package') || '';
      setIntent({ type: 'package', packageName });
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nameField = form.querySelector('input[name="name"]');
        if (nameField) nameField.focus({ preventScroll: true });
      }
    });
  });

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const requestType = String(formData.get('request_type') || 'mini_audit');
    const packageName = String(formData.get('selected_package') || '').trim();

    if (!name || !email || !message) {
      setStatus('Bitte fülle die Pflichtfelder aus.', false);
      return;
    }

    const subject = buildSubject(name, requestType === 'package' ? 'package' : 'mini_audit', packageName);
    if (subjectInput) subjectInput.value = subject;
    formData.set('_subject', subject);

    setStatus('Sende …', true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        resetIntent();
        setStatus('Danke. Ich melde mich persönlich per E-Mail.');
      } else {
        setStatus('Senden fehlgeschlagen. Bitte erneut versuchen.', false);
      }
    } catch (error) {
      setStatus('Senden fehlgeschlagen. Bitte erneut versuchen.', false);
    }
  });
})();
