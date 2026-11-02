/**
 * Esyus Real-Time Live Sync Engine
 * Powered by WebSockets (Socket.io) + Cross-Tab BroadcastChannel + SSE Fallback
 * 
 * Guarantees that any change made in the Admin Panel (customizations, copy,
 * brand details, services, applications/products, and FAQs) propagates INSTANTLY
 * to every connected browser tab and device without requiring a page refresh.
 */

import { io } from 'socket.io-client';
import { applyDynamicData } from '../data/companyData';

// Determine backend socket host URL
export function getSocketUrl() {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      return parsed.origin;
    } catch (e) {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Development localhost or local network IP
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
      return 'http://localhost:5000';
    }
    // Production on custom domain or Vercel
    if (host.includes('esyustechnology.com')) {
      return 'https://esyustechnology-eight.vercel.app';
    }
    return window.location.origin;
  }

  return 'http://localhost:5000';
}

class LiveSyncEngine {
  constructor() {
    this.socket = null;
    this.eventSource = null;
    this.broadcastChannel = null;
    this.subscribers = new Set();
    this.isConnected = false;
    this.lastSyncTime = 0;
    this.initBroadcastChannel();
  }

  // 1. Cross-Tab Browser Communication (0ms instant sync across local tabs)
  initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('esyus_live_broadcast');
        this.broadcastChannel.onmessage = (e) => {
          if (e.data && e.data.event) {
            this.handleIncomingUpdate(e.data.event, e.data.payload, 'broadcast-channel');
          }
        };
      } catch (err) {
        console.warn('[LiveSync] BroadcastChannel not supported:', err);
      }
    }
  }

  // 2. Initialize Real-Time WebSocket Connection
  initSocket() {
    if (this.socket) return;
    const socketUrl = getSocketUrl();
    console.log('[LiveSync] Connecting WebSocket to:', socketUrl);

    try {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log('[LiveSync] Connected to WebSocket server:', this.socket.id);
        this.isConnected = true;
        this.notifyStatus(true);
      });

      this.socket.on('disconnect', () => {
        console.log('[LiveSync] WebSocket disconnected. Attempting reconnect...');
        this.isConnected = false;
        this.notifyStatus(false);
      });

      this.socket.on('connect_error', (err) => {
        console.warn('[LiveSync] WebSocket connection error:', err.message);
        this.isConnected = false;
        this.notifyStatus(false);
        this.initSseFallback(socketUrl);
      });

      // Unified live updates channel
      this.socket.on('live_sync_update', (msg) => {
        if (msg && msg.event) {
          this.handleIncomingUpdate(msg.event, msg.payload, 'websocket');
        }
      });

      // Individual typed events
      this.socket.on('brand_updated', (data) => this.handleIncomingUpdate('brand_updated', data, 'websocket'));
      this.socket.on('landing_page_updated', (data) => this.handleIncomingUpdate('landing_page_updated', data, 'websocket'));
      this.socket.on('services_updated', (data) => this.handleIncomingUpdate('services_updated', data, 'websocket'));
      this.socket.on('products_updated', (data) => this.handleIncomingUpdate('products_updated', data, 'websocket'));
      this.socket.on('faqs_updated', (data) => this.handleIncomingUpdate('faqs_updated', data, 'websocket'));
      this.socket.on('inquiry_received', (data) => this.handleIncomingUpdate('inquiry_received', data, 'websocket'));
      this.socket.on('inquiries_updated', (data) => this.handleIncomingUpdate('inquiries_updated', data, 'websocket'));
      this.socket.on('sync_all', (data) => this.handleIncomingUpdate('sync_all', data, 'websocket'));

    } catch (err) {
      console.error('[LiveSync] Failed to initialize socket.io:', err);
      this.initSseFallback(socketUrl);
    }
  }

  // 3. Server-Sent Events Fallback (for environments where WebSockets are closed)
  initSseFallback(baseUrl) {
    if (this.eventSource || typeof window === 'undefined' || !('EventSource' in window)) return;
    try {
      const sseUrl = `${baseUrl.replace(/\/+$/, '')}/api/live-stream`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.event) {
            this.handleIncomingUpdate(parsed.event, parsed.payload, 'sse');
          }
        } catch (err) {}
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
      };
    } catch (e) {
      console.warn('[LiveSync] SSE fallback init error:', e);
    }
  }

  // 4. Handle incoming updates from any real-time source
  handleIncomingUpdate(event, payload, source = 'websocket') {
    this.lastSyncTime = Date.now();
    console.log(`[LiveSync] Received event: ${event} from ${source}`);

    // Update memory cache
    switch (event) {
      case 'brand_updated':
        applyDynamicData({ brand: payload });
        break;
      case 'landing_page_updated':
        applyDynamicData({ landingPage: payload });
        break;
      case 'services_updated':
        applyDynamicData({ services: payload });
        break;
      case 'products_updated':
        applyDynamicData({ products: payload });
        break;
      case 'faqs_updated':
        applyDynamicData({ faqs: payload });
        break;
      case 'sync_all':
        applyDynamicData(payload || {});
        break;
      default:
        break;
    }

    // Notify all active React components
    this.notifySubscribers(event, payload, source);
  }

  // 5. Broadcast a change made by the Admin to all other tabs and backend
  emitAdminChange(event, payload) {
    // 1. Immediately apply to local memory
    this.handleIncomingUpdate(event, payload, 'admin-local');

    // 2. Broadcast to other open tabs in the same browser
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          event,
          payload,
          timestamp: Date.now()
        });
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    // 3. Relay through WebSocket to all other connected browsers and devices
    if (this.socket && this.socket.connected) {
      this.socket.emit('admin_broadcast', {
        event,
        payload,
        timestamp: Date.now()
      });
    }
  }

  // 6. Subscription API for React components
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers(event, payload, source) {
    for (const callback of this.subscribers) {
      try {
        callback({ event, payload, source, timestamp: Date.now() });
      } catch (err) {
        console.error('[LiveSync] Subscriber error:', err);
      }
    }
  }

  notifyStatus(connected) {
    this.notifySubscribers('connection_status', { connected }, 'system');
  }

  requestFullSync() {
    if (this.socket && this.socket.connected) {
      this.socket.emit('request_sync');
    }
  }
}

// Global Singleton
export const liveSync = new LiveSyncEngine();
export default liveSync;
