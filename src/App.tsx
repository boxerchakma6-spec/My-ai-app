import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WalletStats } from './components/Operator/WalletStats';
import { SupportBoard } from './components/Operator/SupportBoard';
import { TrackingBoard } from './components/Operator/TrackingBoard';
import { ListingOptimizerBoard } from './components/Operator/ListingOptimizerBoard';
import { GigBoard } from './components/Operator/GigBoard';
import { TransactionHistory } from './components/Operator/TransactionHistory';
import { MerchantHub } from './components/Merchant/MerchantHub';
import { Storefront } from './components/Storefront/Storefront';
import { WithdrawModal } from './components/Operator/WithdrawModal';
import { CartDrawer } from './components/Storefront/CartDrawer';
import { NotificationToast } from './components/NotificationToast';
import {
  MessageSquare,
  Package,
  Sparkles,
  Briefcase,
  History,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

type OperatorTab = 'support' | 'tracking' | 'optimizer' | 'gigs' | 'ledger';

const AppContent: React.FC = () => {
  const { roleMode, tickets, shipments, products, gigs } = useApp();
  const [operatorTab, setOperatorTab] = useState<OperatorTab>('support');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;
  const unverifiedShipmentsCount = shipments.filter((s) => !s.isVerified).length;
  const pendingOptimizationsCount = products.filter((p) => !p.isOptimizedByAI).length;
  const openGigsCount = gigs.filter((g) => g.status === 'open').length;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 font-sans flex flex-col selection:bg-amber-200">
      {/* 3-Zone Navigation Header */}
      <Header
        onOpenWithdraw={() => setWithdrawModalOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {roleMode === 'operator' && (
          <div className="space-y-8">
            {/* Financial Overview & Command Center */}
            <WalletStats onOpenWithdraw={() => setWithdrawModalOpen(true)} />

            {/* Operator Workstream Segmented Tab Controls */}
            <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl border border-stone-300/80 overflow-x-auto">
              <button
                onClick={() => setOperatorTab('support')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  operatorTab === 'support'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Customer Support Copilot</span>
                {openTicketsCount > 0 && (
                  <span className="font-mono text-[10px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.5 rounded-full">
                    {openTicketsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOperatorTab('tracking')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  operatorTab === 'tracking'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>Logistics & Order Tracking</span>
                {unverifiedShipmentsCount > 0 && (
                  <span className="font-mono text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full">
                    {unverifiedShipmentsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOperatorTab('optimizer')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  operatorTab === 'optimizer'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Listing Optimizer</span>
                {pendingOptimizationsCount > 0 && (
                  <span className="font-mono text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-full">
                    {pendingOptimizationsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOperatorTab('gigs')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  operatorTab === 'gigs'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Merchant Gigs</span>
                {openGigsCount > 0 && (
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                    {openGigsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setOperatorTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  operatorTab === 'ledger'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <History className="w-4 h-4 text-stone-500" />
                <span>Earnings Ledger</span>
              </button>
            </div>

            {/* Workstream Board Panels */}
            {operatorTab === 'support' && <SupportBoard />}
            {operatorTab === 'tracking' && <TrackingBoard />}
            {operatorTab === 'optimizer' && <ListingOptimizerBoard />}
            {operatorTab === 'gigs' && <GigBoard />}
            {operatorTab === 'ledger' && <TransactionHistory />}
          </div>
        )}

        {roleMode === 'merchant' && <MerchantHub />}

        {roleMode === 'storefront' && <Storefront />}
      </main>

      {/* Global Modals & Drawers */}
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      {/* Instant Celebratory Commission Toast */}
      <NotificationToast />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">OperateX AI</span>
            <span>·</span>
            <span>Decentralized E-Commerce Delegation & Remote Operations</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400 font-mono">
            <span>Server Gemini 3.8 AI Copilot Active</span>
            <span>·</span>
            <span>All Bounties Escrow-Guaranteed</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
