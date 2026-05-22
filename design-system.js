/**
 * Design System Page JavaScript
 * Handles: Color copy-to-clipboard, interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     COLOR SWATCH – Click to copy hex
     ===================================================== */
  const swatches = document.querySelectorAll('.color-swatch[data-copy]');
  const toast    = document.getElementById('copy-toast');
  let   toastTimer;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', async () => {
      const hex = swatch.dataset.copy;
      try {
        await navigator.clipboard.writeText(hex);
        showToast(`✓ Copied ${hex.toUpperCase()}!`);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = hex;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`✓ Copied ${hex.toUpperCase()}!`);
      }
    });
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }


  /* =====================================================
     HERO – Parallax on scroll
     ===================================================== */
  const heroImages = document.querySelectorAll('.hero-img-card');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroImages.forEach((img, i) => {
      const speed = 0.05 + (i * 0.02);
      img.style.transform = `rotate(14.3deg) translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });


  /* =====================================================
     BUTTON DEMOS – Interactive feedback
     ===================================================== */
  const primaryBtn = document.getElementById('btn-primary-demo');
  if (primaryBtn) {
    primaryBtn.addEventListener('click', () => {
      primaryBtn.textContent = '✓ Clicked!';
      setTimeout(() => { primaryBtn.textContent = 'Primary Button'; }, 1500);
    });
  }

  const outlineBtn = document.getElementById('btn-outline-demo');
  if (outlineBtn) {
    outlineBtn.addEventListener('click', () => {
      outlineBtn.textContent = '✓ Clicked!';
      setTimeout(() => { outlineBtn.textContent = 'Outline Button'; }, 1500);
    });
  }


  /* =====================================================
     SMOOTH SECTION REVEAL on scroll
     ===================================================== */
  const sections = document.querySelectorAll('.ds-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(24px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
  });

});
