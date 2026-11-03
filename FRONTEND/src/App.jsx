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
import LoadingScreen from './components/LoadingScreen';
import InquiryModal from './components/InquiryModal';

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
  const [inquiryModalData, setInquiryModalData] = useState(null); // { subject, serviceName } | null

  const isAnyModalOpen = Boolean(selectedProduct || selectedService || downloadingProduct || legalModalType || inquiryModalData);

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
    setInquiryModalData({
      subject: `Enquiry: ${serviceTitle}`,
      serviceName: serviceTitle
    });
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
    <div className="min-h-screen selection:bg-[var(--c1)] selection:text-white relative overflow-x-hidden">
      {/* Cinematic Minimal Loading Screen with Curtain Reveal Exit Transition */}
      {!isAdmin && (
        <LoadingScreen
          isLoading={isLoading}
          isDatabaseConnected={isDatabaseConnected}
          connectionError={connectionError}
          loadingStage={loadingStage}
          loadingStatusText={loadingStatusText}
          brand={brand}
          onRetry={() => reloadAll(true)}
          onOpenAdmin={() => {
            window.location.hash = '#admin';
            setIsAdmin(true);
          }}
        />
      )}

      {/* Main Website Wrapper with subtle slide-up entrance when loading completes */}
      <div
        className={`site-content-wrapper transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          !isAdmin && isLoading ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'
        }`}
      >
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

      </div>

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

      {inquiryModalData && (
        <InquiryModal
          initialSubject={inquiryModalData.subject}
          serviceName={inquiryModalData.serviceName}
          onClose={() => setInquiryModalData(null)}
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
