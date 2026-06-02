export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  features: string[];
  priceString: string; // e.g. "Coming Soon" or "$45.00"
  priceVal: number;    // for shopping cart calculations
  salePriceVal?: number; // sale off price
  isComingSoon: boolean;
  sku: string;
  imageUrl?: string;
}

export interface MedicalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  publishDate: string;
  imageUrl?: string;
  seoKeywords: string[];
  seoCanonicalUrl?: string;
}

export interface BodyworkTreatment {
  id: string;
  name: string;
  durationMin: number;
  costUSD: number;
  description: string;
}

export interface Booking {
  id: string;
  treatmentId: string;
  treatmentName: string;
  costUSD: number;
  durationMin: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  hotelName: string;
  hotelRoom: string;
  preferredTime: string; // datetime string
  therapistProfile: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Enquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  enquiryType: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CulturXData {
  hero: {
    brandLogo: string;
    brandKicker: string;
    mainHeadline: string;
    subline: string;
    description: string;
  };
  manifesto: {
    kicker: string;
    heading: string;
    terms: string[];
  };
  blackSystem: {
    kicker: string;
    heading: string;
    description: string;
    pills: string[];
  };
  whiteSystem: {
    kicker: string;
    heading: string;
    description: string;
    pills: string[];
  };
  ecosystem: {
    kicker: string;
    heading: string;
    items: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
    }[];
  };
  products: Product[];
  bodyworks: {
    kicker: string;
    heading: string;
    subline: string;
    paragraph: string;
    statement: string;
    cardTitle: string;
    cardTexts: string[];
    treatments: BodyworkTreatment[];
  };
  exhaleWork: {
    kicker: string;
    heading: string;
    statement: string;
    explanation: string;
  };
  concierge: {
    kicker: string;
    heading: string;
    description: string;
    columns: {
      title: string;
      items: string[];
    }[];
  };
  philosophy: {
    kicker: string;
    heading: string;
    items: {
      title: string;
      text: string;
    }[];
  };
  contact: {
    kicker: string;
    heading: string;
    founderName: string;
    founderTitle: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    enquiries: string[];
  };
  sectionVisibility?: {
    hero: boolean;
    manifesto: boolean;
    duality: boolean;
    ecosystem: boolean;
    products: boolean;
    shop: boolean;
    bodyworks: boolean;
    exhaleWork: boolean;
    concierge: boolean;
    philosophy: boolean;
    vault: boolean;
    articles: boolean;
    contact: boolean;
  };
}

export const defaultCulturXData: CulturXData = {
  sectionVisibility: {
    hero: true,
    manifesto: true,
    duality: true,
    ecosystem: true,
    products: true,
    shop: true,
    bodyworks: true,
    exhaleWork: true,
    concierge: true,
    philosophy: true,
    vault: true,
    articles: true,
    contact: true
  },
  hero: {
    brandLogo: "CULTURX™",
    brandKicker: "Internal. External. Optimized.",
    mainHeadline: "CULTURX™",
    subline: "Integrated for Elite Human Performance.",
    description: "The Future of Health Engineering. Designed for action, output, resilience, clinical regulation, recovery and elite human optimization."
  },
  manifesto: {
    kicker: "Bee. Free. CulturX.",
    heading: "The Future of Health Engineering.",
    terms: [
      "Through discipline, structure, and intelligent systems… comes freedom.",
      "Not restriction. Liberation.",
      "Freedom from disorder.",
      "Freedom from stagnation.",
      "Freedom from dysfunction.",
      "Freedom from unnecessary suffering.",
      "Freedom from bloating.",
      "Freedom from inflammation.",
      "Freedom from fatigue.",
      "Freedom from nervous system overload.",
      "Freedom to think clearly.",
      "Freedom to move freely.",
      "Freedom to perform optimally.",
      "Freedom to become what you are capable of becoming.",
      "The ultimate freedom is not escape.",
      "It is the ability to fully inhabit yourself."
    ]
  },
  blackSystem: {
    kicker: "BLACK SYSTEM",
    heading: "Performance. Activation. Execution.",
    description: "The BLACK SYSTEM is the high-performance operating system and identity framework of CulturX — engineered for action, output, resilience and elite human performance.",
    pills: ["Performance", "Activation", "Execution"]
  },
  whiteSystem: {
    kicker: "WHITE SYSTEM",
    heading: "Clinical Intelligence. Regulation. Precision.",
    description: "The WHITE SYSTEM is the clinical identity of CulturX — engineered for education, recovery, optimization and internal order.",
    pills: ["Clinical Intelligence", "Regulation", "Precision"]
  },
  ecosystem: {
    kicker: "The Ecosystem",
    heading: "CulturX™ is a Movement. Not Just a Supplement.",
    items: [
      {
        id: "eco-1",
        title: "Ferments",
        subtitle: "CulturX Ferments",
        description: "Precision-fermented kombucha, probiotic tonics and advanced gut elixirs engineered for internal regulation and microbiome optimization."
      },
      {
        id: "eco-2",
        title: "Supplements",
        subtitle: "CulturX Supplements",
        description: "Targeted nutrition systems designed to support energy, resilience, recovery, gut health and elite human performance."
      },
      {
        id: "eco-3",
        title: "Bodyworks",
        subtitle: "CulturX Clinical Bodywork",
        description: "External regulation through nervous system downregulation, lymphatic drainage, abdominal therapy, fascia work and circulation optimization."
      },
      {
        id: "eco-4",
        title: "Concierge",
        subtitle: "CulturX Concierge",
        description: "Hospitality, travel wellness, premium client recovery and distribution for the CulturX performance ecosystem."
      }
    ]
  },
  products: [
    {
      id: "prod-1",
      category: "Ferments",
      name: "Classic Ginger Kombucha",
      description: "Precision-fermented kombucha for daily gut regulation and internal optimization.",
      features: ["Raw live cultures", "Digestive regulation support", "Classic ginger activation profile", "Daily microbiome ritual"],
      priceString: "Coming Soon",
      priceVal: 12,
      isComingSoon: true,
      sku: "CX-FER-GINGER-330",
      imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04ec82a897?w=600&q=80"
    },
    {
      id: "prod-2",
      category: "Functional Tonic",
      name: "Veggie-Might Elixer™",
      description: "Mineral-rich internal recalibration system for cellular nourishment and vitality.",
      features: ["Mineral-rich formulation", "Cellular nourishment support", "Internal recalibration system", "Daily vitality enhancement"],
      priceString: "Coming Soon",
      priceVal: 18,
      isComingSoon: true,
      sku: "CX-ELX-VEGMIGHT",
      imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=600&q=80"
    },
    {
      id: "prod-3",
      category: "Recovery Formula",
      name: "Trinity Salve-ation™",
      description: "Premium regenerative recovery formula positioned for restoration and performance support.",
      features: ["Recovery and restoration positioning", "Biomechanical support system", "Elite regeneration concept", "Premium wellness architecture"],
      priceString: "Coming Soon",
      priceVal: 45,
      isComingSoon: true,
      sku: "CX-ELX-TRINITY",
      imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80"
    },
    {
      id: "prod-4",
      category: "MCT + EVOO Hybrid",
      name: "Polyphenol Lipid Complex™",
      description: "Bioactive lipid delivery system with high-polyphenol EVOO and clean sustained energy positioning.",
      features: ["High-polyphenol EVOO integration", "Bioactive lipid delivery", "Clean sustained energy", "Performance optimization support"],
      priceString: "Coming Soon",
      priceVal: 55,
      isComingSoon: true,
      sku: "CX-LIPID-MCTEVOO",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"
    },
    {
      id: "prod-5",
      category: "Targeted Nutrition",
      name: "CulturX Supplements",
      description: "Supplement range for resilience, gut function, cellular renewal, recovery and performance output.",
      features: ["Adapt — stress support and adaptogens", "Immune — immune support and recovery", "Perform — energy, focus and endurance", "Renew — cellular support and longevity", "Gut+ — gut health and digestion"],
      priceString: "Coming Soon",
      priceVal: 75,
      isComingSoon: true,
      sku: "CX-SUPP-RANGE",
      imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80"
    },
    {
      id: "prod-6",
      category: "Bundles / Stacks",
      name: "Optimization Protocols",
      description: "Curated product protocols combining ferments, lipid systems, supplements and recovery pathways.",
      features: [
        "Interactive digital instruction guide",
        "Synergistic gut microbiome targeting",
        "Full 30-day elite optimization timeline",
        "Includes consultation with recovery expert"
      ],
      priceString: "Coming Soon",
      priceVal: 180,
      isComingSoon: true,
      sku: "CX-PROTOCOLS",
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80"
    }
  ],
  bodyworks: {
    kicker: "CulturX Bodyworks",
    heading: "Not Spa Culture. Recovery Architecture™.",
    subline: "Recovery architecture for the modern mobile professional. Delivered directly to your hotel room.",
    paragraph: "Built to recalibrate the effects of modern transit — mobile professional posture collapse, long-haul compression, digestive disruption, nervous system overload and prolonged seated immobility.",
    statement: "Not indulgence. Required recovery.",
    cardTitle: "The Human Recovery Layer",
    cardTexts: [
      "Loneliness, isolation and disconnection contribute to nervous system dysregulation.",
      "Human touch, grounded presence, care and warmth support faster recovery, regulation and restoration.",
      "CulturX™ Recovery Architecture™ is designed not only to address the physical effects of modern transit physiology, but the emotional and nervous system load carried by modern mobile professionals."
    ],
    treatments: [
      {
        id: "tx-1",
        name: "The Reset",
        durationMin: 60,
        costUSD: 300,
        description: "Designed to recalibrate inflammation, dehydration, nervous system stress, poor circulation and long-haul compression from modern transit."
      },
      {
        id: "tx-2",
        name: "The Gut Protocol",
        durationMin: 75,
        costUSD: 500,
        description: "Targets digestive slowdown, lymphatic stagnation, abdominal compression and post-flight inflammation from prolonged seated immobility."
      },
      {
        id: "tx-3",
        name: "The Full System",
        durationMin: 90,
        costUSD: 700,
        description: "Full-system recovery architecture addressing inflammation, stagnation, compression, dehydration, digestive disruption and nervous system overload."
      }
    ]
  },
  exhaleWork: {
    kicker: "ExhaleWork™",
    heading: "Relief Restores Belief.",
    statement: "One System. You can exhale now. Press reset.",
    explanation: "While everyone else is selling breathwork, we’re focused on ExhaleWork™."
  },
  concierge: {
    kicker: "How It Works",
    heading: "CulturX Recovery Concierge",
    description: "Clinical recovery delivered privately — no need to step outside your hotel room. Built for founders, executives, creatives, travellers and mobile professionals who need recovery without friction.",
    columns: [
      {
        title: "Therapist Side",
        items: [
          "Apply + get vetted by elite recovery architects",
          "Verified specialist clinical skills & certifications",
          "Activate in cities they travel to dynamically",
          "Rigorous quality control and brand orientation"
        ]
      },
      {
        title: "Client Side",
        items: [
          "Book via app or official hotel concierge partners",
          "Choose targeted treatment type (System, Gut, Body)",
          "Select preferred therapist profile and therapist gender",
          "Select exact hotel room, desired time and session window"
        ]
      },
      {
        title: "Hotel Integration",
        items: [
          "Core premium hotels partner directly with the platform",
          "Offer in-room clinical wellness & high-performance recovery treatments",
          "Unique focus on gut-body connection, dynamic circulation and performance output"
        ]
      }
    ]
  },
  philosophy: {
    kicker: "Philosophy",
    heading: "The Bee. The Hive. The Elixir. The X.",
    items: [
      {
        title: "The Bee",
        text: "A Tireless Creator. A Systems Builder. Coordinated Intelligence. Biomechanical Precision. Geometric Structural Mastery."
      },
      {
        title: "The Hive",
        text: "Homogenous systems engineering strength through balance, sequence and structure. Optimization Cracked."
      },
      {
        title: "The Elixir",
        text: "Salve-ation. Recalibrating pH balance. Restoring you. The Formula for Superior Human Output. Activation."
      },
      {
        title: "The X",
        text: "The intersection of science and nature. Next-Gen Cognition & Peak Physical Function. Inactive DNA Codes Actioned."
      }
    ]
  },
  contact: {
    kicker: "Contact",
    heading: "Begin the Recalibration.",
    founderName: "Gabriela Popa",
    founderTitle: "Founder",
    email: "GP@Culturx.com.au",
    phone: "+61 457 788 884",
    website: "www.culturx.com.au",
    location: "Melbourne, Victoria, Australia",
    enquiries: [
      "Product enquiries",
      "Shop order enquiries",
      "Supplement enquiries",
      "Hotel partnerships",
      "Corporate affiliates",
      "Concierge bookings",
      "Therapist applications"
    ]
  }
};

export const defaultBookings: Booking[] = [
  {
    id: "b-1",
    treatmentId: "tx-1",
    treatmentName: "The Reset",
    costUSD: 300,
    durationMin: 60,
    clientName: "David Henderson",
    clientEmail: "david@venturetech.io",
    clientPhone: "+1 650 321 9876",
    hotelName: "Park Hyatt Melbourne",
    hotelRoom: "Suite 402",
    preferredTime: "2026-06-03T16:00",
    therapistProfile: "Senior Practitioner - Focus Lymphatics",
    status: "confirmed",
    createdAt: "2026-05-31T09:12:00Z"
  },
  {
    id: "b-2",
    treatmentId: "tx-2",
    treatmentName: "The Gut Protocol",
    costUSD: 500,
    durationMin: 75,
    clientName: "Sophia Loren",
    clientEmail: "sophia@designstudio.co",
    clientPhone: "+61 411 222 333",
    hotelName: "The Ritz-Carlton",
    hotelRoom: "Room 1805",
    preferredTime: "2026-06-04T10:30",
    therapistProfile: "Primary Specialist - Visceral Manipulation",
    status: "pending",
    createdAt: "2026-06-01T01:10:00Z"
  }
];

export const defaultEnquiries: Enquiry[] = [
  {
    id: "e-1",
    clientName: "Marcus Aurelius",
    clientEmail: "marcus@rome.org",
    enquiryType: "Hotel partnership",
    message: "We would like to explore integrating the CulturX Recovery Architecture across our wellness retreats in Sydney and Gold Coast starting Q3. Please arrange a briefing.",
    status: "unread",
    createdAt: "2026-05-31T14:45:00Z"
  },
  {
    id: "e-2",
    clientName: "Elena Rostova",
    clientEmail: "elena@biohackers.de",
    enquiryType: "Product enquiry",
    message: "Are your ferment formulas certified organic? We are looking to import the Polyphenol Lipid Complex and Classic Ginger line to our functional health lounges in Germany.",
    status: "read",
    createdAt: "2026-05-30T10:15:00Z"
  }
];

export const defaultArticles: MedicalArticle[] = [
  {
    id: "art-1",
    title: "The Gut-Brain Axis: Precision Fermentation for Peak Mental Performance",
    excerpt: "How targeted microbial metabolites cross the blood-brain barrier to optimize focus, reduce executive brain fog, and downregulate autonomic flight responses.",
    category: "Gut Health",
    author: "Clinical Intelligence Team",
    readTime: "6 min read",
    publishDate: "2026-06-01",
    seoKeywords: ["gut health", "kombucha", "precision fermentation", "microbiome optimization", "biohacking"],
    seoCanonicalUrl: "https://culturx.com.au/articles/gut-brain-axis-precision-fermentation",
    content: `## System Alignment and the Gut-Brain Axis

Our digestive system is not merely for processing food. Modern clinical science has demonstrated that the **Gut-Brain Axis** plays a decisive role in maintaining peak work efficiency and cognitive clarity for executives and high-performance individuals.

### 1. Biological Mechanism of Precision Fermentation

CULTURX™'s PRECISION FERMENTATION technology enables strict biochemical control to yield highly active bioactive compounds:
- **Targeted Organic Metabolites:** Acetic, Gluconic, and Glucuronic acids that support liver detoxification and balance homeostatic pH.
- **Sustaining Optimal GABA Levels:** Stimulates enteric neurons to synthesize gamma-aminobutyric acid, rapidly downregulating the central nervous system after high-stress periods.

### 2. Microbiome Optimization & Recovery

Constant air travel (long-haul flights) disrupts gut microbiomes due to cabin pressure and circadian rhythm shifts. Clinical evidence highlights that supplementing with active enzymes and live probiotics from premium kombucha helps:
1. Improve gut barrier integrity and mucosal protection.
2. Minimize systemic inflammatory cytokines circulating in the bloodstream.
3. Accelerate endogenous Serotonin synthesis (over 90% of Serotonin is synthesized in the gut).

**Bee. Free. CulturX.** — Standardizing order from within.`
  },
  {
    id: "art-2",
    title: "Relieving Posture Collapse & Long-Haul Transit Posture: Clinical Bodywork Protocol",
    excerpt: "Detailed anatomical breakdown of pelvic tilt imbalances, visceral compression, and lymphatic stasis induced by prolonged business class immobility.",
    category: "Clinical Bodywork",
    author: "CulturX Recovery Architecture Office",
    readTime: "8 min read",
    publishDate: "2026-05-28",
    seoKeywords: ["clinical bodywork", "wellness concierge", "recovery", "elite human performance", "melbourne"],
    seoCanonicalUrl: "https://culturx.com.au/articles/posture-collapse-clinical-bodywork-protocol",
    content: `## Body Recovery Architecture: Posture Interventions for Frequent Travelers

For professionals and founders constantly in transit, sitting for prolonged periods during long-haul travel causes severe musculoskeletal, lymphatic, and abdominal structural degradation.

### 1. Posture Collapse Syndrome

Sitting continuously for more than 4 hours drastically spikes pelvic and spinal compression:
- **Shortened Psoas (Hip Flexors):** Pulls the pelvis forward into an anterior tilt, causing persistent lower back discomfort and inhibiting glute activation.
- **Visceral Compression:** The liver, stomach, and colon are compressed beneath the ribcage, disrupting peristalsis and triggering post-flight bloating and slow digestion.

### 2. Fascial & Lymphatic Release Protocol

The foundation of **Cms Recovery Architecture™** lies in a scientific combination of:
- **Lymphatic Drainage:** Gentle, rhythmic, directional massage matching primary lymph node hubs (axilla, inguinal) to accelerate toxic waste clearance induced by immobility.
- **Myofascial Release:** Targets deep, bound-up fascia across the chest, shoulders, and neck to restore lung capacity and assist deep parasympathetic nervous upregulation.

In-room clinical sessions at your Melbourne hotel entirely remove transit fatigue, allowing you to stride into your next boardroom meeting with absolute physical presence.`
  },
  {
    id: "art-3",
    title: "Polyphenol Lipids & Cellular Longevity: High-Polyphenol EVOO Synergies",
    excerpt: "How high-polyphenol Extra Virgin Olive Oil blended with medium-chain triglycerides creates a highly bioavailable lipid vehicle for sustained, non-insulinogenic cellular energy.",
    category: "Supplements",
    author: "Dr. Gabriela Popa & Biologists",
    readTime: "5 min read",
    publishDate: "2026-05-25",
    seoKeywords: ["supplements", "microbiome optimization", "biohacking", "elite human performance"],
    seoCanonicalUrl: "https://culturx.com.au/articles/polyphenol-lipids-cellular-longevity",
    content: `## Premium Lipids and Cellular Longevity

In the biohacking era, we understand that sustainable energy does not derive from quick sugars (which trigger volatile insulin spikes) but rather from smart, highly compatible lipid bonds.

### 1. What is the Polyphenol Lipid Complex™?

This is a unique hybrid combining **High-Polyphenol Extra Virgin Olive Oil (EVOO)** and **Medium-Chain Triglyceride (MCT) oils**:
- **EVOO Polyphenols:** Function as powerful antioxidants that search and neutralize free radicals accumulated during intense work stress.
- **MCT Oils:** Bypass complex digestive pathways and are metabolized directly by the liver into Ketones, providing immediate clean energy to the brain without requiring pancreatic insulin secretion.

### 2. Synergy with the Gut Microbiome

Beyond cellular energy, polyphenols serve as ideal nourishment for beneficial gut species like *Akkermansia muciniphila*:
1. **Mucosal Regeneration:** Promotes the synthesis of protective gut mucus, guarding against intestinal permeability (Leaky Gut).
2. **Visceral Anti-inflammation:** Reduces cellular-level chronic inflammation, extending overall biological healthspan.

Begin your daily ritual with a teaspoon of Polyphenol Lipid Complex™ as a core cellular longevity practice.`
  }
];

export interface PaymentMethodSetting {
  enabled: boolean;
  title: string;
  details: string;
  payidEmail?: string;
  businessAbn?: string;
  paypalEmail?: string;
}

export interface PaymentConfig {
  card: PaymentMethodSetting;
  afterpay: PaymentMethodSetting;
  payid: PaymentMethodSetting;
  apple_google_pay: PaymentMethodSetting;
  paypal: PaymentMethodSetting;
}

export const defaultPaymentConfig: PaymentConfig = {
  card: { enabled: true, title: "Credit/Debit Card", details: "Card payments via secure gateway" },
  afterpay: { enabled: true, title: "Afterpay AU", details: "Buy now, pay later split into 4" },
  payid: { enabled: true, title: "PayID / Osko", details: "Direct bank transfer to email account", payidEmail: "finance@culturx.com.au", businessAbn: "84 657 788 884" },
  apple_google_pay: { enabled: true, title: "Smart Wallet", details: "Express Apple & Google integrations" },
  paypal: { enabled: true, title: "PayPal AU", details: "Direct checkout with premium buyer protection", paypalEmail: "billing@culturx.com.au" }
};

// ─────────────────────────────────────────────────────────────
// APP SETTINGS — Global webapp configuration
// ─────────────────────────────────────────────────────────────

export interface AppSettings {
  brand: {
    name: string;
    tagline: string;
    domain: string;
    logoText: string;
    faviconEmoji: string;
    faviconUrl: string;      // Base64 or URL of uploaded favicon image
    primaryColor: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    founderName: string;
    founderTitle: string;
  };
  localization: {
    currency: string;
    currencySymbol: string;
    locale: string;
    timezone: string;
    targetCity: string;
    targetRegion: string;
  };
  integrations: {
    stripePublicKey: string;
    googleAnalyticsId: string;
    googleSearchConsoleId: string;
    facebookPixelId: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
  store: {
    enableShop: boolean;
    enableBodyworks: boolean;
    enableArticles: boolean;
    enableConcierge: boolean;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    tiktok: string;
    youtube: string;
  };
  notifications: {
    adminEmail: string;
    adminEmailAlerts: boolean;
    orderConfirmEmail: boolean;
    bookingConfirmEmail: boolean;
    enquiryAlertEmail: boolean;
  };
}

export const defaultAppSettings: AppSettings = {
  brand: {
    name: "CULTURX™",
    tagline: "Internal. External. Optimized.",
    domain: "https://culturx.com.au",
    logoText: "CULTURX™",
    faviconEmoji: "🧬",
    faviconUrl: "",
    primaryColor: "#4f46e5",
  },
  contact: {
    email: "GP@Culturx.com.au",
    phone: "+61 457 788 884",
    address: "Collins Street",
    city: "Melbourne",
    state: "Victoria",
    country: "Australia",
    founderName: "Gabriela Popa",
    founderTitle: "Founder",
  },
  localization: {
    currency: "AUD",
    currencySymbol: "$",
    locale: "en-AU",
    timezone: "Australia/Melbourne",
    targetCity: "Melbourne",
    targetRegion: "Victoria",
  },
  integrations: {
    stripePublicKey: "",
    googleAnalyticsId: "",
    googleSearchConsoleId: "",
    facebookPixelId: "",
    supabaseUrl: "https://ayvnxquhmbyvljfmsdtq.supabase.co",
    supabaseAnonKey: "sb_publishable_VWe1bP7wYNktlq-9j7Djag_uiV5SjW3",
  },
  store: {
    enableShop: true,
    enableBodyworks: true,
    enableArticles: true,
    enableConcierge: true,
    maintenanceMode: false,
    maintenanceMessage: "We're currently upgrading our systems. Check back soon.",
  },
  social: {
    instagram: "https://instagram.com/culturx",
    facebook: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
  },
  notifications: {
    adminEmail: "GP@Culturx.com.au",
    adminEmailAlerts: true,
    orderConfirmEmail: true,
    bookingConfirmEmail: true,
    enquiryAlertEmail: true,
  },
};
