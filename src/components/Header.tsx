import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWA/PWAInstallButton';
import { ShoppingBag, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenWithdraw: () => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWithdraw, onOpenCart }) => {
  const { roleMode, setRoleMode, wallet, cart, resetDemoData } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setRoleMode('operator')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
              OperateX
            </span>
          </button>
          <span className="hidden sm:inline-flex items-center text-xs text-stone-400 font-mono uppercase tracking-wider">
            Commerce Ops
          </span>
        </div>

        {/* Zone 2: Clean 3-Option Role Navigation */}
        <nav className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200">
          <button
            onClick={() => setRoleMode('operator')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              roleMode === 'operator'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Operator Workspace
          </button>
          <button
            onClick={() => setRoleMode('merchant')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              roleMode === 'merchant'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Merchant Hub
          </button>
          <button
            onClick={() => setRoleMode('storefront')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              roleMode === 'storefront'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Live Storefront
          </button>
        </nav>

        {/* Zone 3: Install App, Wallet / Payout Action & Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <PWAInstallButton />

          <button
            onClick={resetDemoData}
            title="Reset sample data"
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {roleMode === 'storefront' ? (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="font-mono tabular-nums text-xs bg-stone-900 text-white px-1.5 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[11px] text-stone-500 uppercase tracking-wider font-mono">
                  Wallet Balance
                </span>
                <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                  ${wallet.availableBalance.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onOpenWithdraw}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Payout</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
