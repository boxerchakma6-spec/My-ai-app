import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DelegatedGig, TaskPriority } from '../../types';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  X,
  FileText,
  Star,
  ArrowUpDown,
  Flame,
  Clock,
} from 'lucide-react';

export const GigBoard: React.FC = () => {
  const { gigs, submitGigDeliverable } = useApp();
  const [activeGig, setActiveGig] = useState<DelegatedGig | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'bounty'>('priority');
  const [isExecuting, setIsExecuting] = useState(false);
  const [deliverableText, setDeliverableText] = useState('');
  const [executiveNotes, setExecutiveNotes] = useState('');
  const [score, setScore] = useState(98);

  const priorityScore: Record<TaskPriority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const filteredGigs = gigs
    .filter((g) => {
      if (priorityFilter !== 'all' && g.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const scoreA = priorityScore[a.priority || 'Medium'];
        const scoreB = priorityScore[b.priority || 'Medium'];
        if (scoreB !== scoreA) return scoreB - scoreA;
        return b.bounty - a.bounty;
      }
      return b.bounty - a.bounty;
    });

  const handleStartWork = async (gig: DelegatedGig) => {
    setActiveGig(gig);
    setDeliverableText(gig.deliverable || '');
    setExecutiveNotes('');

    if (gig.status === 'open') {
      setIsExecuting(true);
      try {
        const res = await fetch('/api/ai/delegate-work', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskTitle: gig.title,
            taskCategory: gig.category,
            taskInstructions: gig.instructions,
            merchantName: gig.merchantName,
            bounty: gig.bounty,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setDeliverableText(data.data.deliverable || '');
          setExecutiveNotes(data.data.executiveNotes || '');
          setScore(data.data.qualityScore || 98);
        }
      } catch (err) {
        console.error('Failed to execute work gig:', err);
      } finally {
        setIsExecuting(false);
      }
    }
  };

  const handleSubmitAndClaim = () => {
    if (!activeGig) return;
    submitGigDeliverable(activeGig.id, deliverableText, score);
    setActiveGig(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Merchant Delegation Gigs & Custom Contracts
          </h2>
          <p className="text-sm text-stone-500">
            Fulfill direct operational tasks for store owners: draft supplier contracts, VIP sequences, and dispute defenses with Gemini AI.
          </p>
        </div>

        {/* Priority Filter and Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                priorityFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Gigs
            </button>
            <button
              onClick={() => setPriorityFilter('High')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'High'
                  ? 'bg-rose-50 text-rose-800 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-rose-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              High
            </button>
            <button
              onClick={() => setPriorityFilter('Medium')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'Medium'
                  ? 'bg-amber-50 text-amber-800 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-amber-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Medium
            </button>
            <button
              onClick={() => setPriorityFilter('Low')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'Low'
                  ? 'bg-stone-200 text-stone-800 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
              Low
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-xs text-stone-500 font-mono pl-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 font-medium text-xs py-1 pr-1 cursor-pointer focus:outline-hidden"
            >
              <option value="priority">Priority (High First)</option>
              <option value="bounty">Highest Bounty</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
              gig.status === 'completed'
                ? 'border-stone-200 opacity-80'
                : gig.priority === 'High'
                ? 'border-rose-300 shadow-xs hover:border-rose-400'
                : 'border-stone-300 shadow-xs hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-stone-500">{gig.category}</span>
                {/* Priority Label */}
                {gig.priority === 'High' ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                    High Priority
                  </span>
                ) : gig.priority === 'Medium' ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Medium Priority
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    Low Priority
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono mb-2">
                <span>By {gig.merchantName}</span>
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                  Due: {gig.dueDate}
                </span>
              </div>

              <h3 className="text-base font-semibold text-stone-900 mb-2 leading-snug">
                {gig.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200 mb-4 line-clamp-4">
                "{gig.instructions}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  Contract Bounty
                </span>
                <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                  +${gig.bounty.toFixed(2)}
                </span>
              </div>

              {gig.status === 'completed' ? (
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved ({gig.qualityScore}%)</span>
                </div>
              ) : (
                <button
                  onClick={() => handleStartWork(gig)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Execute & Earn</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gig Execution Modal */}
      {activeGig && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                  <span>Contractor Task</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeGig.merchantName}</span>
                  <span aria-hidden="true">·</span>
                  <span className={activeGig.priority === 'High' ? 'text-rose-600 font-bold' : activeGig.priority === 'Medium' ? 'text-amber-600 font-semibold' : 'text-stone-500'}>
                    {activeGig.priority} Priority
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-800 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Deadline: {activeGig.dueDate}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{activeGig.title}</h3>
              </div>
              <button
                onClick={() => setActiveGig(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Instructions */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed font-sans">
              <strong className="text-stone-900 block font-mono uppercase text-[11px] mb-1">
                Client Directives:
              </strong>
              {activeGig.instructions}
            </div>

            {isExecuting ? (
              <div className="py-14 flex flex-col items-center justify-center gap-2 text-stone-500">
                <Loader2 className="w-7 h-7 animate-spin text-stone-900" />
                <span className="text-xs font-mono">
                  Synthesizing professional deliverable with Gemini AI...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {executiveNotes && (
                  <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <span>
                      <strong>Execution Strategy:</strong> {executiveNotes}
                    </span>
                    <span className="shrink-0 font-mono font-bold text-emerald-800">
                      Score: {score}%
                    </span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1.5">
                    Completed Deliverable (Ready for Merchant Delivery)
                  </label>
                  <textarea
                    value={deliverableText}
                    onChange={(e) => setDeliverableText(e.target.value)}
                    rows={8}
                    className="w-full text-xs text-stone-800 p-3.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-xs font-mono text-stone-600">
                Contract Escrow Bounty:{' '}
                <strong className="text-emerald-700 font-bold">
                  +${activeGig.bounty.toFixed(2)}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveGig(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAndClaim}
                  disabled={isExecuting || !deliverableText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Work & Claim ${activeGig.bounty.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
