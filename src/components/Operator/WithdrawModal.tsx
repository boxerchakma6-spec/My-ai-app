import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  X,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { wallet, withdrawFunds } = useApp();
  const [amount, setAmount] = useState<number>(wallet.availableBalance);
  const [method, setMethod] = useState<'stripe' | 'bank' | 'paypal' | 'wise' | 'crypto'>('stripe');
  const [accountDetails, setAccountDetails] = useState('account_acct_88921x');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    if (amount <= 0 || amount > wallet.availableBalance) return;
    setIsProcessing(true);

    setTimeout(() => {
      const methodLabels: Record<string, string> = {
        stripe: 'Stripe Express Direct Deposit',
        bank: 'ACH Direct Bank Transfer',
        paypal: 'PayPal Instant Payout',
        wise: 'Wise Multi-Currency',
        crypto: 'USDT (TRC-20 Escrow)',
      };
      withdrawFunds(amount, methodLabels[method] || method, accountDetails);
      setIsProcessing(false);
      setIsDone(true);
    }, 700);
  };

  const handleClose = () => {
    setIsDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-300 shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Request Commission Payout</h3>
              <p className="text-xs text-stone-500 font-mono">
                Instant Settlement · 0% Transfer Fee
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-stone-900">Payout Transfer Dispatched</h4>
              <p className="text-sm text-stone-600 mt-1">
                Your transfer of{' '}
                <strong className="text-stone-900 font-mono">${amount.toFixed(2)}</strong> has been
                routed to your payout method.
              </p>
              <span className="text-xs text-stone-400 font-mono mt-2 block">
                Ref ID: TX-{Math.random().toString(36).substring(2, 9).toUpperCase()}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Back to Operations
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Balance Overview Card */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-mono uppercase">
                  Available in Wallet
                </span>
                <p className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
                  ${wallet.availableBalance.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAmount(wallet.availableBalance)}
                className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Withdraw Max
              </button>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                Withdrawal Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="5"
                  max={wallet.availableBalance}
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-bold text-stone-900 pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-mono"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-1">
                {[50, 100, 250, wallet.availableBalance].map((presetVal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmount(Math.min(presetVal, wallet.availableBalance))}
                    className="text-xs font-mono text-stone-600 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    ${presetVal.toFixed(0)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Channels */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                Payout Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('stripe');
                    setAccountDetails('Stripe Express (**** 4912)');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    method === 'stripe'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold block truncate">Stripe Connect</span>
                    <span className="text-[10px] opacity-75 font-mono">Debit / Instant</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('paypal');
                    setAccountDetails('agent@operatex-ops.net');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    method === 'paypal'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <Wallet className="w-4 h-4 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold block truncate">PayPal Business</span>
                    <span className="text-[10px] opacity-75 font-mono">&lt; 1 min settlement</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('bank');
                    setAccountDetails('Chase Bank (Checking **** 8821)');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    method === 'bank'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <Building className="w-4 h-4 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold block truncate">ACH Direct Wire</span>
                    <span className="text-[10px] opacity-75 font-mono">Domestic / Intl</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('crypto');
                    setAccountDetails('0x71C...49A2 (USDT TRC20)');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    method === 'crypto'
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold block truncate">USDT Stablecoin</span>
                    <span className="text-[10px] opacity-75 font-mono">Blockchain Escrow</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Destination Account */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-stone-600 block">
                Destination Identifier
              </label>
              <input
                type="text"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="w-full text-xs text-stone-800 p-2.5 rounded-xl border border-stone-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* Bottom Security / Guarantee note */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow insured under OperateX Commerce Delegation Protocols.</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={amount <= 0 || amount > wallet.availableBalance || isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>Confirm ${amount.toFixed(2)} Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
