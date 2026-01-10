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

  const goalInput = document.querySelector('input[name="goal"]');
  document.querySelectorAll('[data-goal]').forEach(link => {
    link.addEventListener('click', () => {
      if (goalInput) {
        goalInput.value = link.getAttribute('data-goal') || '';
      }
    });
  });
})();
