import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Database, Radio, CheckCircle2 } from 'lucide-react';
import SvgSprite from './components/SvgSprite';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompanyStats from './components/CompanyStats';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Products from './components/Products';
import FeaturedProduct from './components/FeaturedProduct';
import WhyChooseUs from './components/WhyChooseUs';
import Team from './components/Team';
import Reviews from './components/Reviews';
import DownloadSection from './components/DownloadSection';
import FAQSection from './components/FAQSection';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import DownloadsPage from './components/DownloadsPage';
import ServicesPage from './components/ServicesPage';

// Modals
import ProductModal from './components/ProductModal';
import ServiceModal from './components/ServiceModal';
import DownloadModal from './components/DownloadModal';
import LegalModal from './components/LegalModal';

// Admin Panel & API Integration
import AdminPanel from './admin/AdminPanel';
import AdminLogin from './admin/AdminLogin';
import { useData } from './context/DataContext';
import { initHearthlyAnimations, lenisScrollTo } from './utils/hearthlyAnimations';

export default function App() {
  const {
    brand,
    landingPage,
    services,
    products,
    faqs,
    isDatabaseConnected,
    isSocketConnected,
    isLoading,
    loadingStage,
    loadingStatusText,
    connectionError,
    dataVersion,
    reloadAll
  } = useData();

  // Admin View & Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin');
  });
  const [isDownloadsPage, setIsDownloadsPage] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('downloads');
  });
  const [isServicesPage, setIsServicesPage] = useState(() => {
    return typeof window !== 'undefined' && (
      window.location.hash.toLowerCase().includes('services-catalog') ||
      window.location.hash.toLowerCase() === '#services-all' ||
      window.location.hash.toLowerCase() === '#all-services'
    );
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return typeof window !== 'undefined' && !!localStorage.getItem('esyus_admin_token');
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [downloadingProduct, setDownloadingProduct] = useState(null);
  const [legalModalType, setLegalModalType] = useState(null); // 'privacy' | 'terms' | null

  const isAnyModalOpen = Boolean(selectedProduct || selectedService || downloadingProduct || legalModalType);

  // Lock background scroll and pause Lenis while modal is open so modal content scrolls natively and smoothly
  useEffect(() => {
    if (isAnyModalOpen) {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.stop();
      }
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.start();
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Handle ESC key to dismiss any open modal
  useEffect(() => {
    if (!isAnyModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setSelectedService(null);
        setDownloadingProduct(null);
        setLegalModalType(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnyModalOpen]);

  // Preselected subject in Contact Us form
  const [contactSubject, setContactSubject] = useState('Finance Flow Desktop Billing');

  // Listen to hash changes (#admin, #downloads) and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      setIsAdmin(hash.includes('admin'));
      setIsDownloadsPage(hash.includes('downloads'));
      setIsServicesPage(hash.includes('services-catalog') || hash === '#services-all' || hash === '#all-services');
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdmin((prev) => {
          const next = !prev;
          window.location.hash = next ? '#admin' : '';
          return next;
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Initialize Hearthly GSAP & Lenis smooth scroll engine (only on landing page)
  useEffect(() => {
    if (isAdmin || isDownloadsPage || isServicesPage || isLoading || !isDatabaseConnected) return;
    let cleanup = null;
    const timeout = setTimeout(() => {
      cleanup = initHearthlyAnimations();
    }, 150);

    return () => {
      clearTimeout(timeout);
      if (typeof cleanup === 'function') cleanup();
    };
  }, [isAdmin, isDownloadsPage, isServicesPage, isLoading, isDatabaseConnected]);

  // Refresh ScrollTrigger whenever live data changes so triggers adjust to content heights
  useEffect(() => {
    if (dataVersion > 0 && typeof window !== 'undefined' && window.ScrollTrigger) {
      const timer = setTimeout(() => {
        window.ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [dataVersion]);

  // Navigation handlers
  const scrollToSection = (id) => {
    const target = id === 'home' || id === '#home' ? 0 : (id.startsWith('#') ? id : `#${id}`);
    lenisScrollTo(target, { offset: -80 });
  };

  const handleOpenServicesPage = () => {
    setIsServicesPage(true);
    setIsDownloadsPage(false);
    window.location.hash = '#services-catalog';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDownloadsPage = (product = null) => {
    setIsDownloadsPage(true);
    setIsServicesPage(false);
    window.location.hash = '#downloads';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) setSelectedProduct(product);
  };

  const handleBackToHome = () => {
    setIsDownloadsPage(false);
    setIsServicesPage(false);
    if (
      window.location.hash.toLowerCase().includes('downloads') ||
      window.location.hash.toLowerCase().includes('services')
    ) {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Robust Cross-Page Navigation Engine: Switches back to landing page and polls until DOM element exists
  const navigateToSection = (sectionId) => {
    const rawId = (sectionId || '').startsWith('#') ? sectionId.slice(1) : (sectionId || '');
    
    const idMap = {
      'home': 'home',
      'about': 'about',
      'services': 'services',
      'applications': 'applications',
      'products': 'applications',
      'featured-product': 'featured-product',
      'finance-flow': 'featured-product',
      'why-choose-us': 'why-choose-us',
      'why-us': 'why-choose-us',
      'team': 'team',
      'reviews': 'reviews',
      'download': 'download',
      'downloads': 'download',
      'faq': 'faq',
      'faqs': 'faq',
      'contact': 'contact'
    };

    const targetId = idMap[rawId] || rawId || 'home';

    // If target is download, open downloads page directly
    if (targetId === 'download') {
      handleOpenDownloadsPage();
      return;
    }

    // If user is already on the landing page:
    if (!isDownloadsPage && !isServicesPage && !isAdmin) {
      scrollToSection(targetId);
      return;
    }

    // Leaving sub-page back to landing page:
    setIsDownloadsPage(false);
    setIsServicesPage(false);
    if (isAdmin) {
      setIsAdmin(false);
    }
    window.location.hash = targetId === 'home' ? '' : `#${targetId}`;

    // Poll until target element exists in DOM, then smooth scroll to it
    let attempts = 0;
    const maxAttempts = 35;
    const pollTimer = setInterval(() => {
      attempts++;
      const el = targetId === 'home' ? document.body : document.getElementById(targetId);
      if (el) {
        clearInterval(pollTimer);
        setTimeout(() => {
          scrollToSection(targetId);
        }, 50);
      } else if (attempts >= maxAttempts) {
        clearInterval(pollTimer);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
  };

  const handleEnquireService = (serviceTitle) => {
    setContactSubject(`Enquiry: ${serviceTitle}`);
    scrollToSection('contact');
  };

  const handleDownloadClick = (productToDownload = null) => {
    handleOpenDownloadsPage(productToDownload);
  };

  const handleContactClick = () => {
    scrollToSection('contact');
  };

  const handleDownloadAppDirectly = (product) => {
    setDownloadingProduct(product);
  };

  const handleDownloadFinanceFlow = () => {
    const ff = products.find((p) => p.id === 'finance-flow') || products[0];
    setDownloadingProduct(ff);
  };

  // Admin Authentication & Session Management
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdmin(true);
    reloadAll();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('esyus_admin_token');
    localStorage.removeItem('esyus_admin_user');
    setIsAdminAuthenticated(false);
    setIsAdmin(false);
    window.location.hash = '';
    reloadAll();
  };

  // =========================================================================
  // STRICT LOADING GATE: Website will NEVER open until MongoDB Atlas & Sockets connect!
  // =========================================================================
  if (!isAdmin && (isLoading || (!isDatabaseConnected && !connectionError))) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--ink)] select-none">
        {/* SVG Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
        
        <div className="relative flex flex-col items-center space-y-5 text-center p-6 max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-[var(--dark)] flex items-center justify-center shadow-xl shadow-[var(--c1)]/20 animate-pulse relative">
            <span className="font-serif italic text-3xl font-bold text-[var(--c1)]">E</span>
            <div className="absolute -inset-1 rounded-3xl border border-[var(--c1)]/40 animate-ping pointer-events-none" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
              {brand?.name || 'Esyus Technology'}
            </h1>
            <p className="text-xs text-[var(--muted)] font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--c1)] animate-ping" />
              <span>{loadingStatusText}</span>
            </p>
          </div>

          <div className="w-52 h-1.5 bg-[var(--line)] rounded-full overflow-hidden relative shadow-inner">
            <div className="h-full bg-gradient-to-r from-[var(--c1)] via-[var(--c3)] to-[var(--c1)] w-1/2 rounded-full animate-marquee" />
          </div>

          <div className="flex flex-col items-center gap-1 pt-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
              <Database className="w-3 h-3 text-[var(--c1)]" />
              <span>MongoDB Atlas Cloud Live Link</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Real-Time WebSocket Engine Active</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CONNECTION ERROR GATE: If MongoDB fails, display dedicated reconnection screen
  // =========================================================================
  if (!isAdmin && connectionError && !isDatabaseConnected) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--ink)] p-6 select-none">
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
        
        <div className="relative max-w-md w-full p-8 rounded-3xl bg-white border border-red-200 shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
              Database Connection Offline
            </span>
            <h2 className="text-xl font-bold text-[var(--ink)]">
              Connecting to MongoDB Atlas...
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              The website requires an active cloud connection to MongoDB Atlas to stream live services, release packages, and customizations. Stale local fallbacks are strictly disabled.
            </p>
          </div>

          {connectionError && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-mono text-stone-600 text-left overflow-x-auto">
              <code>{connectionError}</code>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => reloadAll(true)}
              className="px-6 py-2.5 rounded-xl bg-[var(--c1)] hover:bg-[#d64b22] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Retry Connection Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#admin';
                setIsAdmin(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-stone-100 text-xs font-semibold text-[var(--ink)] cursor-pointer"
            >
              Open Admin Suite
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and in Admin Mode, show full-screen Admin Control Suite
  if (isAdmin && isAdminAuthenticated) {
    return (
      <AdminPanel
        onBackToSite={() => {
          window.location.hash = '';
          setIsAdmin(false);
          reloadAll();
        }}
        onLogout={handleAdminLogout}
        onDataChanged={reloadAll}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-[var(--c1)] selection:text-white relative">
      
      {/* SVG Sprite Definitions for Code Art & Symbols */}
      <SvgSprite />
      
      {/* 01. Navbar / Header */}
      <Navbar
        dataVersion={dataVersion}
        isDownloadsPage={isDownloadsPage}
        isServicesPage={isServicesPage}
        onBackToHome={handleBackToHome}
        onNavigateSection={navigateToSection}
        onDownloadClick={handleOpenDownloadsPage}
        onOpenServicesPage={handleOpenServicesPage}
        onContactClick={() => {
          if (isDownloadsPage || isServicesPage) {
            navigateToSection('contact');
          } else {
            handleContactClick();
          }
        }}
      />

      <main>
        {isDownloadsPage ? (
          <DownloadsPage
            dataVersion={dataVersion}
            onBackToHome={handleBackToHome}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onDownloadApp={handleDownloadAppDirectly}
            onRefresh={reloadAll}
          />
        ) : isServicesPage ? (
          <ServicesPage
            dataVersion={dataVersion}
            onBackToHome={handleBackToHome}
            onSelectService={(service) => setSelectedService(service)}
            onEnquireService={handleEnquireService}
            onRefresh={reloadAll}
          />
        ) : (
          <>
            {/* 02. Hero Banner */}
            <Hero
              dataVersion={dataVersion}
              onExploreServices={() => scrollToSection('services')}
              onViewApplications={() => scrollToSection('applications')}
              onDownloadClick={handleOpenDownloadsPage}
            />

            {/* Company Statistics */}
            <CompanyStats dataVersion={dataVersion} />

            {/* 03. About Us / Company Introduction */}
            <AboutUs
              dataVersion={dataVersion}
              onContactClick={handleContactClick}
            />

            {/* 04. Our Services */}
            <Services
              dataVersion={dataVersion}
              onSelectService={(service) => setSelectedService(service)}
              onEnquireService={handleEnquireService}
              onViewAllServices={handleOpenServicesPage}
            />

            {/* 05. Our Applications / Products */}
            <Products
              dataVersion={dataVersion}
              onSelectProduct={(product) => setSelectedProduct(product)}
              onDownloadProduct={handleDownloadAppDirectly}
              onViewAllPackages={handleOpenDownloadsPage}
              onDownloadClick={handleOpenDownloadsPage}
            />

            {/* 06. Featured Product — Finance Flow */}
            <FeaturedProduct
              dataVersion={dataVersion}
              onDownloadFinanceFlow={handleDownloadFinanceFlow}
              onDownloadClick={(prod) => handleOpenDownloadsPage(prod || products[0])}
            />

            {/* 07. Why Choose Us */}
            <WhyChooseUs
              dataVersion={dataVersion}
              onContactClick={handleContactClick}
            />

            {/* 08. Our Team */}
            <Team
              dataVersion={dataVersion}
              onContactClick={handleContactClick}
            />

            {/* 09. Customer Reviews / Testimonials */}
            <Reviews
              dataVersion={dataVersion}
              onAddFeedbackClick={handleContactClick}
            />

            {/* 10. Download Our Applications */}
            <DownloadSection
              dataVersion={dataVersion}
              onDownloadApp={handleDownloadAppDirectly}
              onOpenDownloadsPage={handleOpenDownloadsPage}
            />

            {/* FAQ Section */}
            <FAQSection
              dataVersion={dataVersion}
              onContactClick={handleContactClick}
            />

            {/* 11. Contact Us */}
            <ContactUs
              dataVersion={dataVersion}
              preselectedSubject={contactSubject}
            />
          </>
        )}
      </main>

      {/* 12. Footer */}
      <Footer
        dataVersion={dataVersion}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onSelectService={(srv) => {
          if (isDownloadsPage || isServicesPage) {
            handleBackToHome();
            setTimeout(() => setSelectedService(srv), 80);
          } else {
            setSelectedService(srv);
          }
        }}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onOpenDownloadsPage={handleOpenDownloadsPage}
        onOpenServicesPage={handleOpenServicesPage}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setIsAdmin(true);
        }}
      />

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDownload={handleDownloadAppDirectly}
        />
      )}

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onEnquire={(title) => {
            setSelectedService(null);
            handleEnquireService(title);
          }}
        />
      )}

      {downloadingProduct && (
        <DownloadModal
          product={downloadingProduct}
          onClose={() => setDownloadingProduct(null)}
        />
      )}

      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

      {/* Admin Authentication Modal */}
      {isAdmin && !isAdminAuthenticated && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onCancel={() => {
            window.location.hash = '';
            setIsAdmin(false);
          }}
        />
      )}

    </div>
  );
}
