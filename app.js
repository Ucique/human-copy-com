(() => {
  const els = Array.from(document.querySelectorAll(".reveal"));

  // If reduced motion, just show everything.
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    els.forEach(el => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();
