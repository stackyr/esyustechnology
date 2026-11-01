import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data aligned with frontend companyData.js
const DEFAULT_DATA = {
  brand: {
    name: "Esyus Technologies",
    shortName: "Esyus",
    domain: "esyustechnologies.com",
    tagline: "Smart Software Solutions for Tomorrow's Businesses",
    slogan: "High-Performance Desktop, Web & Android Systems Built for Absolute Reliability",
    founder: "Milan Mandal",
    coFounder: "Suman Raptan",
    establishmentDate: "01/01/2027",
    email: "contact@esyustechnologies.com",
    supportEmail: "support@esyustechnologies.com",
    phone: "+91 98765 43210",
    address: "Esyus Technologies Tech Park, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    stats: [
      { label: "Offline Uptime", value: "100%", desc: "Works uninterrupted with local databases" },
      { label: "Software Products", value: "5+", desc: "Finance Flow suite & Bharat Yatra Sathi" },
      { label: "Invoices Generated", value: "50,000+", desc: "Rapid GST billings processed offline" },
      { label: "Client Satisfaction", value: "99.4%", desc: "Rated by retail & enterprise clients" },
    ]
  },
  landingPage: {
    hero: {
      title: "Engineered for speed, built for reliability",
      ringText: "Offline Billing Suite · Fast & Dependable ·",
      floodTitle: "Built for Indian business counters.",
      floodLead: "Local SQLite databases, instant 0.2s keystrokes, and plug-and-play thermal printer drivers. Total operational autonomy, no matter what happens to the internet.",
      videoUrl: "/demo-video.mp4?v=2",
      collageA1: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=800",
      collageA2: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800",
      collageB: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800",
      collageD: "https://images.unsplash.com/photo-1556742208-999815fca738?auto=format&fit=crop&q=80&w=800",
      collageE1: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&q=80&w=800",
      collageE2: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800",
      founderPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      coFounderPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    about: {
      headline: "Building dependable software for real-world businesses",
      lead: "Established to solve one critical problem: businesses losing hours of productivity to cloud server outages and complicated tools.",
      motive: "Transforming complex enterprise technology into simple, intuitive, and easy-to-use software that empowers everyday business.",
      founderQuote: "We bridge the gap between heavy enterprise needs and practical everyday reliability with offline-first desktop software and modern digital systems that never stop working.",
      founderPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      officePhoto: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900"
    },
    servicesSection: {
      eyebrow: "Engineering Capabilities",
      headline: "Five ways we engineer business reliability",
      lead: "From offline Windows billing software and thermal printer POS to cloud enterprise applications, we build robust systems with zero downtime."
    },
    productsSection: {
      eyebrow: "Production Software Blueprint",
      headline: "Inside our software ecosystem",
      lead: "Five proprietary systems engineered for retail counters, distributors, travel consultancies, and enterprises requiring 100% offline resilience."
    },
    featuredProduct: {
      headline: "Finance Flow: From barcode scan to printed GST invoice in 0.2 seconds",
      lead: "The premier offline-first billing solution designed by Esyus Technologies. Create customer GST invoices in milliseconds with zero internet dependency and zero cloud latency.",
      stationImage: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900",
      isComingSoon: true,
      downloadUrl: ""
    },
    whyChooseUs: {
      headline: "Five core pillars. Engineered for uninterrupted operations.",
      lead: "Every software package is architected around absolute uptime, data privacy, and rapid user workflows.",
      pillarImages: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=700",
        "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=700",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=700",
        "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=700",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=700"
      ]
    },
    downloadSection: {
      eyebrow: "Section 10 • Application Releases",
      headline: "Installers built for offline endurance.",
      lead: "Direct access to official installers and production releases. Public download links are currently in preparation — packages will be enabled for direct download as soon as release links go live.",
      notice: "Every installer is scanned and clean of malware. Windows packages include all runtime SQLite drivers for isolated offline operation. No internet connection or cloud account setup is ever required."
    },
    reviewsSection: {
      headlineQuote: "Finance Flow eliminated 100% of our checkout delays. Even when broadband cuts out during peak evening rush hours, our billing counters process GST invoices without a hitch.",
      quoteAuthor: "Sunil Agarwal",
      authorMeta: "Agarwal Mega Store, Kolkata · Verified User"
    },
    contact: {
      headline: "Start a conversation.",
      lead: "Have questions regarding Finance Flow, customized desktop billing counters, or custom Android app development? Reach out to our technical leadership directly.",
      counterImage: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=900",
      footerCtaEyebrow: "Enterprise Precision • Zero Cloud Latency",
      footerCtaTitle: "Bring calm, offline precision to your billing counter."
    }
  },
  services: [
    {
      id: "website-dev",
      title: "Website Development",
      shortDesc: "High-speed, modern, SEO-optimized business websites that establish brand credibility.",
      fullDesc: "We build modern, pixel-perfect, and ultra-responsive corporate websites. Utilizing contemporary web technologies, our websites ensure fast loading speeds, complete mobile responsiveness, accessible navigation, and search engine optimization from day one.",
      badge: "Core Service",
      iconName: "Globe",
      isComingSoon: false,
      actionUrl: "",
      features: [
        "Mobile-First Responsive Layouts",
        "SEO & Core Web Vitals Optimization",
        "Modern UI/UX with Sleek Typography",
        "Cross-Browser Compatibility",
        "Easy CMS or Static Hosting Ready"
      ],
      techStack: ["React", "HTML5/CSS3", "Tailwind CSS", "Next.js", "Vite"]
    },
    {
      id: "web-app-dev",
      title: "Web Application Development",
      shortDesc: "Scalable, dynamic cloud web apps and enterprise portals tailored to business workflows.",
      fullDesc: "From custom customer management portals to sophisticated SaaS platforms, we architect scalable web applications with rich frontends and robust API integrations. Designed for data integrity, security, and exceptional user experience.",
      badge: "Enterprise",
      iconName: "Layout",
      isComingSoon: false,
      actionUrl: "",
      features: [
        "Role-Based Access Control (RBAC)",
        "Real-time Dashboards & Data Analytics",
        "RESTful & GraphQL API Integrations",
        "Secure Authentication & Encryption",
        "High Concurrency & Cloud Scaling"
      ],
      techStack: ["React", "Node.js", "Express", "PostgreSQL", "REST APIs"]
    },
    {
      id: "mobile-app-dev",
      title: "Mobile Application Development",
      shortDesc: "Cross-platform and multi-device smartphone apps built for high retention and speed.",
      fullDesc: "We design and develop modern mobile applications that deliver native-grade fluidity across iOS and Android ecosystems. Our solutions prioritize fast load times, intuitive touch gestures, and seamless offline data caching.",
      badge: "Cross-Platform",
      iconName: "Smartphone",
      isComingSoon: false,
      actionUrl: "",
      features: [
        "Smooth 60 FPS Native-Feel UI",
        "Push Notifications & Cloud Sync",
        "Biometric & Secure Local Storage",
        "Optimized Battery & Resource Usage",
        "App Store & Play Store Compliance"
      ],
      techStack: ["React Native", "Flutter", "Android SDK", "Firebase"]
    },
    {
      id: "android-dev",
      title: "Android Application Development",
      shortDesc: "Specialized native Android applications optimized for hardware, sensors, and offline utility.",
      fullDesc: "With deep expertise in the Android ecosystem, we build high-performance applications designed specifically for Android smartphones, POS tablets, and handheld devices. Engineered with Room SQLite databases for robust offline data preservation.",
      badge: "Specialized",
      iconName: "Cpu",
      isComingSoon: false,
      actionUrl: "",
      features: [
        "Native Android Architecture (Kotlin/Java)",
        "Offline SQLite / Room Database Storage",
        "Bluetooth Thermal Printer & Barcode Scanner Integration",
        "Background Workers & Geofencing",
        "Compatibility across Android 8.0 through 14+"
      ],
      techStack: ["Kotlin", "Java", "Android Jetpack", "SQLite", "Room DB"]
    },
    {
      id: "desktop-dev",
      title: "Desktop Application Development",
      shortDesc: "High-performance Windows billing, inventory, and management software that works 100% offline.",
      fullDesc: "Our flagship expertise lies in building rock-solid desktop software. Designed for businesses that cannot afford to halt operations due to poor internet connectivity, our desktop solutions feature instant startup, lightning-fast keystroke navigation, and zero cloud dependency.",
      badge: "Flagship",
      iconName: "Monitor",
      isComingSoon: false,
      actionUrl: "",
      features: [
        "100% Offline Functionality (No Internet Needed)",
        "Zero Lag Keyboard-First Operations",
        "Direct USB/Serial Printer & Cash Drawer Interfacing",
        "Encrypted Local SQLite Database Backups",
        "One-Click Windows MSI/EXE Installer"
      ],
      techStack: ["Electron / C# / C++", "SQLite", "Windows API", "React Desktop"]
    },
    {
      id: "custom-dev",
      title: "Custom Software Development",
      shortDesc: "Bespoke software engineered around your specific operational workflows and legacy tools.",
      fullDesc: "Every business has unique requirements. We craft tailor-made software solutions from the ground up—automating tedious operational tasks, unifying scattered spreadsheets, and connecting disparate hardware devices into a cohesive system.",
      badge: "Tailor-Made",
      iconName: "Code2",
      isComingSoon: false,
      actionUrl: "",
      features: [
        "Business Workflow Automation",
        "Legacy Data Migration & Synchronization",
        "Custom Reporting & Financial Exports",
        "Dedicated Technical Support & Training",
        "Custom Feature Extensions On-Demand"
      ],
      techStack: ["Full Custom Architecture", "Microservices", "RESTful APIs", "SQL"]
    }
  ],
  products: [
    {
      id: "finance-flow",
      name: "Finance Flow",
      category: "Desktop Billing",
      platform: "Windows 10 / 11",
      version: "v2.4.0",
      size: "48.2 MB",
      isFeatured: true,
      tagline: "Desktop billing software with GST invoices and 100% offline autonomy.",
      description: "Finance Flow is our premier desktop billing software engineered for retail shops, wholesalers, and service providers. It empowers businesses to generate GST-compliant tax invoices in seconds without requiring any active internet connection.",
      highlights: [
        "Works 100% offline with zero cloud dependency",
        "Compliant with current GST tax slabs (CGST, SGST, IGST)",
        "Thermal (2\" / 3\") and Laser A4/A5 invoice printing",
        "Instant barcode scanning & stock tracking",
        "Automated daily sales summary & tax reports"
      ],
      chips: ["⚡ 0.2s Keystrokes", "🔒 Encrypted SQLite DB", "🖨️ Thermal 2\"/3\" & A4"],
      downloadFile: "FinanceFlow-v2.4.0-Setup.exe",
      downloadUrl: "",
      isComingSoon: true,
      accentColor: "from-blue-600 to-indigo-700",
      badge: "Flagship Desktop",
      logo: "/finance-flow-logo.png",
      image: "/card-finance-flow.png"
    },
    {
      id: "finance-flow-lite",
      name: "Finance Flow Lite",
      category: "Lightweight Billing",
      platform: "Windows & Android",
      version: "v1.2.1",
      size: "18.5 MB",
      isFeatured: false,
      tagline: "Ultra-compact, low-resource billing software for small counters & mini-kiosks.",
      description: "Designed for small convenience stores, pop-up stalls, and basic counters, Finance Flow Lite runs smoothly even on entry-level computers and Android tablets. It focuses on ultra-fast checkout and minimal hardware requirements.",
      highlights: [
        "Extremely low CPU and RAM footprint (<100MB RAM)",
        "Quick item touch grid & rapid quantity multipliers",
        "Basic GST & Non-GST receipt printing",
        "Daily revenue totals and cash drawer reconciliation",
        "Zero installation overhead"
      ],
      chips: ["⚡ <100MB Memory", "📱 Android Tablet POS", "🧾 Offline Quick Touch"],
      downloadFile: "FinanceFlowLite-Setup.exe",
      downloadUrl: "",
      isComingSoon: true,
      accentColor: "from-teal-600 to-emerald-600",
      badge: "Low Footprint",
      logo: "/finance-flow-lite-logo-transparent.png",
      image: "/card-finance-flow-lite.png"
    },
    {
      id: "finance-flow-flash",
      name: "Finance Flow Flash",
      category: "High-Speed POS",
      platform: "Windows POS / Touch Terminal",
      version: "v1.0.4",
      size: "22.0 MB",
      isFeatured: false,
      tagline: "High-speed point-of-sale software engineered for busy checkout lanes.",
      description: "Built specifically for high-footfall environments like supermarkets, bakeries, and fast-food counters. Finance Flow Flash provides lightning-quick split-second barcode processing, queue busting, and instant thermal receipt generation.",
      highlights: [
        "Sub-second barcode scan & invoice generation",
        "Multi-payment split mode (Cash, UPI, Card, Credit)",
        "Customer queue hold and recall feature",
        "Direct integration with thermal POS receipt printers",
        "Automated shift handovers & cashier tracking"
      ],
      chips: ["⚡ 0.1s Barcode Scan", "🛒 Supermarket Lanes", "💳 Multi-Split Payment"],
      downloadFile: "FinanceFlowFlash-v1.0.4.exe",
      downloadUrl: "",
      isComingSoon: true,
      accentColor: "from-amber-600 to-orange-600",
      badge: "Rapid POS",
      logo: "/finance-flow-flash-logo.png",
      image: "/card-finance-flow-flash.png"
    },
    {
      id: "bharat-yatra-sathi",
      name: "Bharat Yatra Sathi",
      category: "Android Application",
      platform: "Android 8.0+",
      version: "v1.1.0",
      size: "24.8 MB",
      isFeatured: false,
      tagline: "Smart travel, highway mobility, and pilgrimage companion app designed for explorers in India.",
      description: "Bharat Yatra Sathi is a production-grade Android mobile application for domestic travelers, drivers, and pilgrims navigating tourist destinations and sacred sites across India. Features 100% offline highway routes, temple timings, local emergency assistance, and driver navigation.",
      highlights: [
        "100% offline highway routes & temple/heritage site timings",
        "Driver mobility assist & turn-by-turn waypoint tracking",
        "Offline emergency contacts & tourist police hotlines",
        "Custom day-by-day travel planner & expense logger",
        "Low battery consumption mode with offline maps integration"
      ],
      chips: ["🧭 100% Offline Maps", "🚗 Driver & Route Assist", "🛕 Temple Timings"],
      downloadFile: "BharatYatraSathi-v1.1.apk",
      downloadUrl: "",
      isComingSoon: true,
      accentColor: "from-blue-600 to-indigo-600",
      badge: "Android App",
      logo: "/bharat-yatra-sathi-logo.png",
      image: "/card-bharat-yatra-sathi.png"
    },
    {
      id: "bharat-yatra-sathi-partner",
      name: "Bharat Yatra Sathi Partner",
      category: "Partner & Vendor Suite",
      platform: "Android 8.0+ & Web",
      version: "v1.0.2",
      size: "21.4 MB",
      isFeatured: false,
      tagline: "Dedicated business portal & mobile POS for tour guides, hotel vendors, and operators.",
      description: "Built for verified travel agencies, certified pilgrimage guides, transport fleets, and homestay hosts. Manage traveler bookings, verify digital pilgrimage QR passes offline, print customer receipt slips, and track direct daily payouts with zero cloud downtime.",
      highlights: [
        "Offline QR code verification for pilgrim & visitor entry passes",
        "Instant Bluetooth receipt printing for excursions & bookings",
        "Commission calculation and automated daily vendor ledger",
        "Real-time customer itinerary management & notifications",
        "Low battery and offline SQLite database synchronization"
      ],
      chips: ["🤝 Vendor Bookings", "🎫 Offline QR Passes", "💰 Direct Payout Ledger"],
      downloadFile: "BharatYatraSathiPartner-v1.0.2.apk",
      downloadUrl: "",
      isComingSoon: true,
      accentColor: "from-indigo-600 to-amber-600",
      badge: "Partner Suite",
      logo: "/bharat-yatra-sathi-partner-logo.png",
      image: "/card-bharat-yatra-sathi-partner.png"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      q: "Does Finance Flow require an active internet connection to generate GST invoices?",
      a: "No! Finance Flow is built with a 100% offline-first architecture. It stores your company data, customer lists, inventory, and invoices locally on your computer in an encrypted database. You never need an active internet connection to print invoices or record daily sales."
    },
    {
      id: "faq-2",
      q: "What types of printers are supported by the Finance Flow software suite?",
      a: "Finance Flow supports all standard printers: 2-inch and 3-inch thermal POS receipt printers (USB, Bluetooth, LAN) as well as regular A4/A5 laser and inkjet printers for detailed GST tax invoices with terms and bank details."
    },
    {
      id: "faq-3",
      q: "How does Esyus Technologies handle software updates and data safety?",
      a: "All desktop applications include automated local database backup mechanisms. Updates can be installed seamlessly without touching or overwriting your stored customer and invoice records."
    },
    {
      id: "faq-4",
      q: "Can Esyus Technologies build custom features or integrations for our business?",
      a: "Yes! In addition to our off-the-shelf software packages, we offer end-to-end custom software development. Whether you need specific barcode hardware integration, custom reports, or cloud synchronization, our team will engineer it to your exact specifications."
    },
    {
      id: "faq-5",
      q: "How can I download and test Finance Flow or Bharat Yatra Sathi?",
      a: "You can download the installers directly from the 'Download Applications' section on this website. Our desktop installers are packaged as easy-to-use Windows .exe setup files, and Android applications are available as secure APKs."
    }
  ],
  inquiries: []
};

// Ensure data folder and db.json exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
  }
}

export function getDB() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err.message);
    return DEFAULT_DATA;
  }
}

export function saveDB(data) {
  ensureDataFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving db.json:', err.message);
    return false;
  }
}

export function resetDB() {
  saveDB(DEFAULT_DATA);
  return DEFAULT_DATA;
}
