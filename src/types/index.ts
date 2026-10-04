export type RoleMode = 'operator' | 'merchant' | 'storefront';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketSentiment = 'Frustrated' | 'Neutral' | 'Inquiring' | 'Urgent';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface SupportTicket {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  productImage: string;
  merchantName: string;
  issueCategory: 'Where is my order?' | 'Product Defect / Return' | 'Address Correction' | 'Pre-Purchase Question' | 'Warranty Claim';
  message: string;
  status: TicketStatus;
  priority: TaskPriority; // Priority flag for operator urgency
  dueDate: string; // Time-sensitive deadline for resolution
  bounty: number; // Commission paid to agent upon resolution
  createdAt: string;
  sentiment?: TicketSentiment;
  aiSuggestedReply?: string;
  aiRecommendedAction?: string;
  agentReply?: string;
  resolvedAt?: string;
}

export type ShipmentStatus = 'Order Placed' | 'Sorting Hub' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Carrier Delay Hold';

export interface ShipmentTracking {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productTitle: string;
  productImage: string;
  carrier: 'FedEx Express' | 'DHL Global' | 'USPS Priority' | 'YunExpress Direct';
  trackingNumber: string;
  destination: string;
  currentStatus: ShipmentStatus;
  lastScanLocation: string;
  daysInTransit: number;
  estimatedDelivery: string;
  monitoringBounty: number; // Commission agent earns for proactive tracking & delivery verification
  isVerified: boolean;
  aiDelayRisk?: 'On Track' | 'Minor Carrier Hold' | 'High Risk Stalled';
  aiCustomerNotice?: string;
  lastCustomerAlertSent?: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'Watches & Accessories' | 'Skincare & Botanicals' | 'Audio & Acoustics' | 'Leather Goods & Travel' | 'Home & Workspace';
  basePrice: number;
  retailPrice: number;
  stock: number;
  imageUrl: string;
  merchantName: string;
  commissionPercentage: number; // Commission agent earns per sale referred or monitored
  isOptimizedByAI: boolean;
  tagline?: string;
  description: string;
  featureBullets: string[];
  seoTags: string[];
  optimizationBounty: number; // Bounty agent earns for optimizing the listing
}

export type GigCategory = 'Supplier Negotiation' | 'Marketing Sequence' | 'Dispute & Chargeback Defense' | 'Operations SOP & FAQ';

export interface DelegatedGig {
  id: string;
  merchantName: string;
  title: string;
  category: GigCategory;
  instructions: string;
  bounty: number;
  priority: TaskPriority;
  dueDate: string; // Time-sensitive deadline for gig deliverable
  status: 'open' | 'in_progress' | 'completed';
  deliverable?: string;
  qualityScore?: number;
  completedAt?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'ticket_bounty' | 'tracking_bounty' | 'listing_bounty' | 'gig_bounty' | 'sale_commission' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'processing';
  referenceId?: string;
}

export interface UserWallet {
  availableBalance: number;
  pendingEscrow: number;
  lifetimeEarnings: number;
  resolvedTicketsCount: number;
  monitoredShipmentsCount: number;
  optimizedListingsCount: number;
  completedGigsCount: number;
}
