/*
  Form intent handling for package vs. mini-audit requests.
  Sets hidden fields, updates the subject, and posts to Formspree via AJAX.
*/

(function () {
  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('formStatus');
  const requestTypeInput = document.getElementById('request_type');
  const selectedPackageInput = document.getElementById('selected_package');
  const subjectInput = document.getElementById('subject');

  const intentBox = document.getElementById('formIntent');
  const intentText = document.getElementById('formIntentText');
  const intentReset = document.getElementById('formIntentReset');

  const packageLinks = document.querySelectorAll('[data-package]');

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

  function buildSubject(type, packageName) {
    if (type === 'package' && packageName) {
      return `[Paket] ${packageName} – Anfrage`;
    }
    return '[Mini-Audit] Anfrage';
  }

  function resetIntent() {
    setIntent({ type: 'mini_audit', packageName: '' });
    if (subjectInput) subjectInput.value = buildSubject('mini_audit', '');
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
      if (subjectInput) subjectInput.value = buildSubject('package', packageName);
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nameField = form.querySelector('input[name="name"]');
        if (nameField) nameField.focus({ preventScroll: true });
      }
    });
  });
})();
