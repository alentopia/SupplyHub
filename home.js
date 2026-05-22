/**
 * Home Page JavaScript
 * Handles: Banner carousel, Bottom nav, Search bar, Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     BANNER CAROUSEL
     ===================================================== */
  const slides = document.querySelectorAll('.banner-slide');
  const dots   = document.querySelectorAll('.banner-dots .dot');
  let   current = 0;
  let   autoplayTimer;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active', 'wide');
    dots[current].style.width = '';

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].style.width = '16px';
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goToSlide(current + 1);
    }, 3500);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Dot click navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Touch/swipe support
  const carousel = document.getElementById('banner-carousel');
  let touchStartX = 0;
  let touchEndX   = 0;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      goToSlide(diff > 0 ? current + 1 : current - 1);
    }
    startAutoplay();
  }, { passive: true });

  // Init
  goToSlide(0);
  startAutoplay();


  /* =====================================================
     TRANSACTION SLIDER – horizontal scroll snap
     ===================================================== */
  const txSlider = document.getElementById('transaction-slider');
  const txDots   = document.querySelectorAll('#contract-dots .cdot');
  let   txCurrent = 0;

  function updateTxDots(idx) {
    txDots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.classList.toggle('wide',   i === idx);
    });
    txCurrent = idx;
  }

  if (txSlider && txDots.length) {
    // Observe scroll position
    txSlider.addEventListener('scroll', () => {
      const idx = Math.round(txSlider.scrollLeft / txSlider.offsetWidth);
      if (idx !== txCurrent) updateTxDots(idx);
    }, { passive: true });

    // Dot click
    txDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        txSlider.scrollTo({ left: txSlider.offsetWidth * i, behavior: 'smooth' });
        updateTxDots(i);
      });
    });

    // Init at index 0
    updateTxDots(0);
  }



  /* =====================================================
     BOTTOM NAVIGATION
     ===================================================== */
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => {
        n.classList.remove('active');
        n.removeAttribute('aria-current');
        // Reset icon colors
        const svg = n.querySelector('svg');
        if (svg) { svg.setAttribute('stroke', '#424936'); }
        const paths = n.querySelectorAll('path, polyline, rect, circle');
        paths.forEach(p => { if (p.getAttribute('fill') && p.getAttribute('fill') !== 'none') p.setAttribute('fill', 'none'); });
      });
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    });
  });



  /* =====================================================
     SEARCH BAR – sliding placeholder text animation
     ===================================================== */
  const searchInput = document.querySelector('.search-bar__input');
  const placeholders = ['Search for Food...', 'Search for Vegetables...', 'Search for Fruits...', 'Search for Grains...', 'Search for Spices...'];
  let phIndex = 0;

  function cyclePlaceholder() {
    if (document.activeElement !== searchInput) {
      searchInput.placeholder = '';
      let i = 0;
      const text = placeholders[phIndex];
      const typeInterval = setInterval(() => {
        searchInput.placeholder += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            phIndex = (phIndex + 1) % placeholders.length;
          }, 2000);
        }
      }, 60);
    }
  }

  setInterval(cyclePlaceholder, 3500);
  cyclePlaceholder();


  /* =====================================================
     PRODUCT CARDS – wishlist toggle
     ===================================================== */
  const wishlistBtns = document.querySelectorAll('.product-wishlist');

  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const svg = btn.querySelector('svg path');
      if (svg) {
        const isLiked = btn.classList.toggle('liked');
        svg.style.fill = isLiked ? '#ba1a1a' : 'none';
        svg.style.stroke = isLiked ? '#ba1a1a' : 'white';

        // Pop animation
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
          btn.style.transition = 'transform 0.2s ease';
        }, 150);
      }
    });
  });


  /* =====================================================
     RE-ORDER BUTTONS – all contract cards
     ===================================================== */
  document.querySelectorAll('.contract-reorder').forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.background = 'var(--color-brand)';
      btn.style.color = 'white';
      btn.style.borderColor = 'transparent';
      btn.style.padding = '8px 6px';

      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.padding = '';
      }, 2000);
    });
  });


  /* =====================================================
     NOTIFICATION DOT – click to dismiss
     ===================================================== */
  const notifDot = document.querySelector('.notif-dot');
  const notifBtn = document.getElementById('btn-notif');

  if (notifBtn && notifDot) {
    notifBtn.addEventListener('click', () => {
      notifDot.style.display = 'none';
    });
  }

  const cartDot = document.querySelector('.cart-dot');
  const cartBtn = document.getElementById('btn-cart');

  if (cartBtn && cartDot) {
    cartBtn.addEventListener('click', () => {
      cartDot.style.display = 'none';
    });
  }




});
