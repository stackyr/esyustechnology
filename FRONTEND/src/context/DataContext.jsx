import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import liveSync from '../utils/liveSync';
import { COMPANY_INFO, LANDING_PAGE_SECTIONS, SERVICES, PRODUCTS, FAQS, applyDynamicData } from '../data/companyData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Live State: initial state copies the companyData defaults, but is immediately superseded by MongoDB Atlas data
  const [brand, setBrand] = useState(() => ({ ...COMPANY_INFO }));
  const [landingPage, setLandingPage] = useState(() => ({ ...LANDING_PAGE_SECTIONS }));
  const [services, setServices] = useState(() => [...SERVICES]);
  const [products, setProducts] = useState(() => [...PRODUCTS]);
  const [faqs, setFaqs] = useState(() => [...FAQS]);

  // Connection & Gate States
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('connecting'); // 'connecting' | 'socket' | 'fetching' | 'ready' | 'error'
  const [loadingStatusText, setLoadingStatusText] = useState('Loading experience...');
  const [connectionError, setConnectionError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);

  // Synchronize memory cache and trigger smooth ScrollTrigger refresh
  const syncToMemory = useCallback((freshData) => {
    applyDynamicData(freshData);
    setDataVersion((v) => v + 1);
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 150);
  }, []);

  // Fetch all collections directly from MongoDB Atlas
  const loadAllFromDatabase = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
      setConnectionError(null);
      setLoadingStage('connecting');
      setLoadingStatusText('Connecting to network...');
    }

    try {
      // 1. Health check verification
      setLoadingStage('fetching');
      setLoadingStatusText('Loading business solutions...');

      const [brandRes, srvRes, prodRes, faqRes, landingRes, healthRes] = await Promise.allSettled([
        api.getBrand(),
        api.getServices(),
        api.getProducts(),
        api.getFaqs(),
        api.getLandingPage(),
        api.checkHealth()
      ]);

      const health = healthRes.status === 'fulfilled' ? healthRes.value : null;
      const mongoOnline = Boolean(health?.mongoConnected);

      const freshBrand = brandRes.status === 'fulfilled' ? brandRes.value?.data : null;
      const freshServices = srvRes.status === 'fulfilled' ? srvRes.value?.data : null;
      const freshProducts = prodRes.status === 'fulfilled' ? prodRes.value?.data : null;
      const freshFaqs = faqRes.status === 'fulfilled' ? faqRes.value?.data : null;
      const freshLanding = landingRes.status === 'fulfilled' ? landingRes.value?.data : null;

      // Ensure MongoDB returned valid arrays
      if (Array.isArray(freshServices)) {
        setServices(freshServices);
      }
      if (Array.isArray(freshProducts)) {
        setProducts(freshProducts);
      }
      if (Array.isArray(freshFaqs)) {
        setFaqs(freshFaqs);
      }
      if (freshBrand && typeof freshBrand === 'object') {
        setBrand(freshBrand);
      }
      if (freshLanding && typeof freshLanding === 'object') {
        setLandingPage(freshLanding);
      }

      // Update memory cache
      syncToMemory({
        brand: freshBrand,
        services: freshServices,
        products: freshProducts,
        faqs: freshFaqs,
        landingPage: freshLanding
      });

      const isSuccessful = Boolean(freshBrand || freshServices || freshProducts);
      if (isSuccessful) {
        setIsDatabaseConnected(true);
        setConnectionError(null);
        setLoadingStage('ready');
        setLoadingStatusText('Ready');
        if (isInitial) {
          // Leave a brief 300ms moment so user perceives verified connection, then dismiss loading gate
          setTimeout(() => {
            setIsLoading(false);
          }, 350);
        }
        return true;
      } else {
        throw new Error('Website is temporarily down. Please try again shortly.');
      }
    } catch (err) {
      console.warn('[DataContext] Service sync notice:', err.message);
      setIsDatabaseConnected(false);
      setConnectionError('Website is temporarily unavailable. Please try again shortly or contact our team.');
      setLoadingStage('error');
      setLoadingStatusText('Website temporarily unavailable');
      // Keep isLoading true so the loading screen stays closed and presents the user-friendly maintenance message
      return false;
    }
  }, [syncToMemory]);

  // Initial Load & Real-Time WebSocket Engine
  useEffect(() => {
    // 1. Establish Socket.io link
    liveSync.initSocket();

    // 2. Subscribe to real-time events across the entire website
    const unsubscribe = liveSync.subscribe(({ event, payload, source }) => {
      console.log(`[DataContext] Live event received: ${event} via ${source}`);

      if (event === 'connection_status') {
        setIsSocketConnected(Boolean(payload?.connected));
      } else if (event === 'services_updated') {
        if (Array.isArray(payload)) {
          const fresh = [...payload];
          setServices(fresh);
          syncToMemory({ services: fresh });
        }
      } else if (event === 'products_updated') {
        if (Array.isArray(payload)) {
          const fresh = [...payload];
          setProducts(fresh);
          syncToMemory({ products: fresh });
        }
      } else if (event === 'brand_updated') {
        if (payload && typeof payload === 'object') {
          const fresh = { ...payload };
          setBrand(fresh);
          syncToMemory({ brand: fresh });
        }
      } else if (event === 'landing_page_updated') {
        if (payload && typeof payload === 'object') {
          const fresh = { ...payload };
          setLandingPage(fresh);
          syncToMemory({ landingPage: fresh });
        }
      } else if (event === 'faqs_updated') {
        if (Array.isArray(payload)) {
          const fresh = [...payload];
          setFaqs(fresh);
          syncToMemory({ faqs: fresh });
        }
      } else if (event === 'sync_all') {
        if (payload) {
          if (Array.isArray(payload.services)) setServices([...payload.services]);
          if (Array.isArray(payload.products)) setProducts([...payload.products]);
          if (Array.isArray(payload.faqs)) setFaqs([...payload.faqs]);
          if (payload.brand) setBrand({ ...payload.brand });
          if (payload.landingPage) setLandingPage({ ...payload.landingPage });
          syncToMemory(payload);
        }
      }
    });

    // 3. Perform verified initial load from MongoDB Atlas
    loadAllFromDatabase(true);

    // 4. Continuous periodic background auto-refresh (every 8s) so new services, apps, and copy appear automatically
    const pollInterval = setInterval(() => {
      loadAllFromDatabase(false);
    }, 8000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [loadAllFromDatabase, syncToMemory]);

  const reloadAll = useCallback(() => loadAllFromDatabase(false), [loadAllFromDatabase]);

  const value = {
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
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;

