export const COMPANY_INFO = {
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
    { label: "Software Products", value: "4+", desc: "Finance Flow suite & Bharat Yatra Sathi" },
    { label: "Invoices Generated", value: "50,000+", desc: "Rapid GST billings processed offline" },
    { label: "Client Satisfaction", value: "99.4%", desc: "Rated by retail & enterprise clients" },
  ]
};

export const SERVICES = [
  {
    id: "website-dev",
    title: "Website Development",
    shortDesc: "High-speed, modern, SEO-optimized business websites that establish brand credibility.",
    fullDesc: "We build modern, pixel-perfect, and ultra-responsive corporate websites. Utilizing contemporary web technologies, our websites ensure fast loading speeds, complete mobile responsiveness, accessible navigation, and search engine optimization from day one.",
    badge: "Core Service",
    iconName: "Globe",
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
    features: [
      "Business Workflow Automation",
      "Legacy Data Migration & Synchronization",
      "Custom Reporting & Financial Exports",
      "Dedicated Technical Support & Training",
      "Custom Feature Extensions On-Demand"
    ],
    techStack: ["Full Custom Architecture", "Microservices", "RESTful APIs", "SQL"]
  }
];

export const PRODUCTS = [
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
    downloadFile: "FinanceFlow-v2.4.0-Setup.exe",
    accentColor: "from-blue-600 to-indigo-700",
    badge: "Flagship Desktop"
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
    downloadFile: "FinanceFlowLite-Setup.exe",
    accentColor: "from-teal-600 to-emerald-600",
    badge: "Low Footprint"
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
    downloadFile: "FinanceFlowFlash-v1.0.4.exe",
    accentColor: "from-amber-600 to-orange-600",
    badge: "Rapid POS"
  },
  {
    id: "bharat-yatra-sathi",
    name: "Bharat Yatra Sathi",
    category: "Travel & Companion App",
    platform: "Android 8.0+",
    version: "v1.1.0",
    size: "24.8 MB",
    isFeatured: false,
    tagline: "Smart travel and pilgrimage companion app designed for explorers in India.",
    description: "Bharat Yatra Sathi is a mobile companion app for domestic travelers and pilgrims navigating tourist destinations and sacred sites across India. Features offline route summaries, local emergency assistance, and personalized itineraries.",
    highlights: [
      "Curated travel guides and temple/heritage site timings",
      "Offline emergency contacts & tourist police hotlines",
      "Custom day-by-day travel planner & expense logger",
      "Multi-language support (English, Hindi, Bengali)",
      "Low battery consumption mode with offline maps integration"
    ],
    downloadFile: "BharatYatraSathi-v1.1.apk",
    accentColor: "from-purple-600 to-indigo-600",
    badge: "Android App"
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Experienced Team",
    desc: "Our team of skilled developers and architects bring extensive practical experience in crafting desktop software, web platforms, and mobile apps that perform under heavy business load.",
    iconName: "Users",
    stat: "100%",
    statLabel: "In-House Engineering"
  },
  {
    title: "Quality and Security",
    desc: "We adhere to rigorous software engineering and QA standards. Local data is encrypted, business logic is audited for accuracy, and software undergoes multi-tier stress testing.",
    iconName: "ShieldCheck",
    stat: "AES-256",
    statLabel: "Local Data Encryption"
  },
  {
    title: "Custom Solutions",
    desc: "We don't force rigid templates onto your business. Every service and application feature is configured to align with your exact operational flow and hardware environment.",
    iconName: "Sliders",
    stat: "100%",
    statLabel: "Tailored Architecture"
  },
  {
    title: "On-Time Delivery",
    desc: "We pride ourselves on transparent communication and strict adherence to project deadlines, providing continuous progress demos and dependable post-deployment support.",
    iconName: "ClockCheck",
    stat: "99%",
    statLabel: "Milestone Compliance"
  }
];

export const TEAM_MEMBERS = [
  {
    name: "Milan Mandal",
    role: "Founder & Chief Executive Officer",
    category: "Executive Leadership",
    bio: "Visionary founder driving Esyus Technologies. Passionate about creating software solutions that solve real-world operational challenges for Indian businesses with reliability and speed.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    initials: "MM",
    specialties: ["Strategic Vision", "Product Architecture", "Business Operations"],
    featured: true
  },
  {
    name: "Suman Raptan",
    role: "Co-Founder & Chief Technology Officer",
    category: "Executive Leadership",
    bio: "Co-founder leading core technology and engineering standards. Specializes in low-latency offline systems, desktop application runtime, and database performance optimization.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    initials: "SR",
    specialties: ["Offline Systems", "Database Optimization", "System Architecture"],
    featured: true
  },
  {
    name: "Ayan Banerjee",
    role: "Lead Full-Stack Web Engineer",
    category: "Core Engineering",
    bio: "Expert web developer focused on responsive React platforms, enterprise web portals, and REST API integration with modern web security practices.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    initials: "AB",
    specialties: ["React / Vite", "Node.js", "API Systems"],
    featured: false
  },
  {
    name: "Priya Mukherjee",
    role: "Senior Android & Mobile Developer",
    category: "Core Engineering",
    bio: "Specializes in native Android architecture, offline caching, Bluetooth hardware interfacing (thermal printers/scanners), and high-retention UX.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    initials: "PM",
    specialties: ["Android Jetpack", "SQLite / Room", "POS Peripherals"],
    featured: false
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Rajesh Sharma",
    business: "Sharma Wholesale & FMCG Distribution",
    location: "Kolkata, WB",
    product: "Finance Flow",
    rating: 5,
    date: "February 2026",
    comment: "Finance Flow transformed our billing operations. Our internet frequently drops in our godown, but with Finance Flow working 100% offline, our billing never stops for a second. The GST tax calculations and thermal prints are completely accurate."
  },
  {
    id: 2,
    name: "Debojyoti Roy",
    business: "Roy Supermarket & Grocery Mart",
    location: "Howrah, WB",
    product: "Finance Flow Flash",
    rating: 5,
    date: "January 2026",
    comment: "We handle over 300 walk-in customers during evening rush hours. Finance Flow Flash handles barcode scanning instantly without any lag. Queue clearance time reduced by more than 50%!"
  },
  {
    id: 3,
    name: "Ananya Sen",
    business: "Explore India Tourism Agency",
    location: "Siliguri, WB",
    product: "Bharat Yatra Sathi",
    rating: 5,
    date: "December 2025",
    comment: "Bharat Yatra Sathi was recommended to our travel groups. The offline guides and emergency assistance features gave our clients tremendous confidence while exploring remote destinations."
  },
  {
    id: 4,
    name: "Amitav Mukherjee",
    business: "TechLogix Logistics & Warehousing",
    location: "Durgapur, WB",
    product: "Custom Software Development",
    rating: 5,
    date: "March 2026",
    comment: "The team at Esyus Technologies built a bespoke inventory tracking tool that integrates with our existing barcode hardware. Delivered exactly on schedule with fantastic support."
  }
];

export const FAQS = [
  {
    q: "Does Finance Flow require an active internet connection to generate GST invoices?",
    a: "No! Finance Flow is built with a 100% offline-first architecture. It stores your company data, customer lists, inventory, and invoices locally on your computer in an encrypted database. You never need an active internet connection to print invoices or record daily sales."
  },
  {
    q: "What types of printers are supported by the Finance Flow software suite?",
    a: "Finance Flow supports all standard printers: 2-inch and 3-inch thermal POS receipt printers (USB, Bluetooth, LAN) as well as regular A4/A5 laser and inkjet printers for detailed GST tax invoices with terms and bank details."
  },
  {
    q: "How does Esyus Technologies handle software updates and data safety?",
    a: "All desktop applications include automated local database backup mechanisms. Updates can be installed seamlessly without touching or overwriting your stored customer and invoice records."
  },
  {
    q: "Can Esyus Technologies build custom features or integrations for our business?",
    a: "Yes! In addition to our off-the-shelf software packages, we offer end-to-end custom software development. Whether you need specific barcode hardware integration, custom reports, or cloud synchronization, our team will engineer it to your exact specifications."
  },
  {
    q: "How can I download and test Finance Flow or Bharat Yatra Sathi?",
    a: "You can download the installers directly from the 'Download Applications' section on this website. Our desktop installers are packaged as easy-to-use Windows .exe setup files, and Android applications are available as secure APKs."
  }
];

export const LANDING_PAGE_SECTIONS = {
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
    collageE2: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800"
  },
  about: {
    headline: "Building dependable software for real-world businesses",
    lead: "Established to solve one critical problem: businesses losing hours of productivity to cloud server outages and complicated tools.",
    motive: "Transforming complex enterprise technology into simple, intuitive, and easy-to-use software that empowers everyday business.",
    founderQuote: "We bridge the gap between heavy enterprise needs and practical everyday reliability with offline-first desktop software and modern digital systems that never stop working.",
    founderPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    officePhoto: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900"
  },
  featuredProduct: {
    headline: "Finance Flow: From barcode scan to printed GST invoice in 0.2 seconds",
    lead: "The premier offline-first billing solution designed by Esyus Technologies. Create customer GST invoices in milliseconds with zero internet dependency and zero cloud latency.",
    stationImage: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=900"
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
  contact: {
    headline: "Start a conversation.",
    lead: "Have questions regarding Finance Flow, customized desktop billing counters, or custom Android app development? Reach out to our technical leadership directly.",
    counterImage: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=900"
  }
};

// Helper to update memory references dynamically from Backend API without touching other files
export function applyDynamicData({ brand, services, products, faqs, landingPage }) {
  if (brand && typeof brand === 'object') {
    Object.assign(COMPANY_INFO, brand);
  }
  if (landingPage && typeof landingPage === 'object') {
    if (landingPage.hero) Object.assign(LANDING_PAGE_SECTIONS.hero, landingPage.hero);
    if (landingPage.about) Object.assign(LANDING_PAGE_SECTIONS.about, landingPage.about);
    if (landingPage.featuredProduct) Object.assign(LANDING_PAGE_SECTIONS.featuredProduct, landingPage.featuredProduct);
    if (landingPage.whyChooseUs) Object.assign(LANDING_PAGE_SECTIONS.whyChooseUs, landingPage.whyChooseUs);
    if (landingPage.contact) Object.assign(LANDING_PAGE_SECTIONS.contact, landingPage.contact);
  }
  if (Array.isArray(services) && services.length > 0) {
    SERVICES.length = 0;
    SERVICES.push(...services);
  }
  if (Array.isArray(products) && products.length > 0) {
    PRODUCTS.length = 0;
    PRODUCTS.push(...products);
  }
  if (Array.isArray(faqs) && faqs.length > 0) {
    FAQS.length = 0;
    FAQS.push(...faqs);
  }
}

