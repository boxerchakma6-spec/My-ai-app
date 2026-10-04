import { Product, SupportTicket, ShipmentTracking, DelegatedGig, Transaction, UserWallet } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-watch-01',
    title: 'Aethelgard Titanium Chronograph 41mm',
    category: 'Watches & Accessories',
    basePrice: 190,
    retailPrice: 345,
    stock: 24,
    imageUrl: '/src/assets/images/product_minimalist_watch_1791143810831.jpg',
    merchantName: 'Aethelgard Horology',
    commissionPercentage: 14, // 14% on sale = $48.30
    isOptimizedByAI: true,
    tagline: 'Architectural minimalism carved from grade 5 aerospace titanium.',
    description: 'Constructed from lightweight bead-blasted titanium, the Chronograph 41mm combines disciplined Scandinavian geometry with an ultra-accurate meca-quartz movement. Finished with a supple Italian bridle leather strap.',
    featureBullets: [
      'Grade 5 Aerospace Titanium: Unmatched strength-to-weight ratio with hypoallergenic comfort.',
      'Anti-Reflective Sapphire Crystal: Diamond-scratch resistant with dual internal anti-glare coatings.',
      '10 ATM Water Resistance: Sealed screw-down crown tested to 100 meters atmospheric pressure.',
      'Interchangeable Quick-Release: Effortless strap changes without jeweler tools.'
    ],
    seoTags: ['Titanium Watch', 'Minimalist Chronograph', 'Luxury Watch', 'Aerospace Watch', 'Architectural Timepiece'],
    optimizationBounty: 35
  },
  {
    id: 'prod-skincare-02',
    title: 'Komorebi Botanical Youth Serum (30ml)',
    category: 'Skincare & Botanicals',
    basePrice: 22,
    retailPrice: 68,
    stock: 85,
    imageUrl: '/src/assets/images/product_amber_skincare_1791143825359.jpg',
    merchantName: 'Komorebi Organics',
    commissionPercentage: 18, // 18% on sale = $12.24
    isOptimizedByAI: true,
    tagline: 'Concentrated alpine botanicals infused with plant-derived squalane.',
    description: 'An intensive antioxidant treatment oil designed to restore cellular elasticity and lipid barrier balance. Hand-pressed in small micro-batches with organic sea buckthorn and cold-pressed camellia seed oil.',
    featureBullets: [
      'Cold-Pressed Extraction: Retains 98.4% of natural phytonutrients and vitamins C & E.',
      'Rapid Cellular Absorption: Weightless satin finish without greasy pore-clogging residue.',
      'Certified Organic: 100% vegan, cruelty-free, zero synthetic fragrances or parabens.',
      'Amber UV Glass Shield: Protects bioactive compounds against photolytic degradation.'
    ],
    seoTags: ['Botanical Serum', 'Organic Face Oil', 'Clean Beauty', 'Anti-Aging Elixir', 'Squalane Serum'],
    optimizationBounty: 24
  },
  {
    id: 'prod-audio-03',
    title: 'Aura Studio Acoustic Wireless Headphones',
    category: 'Audio & Acoustics',
    basePrice: 120,
    retailPrice: 220,
    stock: 42,
    imageUrl: '/src/assets/images/product_wireless_headphones_1791143836957.jpg',
    merchantName: 'Aura Acoustics NYC',
    commissionPercentage: 12, // 12% on sale = $26.40
    isOptimizedByAI: false, // Ready for operator to optimize!
    tagline: 'Custom 40mm beryllium drivers for uncompromising studio transparency.',
    description: 'Matte black over-ear headphones with hybrid active noise cancellation, memory foam earpads, and 45-hour playback reserve.',
    featureBullets: [
      '40mm Beryllium Neodymium Drivers: Flat studio frequency response from 10Hz to 40kHz.',
      'Adaptive Hybrid ANC: Dual external microphones filter out 92% of ambient commuter frequency.',
      '45-Hour Battery Life: Fast USB-C recharge provides 5 hours of listening in 10 minutes.',
      'Acoustic Memory Foam: Plush magnetic earpads wrapped in breathable protein leather.'
    ],
    seoTags: ['Wireless Headphones', 'Studio Audio', 'Active Noise Canceling', 'Hi-Fi Over-Ear'],
    optimizationBounty: 30
  },
  {
    id: 'prod-bag-04',
    title: 'Vanguard Full-Grain Cognac Weekender Bag',
    category: 'Leather Goods & Travel',
    basePrice: 140,
    retailPrice: 295,
    stock: 18,
    imageUrl: '/src/assets/images/product_leather_bag_1791143847753.jpg',
    merchantName: 'Vanguard Atelier',
    commissionPercentage: 15, // 15% on sale = $44.25
    isOptimizedByAI: false, // Ready for operator to optimize!
    tagline: 'Handcrafted vegetable-tanned leather tailored for weekend escapes.',
    description: 'Spacious 45L duffle crafted from vegetable-tanned Tuscan calfskin. Features reinforced brass hardware, waterproof nylon shoe compartment, and padded 16-inch laptop compartment.',
    featureBullets: [
      'Vegetable-Tanned Tuscan Calfskin: Develops a deep, rich patina with every journey.',
      'Isolated Footwear Chamber: Separate ventilated pocket keeps shoes away from garments.',
      'Solid Brass Hardware: Heavy-duty YKK Excella zippers guaranteed for lifetime durability.',
      'Carry-On Compliant: Precision dimensions (52 x 28 x 26 cm) meet all international airline standards.'
    ],
    seoTags: ['Leather Weekender', 'Travel Duffle Bag', 'Tuscan Leather', 'Carry On Bag'],
    optimizationBounty: 42
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    orderNumber: 'ORD-7821',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techstudio.co',
    productTitle: 'Aethelgard Titanium Chronograph 41mm',
    productImage: '/src/assets/images/product_minimalist_watch_1791143810831.jpg',
    merchantName: 'Aethelgard Horology',
    issueCategory: 'Where is my order?',
    message: 'Hello, I ordered the Chronograph 5 days ago for my anniversary this Friday. The tracking status shows "Departed Regional Sort Hub" but hasn\'t updated in 48 hours. Can you check if it will arrive in time?',
    status: 'open',
    priority: 'Medium',
    dueDate: 'Today by 5:00 PM',
    bounty: 8.50,
    createdAt: '25 mins ago',
    sentiment: 'Inquiring'
  },
  {
    id: 'tkt-102',
    orderNumber: 'ORD-7814',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designworks.io',
    productTitle: 'Komorebi Botanical Youth Serum (30ml)',
    productImage: '/src/assets/images/product_amber_skincare_1791143825359.jpg',
    merchantName: 'Komorebi Organics',
    issueCategory: 'Product Defect / Return',
    message: 'I received my serum package today, but the glass dropper cap was slightly loose and leaked about 20% of the oil inside the box during transit. I love the product smell though. Can you send a replacement bottle or offer a partial adjustment?',
    status: 'open',
    priority: 'High',
    dueDate: 'Within 2 hours',
    bounty: 12.00,
    createdAt: '1 hour ago',
    sentiment: 'Frustrated'
  },
  {
    id: 'tkt-103',
    orderNumber: 'ORD-7839',
    customerName: 'David Chen',
    customerEmail: 'david.chen@ventures.net',
    productTitle: 'Vanguard Full-Grain Cognac Weekender Bag',
    productImage: '/src/assets/images/product_leather_bag_1791143847753.jpg',
    merchantName: 'Vanguard Atelier',
    issueCategory: 'Address Correction',
    message: 'Hi! I made a typo in my shipping address! I put Apartment 4B instead of 4D. The package hasn\'t been handed over to courier yet according to the confirmation. Can you update this before dispatch?',
    status: 'open',
    priority: 'High',
    dueDate: 'Within 45 mins',
    bounty: 6.00,
    createdAt: '2 hours ago',
    sentiment: 'Urgent'
  },
  {
    id: 'tkt-104',
    orderNumber: 'ORD-7798',
    customerName: 'Sophia Lindqvist',
    customerEmail: 'sophia@archfirm.se',
    productTitle: 'Aura Studio Acoustic Wireless Headphones',
    productImage: '/src/assets/images/product_wireless_headphones_1791143836957.jpg',
    merchantName: 'Aura Acoustics NYC',
    issueCategory: 'Pre-Purchase Question',
    message: 'Does this model support simultaneous Bluetooth multipoint pairing to both my MacBook Pro and iPhone 16? Also is there a 3.5mm analog bypass cable included?',
    status: 'open',
    priority: 'Low',
    dueDate: 'Tomorrow by 12:00 PM',
    bounty: 5.50,
    createdAt: '3 hours ago',
    sentiment: 'Neutral'
  }
];

export const INITIAL_SHIPMENTS: ShipmentTracking[] = [
  {
    id: 'shp-501',
    orderNumber: 'ORD-7821',
    customerName: 'Marcus Vance',
    customerPhone: '+1 (555) 234-8901',
    productTitle: 'Aethelgard Titanium Chronograph 41mm',
    productImage: '/src/assets/images/product_minimalist_watch_1791143810831.jpg',
    carrier: 'FedEx Express',
    trackingNumber: 'FDX-9948210389',
    destination: 'Austin, TX 78701',
    currentStatus: 'Sorting Hub',
    lastScanLocation: 'Memphis SuperHub, TN',
    daysInTransit: 2,
    estimatedDelivery: 'Oct 06, 2026',
    monitoringBounty: 7.50,
    isVerified: false
  },
  {
    id: 'shp-502',
    orderNumber: 'ORD-7790',
    customerName: 'Claire Beaumont',
    customerPhone: '+1 (555) 874-3319',
    productTitle: 'Vanguard Full-Grain Cognac Weekender Bag',
    productImage: '/src/assets/images/product_leather_bag_1791143847753.jpg',
    carrier: 'DHL Global',
    trackingNumber: 'DHL-8472910344',
    destination: 'Seattle, WA 98101',
    currentStatus: 'Out for Delivery',
    lastScanLocation: 'Seattle Delivery Depot, WA',
    daysInTransit: 3,
    estimatedDelivery: 'Today by 4:00 PM',
    monitoringBounty: 9.00,
    isVerified: false
  },
  {
    id: 'shp-503',
    orderNumber: 'ORD-7762',
    customerName: 'Tariq Al-Mansoor',
    customerPhone: '+1 (555) 492-1178',
    productTitle: 'Aura Studio Acoustic Wireless Headphones',
    productImage: '/src/assets/images/product_wireless_headphones_1791143836957.jpg',
    carrier: 'USPS Priority',
    trackingNumber: 'USPS-940011189922',
    destination: 'Chicago, IL 60611',
    currentStatus: 'Carrier Delay Hold',
    lastScanLocation: 'Elk Grove Sorting Facility, IL (Weather Divert)',
    daysInTransit: 4,
    estimatedDelivery: 'Delayed · Oct 07, 2026',
    monitoringBounty: 14.00,
    isVerified: false
  }
];

export const INITIAL_GIGS: DelegatedGig[] = [
  {
    id: 'gig-201',
    merchantName: 'Aethelgard Horology',
    title: 'Draft VIP Pre-Order Announcement & Early-Bird Sequence',
    category: 'Marketing Sequence',
    instructions: 'We are launching the 38mm limited edition chronograph in 2 weeks. Write a 3-part high-converting email sequence for our past buyers explaining the new movement, sapphire bezel upgrade, and offering an exclusive 15% VIP code.',
    bounty: 55.00,
    priority: 'Medium',
    dueDate: 'Oct 07, 2026',
    status: 'open'
  },
  {
    id: 'gig-202',
    merchantName: 'Komorebi Organics',
    title: 'Supplier Packaging Negotiation for Leak-Proof Pump Tops',
    category: 'Supplier Negotiation',
    instructions: 'Draft a firm but collaborative negotiation letter to our glass container supplier (Shenzhen PureVial Co.) requesting double-sealed silicone dropper seals and requesting a 12% price reduction on the next 5,000 units batch due to recent transit leak reports.',
    bounty: 45.00,
    priority: 'Medium',
    dueDate: 'Tomorrow by 4:00 PM',
    status: 'open'
  },
  {
    id: 'gig-203',
    merchantName: 'Vanguard Atelier',
    title: 'Chargeback Dispute Defense Rebuttal Dossier',
    category: 'Dispute & Chargeback Defense',
    instructions: 'A buyer opened a bank chargeback claiming "Product Not As Described" after using the leather duffle for 25 days. Draft a bulletproof representment rebuttal referencing our full-grain natural patina policy and carrier delivery receipt.',
    bounty: 65.00,
    priority: 'High',
    dueDate: 'Today by 6:00 PM',
    status: 'open'
  }
];

export const INITIAL_WALLET: UserWallet = {
  availableBalance: 428.50,
  pendingEscrow: 185.00,
  lifetimeEarnings: 1845.00,
  resolvedTicketsCount: 38,
  monitoredShipmentsCount: 29,
  optimizedListingsCount: 14,
  completedGigsCount: 9
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-901',
    date: 'Today, 11:42 AM',
    description: 'Ticket #tkt-098 Resolution Bounty — Komorebi Organics',
    type: 'ticket_bounty',
    amount: 12.00,
    status: 'completed'
  },
  {
    id: 'tx-902',
    date: 'Yesterday, 4:15 PM',
    description: 'Shipment #shp-489 Tracking & Delivery Milestone Confirmed',
    type: 'tracking_bounty',
    amount: 9.50,
    status: 'completed'
  },
  {
    id: 'tx-903',
    date: 'Yesterday, 1:20 PM',
    description: 'Listing Optimization Bounty — Vanguard Weekender Bag',
    type: 'listing_bounty',
    amount: 42.00,
    status: 'completed'
  },
  {
    id: 'tx-904',
    date: 'Oct 02, 2026',
    description: 'Withdrawal to Stripe Connect (Account ***4912)',
    type: 'withdrawal',
    amount: -450.00,
    status: 'completed'
  }
];
