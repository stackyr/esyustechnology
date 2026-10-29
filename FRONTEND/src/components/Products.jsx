import React, { useState } from 'react';
import { PRODUCTS } from '../data/companyData';

function ProductCard({
  product,
  image,
  alt,
  badgeText,
  platformText,
  captionTitle,
  captionCategory,
  tagline,
  shotType = 'shot--p',
  tabClass = '',
  downloadLabel,
  onSelect,
  onDownload
}) {
  return (
    <figure className={`shot ${shotType} group/card`}>
      <div
        className={`shot__img ${tabClass} cursor-pointer overflow-hidden relative group`}
        onClick={() => product && onSelect && onSelect(product)}
      >
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Floating Badge (smoothly slides up on hover so it never overlaps the action buttons) */}
        <div className="chip transition-all duration-300 group-hover:-translate-y-12">
          <span className="chip__ic">
            <svg viewBox="0 0 24 24"><use href="#s-spark" /></svg>
          </span>
          <span>
            <b>{badgeText}</b>
            <small>{platformText}</small>
          </span>
        </div>

        {/* Quick Action Overlay on Hover with High Z-Index so Specs & Download are never blocked */}
        {product && (
          <div className="absolute inset-x-0 bottom-0 z-30 p-3.5 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none group-hover:pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(product);
              }}
              className="relative z-30 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white text-[11px] font-semibold border border-white/30 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              Specs & Features
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onDownload) onDownload(product);
              }}
              className="relative z-30 px-3.5 py-1.5 rounded-full bg-[var(--c1)] hover:bg-[var(--c1)]/90 text-white text-[11px] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>Download</span>
              <span className="opacity-90 text-[10px] font-mono">({product.downloadFile.endsWith('.apk') ? 'APK' : (product.id === 'finance-flow-lite' ? 'EXE/APK' : 'EXE')})</span>
            </button>
          </div>
        )}
      </div>

      <figcaption className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[var(--ink)] text-sm">{captionTitle}</span>
          <span className="text-[11px] font-bold text-[var(--c1)] uppercase tracking-wider">{captionCategory}</span>
        </div>
        {tagline && (
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {tagline}
          </p>
        )}
        {product && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSelect && onSelect(product)}
              className="text-xs font-semibold text-[var(--ink)] hover:text-[var(--c1)] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explore Software</span>
              <span aria-hidden="true">→</span>
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => onDownload && onDownload(product)}
              className="text-xs font-semibold text-[var(--c1)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{downloadLabel || (product.downloadFile.endsWith('.apk') ? 'Download APK' : 'Download EXE')}</span>
              <span className="text-[10px] text-stone-400">({product.size})</span>
            </button>
          </div>
        )}
      </figcaption>
    </figure>
  );
}

export default function Products({ onSelectProduct, onDownloadProduct }) {
  const [filter, setFilter] = useState('all');

  return (
    <section id="applications" className="lookbook" data-kind="gallery" data-section="gallery">
      {/* Head */}
      <div className="wrap lookbook__head">
        <span className="eyebrow">Production Software Blueprint</span>
        <h2 className="lookbook__title">
          Inside our software <em className="s">ecosystem</em>
        </h2>
        <p className="lead">
          Four proprietary systems engineered for retail shops, distributors, travel consultancies, and enterprises requiring 100% offline resilience.
        </p>

        {/* Filter Pills */}
        <div className="toggle" role="group" aria-label="Filter software">
          <button
            className="toggle__btn"
            type="button"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All Software ({PRODUCTS.length})
          </button>
          <button
            className="toggle__btn"
            type="button"
            aria-pressed={filter === 'desktop'}
            onClick={() => setFilter('desktop')}
          >
            Windows Desktop (3)
          </button>
          <button
            className="toggle__btn"
            type="button"
            aria-pressed={filter === 'mobile'}
            onClick={() => setFilter('mobile')}
          >
            Android Mobile (2)
          </button>
        </div>

        {/* Active Filter Helper Subtitle */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--c1)] animate-pulse" />
          <span>
            {filter === 'all' && 'Showing all 4 production software systems (Windows & Android)'}
            {filter === 'desktop' && 'Showing 3 Windows Desktop, Billing & POS systems'}
            {filter === 'mobile' && 'Showing 2 Android Mobile applications & Handheld POS solutions'}
          </span>
        </div>
      </div>

      {/* Lookbook 3-Column Masonry Gallery with Dynamic Filtered View */}
      {filter === 'mobile' ? (
        <div key="mobile" className="wrap gallery animate-fadeIn" data-fixed="7">
          {/* Column A */}
          <div className="gallery__col gallery__col--a">
            <ProductCard
              product={PRODUCTS[3]} // Bharat Yatra Sathi
              image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900"
              alt="Bharat Yatra Sathi Indian Tourism Companion"
              badgeText="Bharat Yatra Sathi"
              platformText="Android 8.0+ APK · v1.1.0"
              captionTitle="Bharat Yatra Sathi"
              captionCategory="Android Mobile App"
              tagline={PRODUCTS[3].tagline}
              shotType="shot--p"
              tabClass="tab-l"
              downloadLabel="Download APK"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
          </div>

          {/* Column B */}
          <div className="gallery__col gallery__col--b">
            <ProductCard
              product={PRODUCTS[1]} // Finance Flow Lite
              image="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Lite on Android Tablet"
              badgeText="Finance Flow Lite (Android)"
              platformText="Android 8.0+ · Tablet POS"
              captionTitle="Finance Flow Lite (Android)"
              captionCategory="Handheld POS"
              tagline="Runs smoothly on entry-level Android POS devices, tablets, and phones with offline local SQLite storage."
              shotType="shot--t"
              tabClass=""
              downloadLabel="Download APK"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
          </div>

          {/* Column C */}
          <div className="gallery__col gallery__col--c">
            <ProductCard
              product={null}
              image="https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=900"
              alt="Mobile Bluetooth Receipt Printer"
              badgeText="Wireless Bluetooth Interop"
              platformText="Bluetooth 5.0 ESC/POS Ready"
              captionTitle="Mobile Hardware Drivers"
              captionCategory="Wireless Sync"
              tagline="Instant pairing with handheld Bluetooth thermal receipt printers (58mm/80mm) and wireless barcode scanners."
              shotType="shot--p"
              tabClass="tab-r"
              onSelect={null}
              onDownload={null}
            />
          </div>
        </div>
      ) : filter === 'desktop' ? (
        <div key="desktop" className="wrap gallery animate-fadeIn" data-fixed="7">
          {/* Column A */}
          <div className="gallery__col gallery__col--a">
            <ProductCard
              product={PRODUCTS[0]} // Finance Flow
              image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Desktop Billing Counter"
              badgeText="Finance Flow"
              platformText="Windows 10 / 11 · v2.4.0"
              captionTitle="Finance Flow Desktop Billing"
              captionCategory="100% Offline GST"
              tagline={PRODUCTS[0].tagline}
              shotType="shot--p"
              tabClass="tab-l"
              downloadLabel="Download EXE"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
            <ProductCard
              product={PRODUCTS[1]} // Finance Flow Lite
              image="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Lite on Desktop"
              badgeText="Finance Flow Lite"
              platformText="Windows Desktop · <100MB RAM"
              captionTitle="Finance Flow Lite"
              captionCategory="Compact POS"
              tagline={PRODUCTS[1].tagline}
              shotType="shot--l"
              tabClass=""
              downloadLabel="Download EXE"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
          </div>

          {/* Column B */}
          <div className="gallery__col gallery__col--b">
            <ProductCard
              product={PRODUCTS[2]} // Finance Flow Flash
              image="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Flash Supermarket POS"
              badgeText="Finance Flow Flash"
              platformText="Split-Second Barcode POS"
              captionTitle="Finance Flow Flash POS"
              captionCategory="Rapid Checkout"
              tagline={PRODUCTS[2].tagline}
              shotType="shot--t"
              tabClass=""
              downloadLabel="Download EXE"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
          </div>

          {/* Column C */}
          <div className="gallery__col gallery__col--c">
            <ProductCard
              product={null}
              image="https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=900"
              alt="Thermal Receipt Printer ESC/POS"
              badgeText="Thermal Drivers Included"
              platformText={'ESC/POS 2" & 3" Serial/USB'}
              captionTitle="Hardware Drivers Bundled"
              captionCategory="Universal Support"
              tagline="Integrated plug-and-play drivers for all standard 58mm/80mm USB & serial thermal receipt printers."
              shotType="shot--p"
              tabClass="tab-r"
              onSelect={null}
              onDownload={null}
            />
          </div>
        </div>
      ) : (
        <div key="all" className="wrap gallery animate-fadeIn" data-fixed="7">
          {/* Column A */}
          <div className="gallery__col gallery__col--a">
            <ProductCard
              product={PRODUCTS[0]}
              image="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Desktop Billing Counter"
              badgeText="Finance Flow"
              platformText="Windows 10 / 11 · v2.4.0"
              captionTitle="Finance Flow Desktop Billing"
              captionCategory="100% Offline GST"
              tagline={PRODUCTS[0].tagline}
              shotType="shot--p"
              tabClass="tab-l"
              downloadLabel="Download EXE"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
            <ProductCard
              product={PRODUCTS[1]}
              image="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Lite on Tablet"
              badgeText="Finance Flow Lite"
              platformText="Windows & Android · <100MB RAM"
              captionTitle="Finance Flow Lite"
              captionCategory="Compact POS"
              tagline={PRODUCTS[1].tagline}
              shotType="shot--l"
              tabClass=""
              downloadLabel="Download EXE / APK"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
          </div>

          {/* Column B */}
          <div className="gallery__col gallery__col--b">
            <ProductCard
              product={PRODUCTS[2]}
              image="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=900"
              alt="Finance Flow Flash Supermarket POS"
              badgeText="Finance Flow Flash"
              platformText="Split-Second Barcode POS"
              captionTitle="Finance Flow Flash POS"
              captionCategory="Rapid Checkout"
              tagline={PRODUCTS[2].tagline}
              shotType="shot--t"
              tabClass=""
              downloadLabel="Download EXE"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
          </div>

          {/* Column C */}
          <div className="gallery__col gallery__col--c">
            <ProductCard
              product={PRODUCTS[3]}
              image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900"
              alt="Bharat Yatra Sathi Indian Tourism Companion"
              badgeText="Bharat Yatra Sathi"
              platformText="Android 8.0+ APK · v1.1.0"
              captionTitle="Bharat Yatra Sathi"
              captionCategory="Android Mobile App"
              tagline={PRODUCTS[3].tagline}
              shotType="shot--t"
              tabClass="tab-r"
              downloadLabel="Download APK"
              onSelect={onSelectProduct}
              onDownload={onDownloadProduct}
            />
            <ProductCard
              product={null}
              image="https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=900"
              alt="Thermal Receipt Printer ESC/POS"
              badgeText="Thermal Drivers Included"
              platformText={'ESC/POS 2" & 3" Serial/USB'}
              captionTitle="Hardware Drivers Bundled"
              captionCategory="Universal Support"
              tagline="Integrated plug-and-play drivers for all standard 58mm/80mm USB & serial thermal receipt printers."
              shotType="shot--p"
              tabClass="tab-r"
              onSelect={null}
              onDownload={null}
            />
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <a className="btn" href="#download">
          <span>Go to download application center</span>
          <svg className="btn__arr" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 9 9 3M4 3h5v5" />
          </svg>
        </a>
      </div>
    </section>
  );
}
