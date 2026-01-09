/*
  Formspree submission handler
  Checklist:
  - Mini-Audit sends request_type=mini_audit and empty selected_package
  - Package click sends request_type=package and selected_package
  - Success view replaces form
  - Errors show inline without layout shifts
*/

(function () {
  const form = document.getElementById('leadForm');
  const statusEl = document.getElementById('formStatus');
  const intentBox = document.getElementById('formIntent');
  const submitButton = form ? form.querySelector('button[type="submit"]') : null;

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? 'rgba(242, 239, 233, 0.9)' : 'rgba(242, 239, 233, 0.7)';
  }

  function renderSuccessView() {
    if (!form) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'form form-success';
    wrapper.innerHTML = `
      <h3>Danke – gesendet.</h3>
      <p class="muted">Ich melde mich persönlich per E-Mail. Kein Newsletter. Keine Automationen.</p>
      <button class="btn btn--ghost" type="button" id="formReset">Noch eine Anfrage senden</button>
    `;
    form.replaceWith(wrapper);
    if (intentBox) intentBox.hidden = true;

    const resetButton = wrapper.querySelector('#formReset');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Senden…';
    }

    setStatus('Sende …', true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        renderSuccessView();
      } else {
        setStatus('Senden hat nicht geklappt. Bitte versuch es nochmal oder schreib direkt an hello@human-copy.com', false);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Kostenloses Mini-Audit anfragen';
        }
      }
    } catch (error) {
      setStatus('Senden hat nicht geklappt. Bitte versuch es nochmal oder schreib direkt an hello@human-copy.com', false);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Kostenloses Mini-Audit anfragen';
      }
    }
  });
})();
