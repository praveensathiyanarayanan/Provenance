// Provenance - Sovereign Architectural Real Estate Application
// State Management
let currentCategory = 'all';
let currentPage = 1;
const itemsPerPage = 3;
let savedPropertyIds = JSON.parse(localStorage.getItem('poperty_favorites') || '[]');
let activeModalProperty = null;
let activeModalTab = 'overview';
let isDuskLighting = false;

// Currency Conversion State
let currentCurrency = 'USD';
const currencyRates = {
  USD: { symbol: '$', rate: 1.0, suffix: '' },
  EUR: { symbol: '€', rate: 0.92, suffix: '' },
  GBP: { symbol: '£', rate: 0.79, suffix: '' },
  AED: { symbol: '', rate: 3.67, suffix: ' AED' }
};

function formatCurrencyPrice(num) {
  if (typeof num !== 'number' || isNaN(num)) return num || '$0';
  const cfg = currencyRates[currentCurrency] || currencyRates.USD;
  const val = Math.round(num * cfg.rate);
  return `${cfg.symbol}${val.toLocaleString()}${cfg.suffix}`;
}

window.formatCurrencyPrice = formatCurrencyPrice;

// Zoom Lightbox State
let currentLightboxIndex = 0;
let currentZoomLevel = 1.0;
let isMotionGifActive = true;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let currentPanX = 0;
let currentPanY = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Setup Core Interactive Modules
  setupTourGateway();
  setupNavigation();
  setupFilterTabs();
  setupPaginationControls();
  setupHeroSearch();
  setupFavoritesDrawer();
  setupModals();
  setupThemeToggle();
  setupStudyLightingToggle();
  setupMortgageCalculator();
  setupAnimatedMetrics();
  setupTiltCards();
  setupZoomLightbox();
  setupHeroScroll();
  setupCinematicScrollVideo();
  setupGridRadarInteractions();
  renderTestimonials();
  setupEnquiryForm();
  renderListings();
  updateFavoritesUI();
});

// Always take user to the top on load/refresh (disable automatic scroll restoration)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// Setup Entry House Tour Gateway Blur Popup with 3-Minute Cooldown
function setupTourGateway() {
  const gateway = document.getElementById('intro-tour-gateway');
  const startBtn = document.getElementById('start-house-tour-btn');
  if (!gateway || !startBtn) return;

  const TOUR_COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes
  const lastDismissedTime = localStorage.getItem('poperty_tour_cooldown_timestamp');
  const now = Date.now();

  // If dismissed within the last 3 minutes, suppress popup and unlock site immediately
  if (lastDismissedTime && (now - parseInt(lastDismissedTime, 10) < TOUR_COOLDOWN_MS)) {
    gateway.classList.add('gateway-dismissed');
    gateway.style.display = 'none';
    document.body.classList.remove('tour-gate-locked');
    return;
  }

  function dismissGateway() {
    if (gateway.classList.contains('gateway-dismissed')) return;

    // Record dismissal time in localStorage
    try {
      localStorage.setItem('poperty_tour_cooldown_timestamp', Date.now().toString());
    } catch(e) {}

    gateway.classList.add('gateway-dismissed');
    document.body.classList.remove('tour-gate-locked');

    // Completely remove from accessibility/interaction flow after fade
    setTimeout(() => {
      gateway.style.display = 'none';
    }, 700);
  }

  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dismissGateway();
  });

  // Support pressing Enter or Space to open website
  window.addEventListener('keydown', (e) => {
    if (!gateway.classList.contains('gateway-dismissed')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismissGateway();
      }
    }
  });
}

// Setup Theme Toggle (Dark / Gallery White) - Default to Dark Theme
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  // Always default to dark theme as requested
  const savedTheme = localStorage.getItem('poperty_theme') || 'dark';

  if (savedTheme !== 'light') {
    document.body.classList.add('dark-mode');
    if (icon) icon.setAttribute('data-lucide', 'sun');
  } else {
    document.body.classList.remove('dark-mode');
    if (icon) icon.setAttribute('data-lucide', 'moon');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('poperty_theme', isDark ? 'dark' : 'light');
      
      if (icon) {
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        if (window.lucide) lucide.createIcons();
      }
      showToast(isDark ? 'Midnight Dark Theme Active' : 'Gallery White Theme Active');
    });
  }
}

// Setup Day / Dusk Lighting Toggle on Architectural Study
function setupStudyLightingToggle() {
  const toggleBtn = document.getElementById('toggle-study-lighting');
  const studyImg = document.getElementById('study-image');
  const icon = document.getElementById('study-lighting-icon');
  const text = document.getElementById('study-lighting-text');

  if (toggleBtn && studyImg) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isDuskLighting = !isDuskLighting;
      if (isDuskLighting) {
        studyImg.style.filter = 'brightness(0.72) sepia(0.3) saturate(1.4) contrast(1.15)';
        if (text) text.textContent = 'Daylight Ambiance';
        if (icon) icon.setAttribute('data-lucide', 'moon');
        showToast('Activated Golden Hour / Dusk Lighting');
      } else {
        studyImg.style.filter = 'brightness(0.92)';
        if (text) text.textContent = 'Dusk Ambiance';
        if (icon) icon.setAttribute('data-lucide', 'sun');
        showToast('Restored Architectural Daylight Ambiance');
      }
      if (window.lucide) lucide.createIcons();
    });
  }
}

// Setup Mobile & Desktop Navigation (Clickable, Smooth Scroll & Scroll Spy)
function setupNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const logoBtn = document.getElementById('brand-logo-btn');
  const browseBtn = document.getElementById('nav-browse-btn');

  // Brand Logo Scroll to Top
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Welcome to Provenance — Sovereign Estates');
    });
  }

  // Browse Button Scroll
  if (browseBtn) {
    browseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('featured-listings');
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        target.classList.add('section-glow-active');
        setTimeout(() => target.classList.remove('section-glow-active'), 1200);
      }
    });
  }

  // Mobile Toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Interactive Desktop & Mobile Nav Links Click Handling
  const allNavLinks = document.querySelectorAll('.nav-link-interactive, .mobile-nav-link');
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top, behavior: 'smooth' });
          
          // Visual highlight
          target.classList.add('section-glow-active');
          setTimeout(() => target.classList.remove('section-glow-active'), 1200);

          // Update active link state
          document.querySelectorAll('.nav-link-interactive').forEach(l => l.classList.remove('active'));
          const matchingDesktop = document.querySelector(`.nav-link-interactive[href="#${targetId}"]`);
          if (matchingDesktop) matchingDesktop.classList.add('active');

          if (mobileMenu) mobileMenu.classList.add('hidden');
          showToast(`Navigated to ${link.textContent.trim()}`);
        }
      }
    });
  });

  // Scroll Spy: Highlight Current Active Section on Scroll & Toggle Static Nav Scrolled State
  window.addEventListener('scroll', () => {
    const staticNav = document.getElementById('site-static-nav');
    if (staticNav) {
      if (window.pageYOffset > 40) {
        staticNav.classList.add('scrolled');
      } else {
        staticNav.classList.remove('scrolled');
      }
    }

    const scrollPos = window.pageYOffset;
    if (scrollPos < 350) {
      // At the hero section - no nav links highlighted
      document.querySelectorAll('.nav-link-interactive').forEach(l => l.classList.remove('active'));
      return;
    }

    const sections = ['about-section', 'cinematic-experience', 'featured-listings', 'testimonials', 'advisory'];
    const spyPos = scrollPos + 220;

    for (let id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (spyPos >= top && spyPos < top + height) {
          document.querySelectorAll('.nav-link-interactive').forEach(l => {
            if (l.getAttribute('href') === `#${id}`) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
          break;
        }
      }
    }
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to the Private Gazette.', 'success');
      newsletterForm.reset();
    });
  }
}

// Setup Category Filter Tabs
function setupFilterTabs() {
  const tabButtons = document.querySelectorAll('.filter-tab');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-black', 'text-white', 'active');
        b.classList.add('bg-gray-100', 'text-gray-700');
      });
      btn.classList.add('bg-black', 'text-white', 'active');
      btn.classList.remove('bg-gray-100', 'text-gray-700');

      currentCategory = btn.getAttribute('data-category');
      currentPage = 1;
      renderListings();
    });
  });
}

// Setup Pagination & Carousel Controls
function setupPaginationControls() {
  const prevBtn = document.getElementById('prev-listings-btn');
  const nextBtn = document.getElementById('next-listings-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const filtered = getFilteredProperties();
      const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
      currentPage = currentPage > 1 ? currentPage - 1 : totalPages;
      renderListings();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredProperties();
      const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
      currentPage = currentPage < totalPages ? currentPage + 1 : 1;
      renderListings();
    });
  }
}

function getFilteredProperties() {
  let list = PROPERTIES_DATA;
  if (currentCategory !== 'all') {
    list = list.filter(p => p.category === currentCategory);
  }
  const searchInput = document.getElementById('hero-location-input');
  if (searchInput && searchInput.value.trim() !== '') {
    const q = searchInput.value.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.location.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q)
    );
  }
  return list;
}

// Render Listings Grid dynamically
function renderListings() {
  const grid = document.getElementById('listings-grid');
  const pageLabel = document.getElementById('listing-pagination-label');
  if (!grid) return;

  const filtered = getFilteredProperties();
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  
  if (currentPage > totalPages) currentPage = 1;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  if (pageLabel) {
    const formattedPage = String(currentPage).padStart(2, '0');
    pageLabel.textContent = `(${formattedPage}) Featured Listings`;
  }

  if (currentItems.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-gray-400">
        <i data-lucide="compass" class="w-10 h-10 mx-auto mb-2 text-gray-300"></i>
        <p class="font-medium text-gray-600">No properties found matching your selection.</p>
        <button onclick="resetFilters()" class="mt-3 text-xs underline text-black font-semibold">
          Reset all filters
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = currentItems.map((prop) => {
    const isSaved = savedPropertyIds.includes(prop.id);
    const heartFillClass = isSaved ? 'text-red-500 fill-red-500' : 'text-white';

    // Interactive Badges (Matching Screenshot with click actions)
    let badgesMarkup = '';
    if (prop.badges && prop.badges.length > 0) {
      badgesMarkup = `
        <div class="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-1.5 z-20">
          <button onclick="event.stopPropagation(); showToast('🔥 High demand: 18 VIP inquiries this week!')" class="frosted-glass-pill px-3 py-1 rounded-full text-[11px] font-bold text-gray-900 uppercase tracking-wider hover:bg-white transition-all shadow-sm flex items-center gap-1">
            <span>🔥 Hot</span>
          </button>
          <button onclick="event.stopPropagation(); openMortgageCalculator(${prop.price}, '${prop.title.replace(/'/g, "\\'")}')" class="frosted-glass-pill px-3 py-1 rounded-full text-[11px] font-medium text-gray-800 hover:bg-white hover:text-black transition-all shadow-sm flex items-center gap-1" title="Click to calculate financing">
            <i data-lucide="calculator" class="w-3 h-3 text-gray-500"></i>
            <span>Price: ${formatCurrencyPrice(prop.price)}</span>
          </button>
          <button onclick="event.stopPropagation(); openNeighborhoodModal('${prop.location.replace(/'/g, "\\'")}', '${prop.id}')" class="frosted-glass-pill px-3 py-1 rounded-full text-[11px] font-medium text-gray-800 hover:bg-white hover:text-black transition-all shadow-sm flex items-center gap-1" title="Click to view neighborhood dossier">
            <i data-lucide="map-pin" class="w-3 h-3 text-gray-500"></i>
            <span>Place: ${prop.location.split(',')[0]}</span>
          </button>
        </div>
      `;
    } else if (prop.badge) {
      badgesMarkup = `
        <div class="absolute top-4 left-4 z-20">
          <span class="frosted-glass-pill px-3 py-1 rounded-full text-[11px] font-semibold text-gray-900 shadow-sm">
            ${prop.badge}
          </span>
        </div>
      `;
    }

    // Specs markup:
    let specsMarkup = '';
    if (prop.beds && prop.baths && prop.sqft) {
      if (typeof prop.beds === 'number') {
        specsMarkup = `<p class="text-xs text-white/90 font-medium tracking-wide">${prop.beds} Beds | ${prop.baths} Baths | ${prop.sqft}</p>`;
      } else {
        specsMarkup = `<p class="text-xs text-white/80 leading-relaxed font-light">${prop.subtitle}</p>`;
      }
    } else {
      specsMarkup = `<p class="text-xs text-white/80 leading-relaxed font-light">${prop.subtitle}</p>`;
    }

    return `
      <div class="box-hover-lift group relative rounded-3xl card-curved-lg overflow-hidden bg-white border border-gray-100 shadow-md flex flex-col justify-between cursor-pointer" onclick="openPropertyModal('${prop.id}')" data-prop-id="${prop.id}">
        <div class="relative h-[340px] sm:h-[380px] w-full overflow-hidden" onclick="event.stopPropagation(); openPropertyZoom('${prop.id}', this)">
          <img 
            src="${prop.image}" 
            alt="${prop.title}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.88]"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
          
          ${badgesMarkup}

          <!-- Direct Full-Screen Zoom Button -->
          <button onclick="event.stopPropagation(); openPropertyZoom('${prop.id}', this.closest('.box-hover-lift') || this)" class="absolute top-4 right-14 p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all z-20 hover:scale-110 active:scale-95 text-white" title="Click for Zoom In Lightbox">
            <i data-lucide="zoom-in" class="w-4 h-4 text-white"></i>
          </button>

          <!-- Floating Heart / Save Button -->
          <button onclick="event.stopPropagation(); toggleFavorite('${prop.id}')" class="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all z-20 hover:scale-110 active:scale-95" title="${isSaved ? 'Remove from Saved' : 'Save Property'}">
            <i data-lucide="heart" class="w-4 h-4 ${heartFillClass}"></i>
          </button>

          <!-- Hover "Quick View" Indicator -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none gap-2">
            <span class="frosted-glass-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-950 flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <i data-lucide="zoom-in" class="w-3.5 h-3.5"></i>
              Zoom In
            </span>
            <span class="frosted-glass-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-950 flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              Dossier
            </span>
          </div>

          <!-- Card Bottom Text inside image matching screenshot -->
          <div class="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
            <h3 class="text-xl font-bold tracking-tight mb-1">${prop.title}</h3>
            ${specsMarkup}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Setup Hero Search Bar with Live Typing Filter
function setupHeroSearch() {
  const form = document.getElementById('hero-search-form');
  const locInput = document.getElementById('hero-location-input');
  const typeInput = document.getElementById('hero-type-input');

  if (locInput) {
    locInput.addEventListener('input', () => {
      currentPage = 1;
      renderListings();
    });
  }

  if (typeInput) {
    typeInput.addEventListener('change', () => {
      currentCategory = typeInput.value;
      currentPage = 1;
      updateFilterTabsUI(currentCategory);
      renderListings();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const target = document.getElementById('featured-listings');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

function updateFilterTabsUI(cat) {
  document.querySelectorAll('.filter-tab').forEach(b => {
    if (b.getAttribute('data-category') === cat) {
      b.classList.add('bg-black', 'text-white', 'active');
      b.classList.remove('bg-gray-100', 'text-gray-700');
    } else {
      b.classList.remove('bg-black', 'text-white', 'active');
      b.classList.add('bg-gray-100', 'text-gray-700');
    }
  });
}

function filterByCategory(cat) {
  currentCategory = cat;
  currentPage = 1;
  updateFilterTabsUI(cat);
  const typeSelect = document.getElementById('hero-type-input');
  if (typeSelect) typeSelect.value = cat;

  renderListings();
  const target = document.getElementById('featured-listings');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function filterByLocation(locationKeyword) {
  const locInput = document.getElementById('hero-location-input');
  if (locInput) locInput.value = locationKeyword;
  currentCategory = 'all';
  updateFilterTabsUI('all');
  renderListings();
  const target = document.getElementById('featured-listings');
  if (target) target.scrollIntoView({ behavior: 'smooth' });
  showToast(`Filtering estates in ${locationKeyword}`);
}

function resetFilters() {
  currentCategory = 'all';
  currentPage = 1;
  const locInput = document.getElementById('hero-location-input');
  if (locInput) locInput.value = '';
  const typeSelect = document.getElementById('hero-type-input');
  if (typeSelect) typeSelect.value = 'all';
  updateFilterTabsUI('all');
  renderListings();
}

// MULTI-TAB INTERACTIVE PROPERTY MODAL
function openPropertyModal(id) {
  const prop = PROPERTIES_DATA.find(p => p.id === id);
  if (!prop) return;

  activeModalProperty = prop;
  activeModalTab = 'overview';
  renderModalBody();

  const modal = document.getElementById('property-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (window.lucide) {
    lucide.createIcons();
  }
}

function switchModalTab(tabKey) {
  activeModalTab = tabKey;
  renderModalBody();
}

function renderModalBody() {
  const prop = activeModalProperty;
  const content = document.getElementById('modal-content');
  if (!prop || !content) return;

  const isSaved = savedPropertyIds.includes(prop.id);

  // Tab Header Navigation
  const tabHeaderHtml = `
    <div class="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto text-xs font-semibold">
      <button onclick="switchModalTab('overview')" class="px-3.5 py-1.5 rounded-full transition-all ${activeModalTab === 'overview' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}">
        Overview
      </button>
      <button onclick="switchModalTab('virtual3d')" class="px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeModalTab === 'virtual3d' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}">
        <i data-lucide="eye" class="w-3.5 h-3.5"></i>
        Interactive 360° View
      </button>
      <button onclick="switchModalTab('floorplan')" class="px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeModalTab === 'floorplan' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}">
        <i data-lucide="layout" class="w-3.5 h-3.5"></i>
        Floor Plan
      </button>
      <button onclick="switchModalTab('financing')" class="px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeModalTab === 'financing' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}">
        <i data-lucide="calculator" class="w-3.5 h-3.5"></i>
        Mortgage Calculator
      </button>
      <button onclick="switchModalTab('neighborhood')" class="px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${activeModalTab === 'neighborhood' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}">
        <i data-lucide="compass" class="w-3.5 h-3.5"></i>
        Neighborhood
      </button>
    </div>
  `;

  let tabBodyHtml = '';

  if (activeModalTab === 'overview') {
    tabBodyHtml = `
      <!-- Main Gallery Carousel -->
      <div class="space-y-3">
        <div class="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
          <img id="modal-main-image" src="${prop.image}" alt="${prop.title}" class="w-full h-full object-cover">
          <button onclick="toggleFavorite('${prop.id}'); refreshModalHeart('${prop.id}')" class="absolute top-4 right-4 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors" title="Bookmark Property">
            <i data-lucide="heart" class="w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-white'}"></i>
          </button>
        </div>
        
        <!-- Thumbnails -->
        <div class="flex gap-2 overflow-x-auto pb-1">
          ${prop.gallery.map((img) => `
            <button onclick="document.getElementById('modal-main-image').src='${img}'" class="w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 hover:border-black transition-all">
              <img src="${img}" class="w-full h-full object-cover">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Specs Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
        <div>
          <span class="text-xs text-gray-400 uppercase tracking-wider block">Bedrooms / Suite</span>
          <span class="text-base font-bold text-gray-900">${prop.beds}</span>
        </div>
        <div>
          <span class="text-xs text-gray-400 uppercase tracking-wider block">Bathrooms</span>
          <span class="text-base font-bold text-gray-900">${prop.baths}</span>
        </div>
        <div>
          <span class="text-xs text-gray-400 uppercase tracking-wider block">Interior Living</span>
          <span class="text-base font-bold text-gray-900">${prop.sqft}</span>
        </div>
        <div>
          <span class="text-xs text-gray-400 uppercase tracking-wider block">Status</span>
          <span class="text-base font-bold text-emerald-600">Available</span>
        </div>
      </div>

      <!-- Overview Story -->
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2">Architectural Overview</h4>
        <p class="text-sm text-gray-600 leading-relaxed">${prop.description}</p>
      </div>

      <!-- Key Curated Features -->
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Distinguished Specifications</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${prop.features.map(feat => `
            <div class="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <i data-lucide="check" class="w-4 h-4 text-gray-900 shrink-0"></i>
              <span>${feat}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeModalTab === 'virtual3d') {
    const views = prop.virtualViews || [
      { name: "Main Salon", url: prop.image },
      { name: "Private Terrace", url: prop.gallery[1] || prop.image }
    ];
    tabBodyHtml = `
      <div class="space-y-4">
        <div class="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-black shadow-lg">
          <img id="virtual-tour-canvas" src="${views[0].url}" class="w-full h-full object-cover transition-opacity duration-500">
          
          <div class="absolute top-4 left-4 frosted-dark-pill px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span id="current-room-label">${views[0].name} (Interactive 360 Camera)</span>
          </div>

          <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span class="frosted-dark-pill px-3 py-1 rounded-full text-[11px]">Click rooms below to transition view</span>
            <button onclick="showToast('Entering Fullscreen 3D Viewport')" class="frosted-dark-pill p-2 rounded-full hover:bg-white hover:text-black transition-colors">
              <i data-lucide="maximize" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          ${views.map((v, i) => `
            <button onclick="changeVirtualView('${v.url}', '${v.name}')" class="p-2.5 rounded-xl border border-gray-200 hover:border-black text-left transition-all ${i === 0 ? 'ring-2 ring-black' : ''}">
              <span class="block text-xs font-bold text-gray-900">${v.name}</span>
              <span class="block text-[10px] text-gray-400">View Angle ${i + 1}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeModalTab === 'floorplan') {
    const rooms = prop.floorPlan || [
      { name: "Grand Salon", size: "30' × 22'", desc: "Floor-to-ceiling glass wall frontage" },
      { name: "Primary Master Suite", size: "22' × 18'", desc: "Dual dressing rooms and private spa bath" }
    ];
    tabBodyHtml = `
      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <h5 class="text-sm font-bold text-gray-900">Interactive Architectural Schematic</h5>
            <p class="text-xs text-gray-500">Click any zone below to highlight dimensions & appointments.</p>
          </div>
          <span class="text-xs font-mono font-bold px-3 py-1 bg-black text-white rounded-full">${prop.sqft}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${rooms.map((r, i) => `
            <div class="floorplan-room p-4 rounded-2xl border border-gray-200 bg-white shadow-sm" onclick="showToast('Selected: ${r.name} (${r.size})')">
              <div class="flex items-center justify-between mb-1">
                <strong class="text-xs font-bold text-gray-900">${r.name}</strong>
                <span class="text-xs font-mono font-semibold text-blue-600">${r.size}</span>
              </div>
              <p class="text-xs text-gray-500">${r.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeModalTab === 'financing') {
    tabBodyHtml = `
      <div class="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs text-gray-400 uppercase font-bold block">Listing Acquisition Price</span>
            <span class="text-2xl font-bold font-display text-gray-950">${formatCurrencyPrice(prop.price)}</span>
          </div>
          <button onclick="openMortgageCalculator(${prop.price}, '${prop.title.replace(/'/g, "\\'")}')" class="px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors">
            Open Interactive Sliders
          </button>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center text-xs">
          <div class="p-3 bg-white rounded-xl border border-gray-100">
            <span class="text-gray-400 block font-medium">Down Payment (20%)</span>
            <span class="font-bold text-gray-900 mt-1 block">$${(prop.price * 0.2).toLocaleString()}</span>
          </div>
          <div class="p-3 bg-white rounded-xl border border-gray-100">
            <span class="text-gray-400 block font-medium">Est. Monthly (30yr)</span>
            <span class="font-bold text-gray-900 mt-1 block">$${Math.round((prop.price * 0.8 * (0.065/12)) / (1 - Math.pow(1 + 0.065/12, -360))).toLocaleString()}/mo</span>
          </div>
          <div class="p-3 bg-white rounded-xl border border-gray-100">
            <span class="text-gray-400 block font-medium">Est. Annual Tax</span>
            <span class="font-bold text-gray-900 mt-1 block">$${Math.round(prop.price * 0.012).toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  } else if (activeModalTab === 'neighborhood') {
    const neigh = prop.neighborhood || { walkScore: 94, transitScore: 90, airportMins: 15, marinaMins: 6, topHighlight: "Prime residential enclave with concierge marina access." };
    tabBodyHtml = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span class="text-2xl font-bold font-display text-black">${neigh.walkScore}</span>
            <span class="text-[10px] text-gray-400 block uppercase font-bold mt-1">Walk Score</span>
          </div>
          <div class="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span class="text-2xl font-bold font-display text-black">${neigh.transitScore}</span>
            <span class="text-[10px] text-gray-400 block uppercase font-bold mt-1">Transit Score</span>
          </div>
          <div class="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span class="text-2xl font-bold font-display text-black">${neigh.airportMins}m</span>
            <span class="text-[10px] text-gray-400 block uppercase font-bold mt-1">Private Jet</span>
          </div>
          <div class="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span class="text-2xl font-bold font-display text-black">${neigh.marinaMins}m</span>
            <span class="text-[10px] text-gray-400 block uppercase font-bold mt-1">Deep Marina</span>
          </div>
        </div>
        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed">
          <strong class="text-gray-900 block font-bold mb-1">Location Highlights:</strong>
          ${neigh.topHighlight}
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="space-y-6">
      <!-- Title & Price Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <span class="text-xs uppercase tracking-widest font-semibold text-gray-400">${prop.category.toUpperCase()}</span>
          <h2 class="text-2xl sm:text-3xl font-bold font-display text-gray-950 mt-1">${prop.title}</h2>
          <p class="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <i data-lucide="map-pin" class="w-4 h-4 text-gray-400"></i>
            ${prop.location}
          </p>
        </div>
        <div class="sm:text-right">
          <div class="text-3xl font-bold font-display text-gray-950">${formatCurrencyPrice(prop.price)}</div>
          <div class="text-xs text-emerald-600 font-semibold mt-0.5">● Prime Architectural Portfolio</div>
        </div>
      </div>

      <!-- Tab Header Switcher -->
      ${tabHeaderHtml}

      <!-- Tab Body -->
      ${tabBodyHtml}

      <!-- Actions Footer -->
      <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" class="w-11 h-11 rounded-full object-cover shadow-sm">
          <div>
            <span class="block text-xs font-bold text-gray-900">Julian Saint-Claire</span>
            <span class="block text-[11px] text-gray-400">Senior Partner, Architectural Acquisitions</span>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button onclick="openTourModal('${prop.title.replace(/'/g, "\\'")}')" class="flex-1 sm:flex-none px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md">
            <i data-lucide="calendar" class="w-4 h-4"></i>
            Schedule VIP Showing
          </button>
          <a href="tel:+13055550188" class="p-3 border border-gray-200 hover:border-black rounded-xl text-gray-700 hover:text-black transition-colors" title="Direct Phone Call">
            <i data-lucide="phone" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function changeVirtualView(url, roomName) {
  const canvas = document.getElementById('virtual-tour-canvas');
  const label = document.getElementById('current-room-label');
  if (canvas) {
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.src = url;
      canvas.style.opacity = '1';
      if (label) label.textContent = `${roomName} (Interactive 360 Camera)`;
    }, 200);
  }
}

function refreshModalHeart(id) {
  const isSaved = savedPropertyIds.includes(id);
  const heartIcon = document.querySelector('#modal-content [data-lucide="heart"]');
  if (heartIcon) {
    if (isSaved) {
      heartIcon.classList.add('text-red-500', 'fill-red-500');
      heartIcon.classList.remove('text-white');
    } else {
      heartIcon.classList.remove('text-red-500', 'fill-red-500');
      heartIcon.classList.add('text-white');
    }
  }
}

// INTERACTIVE MORTGAGE & FINANCING CALCULATOR
function setupMortgageCalculator() {
  const priceSlider = document.getElementById('calc-price-slider');
  const downSlider = document.getElementById('calc-down-slider');
  const rateSlider = document.getElementById('calc-rate-slider');
  const termSelect = document.getElementById('calc-term-select');

  const updateCalc = () => {
    if (!priceSlider || !downSlider || !rateSlider || !termSelect) return;

    const price = parseFloat(priceSlider.value);
    const downPercent = parseFloat(downSlider.value);
    const rate = parseFloat(rateSlider.value);
    const years = parseInt(termSelect.value);

    const downAmount = price * (downPercent / 100);
    const loanAmount = price - downAmount;
    const monthlyRate = (rate / 100) / 12;
    const numPayments = years * 12;

    const monthlyPI = Math.round((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments))) || 0;
    const monthlyTaxes = Math.round((price * 0.012) / 12);
    const monthlyIns = Math.round(price * 0.0035 / 12);
    const totalMonthly = monthlyPI + monthlyTaxes + monthlyIns;

    document.getElementById('calc-price-display').textContent = `$${price.toLocaleString()}`;
    document.getElementById('calc-down-display').textContent = `${downPercent}% ($${Math.round(downAmount).toLocaleString()})`;
    document.getElementById('calc-rate-display').textContent = `${rate.toFixed(2)}%`;
    document.getElementById('calc-monthly-total').textContent = `$${totalMonthly.toLocaleString()}/mo`;
    document.getElementById('calc-pi').textContent = `$${monthlyPI.toLocaleString()}`;
    document.getElementById('calc-taxes').textContent = `$${monthlyTaxes.toLocaleString()}`;
    document.getElementById('calc-ins').textContent = `$${monthlyIns.toLocaleString()}`;
  };

  [priceSlider, downSlider, rateSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', updateCalc);
  });
  if (termSelect) termSelect.addEventListener('change', updateCalc);
}

function openMortgageCalculator(presetPrice, title) {
  const modal = document.getElementById('calculator-modal');
  const priceSlider = document.getElementById('calc-price-slider');
  const titleDisplay = document.getElementById('calc-title');

  if (priceSlider && presetPrice) {
    priceSlider.value = presetPrice;
  }
  if (titleDisplay && title) {
    titleDisplay.textContent = `Financing: ${title}`;
  }

  // Trigger recalculation
  const event = new Event('input');
  if (priceSlider) priceSlider.dispatchEvent(event);

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

// NEIGHBORHOOD GUIDE MODAL
function openNeighborhoodModal(locationStr, propId) {
  const modal = document.getElementById('neighborhood-modal');
  const title = document.getElementById('neighborhood-title');
  const prop = PROPERTIES_DATA.find(p => p.id === propId);

  if (title) {
    title.textContent = prop ? `${prop.title} — ${locationStr}` : locationStr;
  }

  if (prop && prop.neighborhood) {
    document.getElementById('score-walk').textContent = prop.neighborhood.walkScore;
    document.getElementById('score-transit').textContent = prop.neighborhood.transitScore;
    document.getElementById('score-airport').textContent = `${prop.neighborhood.airportMins}m`;
    document.getElementById('score-marina').textContent = `${prop.neighborhood.marinaMins}m`;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

// SETUP MODAL CLOSE HANDLERS
function setupModals() {
  const propModal = document.getElementById('property-modal');
  const closePropBtn = document.getElementById('close-modal-btn');
  const propBackdrop = document.getElementById('modal-backdrop');

  const tourModal = document.getElementById('tour-modal');
  const closeTourBtn = document.getElementById('close-tour-btn');
  const tourBackdrop = document.getElementById('tour-backdrop');
  const tourForm = document.getElementById('tour-form');

  const calcModal = document.getElementById('calculator-modal');
  const closeCalcBtn = document.getElementById('close-calc-btn');
  const calcBackdrop = document.getElementById('calc-backdrop');

  const neighModal = document.getElementById('neighborhood-modal');
  const closeNeighBtn = document.getElementById('close-neighborhood-btn');
  const neighBackdrop = document.getElementById('neighborhood-backdrop');

  const closeModal = (m) => {
    if (m) m.classList.add('hidden');
    document.body.style.overflow = '';
  };

  if (closePropBtn) closePropBtn.addEventListener('click', () => closeModal(propModal));
  if (propBackdrop) propBackdrop.addEventListener('click', () => closeModal(propModal));

  if (closeTourBtn) closeTourBtn.addEventListener('click', () => closeModal(tourModal));
  if (tourBackdrop) tourBackdrop.addEventListener('click', () => closeModal(tourModal));

  if (closeCalcBtn) closeCalcBtn.addEventListener('click', () => closeModal(calcModal));
  if (calcBackdrop) calcBackdrop.addEventListener('click', () => closeModal(calcModal));

  if (closeNeighBtn) closeNeighBtn.addEventListener('click', () => closeModal(neighModal));
  if (neighBackdrop) neighBackdrop.addEventListener('click', () => closeModal(neighModal));

  if (tourForm) {
    tourForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(tourModal);
      showToast('Showing requested! A senior partner will contact you shortly.', 'success');
      tourForm.reset();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [propModal, tourModal, calcModal, neighModal].forEach(closeModal);
      closeFavoritesDrawer();
    }
  });
}

function openTourModal(propertyTitle) {
  const modal = document.getElementById('tour-modal');
  const subtitle = document.getElementById('tour-property-title');
  if (subtitle && propertyTitle) {
    subtitle.textContent = `Private showing request for ${propertyTitle}`;
  }
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

// FAVORITES & SHORTLIST MANAGEMENT
function toggleFavorite(id) {
  const index = savedPropertyIds.indexOf(id);
  const prop = PROPERTIES_DATA.find(p => p.id === id);

  if (index > -1) {
    savedPropertyIds.splice(index, 1);
    showToast(`Removed from saved shortlist.`);
  } else {
    savedPropertyIds.push(id);
    showToast(`Saved "${prop ? prop.title : 'property'}" to your shortlist!`);
  }

  localStorage.setItem('poperty_favorites', JSON.stringify(savedPropertyIds));
  updateFavoritesUI();
  renderListings();
}

function updateFavoritesUI() {
  const badge = document.getElementById('fav-badge');
  const headerCount = document.getElementById('fav-count-header');
  const summaryBox = document.getElementById('favorites-summary');
  const totalValueEl = document.getElementById('fav-total-value');
  const count = savedPropertyIds.length;

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (headerCount) {
    headerCount.textContent = count;
  }

  if (summaryBox && totalValueEl) {
    if (count > 0) {
      summaryBox.classList.remove('hidden');
      const total = savedPropertyIds.reduce((sum, id) => {
        const p = PROPERTIES_DATA.find(item => item.id === id);
        return sum + (p ? p.price : 0);
      }, 0);
      totalValueEl.textContent = formatCurrencyPrice(total);
    } else {
      summaryBox.classList.add('hidden');
    }
  }

  renderFavoritesList();
}

function renderFavoritesList() {
  const container = document.getElementById('favorites-list');
  if (!container) return;

  if (savedPropertyIds.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-gray-400">
        <i data-lucide="heart" class="w-10 h-10 mx-auto mb-3 stroke-[1.5] text-gray-300"></i>
        <p class="text-sm font-medium">No saved properties yet.</p>
        <p class="text-xs text-gray-400 mt-1">Click the heart icon on any listing to save it here.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const savedProps = PROPERTIES_DATA.filter(p => savedPropertyIds.includes(p.id));

  container.innerHTML = savedProps.map(prop => `
    <div class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
      <img src="${prop.image}" alt="${prop.title}" class="w-16 h-16 rounded-xl object-cover">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-bold text-gray-900 truncate">${prop.title}</h4>
        <p class="text-xs text-gray-500">${formatCurrencyPrice(prop.price)}</p>
        <span class="text-[11px] text-gray-400 truncate block">${prop.location}</span>
      </div>
      <div class="flex flex-col gap-1">
        <button onclick="openPropertyModal('${prop.id}')" class="p-1.5 text-gray-600 hover:text-black hover:bg-white rounded-lg transition-colors" title="View Property">
          <i data-lucide="external-link" class="w-4 h-4"></i>
        </button>
        <button onclick="toggleFavorite('${prop.id}')" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors" title="Remove">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function setupFavoritesDrawer() {
  const openBtn = document.getElementById('open-favorites-btn');
  const closeBtn = document.getElementById('close-favorites');
  const backdrop = document.getElementById('favorites-backdrop');
  const drawer = document.getElementById('favorites-drawer');
  const panel = document.getElementById('favorites-panel');
  const inquireAllBtn = document.getElementById('inquire-all-saved');
  const clearAllBtn = document.getElementById('clear-all-favs');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      drawer.classList.remove('hidden', 'pointer-events-none', 'opacity-0');
      drawer.classList.add('opacity-100');
      if (backdrop) backdrop.classList.remove('pointer-events-none');
      panel.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeDrawer = () => {
    panel.classList.add('translate-x-full');
    drawer.classList.add('opacity-0');
    setTimeout(() => {
      drawer.classList.add('hidden', 'pointer-events-none');
      if (backdrop) backdrop.classList.add('pointer-events-none');
      document.body.style.overflow = '';
    }, 300);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      savedPropertyIds = [];
      localStorage.setItem('poperty_favorites', '[]');
      updateFavoritesUI();
      renderListings();
      showToast('Cleared saved shortlist.');
    });
  }

  if (inquireAllBtn) {
    inquireAllBtn.addEventListener('click', () => {
      closeDrawer();
      openTourModal('Portfolio Shortlist Inquiry');
    });
  }
}

function closeFavoritesDrawer() {
  const drawer = document.getElementById('favorites-drawer');
  const panel = document.getElementById('favorites-panel');
  if (drawer && panel) {
    panel.classList.add('translate-x-full');
    drawer.classList.add('opacity-0');
    setTimeout(() => {
      drawer.classList.add('pointer-events-none');
      document.body.style.overflow = '';
    }, 300);
  }
}

// SETUP ANIMATED METRICS COUNT-UP
function setupAnimatedMetrics() {
  const strip = document.getElementById('metrics-strip');
  if (!strip) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumber('metric-vol', 0, 2.8, 1400, (v) => `$${v.toFixed(1)}B+`);
        animateNumber('metric-estates', 0, 850, 1400, (v) => `${Math.round(v)}+`);
        animateNumber('metric-satisfaction', 0, 99.4, 1400, (v) => `${v.toFixed(1)}%`);
        animateNumber('metric-hubs', 0, 14, 1400, (v) => `${Math.round(v)}`);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(strip);
}

function animateNumber(id, start, end, duration, formatter) {
  const el = document.getElementById(id);
  if (!el) return;

  const startTime = performance.now();
  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const currentVal = start + (end - start) * easeOutQuad;

    el.textContent = formatter(currentVal);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

// RENDER TESTIMONIALS (Continuous Left-Moving Box Marquee on Endless Loop)
function renderTestimonials() {
  const track = document.getElementById('testimonials-marquee-track');
  const fallbackContainer = document.getElementById('testimonials-container');

  if (track) {
    // Duplicate data array for seamless 0% -> -50% translateX marquee loop
    const loopData = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

    track.innerHTML = loopData.map((t, idx) => `
      <div class="testimonial-marquee-card box-hover-lift flex flex-col justify-between" data-index="${idx}">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-1 text-amber-400">
              ${Array(t.rating).fill(0).map(() => `<i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>`).join('')}
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              ${t.badge || 'Verified Client'}
            </span>
          </div>
          <p class="testimonial-quote-text mb-6">
            &ldquo;${t.quote}&rdquo;
          </p>
        </div>

        <div class="flex items-center gap-3.5 pt-4 border-t border-white/10 mt-auto">
          <img src="${t.avatar}" alt="${t.author}" class="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400/30 shrink-0">
          <div class="min-w-0">
            <h4 class="text-sm sm:text-base font-bold text-white tracking-tight truncate">${t.author}</h4>
            <p class="text-xs text-emerald-400 font-mono truncate">${t.role}</p>
            <p class="text-[11px] text-zinc-400 font-mono truncate">${t.city}</p>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
    return;
  }

  if (fallbackContainer) {
    fallbackContainer.innerHTML = TESTIMONIALS_DATA.map(t => `
      <div class="testimonial-marquee-card box-hover-lift flex flex-col justify-between p-6">
        <div>
          <div class="flex items-center gap-1 text-amber-400 mb-4">
            ${Array(t.rating).fill(0).map(() => `<i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>`).join('')}
          </div>
          <p class="testimonial-quote-text mb-6">"${t.quote}"</p>
        </div>
        <div class="flex items-center gap-3 pt-4 border-t border-white/10">
          <img src="${t.avatar}" alt="${t.author}" class="w-10 h-10 rounded-full object-cover">
          <div>
            <h5 class="text-xs font-bold text-white">${t.author}</h5>
            <p class="text-[11px] text-emerald-400 font-mono">${t.role}</p>
          </div>
        </div>
      </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
  }
}

// SETUP MEDIUM-SIZED ENQUIRY FORM
function setupEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('enquiry-name')?.value || 'Client';
    const email = document.getElementById('enquiry-email')?.value || '';
    const propType = document.getElementById('enquiry-property-type')?.value || 'Estate';

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
        <span>Registering Confidential Enquiry...</span>
      `;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      form.reset();
      showToast(`Thank you, ${name}. Your private enquiry for ${propType} has been received. Our advisory team will reach out within 2 hours.`, 'success');
      
      const successBadge = document.getElementById('enquiry-success-message');
      if (successBadge) {
        successBadge.classList.remove('hidden');
        setTimeout(() => successBadge.classList.add('hidden'), 7000);
      }
    }, 850);
  });
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item px-4 py-3 rounded-2xl bg-black text-white text-xs font-medium shadow-2xl flex items-center gap-2.5 border border-white/20';
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 text-white shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}


// =========================================================
// 3D PERSPECTIVE TILT & CURSOR-TRACKING GLARE SHEEN
// =========================================================
function setupTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;  // Max 9 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      
      // Update glare sheen mouse position
      const mousePercentX = ((x / rect.width) * 100).toFixed(1);
      const mousePercentY = ((y / rect.height) * 100).toFixed(1);
      card.style.setProperty('--mouse-x', `${mousePercentX}%`);
      card.style.setProperty('--mouse-y', `${mousePercentY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// =========================================================
// FULL-SCREEN ARCHITECTURAL ZOOM & MOTION LIGHTBOX (iOS Maximize)
// =========================================================
function setupZoomLightbox() {
  const lightbox = document.getElementById('zoom-lightbox');
  const closeBtn = document.getElementById('close-zoom-lightbox');
  const backdrop = document.getElementById('zoom-lightbox-backdrop');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const motionToggleBtn = document.getElementById('zoom-toggle-motion-btn');
  const zoomWrapper = document.getElementById('zoom-wrapper');

  if (closeBtn) closeBtn.addEventListener('click', closeZoomLightbox);
  if (backdrop) backdrop.addEventListener('click', closeZoomLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex > 0) ? currentLightboxIndex - 1 : PARTNER_SHOWCASE.length - 1;
      updateLightboxContent(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex < PARTNER_SHOWCASE.length - 1) ? currentLightboxIndex + 1 : 0;
      updateLightboxContent(true);
    });
  }

  // Motion toggle button is disabled across the website
  if (motionToggleBtn) {
    motionToggleBtn.style.display = 'none';
  }

  // iOS Touch / Pointer Drag-to-Dismiss (Swipe Down to Close)
  let isDraggingDown = false;
  let startDragY = 0;
  let currentDragDeltaY = 0;

  if (zoomWrapper) {
    // Double click to zoom in/out
    zoomWrapper.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      currentZoomLevel = (currentZoomLevel === 1.0) ? 1.75 : 1.0;
      applyZoomTransform();
      showToast(currentZoomLevel > 1.0 ? 'Magnified: Drag image to pan' : 'Restored Normal Framing');
    });

    zoomWrapper.addEventListener('pointerdown', (e) => {
      if (currentZoomLevel > 1.0 || isClosingZoom) return;
      isDraggingDown = true;
      startDragY = e.clientY;
      currentDragDeltaY = 0;
      zoomWrapper.style.transition = 'none';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDraggingDown || currentZoomLevel > 1.0 || isClosingZoom) return;
      const deltaY = e.clientY - startDragY;
      if (deltaY > 0) {
        currentDragDeltaY = deltaY;
        const dragScale = Math.max(0.80, 1 - deltaY * 0.0008);
        const dragY = deltaY * 0.68;
        zoomWrapper.style.transform = `translate3d(0, ${dragY}px, 0) scale(${dragScale})`;
        if (backdrop) {
          backdrop.style.opacity = Math.max(0.15, 1 - deltaY * 0.002);
        }
      }
    });

    const finishDrag = () => {
      if (!isDraggingDown) return;
      isDraggingDown = false;
      if (currentDragDeltaY > 55) {
        closeZoomLightbox();
      } else {
        const smoothCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';
        zoomWrapper.style.transition = `transform 0.3s ${smoothCurve}`;
        zoomWrapper.style.transform = 'translate3d(0, 0, 0) scale(1)';
        if (backdrop) {
          backdrop.style.transition = `opacity 0.3s ${smoothCurve}`;
          backdrop.style.opacity = '1';
        }
      }
    };

    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeZoomLightbox();
    } else if (e.key === 'ArrowLeft') {
      currentLightboxIndex = (currentLightboxIndex > 0) ? currentLightboxIndex - 1 : PARTNER_SHOWCASE.length - 1;
      updateLightboxContent(true);
    } else if (e.key === 'ArrowRight') {
      currentLightboxIndex = (currentLightboxIndex < PARTNER_SHOWCASE.length - 1) ? currentLightboxIndex + 1 : 0;
      updateLightboxContent(true);
    }
  });
}

// State for iOS Card Maximize
let lastTriggerElement = null;
let isClosingZoom = false;
let currentSource = null;
let currentDest = null;

function computeIosDestRect() {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  let destW = Math.min(screenW * 0.90, 1140);
  let destH = Math.min(screenH * 0.82, 750);

  if (screenW < 640) {
    destW = screenW * 0.94;
    destH = Math.min(screenH * 0.80, 560);
  }

  const destL = Math.round((screenW - destW) / 2);
  const destT = Math.round((screenH - destH) / 2);
  return { left: destL, top: destT, width: destW, height: destH, radius: '28px' };
}

// Universal iOS-Style Fullscreen Image Zoom for ANY image on the website
function openAnyImageZoom(target, title = '', tag = '', triggerElement = null) {
  const lightbox = document.getElementById('zoom-lightbox');
  const backdrop = document.getElementById('zoom-lightbox-backdrop');
  const wrapper = document.getElementById('zoom-wrapper');
  const img = document.getElementById('zoom-lightbox-img');
  const closeBtn = document.getElementById('close-zoom-lightbox');
  const motionBadge = document.getElementById('zoom-toggle-motion-btn');
  const caption = document.getElementById('lightbox-caption-capsule');
  const titleEl = document.getElementById('lightbox-caption-title');
  const tagEl = document.getElementById('lightbox-caption-tag');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!lightbox || !wrapper || !img) return;

  if (motionBadge) motionBadge.style.display = 'none';

  let src = '';
  let targetTrigger = triggerElement;

  if (typeof target === 'string') {
    src = target;
  } else if (target && target.tagName === 'IMG') {
    src = target.currentSrc || target.src;
    if (!targetTrigger) targetTrigger = target;
    if (!title && target.alt) title = target.alt;
  } else if (target && target.querySelector && target.querySelector('img')) {
    const childImg = target.querySelector('img');
    src = childImg.currentSrc || childImg.src;
    if (!targetTrigger) targetTrigger = childImg;
    if (!title && childImg.alt) title = childImg.alt;
  }

  if (!src) return;

  if (!targetTrigger && typeof event !== 'undefined' && event && event.currentTarget) {
    targetTrigger = event.currentTarget;
  }
  lastTriggerElement = targetTrigger;

  const sourceEl = (targetTrigger && targetTrigger.querySelector) ? (targetTrigger.querySelector('img') || targetTrigger) : targetTrigger;
  const sourceRect = sourceEl ? sourceEl.getBoundingClientRect() : null;
  const sourceRadius = targetTrigger ? window.getComputedStyle(targetTrigger).borderRadius : '24px';

  currentZoomLevel = 1.0;
  currentPanX = 0;
  currentPanY = 0;

  img.src = src;

  if (titleEl) titleEl.textContent = title || 'Architectural View';
  if (tagEl) tagEl.textContent = tag ? `● ${tag}` : '● High-Resolution View';

  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const defaultSource = {
    left: Math.round(screenW / 2 - 120),
    top: Math.round(screenH / 2 - 120),
    width: 240,
    height: 240,
    radius: '24px'
  };

  currentSource = sourceRect ? {
    left: sourceRect.left,
    top: sourceRect.top,
    width: sourceRect.width,
    height: sourceRect.height,
    radius: sourceRadius
  } : defaultSource;

  const dest = computeIosDestRect();
  currentDest = dest;

  wrapper.style.position = 'fixed';
  wrapper.style.left = `${currentSource.left}px`;
  wrapper.style.top = `${currentSource.top}px`;
  wrapper.style.width = `${currentSource.width}px`;
  wrapper.style.height = `${currentSource.height}px`;
  wrapper.style.borderRadius = currentSource.radius || '24px';
  wrapper.style.transform = 'translate3d(0, 0, 0) scale(1)';
  wrapper.style.transition = 'none';
  wrapper.style.zIndex = '100010';
  wrapper.style.overflow = 'hidden';
  wrapper.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.45)';

  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.transform = 'none';

  if (backdrop) { backdrop.style.transition = 'none'; backdrop.style.opacity = '0'; }
  if (closeBtn) { closeBtn.style.transition = 'none'; closeBtn.style.opacity = '0'; closeBtn.style.transform = 'scale(0.8)'; }
  if (caption) { caption.style.transition = 'none'; caption.style.opacity = '0'; caption.style.transform = 'translateX(-50%) translateY(20px)'; }

  lightbox.style.display = 'block';
  lightbox.classList.add('active');
  lightbox.classList.remove('hidden', 'pointer-events-none');
  document.body.classList.add('ios-active');

  wrapper.offsetHeight;

  const smoothCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrapper.style.transition = `left 0.38s ${smoothCurve}, top 0.38s ${smoothCurve}, width 0.38s ${smoothCurve}, height 0.38s ${smoothCurve}, border-radius 0.38s ${smoothCurve}, box-shadow 0.38s ${smoothCurve}`;
      wrapper.style.left = `${dest.left}px`;
      wrapper.style.top = `${dest.top}px`;
      wrapper.style.width = `${dest.width}px`;
      wrapper.style.height = `${dest.height}px`;
      wrapper.style.borderRadius = '24px';
      wrapper.style.boxShadow = '0 30px 85px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.15)';

      if (backdrop) {
        backdrop.style.transition = `opacity 0.35s ${smoothCurve}`;
        backdrop.style.opacity = '1';
      }

      setTimeout(() => {
        if (closeBtn) {
          closeBtn.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          closeBtn.style.opacity = '1';
          closeBtn.style.transform = 'scale(1)';
        }
        if (caption) {
          caption.style.transition = `opacity 0.3s ${smoothCurve}, transform 0.3s ${smoothCurve}`;
          caption.style.opacity = '1';
          caption.style.transform = 'translateX(-50%) translateY(0)';
        }
      }, 120);
    });
  });

  showToast(`Zoomed: ${title || 'Architectural View'}`);
  if (window.lucide) lucide.createIcons();
}

function openZoomLightbox(index = 0, triggerElement = null) {
  const item = PARTNER_SHOWCASE[index] || PARTNER_SHOWCASE[0];
  if (!item) return;
  const trigger = triggerElement || document.getElementById(`partner-card-${index + 1}`) || document.querySelector('.partner-interactive-card');
  openAnyImageZoom(item.staticImg, item.title, item.tag, trigger);
}

let closeZoomTimeout = null;

function closeZoomLightbox() {
  const lightbox = document.getElementById('zoom-lightbox');
  const wrapper = document.getElementById('zoom-wrapper');
  const backdrop = document.getElementById('zoom-lightbox-backdrop');
  const closeBtn = document.getElementById('close-zoom-lightbox');
  const motionBadge = document.getElementById('zoom-toggle-motion-btn');
  const caption = document.getElementById('lightbox-caption-capsule');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (!lightbox || !wrapper) return;

  // Prevent duplicate execution while allowing fail-safe recovery
  if (isClosingZoom) {
    finishClose();
    return;
  }
  isClosingZoom = true;

  // Reset internal zoom/pan state
  currentZoomLevel = 1.0;
  currentPanX = 0;
  currentPanY = 0;
  const zoomImg = document.getElementById('zoom-lightbox-img');
  if (zoomImg) {
    zoomImg.style.transition = 'transform 0.25s ease';
    zoomImg.style.transform = 'none';
  }

  // Fade out UI controls rapidly
  if (closeBtn) { closeBtn.style.transition = 'opacity 0.15s ease'; closeBtn.style.opacity = '0'; }
  if (motionBadge) { motionBadge.style.transition = 'opacity 0.15s ease'; motionBadge.style.opacity = '0'; }
  if (caption) { caption.style.transition = 'opacity 0.15s ease'; caption.style.opacity = '0'; }
  if (prevBtn) { prevBtn.style.transition = 'opacity 0.15s ease'; prevBtn.style.opacity = '0'; }
  if (nextBtn) { nextBtn.style.transition = 'opacity 0.15s ease'; nextBtn.style.opacity = '0'; }

  // Remove dimming on body smoothly
  document.body.classList.remove('ios-active');

  // Determine return target rectangle
  let returnRect = null;
  let returnRadius = '24px';

  let returnEl = lastTriggerElement;
  if (!returnEl || !document.body.contains(returnEl)) {
    returnEl = document.getElementById(`partner-card-${currentLightboxIndex + 1}`) || document.querySelector('.partner-interactive-card');
  }

  if (returnEl && document.body.contains(returnEl)) {
    const sourceEl = (returnEl.querySelector && returnEl.querySelector('img')) ? returnEl.querySelector('img') : returnEl;
    const r = sourceEl.getBoundingClientRect();
    if (r && r.width > 20 && r.height > 20 && r.bottom > 0 && r.top < window.innerHeight) {
      returnRect = r;
      returnRadius = window.getComputedStyle(returnEl).borderRadius || '24px';
    }
  }

  // Fallback to recorded source rect
  if (!returnRect && currentSource && currentSource.width > 20) {
    returnRect = currentSource;
    returnRadius = currentSource.radius || '24px';
  }

  const smoothCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  if (returnRect) {
    // Smooth, butter-like return to the exact card bounds
    wrapper.style.transition = `left 0.35s ${smoothCurve}, top 0.35s ${smoothCurve}, width 0.35s ${smoothCurve}, height 0.35s ${smoothCurve}, border-radius 0.35s ${smoothCurve}, transform 0.35s ${smoothCurve}, opacity 0.32s ease, box-shadow 0.35s ease`;
    wrapper.style.transform = 'translate3d(0, 0, 0) scale(1)';
    wrapper.style.left = `${returnRect.left}px`;
    wrapper.style.top = `${returnRect.top}px`;
    wrapper.style.width = `${returnRect.width}px`;
    wrapper.style.height = `${returnRect.height}px`;
    wrapper.style.borderRadius = returnRadius;
    wrapper.style.opacity = '0';
    wrapper.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';

    if (backdrop) {
      backdrop.style.transition = 'opacity 0.3s ease';
      backdrop.style.opacity = '0';
    }

    if (closeZoomTimeout) clearTimeout(closeZoomTimeout);
    closeZoomTimeout = setTimeout(finishClose, 350);
  } else {
    // Elegant scale down fade if off-screen
    wrapper.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    wrapper.style.transform = 'scale(0.88)';
    wrapper.style.opacity = '0';

    if (backdrop) {
      backdrop.style.transition = 'opacity 0.22s ease';
      backdrop.style.opacity = '0';
    }

    if (closeZoomTimeout) clearTimeout(closeZoomTimeout);
    closeZoomTimeout = setTimeout(finishClose, 260);
  }

  function finishClose() {
    if (closeZoomTimeout) clearTimeout(closeZoomTimeout);
    closeZoomTimeout = null;

    lightbox.style.display = 'none';
    lightbox.classList.remove('active');
    lightbox.classList.add('hidden', 'pointer-events-none');
    document.body.classList.remove('ios-active');
    document.body.style.overflow = '';

    wrapper.style.cssText = '';
    const imgEl = document.getElementById('zoom-lightbox-img');
    if (imgEl) imgEl.style.transform = '';

    isClosingZoom = false;
  }
}

function updateLightboxContent(animate = false) {
  const item = PARTNER_SHOWCASE[currentLightboxIndex];
  const img = document.getElementById('zoom-lightbox-img');
  const title = document.getElementById('lightbox-caption-title');
  const tag = document.getElementById('lightbox-caption-tag');

  if (!item || !img) return;

  lastTriggerElement = document.getElementById(`partner-card-${currentLightboxIndex + 1}`) || lastTriggerElement;

  const targetSrc = item.staticImg;

  if (animate) {
    img.style.opacity = '0.4';
    img.style.transform = 'scale(0.96)';
    setTimeout(() => {
      img.src = targetSrc;
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 120);
  } else {
    img.src = targetSrc;
  }

  if (title) title.textContent = item.title;
  if (tag) tag.textContent = `● ${item.tag}`;

  currentZoomLevel = 1.0;
  currentPanX = 0;
  currentPanY = 0;
}

function applyZoomTransform() {
  const img = document.getElementById('zoom-lightbox-img');
  const wrapper = document.getElementById('zoom-wrapper');

  if (img) {
    img.style.transform = `scale(${currentZoomLevel}) translate(${currentPanX / currentZoomLevel}px, ${currentPanY / currentZoomLevel}px)`;
  }
}

// Open iOS Maximize Zoom Lightbox for Any Property
function openPropertyZoom(propId, triggerElement = null) {
  const prop = PROPERTIES_DATA.find(p => p.id === propId);
  if (!prop) return;

  let targetTrigger = triggerElement;
  if (!targetTrigger && typeof event !== 'undefined' && event && event.currentTarget) {
    targetTrigger = event.currentTarget;
  }
  if (!targetTrigger) {
    targetTrigger = document.querySelector(`[data-prop-id="${propId}"]`) || document.querySelector('.box-hover-lift');
  }

  openAnyImageZoom(prop.image, prop.title, `${prop.location} • ${prop.priceFormatted}`, targetTrigger);
}

// Universal Click Handler: Clicking ANY image across the website zooms that particular image!
document.addEventListener('click', (e) => {
  const img = e.target.closest('img:not(.no-zoom)');
  if (!img) return;

  // Ignore navigation bar items, tour gateway popup, zoom lightbox controls, avatars/logos
  if (img.closest('#site-static-nav, #intro-tour-gateway, #zoom-lightbox, .brand-logo, .avatar-chip, [data-no-zoom]')) {
    return;
  }

  // Prevent parent card events (like opening the property modal if clicking the image)
  e.stopPropagation();

  let title = img.alt || '';
  let tag = 'Architectural View';

  const card = img.closest('.partner-interactive-card, .box-hover-lift, .enclave-box, .material-specimen-card, #turner-spotlight-card, .property-card');
  if (card) {
    const heading = card.querySelector('h2, h3, h4');
    if (heading && !title) title = heading.textContent.trim();
    const tagEl = card.querySelector('.text-emerald-400, span');
    if (tagEl) tag = tagEl.textContent.trim().substring(0, 40);
  }

  openAnyImageZoom(img, title || 'Architectural Showcase', tag, img);
}, true);

// Expose key handlers to window
window.openAnyImageZoom = openAnyImageZoom;
window.openZoomLightbox = openZoomLightbox;
window.openPropertyZoom = openPropertyZoom;
window.closeZoomLightbox = closeZoomLightbox;
window.openPropertyModal = openPropertyModal;
window.switchModalTab = switchModalTab;

// =========================================================
// CINEMATIC SCROLL-DRIVEN VIDEO CONTROLLER
// (Non-blocking queued seeking: every scroll moves video frames!)

// =========================================================
// CINEMATIC VIDEO CONTROLLER (Continuous 60FPS Loop)
// Plays continuously on loop; not scrubbed by page scroll
// =========================================================
function setupCinematicScrollVideo() {
  const video = document.getElementById('scroll-cinematic-video');
  const section = document.getElementById('cinematic-experience');
  const timecodeEl = document.getElementById('video-timecode');
  const progressFill = document.getElementById('video-progress-fill');
  const scrubBar = document.getElementById('video-scrub-bar');
  const ambientGlow = document.getElementById('video-ambient-glow');
  const badgeMode = document.getElementById('video-mode-badge');
  const playPauseBtn = document.getElementById('toggle-video-autoplay-btn');
  const playPauseIcon = document.getElementById('btn-autoplay-icon');
  const playPauseText = document.getElementById('btn-autoplay-text');
  const resetBtn = document.getElementById('video-reset-btn');
  const fullscreenBtn = document.getElementById('video-fullscreen-btn');

  const phaseLabel = document.getElementById('cinematic-phase-label');
  const phaseTimer = document.getElementById('cinematic-phase-timer');
  const phaseTitle = document.getElementById('cinematic-phase-title');
  const phaseDesc = document.getElementById('cinematic-phase-desc');

  if (!video || !section) return;

  // Configure continuous loop playback
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;

  const attemptPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: resumes on first user interaction
        const startOnInteract = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', startOnInteract);
          window.removeEventListener('keydown', startOnInteract);
          window.removeEventListener('touchstart', startOnInteract);
        };
        window.addEventListener('click', startOnInteract, { once: true });
        window.addEventListener('keydown', startOnInteract, { once: true });
        window.addEventListener('touchstart', startOnInteract, { once: true });
      });
    }
  };

  attemptPlay();

  video.addEventListener('loadedmetadata', () => {
    updateHud(video.currentTime, video.duration || 27.12);
  });

  function formatTime(sec) {
    const s = Math.max(0, sec || 0);
    const mins = String(Math.floor(s / 60)).padStart(2, '0');
    const secs = (s % 60).toFixed(1).padStart(4, '0');
    return mins + ':' + secs;
  }

  function updateHud(current, total, progressOverride) {
    const duration = total > 0 ? total : 27.12;
    const p = progressOverride !== undefined 
      ? Math.max(0, Math.min(1, progressOverride)) 
      : Math.max(0, Math.min(1, current / duration));

    if (timecodeEl) {
      timecodeEl.textContent = formatTime(current) + ' / ' + formatTime(duration);
    }
    if (progressFill) {
      progressFill.style.width = (p * 100).toFixed(1) + '%';
    }

    if (phaseLabel && phaseTitle && phaseDesc) {
      if (p < 0.28) {
        phaseLabel.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span>Phase 01 / Aerial Survey';
        if (phaseTimer) phaseTimer.textContent = '00:00 - 00:07';
        phaseTitle.textContent = 'Aerial Territory Survey';
        phaseDesc.textContent = 'Expansive panoramic drone survey gliding over private master-planned enclaves, surrounded by lush tropical canopies.';
        if (ambientGlow) ambientGlow.style.backgroundColor = 'rgba(59, 130, 246, 0.25)';
      } else if (p < 0.58) {
        phaseLabel.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span>Phase 02 / Precision Architecture';
        if (phaseTimer) phaseTimer.textContent = '00:07 - 00:15';
        phaseTitle.textContent = 'Geometric Cantilevers & Pools';
        phaseDesc.textContent = 'Ultra-luxury modern residences featuring honed limestone facades, floor-to-ceiling acoustic glass, and horizon pools.';
        if (ambientGlow) ambientGlow.style.backgroundColor = 'rgba(245, 158, 11, 0.22)';
      } else if (p < 0.82) {
        phaseLabel.innerHTML = '<span class="w-2 h-2 rounded-full bg-teal-400"></span>Phase 03 / Master Security & Slips';
        if (phaseTimer) phaseTimer.textContent = '00:15 - 00:22';
        phaseTitle.textContent = 'Gated Enclaves & Deep Mooring';
        phaseDesc.textContent = 'Double-gated security perimeter, subterranean utility grid, and deep-water moorings accommodating vessels up to 130 feet.';
        if (ambientGlow) ambientGlow.style.backgroundColor = 'rgba(16, 185, 129, 0.22)';
      } else {
        phaseLabel.innerHTML = '<span class="w-2 h-2 rounded-full bg-purple-400"></span>Phase 04 / Sanctuary Unlocked';
        if (phaseTimer) phaseTimer.textContent = '00:22 - 00:27';
        phaseTitle.textContent = 'Destination Unlocked';
        phaseDesc.textContent = 'Arrival at your private domain. Seamless transition into our world-class residential portfolio displayed below.';
        if (ambientGlow) ambientGlow.style.backgroundColor = 'rgba(139, 92, 246, 0.25)';
      }
    }
  }

  // Smooth Render Loop using RequestAnimationFrame tracking video playback continuously
  function renderLoop() {
    const duration = (video.duration && !isNaN(video.duration) && video.duration > 0) ? video.duration : 27.12;
    updateHud(video.currentTime, duration);
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);

  // Click or drag on scrub bar to seek video without interrupting playback loop
  if (scrubBar) {
    scrubBar.addEventListener('click', (e) => {
      const barRect = scrubBar.getBoundingClientRect();
      const clickX = e.clientX - barRect.left;
      const scrubPercent = Math.max(0, Math.min(1, clickX / barRect.width));
      const duration = (video.duration && !isNaN(video.duration) && video.duration > 0) ? video.duration : 27.12;
      video.currentTime = scrubPercent * duration;
      updateHud(video.currentTime, duration, scrubPercent);
    });
  }

  // Play / Pause Toggle button
  function updatePlayButtonUI(isPlaying) {
    if (isPlaying) {
      if (playPauseText) playPauseText.textContent = 'Pause';
      if (playPauseIcon) playPauseIcon.setAttribute('data-lucide', 'pause');
      if (badgeMode) badgeMode.textContent = 'Continuous 60FPS Video Loop';
    } else {
      if (playPauseText) playPauseText.textContent = 'Play';
      if (playPauseIcon) playPauseIcon.setAttribute('data-lucide', 'play');
      if (badgeMode) badgeMode.textContent = 'Video Paused';
    }
    if (window.lucide) lucide.createIcons();
  }

  video.addEventListener('play', () => updatePlayButtonUI(true));
  video.addEventListener('pause', () => updatePlayButtonUI(false));

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
        updatePlayButtonUI(true);
        showToast('Resumed Continuous Video Loop');
      } else {
        video.pause();
        updatePlayButtonUI(false);
        showToast('Video Paused');
      }
    });
  }

  // Reset button: Rewind to beginning and keep looping
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = 0;
      video.play().catch(() => {});
      const duration = (video.duration && !isNaN(video.duration) && video.duration > 0) ? video.duration : 27.12;
      updateHud(0, duration, 0);
      updatePlayButtonUI(true);
      showToast('Rewound video to 00:00 (Looping)');
    });
  }

  // Fullscreen button
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  }
}

window.setupCinematicScrollVideo = setupCinematicScrollVideo;

// ========================================================
// HERO SCROLL FRAME SCRUBBING MODULE
// Smoothly scrubs 222 Full HD (1920x1080) architectural frames from videoweb (1).gif
// "One scroll = one frame moved, keep the scrolling trigger perfect"
// Black gradient removed for pristine clarity and vibrant architectural illumination
// ========================================================
function setupHeroScroll() {
  const canvas = document.getElementById('hero-scroll-canvas');
  const track = document.getElementById('hero-scroll-track');
  const fallbackImg = document.getElementById('hero-bg-image');
  const counter = document.getElementById('hero-frame-counter');
  const playBtn = document.getElementById('hero-play-toggle');
  const playIcon = document.getElementById('hero-play-icon');
  const progressBar = document.getElementById('hero-progress-bar');

  if (!canvas || !track) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 224;
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let isAutoPlaying = false;
  let autoPlayRaf = null;
  let lastAutoPlayTime = 0;
  let lastRenderedFrame = -1;

  // Frame URL constructor (1-indexed, 3-digit padded e.g. f_001.jpg)
  function frameUrl(index) {
    const num = String(index + 1).padStart(3, '0');
    return `assets/hero-frames/f_${num}.jpg`;
  }

  // Phase labels matching the 224 ultra-HD architectural tour
  function getPhaseLabel(frameIdx) {
    const f = frameIdx + 1;
    if (f <= 36) return '01 Front Facade • Dusk Illumination';
    if (f <= 86) return '02 Grand Foyer & Floating Staircase';
    if (f <= 152) return '03 Riverfront Sunset Terrace';
    if (f <= 188) return '04 Master Suite & Glass Lanai';
    return '05 Twilight Pavilion & Garden Walkway';
  }

  // High-DPI canvas sizing
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    renderFrame(Math.round(currentFrame));
  }

  // Draw frame with object-fit: cover math
  function renderFrame(index) {
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    const img = frames[clampedIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame if this specific frame isn't decoded yet
      for (let offset = 1; offset < 25; offset++) {
        const prev = frames[clampedIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          drawCover(prev);
          return;
        }
        const next = frames[clampedIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          drawCover(next);
          return;
        }
      }
      return;
    }

    drawCover(img);

    // Smoothly fade out fallback img once canvas is actively rendering
    if (fallbackImg && fallbackImg.style.opacity !== '0') {
      fallbackImg.style.opacity = '0';
    }
  }

  function drawCover(img) {
    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * 0.5;
    const dy = (ch - dh) * 0.5;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Progressive preloading pipeline:
  // 1. Frame 0 immediately painted for instant initial appearance
  // 2. Keyframes (every 2nd frame) preloaded for responsive scrub across the full length
  // 3. All remaining frames preloaded smoothly in micro-batches
  function preloadImages() {
    // Frame 0 immediately
    const img0 = new Image();
    img0.src = frameUrl(0);
    img0.onload = () => {
      frames[0] = img0;
      loadedCount++;
      resizeCanvas();
      renderFrame(0);
    };
    frames[0] = img0;

    // Keyframes: every 2nd frame
    const keyframes = [];
    for (let i = 2; i < TOTAL_FRAMES; i += 2) {
      keyframes.push(i);
    }

    let kIdx = 0;
    function loadKeyframeBatch() {
      const batchEnd = Math.min(kIdx + 12, keyframes.length);
      for (; kIdx < batchEnd; kIdx++) {
        const idx = keyframes[kIdx];
        if (!frames[idx]) {
          const img = new Image();
          img.src = frameUrl(idx);
          img.onload = () => { loadedCount++; };
          frames[idx] = img;
        }
      }
      if (kIdx < keyframes.length) {
        requestAnimationFrame(loadKeyframeBatch);
      } else {
        loadRemainingFrames();
      }
    }

    let rIdx = 1;
    function loadRemainingFrames() {
      let loadedThisBatch = 0;
      while (rIdx < TOTAL_FRAMES && loadedThisBatch < 15) {
        if (!frames[rIdx]) {
          const img = new Image();
          img.src = frameUrl(rIdx);
          img.onload = () => { loadedCount++; };
          frames[rIdx] = img;
          loadedThisBatch++;
        }
        rIdx += 2;
      }
      if (rIdx < TOTAL_FRAMES) {
        requestAnimationFrame(loadRemainingFrames);
      }
    }

    requestAnimationFrame(loadKeyframeBatch);
  }

  // Update UI indicators (frame counter & scrub progress bar & white gradient towards end of GIF)
  function updateIndicators(frameIdx, progress) {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));
    if (counter) {
      counter.textContent = `Frame ${clamped + 1} / ${TOTAL_FRAMES} • ${getPhaseLabel(clamped)}`;
    }
    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Ensure dark gradient remains full-strength to blend with dark UI
    const darkGrad = document.getElementById('hero-dark-gradient');
    if (darkGrad) {
      darkGrad.style.opacity = '1';
    }
  }

  // Calculate scroll target based on position inside #hero-scroll-track
  function calculateScrollTarget() {
    const trackRect = track.getBoundingClientRect();
    const scrollTravel = track.offsetHeight - window.innerHeight;
    if (scrollTravel <= 0) return { progress: 0, target: 0 };

    const scrolled = -trackRect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollTravel));
    return { progress, target: progress * (TOTAL_FRAMES - 1) };
  }

  // Slow, cinematographic, buttery smooth LERP render loop (reduced speed by 20%)
  const LERP_FACTOR = 0.064;

  function tick() {
    if (!isAutoPlaying) {
      const { progress, target } = calculateScrollTarget();
      targetFrame = target;
      currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;

      if (Math.abs(targetFrame - currentFrame) < 0.015) {
        currentFrame = targetFrame;
      }

      const frameToDraw = Math.round(currentFrame);
      if (frameToDraw !== lastRenderedFrame) {
        renderFrame(frameToDraw);
        lastRenderedFrame = frameToDraw;
        updateIndicators(frameToDraw, progress);
      }
    }

    requestAnimationFrame(tick);
  }

  // Auto-play feature (native 12.5 fps = 80ms per frame)
  function runAutoPlay(timestamp) {
    if (!isAutoPlaying) return;
    if (!lastAutoPlayTime) lastAutoPlayTime = timestamp;

    const delta = timestamp - lastAutoPlayTime;
    if (delta >= 80) {
      currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
      const progress = currentFrame / (TOTAL_FRAMES - 1);
      renderFrame(Math.round(currentFrame));
      updateIndicators(currentFrame, progress);
      lastAutoPlayTime = timestamp;
    }

    autoPlayRaf = requestAnimationFrame(runAutoPlay);
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isAutoPlaying = !isAutoPlaying;
      if (isAutoPlaying) {
        lastAutoPlayTime = 0;
        if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
        autoPlayRaf = requestAnimationFrame(runAutoPlay);
        showToast('Auto-Tour Playing: 1080p Architectural Sequence');
      } else {
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        if (autoPlayRaf) cancelAnimationFrame(autoPlayRaf);
        showToast('Scroll-Trigger Mode: Scroll down to scrub frames');
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });

  preloadImages();
  resizeCanvas();
  requestAnimationFrame(tick);
}

window.setupHeroScroll = setupHeroScroll;

// =========================================================
// INTERACTIVE ARCHITECTURAL MATERIAL & FINISH LAB
// =========================================================
const materialsData = [
  {
    name: '01. Honed Carrara Marble',
    category: 'Natural Italian Stone',
    title: 'Honed Carrara Calacatta',
    acoustic: 'STC 56',
    thermal: 'R-32.0',
    origin: 'Carrara, IT',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: '02. Shou Sugi Ban Cypress',
    category: 'Yakisugi Charred Timber',
    title: 'Carbonized Japanese Cypress',
    acoustic: 'STC 48',
    thermal: 'R-28.5',
    origin: 'Kyoto, JP',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: '03. Triple Low-E Acoustic Glass',
    category: 'Cryogenic Vacuum Interlayer',
    title: 'Triple Low-E Acoustic Glass',
    acoustic: 'STC 54',
    thermal: 'R-14.2',
    origin: 'Saint-Gobain, FR',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: '04. Brushed Champagne Titanium',
    category: 'Aero Metallurgy Millwork',
    title: 'Brushed Champagne Titanium',
    acoustic: 'STC 52',
    thermal: 'R-24.0',
    origin: 'Zurich, CH',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85'
  }
];

let activeMaterialIndex = 0;

function selectMaterial(index) {
  activeMaterialIndex = index;
  const mat = materialsData[index];
  if (!mat) return;

  const cards = document.querySelectorAll('.material-specimen-card');
  cards.forEach((c, idx) => {
    if (idx === index) {
      c.classList.add('active-specimen');
    } else {
      c.classList.remove('active-specimen');
    }
  });

  const nameEl = document.getElementById('active-material-name');
  const catEl = document.getElementById('material-hero-category');
  const titleEl = document.getElementById('material-hero-title');
  const acousticEl = document.getElementById('material-spec-acoustic');
  const thermalEl = document.getElementById('material-spec-thermal');
  const originEl = document.getElementById('material-spec-origin');
  const imgEl = document.getElementById('material-hero-img');

  if (nameEl) nameEl.textContent = mat.name;
  if (catEl) catEl.textContent = mat.category;
  if (titleEl) titleEl.textContent = mat.title;
  if (acousticEl) acousticEl.textContent = mat.acoustic;
  if (thermalEl) thermalEl.textContent = mat.thermal;
  if (originEl) originEl.textContent = mat.origin;

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = mat.img;
      imgEl.style.opacity = '1';
    }, 150);
  }

  showToast(`Inspecting Material: ${mat.title} (${mat.origin})`);
}

function inspectMaterialZoom() {
  const mat = materialsData[activeMaterialIndex];
  if (!mat) return;
  const mockCard = document.createElement('div');
  const mockImg = document.createElement('img');
  mockImg.src = mat.img;
  mockCard.appendChild(mockImg);
  if (typeof openZoomLightbox === 'function') {
    openZoomLightbox(0, mockCard);
  }
}

window.selectMaterial = selectMaterial;
window.inspectMaterialZoom = inspectMaterialZoom;

// =========================================================
// BACKGROUND GRID INTERACTION (Radar Crosshairs & CAD Coordinate Beacon)
// =========================================================
function setupGridRadarInteractions() {
  window.addEventListener('click', (e) => {
    const interactiveTarget = e.target.closest('button, a, input, select, textarea, .partner-interactive-card, .material-specimen-card, #intro-tour-gateway, #favorites-panel, .animate-modal-enter, #scroll-cinematic-video');
    if (interactiveTarget) return;

    const beacon = document.createElement('div');
    beacon.className = 'grid-radar-beacon';
    beacon.style.left = `${e.clientX}px`;
    beacon.style.top = `${e.clientY}px`;

    const gx = Math.floor(e.clientX / 64);
    const gy = Math.floor(e.clientY / 64);

    beacon.innerHTML = `
      <div class="radar-ring"></div>
      <div class="radar-crosshair"></div>
      <div class="beacon-tag">CAD [${gx}, ${gy}]</div>
    `;

    document.body.appendChild(beacon);
    setTimeout(() => {
      beacon.remove();
    }, 3500);
  });
}

window.setupGridRadarInteractions = setupGridRadarInteractions;
