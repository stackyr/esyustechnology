import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle2, X, RefreshCw, Database } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import InquiriesTab from './InquiriesTab';
import CustomizationTab from './CustomizationTab';
import ServicesTab from './ServicesTab';
import ProductsTab from './ProductsTab';
import FaqsTab from './FaqsTab';
import AdminSecurityModal from './AdminSecurityModal';
import api from '../utils/api';
import liveSync from '../utils/liveSync';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Panel tab rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
          <div className="flex items-center gap-2 font-bold text-base text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>Tab Rendering Notice</span>
          </div>
          <p className="text-xs text-red-700 leading-relaxed font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred in this view.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Retry Tab
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AdminPanel({ onBackToSite, onLogout, onDataChanged }) {
  // Parse initial tab from URL hash (e.g. #admin/services) or localStorage
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const match = hash.match(/#admin[/?]([a-z0-9_-]+)/i);
      if (match && match[1]) {
        const tab = match[1].toLowerCase();
        if (['inquiries', 'customization', 'services', 'products', 'faqs'].includes(tab)) {
          return tab;
        }
      }
      const saved = localStorage.getItem('esyus_admin_active_tab');
      if (saved && ['inquiries', 'customization', 'services', 'products', 'faqs'].includes(saved)) {
        return saved;
      }
    }
    return 'inquiries';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  
  // Data State
  const [inquiries, setInquiries] = useState([]);
  const [brand, setBrand] = useState(null);
  const [landingPage, setLandingPage] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // System & Loading State
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshingSection, setRefreshingSection] = useState(null); // 'services' | 'products' | 'faqs' | 'inquiries' | 'customization' | null
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    status: 'loading', // 'loading' | 'error'
    title: '',
    subtitle: '',
    onRetry: null
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Persistent Tab Switcher: updates state, localStorage, and URL hash
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('esyus_admin_active_tab', tab);
      window.location.hash = `#admin/${tab}`;
    }
  };

  // Sync tab if user navigates with browser forward/backward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const match = hash.match(/#admin[/?]([a-z0-9_-]+)/i);
      if (match && match[1]) {
        const tab = match[1].toLowerCase();
        if (['inquiries', 'customization', 'services', 'products', 'faqs'].includes(tab)) {
          setActiveTabState(tab);
          localStorage.setItem('esyus_admin_active_tab', tab);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch all data from backend
  const loadAllData = useCallback(async (isInitial = false, isSilent = false) => {
    if (!isInitial && !isSilent) setIsRefreshing(true);

    try {
      const [inqRes, brandRes, landingRes, srvRes, prodRes, faqRes, healthRes] = await Promise.allSettled([
        api.getInquiries(),
        api.getBrand(),
        api.getLandingPage(),
        api.getServices(),
        api.getProducts(),
        api.getFaqs(),
        api.checkHealth()
      ]);

      if (inqRes.status === 'fulfilled' && inqRes.value?.data) {
        setInquiries(inqRes.value.data);
      }
      if (brandRes.status === 'fulfilled' && brandRes.value?.data) {
        setBrand(brandRes.value.data);
      }
      if (landingRes.status === 'fulfilled' && landingRes.value?.data) {
        setLandingPage(landingRes.value.data);
      }
      if (srvRes.status === 'fulfilled' && Array.isArray(srvRes.value?.data)) {
        setServices(srvRes.value.data);
      }
      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value?.data)) {
        setProducts(prodRes.value.data);
      }
      if (faqRes.status === 'fulfilled' && Array.isArray(faqRes.value?.data)) {
        setFaqs(faqRes.value.data);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setIsMongoConnected(!!healthRes.value.mongoConnected);
      }

      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend sync warning:', err.message);
      setIsBackendConnected(false);
    } finally {
      if (!isSilent) setIsRefreshing(false);
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData(true);
  }, [loadAllData]);

  // Real-time live synchronization via WebSockets & Cross-Tab Broadcast
  useEffect(() => {
    liveSync.initSocket();
    const unsub = liveSync.subscribe(({ event, payload }) => {
      if (event === 'inquiry_received') {
        setInquiries((prev) => [payload, ...prev.filter(i => i.id !== payload.id)]);
        showToast(`🔔 New inquiry received from ${payload.name || 'Visitor'}!`);
      } else if (event === 'inquiries_updated') {
        if (payload?.deleted) {
          setInquiries((prev) => prev.filter(i => i.id !== payload.id));
        } else if (payload?.id) {
          setInquiries((prev) => prev.map(i => i.id === payload.id ? { ...i, ...payload } : i));
        }
      } else if (event === 'services_updated') {
        if (Array.isArray(payload)) setServices(payload);
      } else if (event === 'products_updated') {
        if (Array.isArray(payload)) setProducts(payload);
      } else if (event === 'brand_updated') {
        if (payload) setBrand(payload);
      } else if (event === 'landing_page_updated') {
        if (payload) setLandingPage(payload);
      } else if (event === 'faqs_updated') {
        if (Array.isArray(payload)) setFaqs(payload);
      }
    });

    return () => unsub();
  }, []);

  // Real-time updates delivered via WebSockets

  // ----------------------------------------------------
  // Inquiries Handlers
  // ----------------------------------------------------
  const handleUpdateInquiryStatus = async (id, status) => {
    setRefreshingSection('inquiries');
    try {
      await api.updateInquiry(id, { status });
      const inqRes = await api.getInquiries();
      if (inqRes && inqRes.data) setInquiries(inqRes.data);
      showToast(`Inquiry marked as ${status.replace('_', ' ')}`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 300);
    }
  };

  const handleDeleteInquiry = async (id) => {
    setRefreshingSection('inquiries');
    try {
      await api.deleteInquiry(id);
      const inqRes = await api.getInquiries();
      if (inqRes && inqRes.data) setInquiries(inqRes.data);
      showToast('Inquiry deleted successfully');
    } catch (err) {
      showToast('Failed to delete inquiry', 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 300);
    }
  };

  // ----------------------------------------------------
  // Brand & Landing Page Handlers
  // ----------------------------------------------------
  const handleSaveBrand = async (brandData) => {
    setIsSaving(true);
    try {
      const res = await api.updateBrand(brandData);
      if (res && res.data) {
        setBrand(res.data);
        liveSync.emitAdminChange('brand_updated', res.data);
        if (onDataChanged) onDataChanged();
      }
      showToast('Brand details and contact settings saved!');
      return res?.data;
    } catch (err) {
      showToast('Failed to save brand settings: ' + err.message, 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLandingPage = async (pageData) => {
    setIsSaving(true);
    try {
      const res = await api.updateLandingPage(pageData);
      if (res && res.data) {
        setLandingPage(res.data);
        liveSync.emitAdminChange('landing_page_updated', res.data);
        if (onDataChanged) onDataChanged();
      }
      showToast('Landing page sections and image links updated successfully!');
      return res?.data;
    } catch (err) {
      showToast('Failed to save landing page: ' + err.message, 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setRefreshingSection('customization');
    try {
      // Reload fresh data directly from MongoDB Atlas to discard unsaved edits and restore latest saved version
      await loadAllData(false, true);
      if (onDataChanged) onDataChanged();
      showToast('Restored latest saved version from MongoDB Atlas');
    } catch (err) {
      showToast('Failed to reset: ' + err.message, 'error');
    } finally {
      setRefreshingSection(null);
    }
  };

  // ----------------------------------------------------
  // Services Handlers (With animated action overlay & error retry)
  // ----------------------------------------------------
  const handleAddService = async (serviceData) => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Adding New Service...',
      subtitle: 'Saving service details to MongoDB Atlas & broadcasting live...',
      onRetry: null
    });
    setRefreshingSection('services');
    try {
      await api.createService(serviceData);
      const srvRes = await api.getServices();
      if (srvRes && srvRes.data) {
        setServices(srvRes.data);
        liveSync.emitAdminChange('services_updated', srvRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('New service added successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Add Service',
        subtitle: err.message || 'Could not save service to database. Please check your connection and retry.',
        onRetry: () => handleAddService(serviceData)
      });
      showToast('Failed to add service: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  const handleUpdateService = async (id, serviceData) => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Updating Service Changes...',
      subtitle: 'Saving modifications to MongoDB Atlas & broadcasting live...',
      onRetry: null
    });
    setRefreshingSection('services');
    try {
      const res = await api.updateService(id, serviceData);
      if (res && res.data) {
        setServices((prev) => prev.map((s) => (s.id === id || s._id === id || String(s._id) === String(id) ? { ...s, ...res.data } : s)));
      }
      const srvRes = await api.getServices();
      if (srvRes && srvRes.data) {
        setServices(srvRes.data);
        liveSync.emitAdminChange('services_updated', srvRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('Service updated successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Update Service',
        subtitle: err.message || 'Could not update service in database. Please retry.',
        onRetry: () => handleUpdateService(id, serviceData)
      });
      showToast('Failed to update service: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  const handleDeleteService = async (id, serviceTitle = 'Service') => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Deleting Service...',
      subtitle: `Removing "${serviceTitle}" from MongoDB Atlas & synchronizing...`,
      onRetry: null
    });
    setRefreshingSection('services');
    try {
      await api.deleteService(id);
      // ONLY remove from local state AFTER successful backend confirmation!
      setServices((prev) => prev.filter((s) => s.id !== id && s._id !== id && String(s._id) !== String(id)));
      const srvRes = await api.getServices();
      if (srvRes && srvRes.data) {
        setServices(srvRes.data);
        liveSync.emitAdminChange('services_updated', srvRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('Service deleted successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      // Keep item in state! Never delete locally if backend fails!
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Delete Service',
        subtitle: err.message || 'Could not delete service from database. Item has been preserved.',
        onRetry: () => handleDeleteService(id, serviceTitle)
      });
      showToast('Failed to delete service: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  // ----------------------------------------------------
  // Products & Specs Handlers (With animated action overlay & error retry)
  // ----------------------------------------------------
  const handleAddProduct = async (productData) => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Adding New Application...',
      subtitle: 'Saving application specs to MongoDB Atlas & broadcasting live...',
      onRetry: null
    });
    setRefreshingSection('products');
    try {
      await api.createProduct(productData);
      const prodRes = await api.getProducts();
      if (prodRes && prodRes.data) {
        setProducts(prodRes.data);
        liveSync.emitAdminChange('products_updated', prodRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('New application added successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Add Application',
        subtitle: err.message || 'Could not save application to database. Please retry.',
        onRetry: () => handleAddProduct(productData)
      });
      showToast('Failed to add application: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Updating Application Specs...',
      subtitle: 'Saving specification changes to MongoDB Atlas & broadcasting live...',
      onRetry: null
    });
    setRefreshingSection('products');
    try {
      const res = await api.updateProduct(id, productData);
      if (res && res.data) {
        setProducts((prev) => prev.map((p) => (p.id === id || p._id === id || String(p._id) === String(id) ? { ...p, ...res.data } : p)));
      }
      const prodRes = await api.getProducts();
      if (prodRes && prodRes.data) {
        setProducts(prodRes.data);
        liveSync.emitAdminChange('products_updated', prodRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('Application & specs updated successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Update Application',
        subtitle: err.message || 'Could not update application in database. Please retry.',
        onRetry: () => handleUpdateProduct(id, productData)
      });
      showToast('Failed to update application: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  const handleDeleteProduct = async (id, productTitle = 'Application') => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Deleting Application...',
      subtitle: `Removing "${productTitle}" from MongoDB Atlas & synchronizing...`,
      onRetry: null
    });
    setRefreshingSection('products');
    try {
      await api.deleteProduct(id);
      // ONLY remove from local state AFTER successful backend confirmation!
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id && String(p._id) !== String(id)));
      const prodRes = await api.getProducts();
      if (prodRes && prodRes.data) {
        setProducts(prodRes.data);
        liveSync.emitAdminChange('products_updated', prodRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('Application deleted successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      // Keep item in state! Never delete locally if backend fails!
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Delete Application',
        subtitle: err.message || 'Could not delete application from database. Item has been preserved.',
        onRetry: () => handleDeleteProduct(id, productTitle)
      });
      showToast('Failed to delete application: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  // ----------------------------------------------------
  // FAQs Handlers (With animated action overlay & error retry)
  // ----------------------------------------------------
  const handleAddFaq = async (faqData) => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Adding New FAQ...',
      subtitle: 'Saving question & answer to MongoDB Atlas & broadcasting live...',
      onRetry: null
    });
    setRefreshingSection('faqs');
    try {
      await api.createFaq(faqData);
      const faqsRes = await api.getFaqs();
      if (faqsRes && faqsRes.data) {
        setFaqs(faqsRes.data);
        liveSync.emitAdminChange('faqs_updated', faqsRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('New FAQ added successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Add FAQ',
        subtitle: err.message || 'Could not save FAQ to database. Please retry.',
        onRetry: () => handleAddFaq(faqData)
      });
      showToast('Failed to add FAQ: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  const handleUpdateFaq = async (id, faqData) => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Updating FAQ...',
      subtitle: 'Saving FAQ changes to MongoDB Atlas & broadcasting live...',
      onRetry: null
    });
    setRefreshingSection('faqs');
    try {
      const res = await api.updateFaq(id, faqData);
      if (res && res.data) {
        setFaqs((prev) => prev.map((f, idx) => (f.id === id || f._id === id || String(f._id) === String(id) || idx === id ? { ...f, ...res.data } : f)));
      }
      const faqsRes = await api.getFaqs();
      if (faqsRes && faqsRes.data) {
        setFaqs(faqsRes.data);
        liveSync.emitAdminChange('faqs_updated', faqsRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('FAQ updated successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Update FAQ',
        subtitle: err.message || 'Could not update FAQ in database. Please retry.',
        onRetry: () => handleUpdateFaq(id, faqData)
      });
      showToast('Failed to update FAQ: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
    }
  };

  const handleDeleteFaq = async (id, faqQuestion = 'FAQ') => {
    setActionModal({
      isOpen: true,
      status: 'loading',
      title: 'Deleting FAQ...',
      subtitle: `Removing FAQ from MongoDB Atlas & synchronizing...`,
      onRetry: null
    });
    setRefreshingSection('faqs');
    try {
      await api.deleteFaq(id);
      // ONLY remove from local state AFTER successful backend confirmation!
      setFaqs((prev) => prev.filter((f, idx) => f.id !== id && f._id !== id && String(f._id) !== String(id) && idx !== id));
      const faqsRes = await api.getFaqs();
      if (faqsRes && faqsRes.data) {
        setFaqs(faqsRes.data);
        liveSync.emitAdminChange('faqs_updated', faqsRes.data);
      }
      if (onDataChanged) onDataChanged();
      showToast('FAQ deleted successfully!');
      setTimeout(() => setActionModal(prev => ({ ...prev, isOpen: false })), 350);
    } catch (err) {
      // Keep item in state! Never delete locally if backend fails!
      setActionModal({
        isOpen: true,
        status: 'error',
        title: 'Failed to Delete FAQ',
        subtitle: err.message || 'Could not delete FAQ from database. Item has been preserved.',
        onRetry: () => handleDeleteFaq(id, faqQuestion)
      });
      showToast('Failed to delete FAQ: ' + err.message, 'error');
    } finally {
      setTimeout(() => setRefreshingSection(null), 350);
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

      {/* 1. Responsive Sidebar Navigation with Loading Skeleton Prevention */}
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
        onOpenSecurity={() => setIsSecurityOpen(true)}
        isInitialLoading={isInitialLoading}
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
          onOpenSecurity={() => setIsSecurityOpen(true)}
        />

        {/* Tab Content Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full min-w-0 mx-auto space-y-5">


              <AdminErrorBoundary key={activeTab}>
                {activeTab === 'inquiries' && (
                  <InquiriesTab
                    inquiries={inquiries}
                    onUpdateStatus={handleUpdateInquiryStatus}
                    onDeleteInquiry={handleDeleteInquiry}
                    onRefresh={() => loadAllData()}
                    isRefreshing={isRefreshing || refreshingSection === 'inquiries'}
                    isInitialLoading={isInitialLoading}
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
                    onRefresh={() => loadAllData()}
                    isRefreshing={isRefreshing || refreshingSection === 'customization'}
                    isInitialLoading={isInitialLoading}
                  />
                )}

                {activeTab === 'services' && (
                  <ServicesTab
                    services={services}
                    onAddService={handleAddService}
                    onUpdateService={handleUpdateService}
                    onDeleteService={handleDeleteService}
                    onRefresh={() => loadAllData()}
                    isRefreshing={isRefreshing || refreshingSection === 'services'}
                    isInitialLoading={isInitialLoading}
                  />
                )}

                {activeTab === 'products' && (
                  <ProductsTab
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onRefresh={() => loadAllData()}
                    isRefreshing={isRefreshing || refreshingSection === 'products'}
                    isInitialLoading={isInitialLoading}
                  />
                )}

                {activeTab === 'faqs' && (
                  <FaqsTab
                    faqs={faqs}
                    onAddFaq={handleAddFaq}
                    onUpdateFaq={handleUpdateFaq}
                    onDeleteFaq={handleDeleteFaq}
                    onRefresh={() => loadAllData()}
                    isRefreshing={isRefreshing || refreshingSection === 'faqs'}
                    isInitialLoading={isInitialLoading}
                  />
                )}
              </AdminErrorBoundary>
        </main>

      </div>

      {/* Admin Security & Password Change Modal */}
      <AdminSecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        onCredentialsUpdated={(updated) => {
          showToast(`Admin credentials successfully updated (${updated?.username || 'admin'})!`, 'success');
        }}
      />

      {/* Universal Action Modal Overlay with Retry */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[99999] bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/90 flex flex-col items-center gap-4 max-w-sm w-full text-center">
            {actionModal.status === 'loading' ? (
              <>
                <div className="relative flex items-center justify-center w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-stone-200/70" />
                  <div className="absolute inset-0 rounded-full border-4 border-[var(--c1)] border-t-transparent animate-spin" />
                </div>
                <div className="space-y-1.5 mt-1">
                  <h4 className="text-base sm:text-lg font-bold text-[var(--ink)] tracking-tight">
                    {actionModal.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] font-mono leading-relaxed">
                    {actionModal.subtitle}
                  </p>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-1">
                  <div className="h-full bg-[var(--c1)] rounded-full animate-pulse w-full" />
                </div>
              </>
            ) : actionModal.status === 'error' ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-600 shadow-xs">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-bold text-red-950 tracking-tight">
                    {actionModal.title}
                  </h4>
                  <p className="text-xs text-red-700/90 leading-relaxed font-mono px-1">
                    {actionModal.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 w-full mt-2">
                  {actionModal.onRetry && (
                    <button
                      type="button"
                      onClick={() => {
                        const retryFn = actionModal.onRetry;
                        if (retryFn) retryFn();
                      }}
                      className="flex-1 px-4 py-2.5 bg-[var(--c1)] hover:bg-[var(--c2)] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Now</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActionModal({ isOpen: false, status: 'loading', title: '', subtitle: '', onRetry: null })}
                    className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
}
