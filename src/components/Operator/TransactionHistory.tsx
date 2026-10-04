import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { transactions } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            Commission Ledger & Payout History
          </h3>
          <p className="text-xs text-stone-500 font-mono">
            Itemized escrow credits and direct transfers
          </p>
        </div>
        <span className="text-xs font-mono text-stone-500">
          Total Entries: {transactions.length}
        </span>
      </div>

      <div className="divide-y divide-stone-100">
        {transactions.map((tx) => {
          const isCredit = tx.amount > 0;
          return (
            <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCredit
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-stone-100 text-stone-800'
                  }`}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-stone-900">{tx.description}</h5>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
                    <span>{tx.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>Ref: {tx.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-sm font-bold font-mono tabular-nums ${
                    isCredit ? 'text-emerald-700' : 'text-stone-900'
                  }`}
                >
                  {isCredit ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
                <span className="text-[10px] text-stone-400 block font-mono capitalize">
                  {tx.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
