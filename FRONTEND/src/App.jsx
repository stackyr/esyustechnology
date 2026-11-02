import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
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

// Modals
import ProductModal from './components/ProductModal';
import ServiceModal from './components/ServiceModal';
import DownloadModal from './components/DownloadModal';
import LegalModal from './components/LegalModal';

// Admin Panel & API Integration
import AdminPanel from './admin/AdminPanel';
import AdminLogin from './admin/AdminLogin';
import api from './utils/api';
import liveSync from './utils/liveSync';
import { PRODUCTS, applyDynamicData } from './data/companyData';
import { initHearthlyAnimations, lenisScrollTo } from './utils/hearthlyAnimations';

export default function App() {
  // Admin View & Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin');
  });
  const [isDownloadsPage, setIsDownloadsPage] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('downloads');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return typeof window !== 'undefined' && !!localStorage.getItem('esyus_admin_token');
  });
  const [dataVersion, setDataVersion] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('connecting'); // 'connecting' | 'fetching' | 'ready' | 'dismissing'
  const [loadingStatusText, setLoadingStatusText] = useState('Connecting to Esyus Production Database...');
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Load Dynamic Data from Backend API
  const loadDynamicData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setIsRefreshing(true);
    setLoadingStage('fetching');
    setLoadingStatusText('Synchronizing MongoDB catalog & customizations...');
    try {
      const [brandRes, srvRes, prodRes, faqRes, landingRes] = await Promise.allSettled([
        api.getBrand(),
        api.getServices(),
        api.getProducts(),
        api.getFaqs(),
        api.getLandingPage(),
      ]);

      const brand = brandRes.status === 'fulfilled' ? brandRes.value?.data : null;
      const services = srvRes.status === 'fulfilled' ? srvRes.value?.data : null;
      const products = prodRes.status === 'fulfilled' ? prodRes.value?.data : null;
      const faqs = faqRes.status === 'fulfilled' ? faqRes.value?.data : null;
      const landingPage = landingRes.status === 'fulfilled' ? landingRes.value?.data : null;

      if (brand || services || products || faqs || landingPage) {
        applyDynamicData({ brand, services, products, faqs, landingPage });
        setDataVersion((v) => v + 1);
        setLoadingStage('ready');
        setLoadingStatusText('All records live from MongoDB Atlas');
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 120);
      }
    } catch (err) {
      console.warn('[App] Backend load warning:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Real-time live synchronization via WebSockets & Cross-Tab Broadcast
  useEffect(() => {
    liveSync.initSocket();

    const unsub = liveSync.subscribe(({ event, payload, source }) => {
      console.log(`[App] Live sync received: ${event} from ${source}`);
      setDataVersion((v) => v + 1);

      // Smoothly refresh ScrollTrigger if structural cards or section heights changed
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 150);
    });

    return () => unsub();
  }, []);

  // First fetch data from backend before showing the page (avoids stale/default data)
  useEffect(() => {
    let isMounted = true;
    setLoadingStage('connecting');
    setLoadingStatusText('Connecting to MongoDB Atlas...');

    loadDynamicData().finally(() => {
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) setIsInitialLoading(false);
        }, 300);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadDynamicData]);

  // Listen to hash changes (#admin, #downloads) and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash.toLowerCase().includes('admin'));
      setIsDownloadsPage(window.location.hash.toLowerCase().includes('downloads'));
      loadDynamicData(true);
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
    if (isAdmin || isDownloadsPage || isInitialLoading) return;
    let cleanup = null;
    const timeout = setTimeout(() => {
      cleanup = initHearthlyAnimations();
    }, 150);

    return () => {
      clearTimeout(timeout);
      if (typeof cleanup === 'function') cleanup();
    };
  }, [isAdmin, isDownloadsPage, isInitialLoading]);

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

  const handleOpenDownloadsPage = () => {
    setIsDownloadsPage(true);
    window.location.hash = '#downloads';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadDynamicData(true);
  };

  const handleBackToHome = () => {
    setIsDownloadsPage(false);
    if (window.location.hash.toLowerCase().includes('downloads')) {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadDynamicData();
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
    const ff = PRODUCTS.find((p) => p.id === 'finance-flow') || PRODUCTS[0];
    setDownloadingProduct(ff);
  };

  // Admin Authentication & Session Management
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdmin(true);
    loadDynamicData();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('esyus_admin_token');
    localStorage.removeItem('esyus_admin_user');
    setIsAdminAuthenticated(false);
    setIsAdmin(false);
    window.location.hash = '';
    loadDynamicData();
  };

  // Initial luxury preloader: First load live data from backend before showing the site
  if (isInitialLoading && !isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--ink)] select-none">
        {/* SVG Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[var(--grain)]" />
        
        <div className="relative flex flex-col items-center space-y-5 text-center p-6 max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-[var(--dark)] flex items-center justify-center shadow-xl shadow-[var(--c1)]/20 animate-pulse">
            <span className="font-serif italic text-3xl font-bold text-[var(--c1)]">E</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
              Esyus <em className="s font-normal">Technology</em>
            </h1>
            <p className="text-xs text-[var(--muted)] font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--c1)] animate-ping" />
              <span>{loadingStatusText}</span>
            </p>
          </div>

          <div className="w-48 h-1.5 bg-[var(--line)] rounded-full overflow-hidden relative shadow-inner">
            <div className="h-full bg-gradient-to-r from-[var(--c1)] via-[var(--c3)] to-[var(--c1)] w-1/2 rounded-full animate-marquee" />
          </div>

          <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">
            {loadingStage === 'connecting' && 'Step 1/3: Establishing Socket Link'}
            {loadingStage === 'fetching' && 'Step 2/3: Live MongoDB Atlas Sync'}
            {loadingStage === 'ready' && 'Step 3/3: Database Verified'}
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
          loadDynamicData();
        }}
        onLogout={handleAdminLogout}
        onDataChanged={loadDynamicData}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-[var(--c1)] selection:text-white relative">
            {/* Full-Screen Live Database Preloader Overlay */}
      {isInitialLoading && !isAdmin && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--ink)] select-none transition-opacity duration-500 ${
            loadingStage === 'dismissing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center space-y-6 text-center p-8 max-w-md w-full">
            <div className="w-20 h-20 rounded-3xl bg-[var(--dark)] flex items-center justify-center shadow-2xl shadow-[var(--c1)]/20 border border-white/10 relative">
              <span className="font-serif italic text-4xl font-bold text-[var(--c1)]">E</span>
              <div className="absolute -inset-1 rounded-3xl border border-[var(--c1)]/30 animate-pulse pointer-events-none" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
                Esyus <em className="s font-normal">Technology</em>
              </h1>
              <p className="text-xs text-[var(--muted)] font-mono">
                Smart Software Solutions &bull; Enterprise Architecture
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium border transition-all duration-300 ${
                  loadingStage === 'ready'
                    ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
                    : 'bg-[var(--soft)] text-[var(--ink)]/80 border-[var(--line)]'
                }`}
              >
                {loadingStage === 'ready' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[var(--c1)] animate-ping" />
                )}
                <span>{loadingStatusText}</span>
              </div>

              <div className="w-56 h-1.5 bg-[var(--line)]/60 rounded-full overflow-hidden relative">
                <div
                  className={`h-full bg-gradient-to-r from-[var(--c1)] via-[var(--c3)] to-[var(--c1)] rounded-full transition-all duration-500 ${
                    loadingStage === 'ready'
                      ? 'w-full'
                      : loadingStage === 'fetching'
                      ? 'w-4/5 animate-pulse'
                      : 'w-2/5 animate-pulse'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG Sprite Definitions for Code Art & Symbols */}
      <SvgSprite />
      
      {/* 01. Navbar / Header */}
      <Navbar
        dataVersion={dataVersion}
        isDownloadsPage={isDownloadsPage}
        onBackToHome={handleBackToHome}
        onNavigateSection={(id) => {
          handleBackToHome();
          setTimeout(() => scrollToSection(id), 80);
        }}
        onDownloadClick={handleOpenDownloadsPage}
        onContactClick={() => {
          if (isDownloadsPage) {
            handleBackToHome();
            setTimeout(() => scrollToSection('contact'), 80);
          } else {
            handleContactClick();
          }
        }}
      />

      <main>
        {isDownloadsPage ? (
          <DownloadsPage
            dataVersion={dataVersion}
            isRefreshing={isRefreshing}
            onRefresh={() => loadDynamicData(true)}
            onBackToHome={handleBackToHome}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onDownloadApp={handleDownloadAppDirectly}
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
            />

            {/* 05. Our Applications / Products */}
            <Products
              dataVersion={dataVersion}
              onSelectProduct={(product) => setSelectedProduct(product)}
              onDownloadProduct={handleDownloadAppDirectly}
              onViewAllPackages={handleOpenDownloadsPage}
              onDownloadClick={handleOpenDownloadsPage}
            />

            {/* 06. Featured Product — Finance Flow (Desktop Billing, GST Invoices, 100% Offline) */}
            <FeaturedProduct
              dataVersion={dataVersion}
              onDownloadFinanceFlow={() => handleOpenDownloadsPage(PRODUCTS[0])}
              onDownloadClick={(prod) => handleOpenDownloadsPage(prod || PRODUCTS[0])}
            />

            {/* 07. Why Choose Us */}
            <WhyChooseUs
              dataVersion={dataVersion}
              onContactClick={handleContactClick}
            />

            {/* 08. Our Team (Founder Milan Mandal & Co-founder Suman Raptan) */}
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
          if (isDownloadsPage) {
            handleBackToHome();
            setTimeout(() => setSelectedService(srv), 80);
          } else {
            setSelectedService(srv);
          }
        }}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onOpenDownloadsPage={handleOpenDownloadsPage}
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

      {/* Admin Authentication Modal: mounts seamlessly on top of landing page with silky entry & exit transition */}
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
