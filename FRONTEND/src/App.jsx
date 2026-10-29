import React, { useState, useEffect, useCallback } from 'react';
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

// Modals
import ProductModal from './components/ProductModal';
import ServiceModal from './components/ServiceModal';
import DownloadModal from './components/DownloadModal';
import LegalModal from './components/LegalModal';

// Admin Panel & API Integration
import AdminPanel from './admin/AdminPanel';
import AdminLogin from './admin/AdminLogin';
import api from './utils/api';
import { PRODUCTS, applyDynamicData } from './data/companyData';
import { initHearthlyAnimations } from './utils/hearthlyAnimations';

export default function App() {
  // Admin View & Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return typeof window !== 'undefined' && !!localStorage.getItem('esyus_admin_token');
  });
  const [dataVersion, setDataVersion] = useState(0);
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [downloadingProduct, setDownloadingProduct] = useState(null);
  const [legalModalType, setLegalModalType] = useState(null); // 'privacy' | 'terms' | null

  // Preselected subject in Contact Us form
  const [contactSubject, setContactSubject] = useState('Finance Flow Desktop Billing');

  // Load Dynamic Data from Backend API
  const loadDynamicData = useCallback(async () => {
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
        setTimeout(() => {
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        }, 100);
      }
    } catch (err) {
      console.warn('[App] Backend load warning:', err.message);
    }
  }, []);

  // Sync data on startup
  useEffect(() => {
    loadDynamicData();
  }, [loadDynamicData]);

  // Listen to hash changes (#admin) and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash.toLowerCase().includes('admin'));
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

  // Initialize Hearthly GSAP & Lenis smooth scroll engine
  useEffect(() => {
    if (isAdmin) return;
    let cleanup = null;
    const timeout = setTimeout(() => {
      cleanup = initHearthlyAnimations();
    }, 150);

    return () => {
      clearTimeout(timeout);
      if (typeof cleanup === 'function') cleanup();
    };
  }, [isAdmin]);

  // Navigation handlers
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnquireService = (serviceTitle) => {
    setContactSubject(`Enquiry: ${serviceTitle}`);
    scrollToSection('contact');
  };

  const handleDownloadClick = () => {
    scrollToSection('download');
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
    <div className="min-h-screen selection:bg-[var(--c1)] selection:text-white">
      {/* SVG Sprite Definitions for Code Art & Symbols */}
      <SvgSprite />
      
      {/* 01. Navbar / Header */}
      <Navbar
        dataVersion={dataVersion}
        onDownloadClick={handleDownloadClick}
        onContactClick={handleContactClick}
      />

      <main>
        {/* 02. Hero Banner */}
        <Hero
          dataVersion={dataVersion}
          onExploreServices={() => scrollToSection('services')}
          onViewApplications={() => scrollToSection('applications')}
          onDownloadClick={handleDownloadClick}
        />

        {/* Company Statistics (from SRS Page 5 Recommended Features) */}
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
        />

        {/* 06. Featured Product — Finance Flow (Desktop Billing, GST Invoices, 100% Offline) */}
        <FeaturedProduct
          dataVersion={dataVersion}
          onDownloadFinanceFlow={handleDownloadFinanceFlow}
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
        />

        {/* FAQ Section (from SRS Page 5 Recommended Features) */}
        <FAQSection
          dataVersion={dataVersion}
          onContactClick={handleContactClick}
        />

        {/* 11. Contact Us */}
        <ContactUs
          dataVersion={dataVersion}
          preselectedSubject={contactSubject}
        />
      </main>

      {/* 12. Footer */}
      <Footer
        dataVersion={dataVersion}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onSelectService={(srv) => setSelectedService(srv)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
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
