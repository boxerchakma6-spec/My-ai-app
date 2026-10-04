import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyPerformanceReport } from './DailyPerformanceReport';
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Package,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WalletStatsProps {
  onOpenWithdraw: () => void;
}

export const WalletStats: React.FC<WalletStatsProps> = ({ onOpenWithdraw }) => {
  const { wallet } = useApp();
  const [showReport, setShowReport] = useState(true);

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-md space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Tier 2 Verified E-Commerce Operator · 100% Escrow Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Operator Earnings & Commission Hub
          </h1>
          <p className="mt-1 text-sm text-stone-400 max-w-2xl">
            Resolve merchant customer support tickets, verify parcel tracking milestones, optimize product listings, and complete operational gigs to claim guaranteed commissions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="bg-stone-800/80 px-5 py-3.5 rounded-xl border border-stone-700/60">
            <span className="text-xs text-stone-400 block font-mono">Available Payout</span>
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              ${wallet.availableBalance.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onOpenWithdraw}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer whitespace-nowrap"
          >
            <Wallet className="w-4 h-4" />
            <span>Withdraw Balance</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-800/40 p-4 rounded-xl border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lifetime Payouts</span>
          </div>
          <p className="text-lg font-bold text-white font-mono tabular-nums">
            ${wallet.lifetimeEarnings.toFixed(2)}
          </p>
          <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
            Escrow in progress: ${wallet.pendingEscrow.toFixed(2)}
          </span>
        </div>

        <div className="bg-stone-800/40 p-4 rounded-xl border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Tickets Resolved</span>
          </div>
          <p className="text-lg font-bold text-white font-mono tabular-nums">
            {wallet.resolvedTicketsCount}
          </p>
          <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
            Avg. $8.50 / ticket
          </span>
        </div>

        <div className="bg-stone-800/40 p-4 rounded-xl border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Parcels Monitored</span>
          </div>
          <p className="text-lg font-bold text-white font-mono tabular-nums">
            {wallet.monitoredShipmentsCount}
          </p>
          <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
            Proactive carrier alerts
          </span>
        </div>

        <div className="bg-stone-800/40 p-4 rounded-xl border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Listings & Gigs</span>
          </div>
          <p className="text-lg font-bold text-white font-mono tabular-nums">
            {wallet.optimizedListingsCount + wallet.completedGigsCount}
          </p>
          <span className="text-[11px] text-stone-500 font-mono mt-0.5 block">
            AI-driven high bounties
          </span>
        </div>
      </div>

      {/* Daily Performance Report Section Header & Toggle */}
      <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>7-Day Earnings Trend Analytics (Recharts Engine)</span>
        </div>
        <button
          onClick={() => setShowReport(!showReport)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 transition-colors cursor-pointer"
        >
          <span>{showReport ? 'Hide Chart' : 'Show Chart'}</span>
          {showReport ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Embedded Daily Performance Report Line Chart */}
      {showReport && <DailyPerformanceReport />}
    </div>
  );
};

