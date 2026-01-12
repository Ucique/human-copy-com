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
  const defaultLabel = submitButton?.getAttribute('data-default-label') || 'Gratis Mini-Audit anfragen';
  const endpoint = 'https://formspree.io/f/mlggrbdv';
  let leadEventSent = false;

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
      <h3>Danke! Anfrage ist angekommen.</h3>
      <p class="muted">Ich melde mich innerhalb von 24–48h persönlich per E-Mail – mit Feedback und einem überarbeiteten Beispielabsatz. Kein Newsletter. Kein Spam.</p>
      <p class="micro muted">Wenn’s dringend ist: Deadline ins Formular schreiben.</p>
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
    form.action = endpoint;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Senden…';
    }

    setStatus('Sende …', true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        if (!leadEventSent && typeof window.gtag === 'function') {
          const requestType = form.querySelector('#request_type')?.value || 'mini_audit';
          const packageName = form.querySelector('#selected_package')?.value || '';
          const formName = requestType === 'package' ? 'package_request' : 'mini_audit';
          const payload = {
            method: 'website_form',
            form_name: formName,
            page_location: window.location.href
          };
          if (packageName) {
            payload.package = packageName;
          }
          window.gtag('event', 'generate_lead', payload);
          leadEventSent = true;
        }
        renderSuccessView();
      } else {
        let responseText = '';
        try {
          const data = await response.clone().json();
          responseText = JSON.stringify(data);
        } catch (err) {
          responseText = await response.clone().text();
        }
        console.log('Formspree error', response.status, responseText);
        const hint = response.status === 403
          ? ' Wenn Formspree Domain Restriction aktiv ist: bitte Domain hinzufügen.'
          : '';
        setStatus(`Senden fehlgeschlagen (${response.status}). Bitte versuch es nochmal oder schreib direkt an hello@human-copy.com.${hint}`, false);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultLabel;
        }
      }
    } catch (error) {
      console.log('Formspree network error', error);
      setStatus('Senden fehlgeschlagen (Netzwerk). Bitte versuch es nochmal oder schreib direkt an hello@human-copy.com.', false);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultLabel;
      }
      form.action = endpoint;
      form.submit();
    }
  });
})();
