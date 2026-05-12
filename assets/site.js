(() => {
  const supportsIO = 'IntersectionObserver' in window;

  if (supportsIO) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    document.querySelectorAll('.reveal, .case-section').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .case-section').forEach((el) => el.classList.add('visible'));
  }

  const bar = document.querySelector('.progress-bar');
  if (bar) {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const height = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const pct = height > 0 ? (scrolled / height) * 100 : 0;
      bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a[href]').forEach((a) => {
    const target = a.getAttribute('href');
    if (target && target === here) a.setAttribute('aria-current', 'page');
  });

  document.querySelectorAll('.case-image img').forEach((img) => {
    const handleMissing = () => {
      const fig = img.closest('.case-image');
      if (!fig || fig.classList.contains('is-missing')) return;
      fig.classList.add('is-missing');
      const label = document.createElement('div');
      label.className = 'missing-label';
      label.textContent = img.alt ? `${img.alt} — image coming soon` : 'Image coming soon';
      img.replaceWith(label);
    };
    if (img.complete && img.naturalWidth === 0) handleMissing();
    else img.addEventListener('error', handleMissing);
  });
})();
