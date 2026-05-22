/**
 * Marketplace JavaScript
 * Features:
 * - Category tab switching (For You / Local / Sell)
 * - Quick filter chips with product filtering
 * - Search with live filtering
 * - Save / bookmark toggle
 * - Product detail bottom sheet modal
 * - Sell form modal with validation
 * - Toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     PRODUCT DATA
     ===================================================== */
  const products = [
    { id: 'mp-product-1',  cat: 'veg',   name: 'Organic Mixed Vegetables',     price: 'Rp 45.000',     loc: 'Bandung, West Java',       img: 'prod_vegbundle.png',  seller: 'Sarah Jenkins',   sellerImg: 'avatar_sarah.png',   rating: '4.9' },
    { id: 'mp-product-2',  cat: 'grain', name: 'Premium Rice 50kg',      price: 'Rp 380.000',    loc: 'Cianjur, West Java',       img: 'prod_rice.png',       seller: 'Gabriel Valerio', sellerImg: 'avatar_gabriel.png', rating: '4.2' },
    { id: 'mp-product-3',  cat: 'veg',   name: 'Fresh Red Chili 1kg',    price: 'Rp 28.000',     loc: 'Garut, West Java',         img: 'prod_chili.png',      seller: 'Brian Alex',      sellerImg: 'avatar_brian.png',   rating: '3.8' },
    { id: 'mp-product-4',  cat: 'tool',  name: 'Irrigation Water Pump',       price: 'Rp 1.250.000',  loc: 'Bekasi, West Java',        img: 'prod_farmtool.png',   seller: 'Valen Angel',     sellerImg: 'avatar_valen.png',   rating: '4.6' },
    { id: 'mp-product-5',  cat: 'seed',  name: 'Organic Fertilizer 25kg',      price: 'Rp 95.000',     loc: 'Bogor, West Java',         img: 'prod_fertilizer.png', seller: 'Sarah Jenkins',   sellerImg: 'avatar_sarah.png',   rating: '4.9' },
    { id: 'mp-product-6',  cat: 'tool',  name: 'Compact Mini Tractor',    price: 'Rp 28.500.000', loc: 'Subang, West Java',        img: 'prod_tractor.png',    seller: 'Gabriel Valerio', sellerImg: 'avatar_gabriel.png', rating: '4.2' },
    { id: 'mp-product-7',  cat: 'seed',  name: 'Premium Seeds Mix Pack',   price: 'Rp 35.000',     loc: 'Bandung, West Java',       img: 'prod_seeds.png',      seller: 'Brian Alex',      sellerImg: 'avatar_brian.png',   rating: '3.8' },
    { id: 'mp-product-8',  cat: 'tool',  name: 'Greenhouse Tunnel 6x10m', price: 'Rp 850.000',    loc: 'Malang, East Java',        img: 'prod_greenhouse.png', seller: 'Valen Angel',     sellerImg: 'avatar_valen.png',   rating: '4.6' },
    { id: 'mp-product-9',  cat: 'veg',   name: 'Fresh Cherry Tomatoes /kg',  price: 'Rp 15.000',     loc: 'Lembang, West Java',       img: 'product_tomato.png',  seller: 'Sarah Jenkins',   sellerImg: 'avatar_sarah.png',   rating: '4.9' },
    { id: 'mp-product-10', cat: 'grain', name: 'Fresh Green Vegetables /kg', price: 'Rp 12.000',     loc: 'Sukabumi, West Java',      img: 'article_thumb1.png',  seller: 'Brian Alex',      sellerImg: 'avatar_brian.png',   rating: '3.8' },
  ];

  let activeCat   = 'all';
  let searchQuery = '';


  /* =====================================================
     UTILITY: show toast
     ===================================================== */
  const toast = document.getElementById('mp-toast');
  let toastTimer;

  function showToast(msg, duration = 2500) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }


  /* =====================================================
     CATEGORY TABS (For You / Local / Sell)
     ===================================================== */
  const tabs = document.querySelectorAll('.mp-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;

      // Sell tab opens sell modal directly
      if (tabId === 'sell') {
        openSellModal();
        return;
      }

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Tab-based filtering
      if (tabId === 'local') {
        filterBySearch('java'); // show local items
        showToast('Showing nearby products 📍');
      } else {
        filterProducts(); // reset to active chip + search
      }
    });
  });


  /* =====================================================
     FILTER CHIPS
     ===================================================== */
  const chips = document.querySelectorAll('.mp-chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.cat;
      filterProducts();
    });
  });


  /* =====================================================
     PRODUCT FILTERING
     ===================================================== */
  function filterProducts() {
    const grid  = document.getElementById('mp-grid');
    const empty = document.getElementById('mp-empty');
    let visible = 0;

    products.forEach(p => {
      const el = document.getElementById(p.id);
      if (!el) return;

      const matchCat    = activeCat === 'all' || p.cat === activeCat;
      const matchSearch = searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.loc.toLowerCase().includes(searchQuery)  ||
        p.price.toLowerCase().includes(searchQuery);

      if (matchCat && matchSearch) {
        el.classList.remove('hidden');
        el.style.display = '';
        visible++;
      } else {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });

    empty.style.display = visible === 0 ? 'flex' : 'none';
    grid.style.display  = visible === 0 ? 'none' : 'grid';
  }

  // Filter by keyword (used by Local tab)
  function filterBySearch(keyword) {
    searchQuery = keyword;
    filterProducts();
  }


  /* =====================================================
     SEARCH BAR
     ===================================================== */
  const btnSearch      = document.getElementById('btn-mp-search');
  const searchBar      = document.getElementById('mp-search-bar');
  const searchInput    = document.getElementById('mp-search-input');
  const btnCancelSearch = document.getElementById('btn-search-cancel');

  btnSearch.addEventListener('click', () => {
    searchBar.style.display = 'flex';
    searchInput.focus();
    btnSearch.style.display = 'none';
  });

  btnCancelSearch.addEventListener('click', () => {
    searchBar.style.display = 'none';
    btnSearch.style.display = '';
    searchInput.value = '';
    searchQuery = '';
    filterProducts();
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    filterProducts();
  });

  // Search on Enter
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      btnCancelSearch.click();
    }
  });


  /* =====================================================
     SAVE / BOOKMARK TOGGLE
     ===================================================== */
  document.querySelectorAll('.mp-card-save').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation(); // don't open product modal
      const isSaved = btn.dataset.saved === 'true';
      btn.dataset.saved = !isSaved;
      btn.classList.toggle('saved', !isSaved);
      showToast(isSaved ? 'Removed from saved' : '✓ Saved!');

      // Pop animation
      btn.style.transform = 'scale(1.35)';
      setTimeout(() => { btn.style.transform = ''; }, 180);
    });
  });


  /* =====================================================
     PRODUCT DETAIL MODAL
     ===================================================== */
  const modal      = document.getElementById('mp-modal');
  const btnClose   = document.getElementById('btn-modal-close');
  const modalImg   = document.getElementById('modal-img');
  const modalPrice = document.getElementById('modal-price');
  const modalName  = document.getElementById('modal-title');
  const modalLocTxt= document.getElementById('modal-loc-text');
  const modalSellerName = document.getElementById('modal-seller-name');
  const modalSellerImg  = document.getElementById('modal-seller-img');
  const btnChat    = document.getElementById('btn-modal-chat');
  const btnBuy     = document.getElementById('btn-modal-buy');

  function openProductModal(product) {
    modalImg.src        = product.img;
    modalImg.alt        = product.name;
    modalPrice.textContent = product.price;
    modalName.textContent  = product.name;
    modalLocTxt.textContent = product.loc;
    modalSellerName.textContent = product.seller;
    modalSellerImg.src  = product.sellerImg;

    // rating display
    document.querySelector('.mp-modal-seller-rating span').textContent = product.rating;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Click on cards → open modal
  products.forEach(p => {
    const el = document.getElementById(p.id);
    if (!el) return;

    el.addEventListener('click', () => openProductModal(p));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProductModal(p);
      }
    });
  });

  btnClose.addEventListener('click', closeProductModal);

  // Close on backdrop click
  modal.addEventListener('click', e => {
    if (e.target === modal) closeProductModal();
  });

  // Chat button
  btnChat.addEventListener('click', () => {
    showToast('💬 Opening seller chat...');
    setTimeout(closeProductModal, 800);
  });

  // Buy button
  btnBuy.addEventListener('click', () => {
    const name  = modalName.textContent;
    const price = modalPrice.textContent;
    btnBuy.textContent = '✓ Added!';
    btnBuy.style.background = '#528400';
    showToast(`🛒 ${name} (${price}) added to cart`);
    setTimeout(() => {
      btnBuy.textContent = 'Buy Now';
      btnBuy.style.background = '';
      closeProductModal();
    }, 1800);
  });


  /* =====================================================
     SELL FORM MODAL
     ===================================================== */
  const sellModal   = document.getElementById('sell-modal');
  const btnSellFab  = document.getElementById('btn-sell-fab');
  const btnSellClose = document.getElementById('btn-sell-close');
  const sellForm    = document.getElementById('sell-form');

  function openSellModal() {
    sellModal.style.display = 'flex';
  }

  function closeSellModal() {
    sellModal.style.display = 'none';
    sellForm.reset();
    // Remove error states
    sellForm.querySelectorAll('.mp-form-input').forEach(i => i.classList.remove('error'));
  }

  btnSellFab.addEventListener('click', openSellModal);
  btnSellClose.addEventListener('click', closeSellModal);

  sellModal.addEventListener('click', e => {
    if (e.target === sellModal) closeSellModal();
  });

  // Form submit with validation
  sellForm.addEventListener('submit', e => {
    e.preventDefault();

    const nameField  = document.getElementById('sell-name');
    const priceField = document.getElementById('sell-price');
    const catField   = document.getElementById('sell-category');
    const locField   = document.getElementById('sell-location');
    let valid = true;

    [nameField, priceField, catField, locField].forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (!valid) {
      showToast('⚠️ Please fill in all required fields');
      return;
    }

    // Simulate success
    const submitBtn = document.getElementById('btn-sell-submit');
    submitBtn.textContent = '⏳ Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      closeSellModal();
      submitBtn.textContent = '+ Post Ad';
      submitBtn.disabled = false;
      showToast('🎉 Ad successfully posted!', 3000);
    }, 1500);
  });

  // Remove error on input
  sellForm.querySelectorAll('.mp-form-input').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });


  /* =====================================================
     BOTTOM NAVIGATION
     ===================================================== */
  const navItems = document.querySelectorAll('.bottom-nav__item');

  navItems.forEach(item => {
    // Skip anchor tags (they handle navigation natively)
    if (item.tagName === 'A') return;

    item.addEventListener('click', () => {
      navItems.forEach(n => {
        n.classList.remove('active');
        n.removeAttribute('aria-current');
        const label = n.querySelector('.bottom-nav__label');
        if (label) label.style.color = '';
      });
      item.classList.add('active');
      item.setAttribute('aria-current', 'page');
    });
  });


  /* =====================================================
     HEADER PROFILE BUTTON
     ===================================================== */
  document.getElementById('btn-mp-profile').addEventListener('click', () => {
    showToast('👤 My profile');
  });


  /* =====================================================
     INITIAL RENDER
     ===================================================== */
  filterProducts();

});
