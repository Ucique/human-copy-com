/*
  Theme toggle: light default, dark optional.
  Persists to localStorage key "hc_theme".
*/

(function () {
  const STORAGE_KEY = 'hc_theme';
  const toggle = document.getElementById('themeToggle');
  const label = document.getElementById('themeToggleLabel');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (toggle) toggle.setAttribute('aria-checked', 'true');
      if (label) label.textContent = 'Dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (toggle) toggle.setAttribute('aria-checked', 'false');
      if (label) label.textContent = 'Light';
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
})();
