import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleMode,
  Product,
  SupportTicket,
  ShipmentTracking,
  DelegatedGig,
  Transaction,
  UserWallet,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_TICKETS,
  INITIAL_SHIPMENTS,
  INITIAL_GIGS,
  INITIAL_WALLET,
  INITIAL_TRANSACTIONS,
} from '../data/initialData';

interface ToastNotice {
  id: string;
  title: string;
  message: string;
  amount?: number;
  type: 'commission' | 'success' | 'info';
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  roleMode: RoleMode;
  setRoleMode: (mode: RoleMode) => void;
  products: Product[];
  tickets: SupportTicket[];
  shipments: ShipmentTracking[];
  gigs: DelegatedGig[];
  wallet: UserWallet;
  transactions: Transaction[];
  cart: CartItem[];
  toast: ToastNotice | null;
  clearToast: () => void;
  showToast: (title: string, message: string, amount?: number, type?: 'commission' | 'success' | 'info') => void;
  // Operator Actions
  resolveTicket: (ticketId: string, agentReply: string) => void;
  verifyShipment: (shipmentId: string, alertNotice?: string) => void;
  saveOptimizedProduct: (productId: string, optimizedData: Partial<Product>) => void;
  submitGigDeliverable: (gigId: string, deliverable: string, qualityScore: number) => void;
  withdrawFunds: (amount: number, method: string, accountDetails: string) => boolean;
  // Merchant Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  addGig: (gig: Omit<DelegatedGig, 'id'>) => void;
  // Storefront Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  createCustomerTicket: (
    ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'bounty' | 'dueDate'> & {
      priority?: import('../types').TaskPriority;
      dueDate?: string;
    }
  ) => void;
  processCheckout: (shippingDetails: { name: string; phone: string; address: string; city: string; paymentMethod: string }) => void;
  // Reset demo data helper
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'operatex_ai_store_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roleMode, setRoleMode] = useState<RoleMode>('operator');

  // Load from localStorage or fall back to initial data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [shipments, setShipments] = useState<ShipmentTracking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_shipments`);
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [gigs, setGigs] = useState<DelegatedGig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gigs`);
    return saved ? JSON.parse(saved) : INITIAL_GIGS;
  });

  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_wallet`);
    return saved ? JSON.parse(saved) : INITIAL_WALLET;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<ToastNotice | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_shipments`, JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wallet`, JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (
    title: string,
    message: string,
    amount?: number,
    type: 'commission' | 'success' | 'info' = 'commission'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, title, message, amount, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  // 1. Resolve Ticket & Earn Bounty
  const resolveTicket = (ticketId: string, agentReply: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const bountyEarned = ticket.bounty;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              agentReply,
              resolvedAt: 'Just now',
            }
          : t
      )
    );

    setWallet((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance + bountyEarned).toFixed(2)),
      lifetimeEarnings: Number((prev.lifetimeEarnings + bountyEarned).toFixed(2)),
      resolvedTicketsCount: prev.resolvedTicketsCount + 1,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      description: `Support Ticket #${ticket.orderNumber} Resolved — ${ticket.merchantName}`,
      type: 'ticket_bounty',
      amount: bountyEarned,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Commission Credited!',
      `Ticket #${ticket.orderNumber} resolved. $${bountyEarned.toFixed(2)} added to your wallet.`,
      bountyEarned,
      'commission'
    );
  };

  // 2. Verify Shipment & Earn Tracking Bounty
  const verifyShipment = (shipmentId: string, alertNotice?: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (!shipment) return;

    const bounty = shipment.monitoringBounty;

    setShipments((prev) =>
      prev.map((s) =>
        s.id === shipmentId
          ? {
              ...s,
              isVerified: true,
              lastCustomerAlertSent: alertNotice || 'Milestone verified with carrier',
            }
          : s
      )
    );

    setWallet((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance + bounty).toFixed(2)),
      lifetimeEarnings: Number((prev.lifetimeEarnings + bounty).toFixed(2)),
      monitoredShipmentsCount: prev.monitoredShipmentsCount + 1,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      description: `Logistics Audit & Customer Notice — Order #${shipment.orderNumber}`,
      type: 'tracking_bounty',
      amount: bounty,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Tracking Bounty Earned!',
      `Verified parcel ${shipment.trackingNumber} and alerted buyer. +$${bounty.toFixed(2)} credited.`,
      bounty,
      'commission'
    );
  };

  // 3. Optimize Product Listing
  const saveOptimizedProduct = (productId: string, optimizedData: Partial<Product>) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const bounty = product.optimizationBounty;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              ...optimizedData,
              isOptimizedByAI: true,
            }
          : p
      )
    );

    setWallet((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance + bounty).toFixed(2)),
      lifetimeEarnings: Number((prev.lifetimeEarnings + bounty).toFixed(2)),
      optimizedListingsCount: prev.optimizedListingsCount + 1,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      description: `Product Listing AI Optimization — ${product.title}`,
      type: 'listing_bounty',
      amount: bounty,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Listing Bounty Earned!',
      `AI-optimized listing published to store. +$${bounty.toFixed(2)} credited to your balance.`,
      bounty,
      'commission'
    );
  };

  // 4. Submit Delegated Gig Work
  const submitGigDeliverable = (gigId: string, deliverable: string, qualityScore: number) => {
    const gig = gigs.find((g) => g.id === gigId);
    if (!gig) return;

    const bounty = gig.bounty;

    setGigs((prev) =>
      prev.map((g) =>
        g.id === gigId
          ? {
              ...g,
              status: 'completed',
              deliverable,
              qualityScore,
              completedAt: 'Just now',
            }
          : g
      )
    );

    setWallet((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance + bounty).toFixed(2)),
      lifetimeEarnings: Number((prev.lifetimeEarnings + bounty).toFixed(2)),
      completedGigsCount: prev.completedGigsCount + 1,
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      description: `Delegated Task Bounty: ${gig.title}`,
      type: 'gig_bounty',
      amount: bounty,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Gig Bounty Paid!',
      `Work accepted by ${gig.merchantName} with score ${qualityScore}%. +$${bounty.toFixed(2)} added.`,
      bounty,
      'commission'
    );
  };

  // 5. Withdraw Funds
  const withdrawFunds = (amount: number, method: string, accountDetails: string): boolean => {
    if (amount <= 0 || amount > wallet.availableBalance) {
      return false;
    }

    setWallet((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance - amount).toFixed(2)),
    }));

    const newTx: Transaction = {
      id: `tx-wd-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      description: `Payout to ${method} (${accountDetails || 'Direct Wire'})`,
      type: 'withdrawal',
      amount: -amount,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Payout Initiated!',
      `$${amount.toFixed(2)} is being dispatched to ${method}. Transfer reference generated.`,
      undefined,
      'success'
    );
    return true;
  };

  // 6. Merchant Adds Product
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now().toString().slice(-5)}`;
    const fullProduct: Product = {
      ...newProd,
      id,
    };
    setProducts((prev) => [fullProduct, ...prev]);
    showToast('Product Uploaded!', `"${fullProduct.title}" is now active in the store catalog.`, undefined, 'success');
  };

  // 7. Merchant Adds Gig
  const addGig = (newGig: Omit<DelegatedGig, 'id'>) => {
    const id = `gig-${Date.now().toString().slice(-4)}`;
    const fullGig: DelegatedGig = {
      ...newGig,
      id,
    };
    setGigs((prev) => [fullGig, ...prev]);
    showToast('Task Posted!', `Delegated task "${fullGig.title}" is open for agents.`, undefined, 'success');
  };

  // 8. Storefront: Add to Cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast('Added to Cart', `${product.title} placed in shopping bag.`, undefined, 'info');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  // 9. Storefront: Customer submits support inquiry
  const createCustomerTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'bounty' | 'dueDate'> & {
      priority?: import('../types').TaskPriority;
      dueDate?: string;
    }
  ) => {
    const id = `tkt-${Date.now().toString().slice(-4)}`;
    const assignedPriority =
      ticketData.priority ||
      (ticketData.issueCategory === 'Address Correction' ||
      ticketData.issueCategory === 'Product Defect / Return'
        ? 'High'
        : ticketData.issueCategory === 'Pre-Purchase Question'
        ? 'Low'
        : 'Medium');

    const assignedDueDate =
      ticketData.dueDate ||
      (assignedPriority === 'High'
        ? 'Within 2 hours'
        : assignedPriority === 'Medium'
        ? 'Today by 6:00 PM'
        : 'Tomorrow by 12:00 PM');

    const calculatedBounty =
      assignedPriority === 'High' ? 12.00 : assignedPriority === 'Medium' ? 8.50 : 5.50;

    const newTicket: SupportTicket = {
      ...ticketData,
      id,
      priority: assignedPriority,
      dueDate: assignedDueDate,
      status: 'open',
      bounty: calculatedBounty,
      createdAt: 'Just now',
    };
    setTickets((prev) => [newTicket, ...prev]);
    showToast(
      'Inquiry Dispatched to Agent',
      `Your support ticket [${assignedPriority} Priority · Due: ${assignedDueDate}] has been queued.`,
      undefined,
      'info'
    );
  };

  // 10. Storefront: Checkout creates order and logistics tracking
  const processCheckout = (shippingDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: string;
  }) => {
    if (cart.length === 0) return;

    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const firstItem = cart[0].product;

    // Calculate total affiliate sales commission
    let totalSaleCommission = 0;
    cart.forEach((item) => {
      const itemCommission = (item.product.retailPrice * item.quantity * item.product.commissionPercentage) / 100;
      totalSaleCommission += itemCommission;
    });

    const newShipment: ShipmentTracking = {
      id: `shp-${Date.now().toString().slice(-4)}`,
      orderNumber: orderNum,
      customerName: shippingDetails.name,
      customerPhone: shippingDetails.phone,
      productTitle: cart.map((c) => `${c.quantity}x ${c.product.title}`).join(', '),
      productImage: firstItem.imageUrl,
      carrier: 'FedEx Express',
      trackingNumber: `FDX-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      destination: `${shippingDetails.city}, ${shippingDetails.address}`,
      currentStatus: 'Order Placed',
      lastScanLocation: 'Merchant Fulfillment Warehouse, Direct Dock',
      daysInTransit: 0,
      estimatedDelivery: 'Oct 08, 2026',
      monitoringBounty: 8.00,
      isVerified: false,
    };

    setShipments((prev) => [newShipment, ...prev]);

    // Give operator sales commission on the order
    setWallet((prev) => ({
      ...prev,
      availableBalance: Number((prev.availableBalance + totalSaleCommission).toFixed(2)),
      lifetimeEarnings: Number((prev.lifetimeEarnings + totalSaleCommission).toFixed(2)),
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      description: `Sales Commission on Order #${orderNum} (${cart.length} item${cart.length > 1 ? 's' : ''})`,
      type: 'sale_commission',
      amount: Number(totalSaleCommission.toFixed(2)),
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);
    clearCart();

    showToast(
      'Order Confirmed & Commission Earned!',
      `Order #${orderNum} placed! You earned $${totalSaleCommission.toFixed(2)} sales commission + parcel tracking assigned!`,
      totalSaleCommission,
      'commission'
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_products`);
    localStorage.removeItem(`${STORAGE_KEY}_tickets`);
    localStorage.removeItem(`${STORAGE_KEY}_shipments`);
    localStorage.removeItem(`${STORAGE_KEY}_gigs`);
    localStorage.removeItem(`${STORAGE_KEY}_wallet`);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);

    setProducts(INITIAL_PRODUCTS);
    setTickets(INITIAL_TICKETS);
    setShipments(INITIAL_SHIPMENTS);
    setGigs(INITIAL_GIGS);
    setWallet(INITIAL_WALLET);
    setTransactions(INITIAL_TRANSACTIONS);
    setCart([]);
    showToast('Data Reset', 'Default test products, tickets, and shipments restored.', undefined, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        roleMode,
        setRoleMode,
        products,
        tickets,
        shipments,
        gigs,
        wallet,
        transactions,
        cart,
        toast,
        clearToast,
        showToast,
        resolveTicket,
        verifyShipment,
        saveOptimizedProduct,
        submitGigDeliverable,
        withdrawFunds,
        addProduct,
        addGig,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createCustomerTicket,
        processCheckout,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
