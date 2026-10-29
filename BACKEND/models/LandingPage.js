import mongoose from 'mongoose';

const LandingPageSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: "Engineered for speed, built for reliability" },
    ringText: { type: String, default: "Offline Billing Suite · Fast & Dependable ·" },
    floodTitle: { type: String, default: "Built for Indian business counters." },
    floodLead: { type: String, default: "Local SQLite databases, instant 0.2s keystrokes, and plug-and-play thermal printer drivers. Total operational autonomy, no matter what happens to the internet." },
    videoUrl: { type: String, default: "/demo-video.mp4?v=2" },
    collageA1: { type: String, default: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=800" },
    collageA2: { type: String, default: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800" },
    collageB: { type: String, default: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800" },
    collageD: { type: String, default: "https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&q=80&w=800" },
    collageE1: { type: String, default: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&q=80&w=800" },
    collageE2: { type: String, default: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800" },
    founderPhoto: { type: String, default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
    coFounderPhoto: { type: String, default: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
  },
  about: {
    headline: { type: String, default: "Building dependable software for real-world businesses" },
    lead: { type: String, default: "Established to solve one critical problem: businesses losing hours of productivity to cloud server outages and complicated tools." },
    motive: { type: String, default: "Transforming complex enterprise technology into simple, intuitive, and easy-to-use software that empowers everyday business." },
    founderQuote: { type: String, default: "We bridge the gap between heavy enterprise needs and practical everyday reliability with offline-first desktop software and modern digital systems that never stop working." },
    founderPhoto: { type: String, default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
    officePhoto: { type: String, default: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900" }
  },
  servicesSection: {
    eyebrow: { type: String, default: "Engineering Capabilities" },
    headline: { type: String, default: "Five ways we engineer business reliability" },
    lead: { type: String, default: "From offline Windows billing software and thermal printer POS to cloud enterprise applications, we build robust systems with zero downtime." }
  },
  featuredProduct: {
    headline: { type: String, default: "Finance Flow: From barcode scan to printed GST invoice in 0.2 seconds" },
    lead: { type: String, default: "The premier offline-first billing solution designed by Esyus Technologies. Create customer GST invoices in milliseconds with zero internet dependency and zero cloud latency." },
    stationImage: { type: String, default: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900" },
    isComingSoon: { type: Boolean, default: true },
    downloadUrl: { type: String, default: "" }
  },
  whyChooseUs: {
    headline: { type: String, default: "Five core pillars. Engineered for uninterrupted operations." },
    lead: { type: String, default: "Every software package is architected around absolute uptime, data privacy, and rapid user workflows." },
    pillarImages: [{ type: String }]
  },
  productsSection: {
    eyebrow: { type: String, default: "Production Software Blueprint" },
    headline: { type: String, default: "Inside our software ecosystem" },
    lead: { type: String, default: "Five proprietary systems engineered for retail counters, distributors, travel consultancies, and enterprises requiring 100% offline resilience." }
  },
  downloadSection: {
    eyebrow: { type: String, default: "Section 10 • Application Releases" },
    headline: { type: String, default: "Installers built for offline endurance." },
    lead: { type: String, default: "Direct access to official installers and production releases. Public download links are currently in preparation — packages will be enabled for direct download as soon as release links go live." },
    notice: { type: String, default: "Every installer is scanned and clean of malware. Windows packages include all runtime SQLite drivers for isolated offline operation. No internet connection or cloud account setup is ever required." }
  },
  reviewsSection: {
    headlineQuote: { type: String, default: "Finance Flow eliminated 100% of our checkout delays. Even when broadband cuts out during peak evening rush hours, our billing counters process GST invoices without a hitch." },
    quoteAuthor: { type: String, default: "Sunil Agarwal" },
    authorMeta: { type: String, default: "Agarwal Mega Store, Kolkata · Verified User" }
  },
  contact: {
    headline: { type: String, default: "Start a conversation." },
    lead: { type: String, default: "Have questions regarding Finance Flow, customized desktop billing counters, or custom Android app development? Reach out to our technical leadership directly." },
    counterImage: { type: String, default: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=900" },
    footerCtaEyebrow: { type: String, default: "Enterprise Precision • Zero Cloud Latency" },
    footerCtaTitle: { type: String, default: "Bring calm, offline precision to your billing counter." }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const LandingPage = mongoose.models.LandingPage || mongoose.model('LandingPage', LandingPageSchema);
export default LandingPage;
