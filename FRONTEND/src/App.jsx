import React, { useState, useEffect } from 'react';
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

import { PRODUCTS } from './data/companyData';
import { initHearthlyAnimations } from './utils/hearthlyAnimations';

export default function App() {
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [downloadingProduct, setDownloadingProduct] = useState(null);
  const [legalModalType, setLegalModalType] = useState(null); // 'privacy' | 'terms' | null

  // Preselected subject in Contact Us form
  const [contactSubject, setContactSubject] = useState('Finance Flow Desktop Billing');

  // Initialize Hearthly GSAP & Lenis smooth scroll engine
  useEffect(() => {
    let cleanup = null;
    const timeout = setTimeout(() => {
      cleanup = initHearthlyAnimations();
    }, 150);

    return () => {
      clearTimeout(timeout);
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

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

  return (
    <div className="min-h-screen selection:bg-[var(--c1)] selection:text-white">
      {/* SVG Sprite Definitions for Code Art & Symbols */}
      <SvgSprite />
      
      {/* 01. Navbar / Header */}
      <Navbar
        onDownloadClick={handleDownloadClick}
        onContactClick={handleContactClick}
      />

      <main>
        {/* 02. Hero Banner */}
        <Hero
          onExploreServices={() => scrollToSection('services')}
          onViewApplications={() => scrollToSection('applications')}
          onDownloadClick={handleDownloadClick}
        />

        {/* Company Statistics (from SRS Page 5 Recommended Features) */}
        <CompanyStats />

        {/* 03. About Us / Company Introduction */}
        <AboutUs
          onContactClick={handleContactClick}
        />

        {/* 04. Our Services */}
        <Services
          onSelectService={(service) => setSelectedService(service)}
          onEnquireService={handleEnquireService}
        />

        {/* 05. Our Applications / Products */}
        <Products
          onSelectProduct={(product) => setSelectedProduct(product)}
          onDownloadProduct={handleDownloadAppDirectly}
        />

        {/* 06. Featured Product — Finance Flow (Desktop Billing, GST Invoices, 100% Offline) */}
        <FeaturedProduct
          onDownloadFinanceFlow={handleDownloadFinanceFlow}
        />

        {/* 07. Why Choose Us */}
        <WhyChooseUs
          onContactClick={handleContactClick}
        />

        {/* 08. Our Team (Founder Milan Mandal & Co-founder Suman Raptan) */}
        <Team
          onContactClick={handleContactClick}
        />

        {/* 09. Customer Reviews / Testimonials */}
        <Reviews
          onAddFeedbackClick={handleContactClick}
        />

        {/* 10. Download Our Applications */}
        <DownloadSection
          onDownloadApp={handleDownloadAppDirectly}
        />

        {/* FAQ Section (from SRS Page 5 Recommended Features) */}
        <FAQSection
          onContactClick={handleContactClick}
        />

        {/* 11. Contact Us */}
        <ContactUs
          preselectedSubject={contactSubject}
        />
      </main>

      {/* 12. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onSelectService={(srv) => setSelectedService(srv)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
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

    </div>
  );
}
