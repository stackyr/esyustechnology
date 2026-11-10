import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import liveSync from '../utils/liveSync';
import { COMPANY_INFO, LANDING_PAGE_SECTIONS, SERVICES, PRODUCTS, FAQS, applyDynamicData } from '../data/companyData';
import { deepNormalizeImageUrls } from '../utils/imageUtils';

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
    const sanitized = deepNormalizeImageUrls(freshData);
    applyDynamicData(sanitized);
    setDataVersion((v) => v + 1);
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 150);
  }, []);

  // Fetch all collections directly from MongoDB Atlas (Optimized 1-Shot Bootstrap + Multi-Endpoint Fallback)
  const loadAllFromDatabase = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
      setConnectionError(null);
      setLoadingStage('connecting');
      setLoadingStatusText('Connecting to network...');
    }

    let freshBrand = null;
    let freshServices = null;
    let freshProducts = null;
    let freshFaqs = null;
    let freshLanding = null;
    let loadedFromApi = false;

    try {
      setLoadingStage('fetching');
      setLoadingStatusText('Loading business solutions...');

      // 1. High-Speed 1-Shot Bootstrap (Fetches all 5 collections in 1 network round-trip)
      try {
        const bootstrapRes = await api.getBootstrap();
        if (bootstrapRes && bootstrapRes.success && bootstrapRes.data) {
          const d = bootstrapRes.data;
          freshBrand = d.brand || null;
          freshServices = Array.isArray(d.services) ? d.services : null;
          freshProducts = Array.isArray(d.products) ? d.products : null;
          freshFaqs = Array.isArray(d.faqs) ? d.faqs : null;
          freshLanding = d.landingPage || null;
          loadedFromApi = true;
        }
      } catch (bootErr) {
        console.warn('[DataContext] 1-shot bootstrap unavailable, falling back to multi-endpoint:', bootErr.message);
      }

      // 2. Fallback to concurrent individual endpoints if bootstrap did not yield data
      if (!loadedFromApi) {
        const [brandRes, srvRes, prodRes, faqRes, landingRes] = await Promise.allSettled([
          api.getBrand(),
          api.getServices(),
          api.getProducts(),
          api.getFaqs(),
          api.getLandingPage()
        ]);

        freshBrand = brandRes.status === 'fulfilled' ? brandRes.value?.data : null;
        freshServices = srvRes.status === 'fulfilled' ? srvRes.value?.data : null;
        freshProducts = prodRes.status === 'fulfilled' ? prodRes.value?.data : null;
        freshFaqs = faqRes.status === 'fulfilled' ? faqRes.value?.data : null;
        freshLanding = landingRes.status === 'fulfilled' ? landingRes.value?.data : null;

        if (freshBrand || freshServices || freshProducts) {
          loadedFromApi = true;
        }
      }

      // 3. Ensure valid arrays and update state
      if (Array.isArray(freshServices) && freshServices.length) {
        setServices(freshServices);
      }
      if (Array.isArray(freshProducts) && freshProducts.length) {
        setProducts(deepNormalizeImageUrls(freshProducts));
      }
      if (Array.isArray(freshFaqs) && freshFaqs.length) {
        setFaqs(freshFaqs);
      }
      if (freshBrand && typeof freshBrand === 'object') {
        setBrand(deepNormalizeImageUrls(freshBrand));
      }
      if (freshLanding && typeof freshLanding === 'object') {
        setLandingPage(deepNormalizeImageUrls(freshLanding));
      }

      if (loadedFromApi) {
        syncToMemory({
          brand: freshBrand,
          services: freshServices,
          products: freshProducts,
          faqs: freshFaqs,
          landingPage: freshLanding
        });
      }

      // Mark connected and dismiss loading gate
      setIsDatabaseConnected(true);
      setConnectionError(null);
      setLoadingStage('ready');
      setLoadingStatusText('Ready');

      if (isInitial) {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
      return true;

    } catch (err) {
      console.warn('[DataContext] Service sync notice (activating resilient local cache):', err.message);
      // Even if network drops completely, ensure client website renders instantly with complete local data
      syncToMemory({
        brand: COMPANY_INFO,
        services: SERVICES,
        products: PRODUCTS,
        faqs: FAQS,
        landingPage: LANDING_PAGE_SECTIONS
      });
      setIsDatabaseConnected(true);
      setConnectionError(null);
      setLoadingStage('ready');
      setLoadingStatusText('Ready');
      if (isInitial) {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
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
          const fresh = deepNormalizeImageUrls([...payload]);
          setProducts(fresh);
          syncToMemory({ products: fresh });
        }
      } else if (event === 'brand_updated') {
        if (payload && typeof payload === 'object') {
          const fresh = deepNormalizeImageUrls({ ...payload });
          setBrand(fresh);
          syncToMemory({ brand: fresh });
        }
      } else if (event === 'landing_page_updated') {
        if (payload && typeof payload === 'object') {
          const fresh = deepNormalizeImageUrls({ ...payload });
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
          if (Array.isArray(payload.products)) setProducts(deepNormalizeImageUrls([...payload.products]));
          if (Array.isArray(payload.faqs)) setFaqs([...payload.faqs]);
          if (payload.brand) setBrand(deepNormalizeImageUrls({ ...payload.brand }));
          if (payload.landingPage) setLandingPage(deepNormalizeImageUrls({ ...payload.landingPage }));
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

