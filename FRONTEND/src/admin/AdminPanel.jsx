import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import InquiriesTab from './InquiriesTab';
import CustomizationTab from './CustomizationTab';
import ServicesTab from './ServicesTab';
import ProductsTab from './ProductsTab';
import FaqsTab from './FaqsTab';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AdminPanel({ onBackToSite, onLogout, onDataChanged }) {
  const [activeTab, setActiveTab] = useState('inquiries'); // Default to Inquiries (MAIN FOCUS)
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  
  // Data State
  const [inquiries, setInquiries] = useState([]);
  const [brand, setBrand] = useState(null);
  const [landingPage, setLandingPage] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // System State
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all data from backend
  const loadAllData = useCallback(async (isInitial = false) => {
    if (!isInitial) setIsRefreshing(true);

    try {
      // 1. Inquiries
      try {
        const inqRes = await api.getInquiries();
        if (inqRes && inqRes.data) setInquiries(inqRes.data);
      } catch (e) {
        console.warn('Inquiries load error:', e);
      }

      // 2. Brand
      try {
        const brandRes = await api.getBrand();
        if (brandRes && brandRes.data) setBrand(brandRes.data);
      } catch (e) {
        console.warn('Brand load error:', e);
      }

      // 2.5. Landing Page Sections & Visuals
      try {
        const landingRes = await api.getLandingPage();
        if (landingRes && landingRes.data) setLandingPage(landingRes.data);
      } catch (e) {
        console.warn('Landing page load error:', e);
      }

      // 3. Services
      try {
        const srvRes = await api.getServices();
        if (srvRes && srvRes.data) setServices(srvRes.data);
      } catch (e) {
        console.warn('Services load error:', e);
      }

      // 4. Products & Specs
      try {
        const prodRes = await api.getProducts();
        if (prodRes && prodRes.data) setProducts(prodRes.data);
      } catch (e) {
        console.warn('Products load error:', e);
      }

      // 5. FAQs
      try {
        const faqsRes = await api.getFaqs();
        if (faqsRes && faqsRes.data) setFaqs(faqsRes.data);
      } catch (e) {
        console.warn('FAQs load error:', e);
      }

      // 6. Health & MongoDB status
      try {
        const health = await api.checkHealth();
        if (health) setIsMongoConnected(!!health.mongoConnected);
      } catch (e) {}

      setIsBackendConnected(true);
    } catch (err) {
      console.error('Failed to load data from backend:', err);
      setIsBackendConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData(true);
  }, [loadAllData]);

  // Periodic polling every 5 seconds so incoming inquiries show up in real time!
  useEffect(() => {
    const interval = setInterval(() => {
      api.getInquiries()
        .then((res) => {
          if (res && res.data) {
            setInquiries(res.data);
            setIsBackendConnected(true);
          }
        })
        .catch(() => {
          setIsBackendConnected(false);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------
  // Inquiries Handlers (MAIN FOCUS)
  // ----------------------------------------------------
  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await api.updateInquiry(id, { status });
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
      showToast(`Inquiry marked as ${status.replace('_', ' ')}`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    try {
      await api.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      showToast('Inquiry deleted successfully');
    } catch (err) {
      showToast('Failed to delete inquiry', 'error');
    }
  };

  // ----------------------------------------------------
  // Brand Handlers
  // ----------------------------------------------------
  const handleSaveBrand = async (brandData) => {
    setIsSaving(true);
    try {
      const res = await api.updateBrand(brandData);
      setBrand(res.data);
      if (onDataChanged) onDataChanged();
      showToast('Brand details and contact settings saved!');
    } catch (err) {
      showToast('Failed to save brand settings: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLandingPage = async (pageData) => {
    setIsSaving(true);
    try {
      const res = await api.updateLandingPage(pageData);
      setLandingPage(res.data);
      if (onDataChanged) onDataChanged();
      showToast('Landing page sections and image links updated successfully!');
    } catch (err) {
      showToast('Failed to save landing page: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      await api.resetDefaults();
      await loadAllData();
      if (onDataChanged) onDataChanged();
      showToast('Database reset to original default template.');
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // Services Handlers
  // ----------------------------------------------------
  const handleAddService = async (serviceData) => {
    try {
      const res = await api.createService(serviceData);
      setServices((prev) => [...prev, res.data]);
      if (onDataChanged) onDataChanged();
      showToast('New service added successfully!');
    } catch (err) {
      showToast('Failed to add service: ' + err.message, 'error');
    }
  };

  const handleUpdateService = async (id, serviceData) => {
    try {
      const res = await api.updateService(id, serviceData);
      setServices((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      if (onDataChanged) onDataChanged();
      showToast('Service updated successfully!');
    } catch (err) {
      showToast('Failed to update service: ' + err.message, 'error');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (onDataChanged) onDataChanged();
      showToast('Service deleted successfully!');
    } catch (err) {
      showToast('Failed to delete service: ' + err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // Products & Specs Handlers
  // ----------------------------------------------------
  const handleAddProduct = async (productData) => {
    try {
      const res = await api.createProduct(productData);
      setProducts((prev) => [...prev, res.data]);
      if (onDataChanged) onDataChanged();
      showToast('New application added successfully!');
    } catch (err) {
      showToast('Failed to add application: ' + err.message, 'error');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const res = await api.updateProduct(id, productData);
      setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      if (onDataChanged) onDataChanged();
      showToast('Application & specs updated successfully!');
    } catch (err) {
      showToast('Failed to update application: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (onDataChanged) onDataChanged();
      showToast('Application deleted successfully!');
    } catch (err) {
      showToast('Failed to delete application: ' + err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // FAQs Handlers
  // ----------------------------------------------------
  const handleAddFaq = async (faqData) => {
    try {
      const res = await api.createFaq(faqData);
      setFaqs((prev) => [...prev, res.data]);
      if (onDataChanged) onDataChanged();
      showToast('New FAQ added successfully!');
    } catch (err) {
      showToast('Failed to add FAQ: ' + err.message, 'error');
    }
  };

  const handleUpdateFaq = async (id, faqData) => {
    try {
      const res = await api.updateFaq(id, faqData);
      setFaqs((prev) => prev.map((f, idx) => (f.id === id || idx === id ? res.data : f)));
      if (onDataChanged) onDataChanged();
      showToast('FAQ updated successfully!');
    } catch (err) {
      showToast('Failed to update FAQ: ' + err.message, 'error');
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await api.deleteFaq(id);
      setFaqs((prev) => prev.filter((f, idx) => f.id !== id && idx !== id));
      if (onDataChanged) onDataChanged();
      showToast('FAQ deleted successfully!');
    } catch (err) {
      showToast('Failed to delete FAQ: ' + err.message, 'error');
    }
  };

  const unreadCount = inquiries.filter((i) => (i.status || 'new') === 'new').length;

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--c1)] selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border ${
            toast.type === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-[var(--dark)] text-[var(--bg)] border-white/20'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[var(--c3)] shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Responsive Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBackToSite={onBackToSite}
        onLogout={onLogout}
        inquiriesCount={inquiries.length}
        unreadCount={unreadCount}
        servicesCount={services.length}
        productsCount={products.length}
        faqsCount={faqs.length}
        isBackendConnected={isBackendConnected}
        isMongoConnected={isMongoConnected}
        onRefresh={() => loadAllData()}
        isRefreshing={isRefreshing}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Navbar */}
        <AdminTopBar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          unreadCount={unreadCount}
          onBackToSite={onBackToSite}
          onLogout={onLogout}
          onRefresh={() => loadAllData()}
          isRefreshing={isRefreshing}
        />

        {/* Tab Content Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full min-w-0 mx-auto space-y-5">
          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              onUpdateStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
              onRefresh={() => loadAllData()}
              isRefreshing={isRefreshing}
            />
          )}

          {activeTab === 'customization' && (
            <CustomizationTab
              brand={brand}
              landingPage={landingPage}
              onSaveBrand={handleSaveBrand}
              onSaveLandingPage={handleSaveLandingPage}
              onResetDefaults={handleResetDefaults}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab
              services={services}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'faqs' && (
            <FaqsTab
              faqs={faqs}
              onAddFaq={handleAddFaq}
              onUpdateFaq={handleUpdateFaq}
              onDeleteFaq={handleDeleteFaq}
            />
          )}
        </main>

      </div>

    </div>
  );
}
