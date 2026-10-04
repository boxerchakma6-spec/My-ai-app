import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TaskPriority } from '../../types';
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  X,
  ExternalLink,
  ArrowUpDown,
  Flame,
} from 'lucide-react';

export const SupportBoard: React.FC = () => {
  const { tickets, resolveTicket } = useApp();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'bounty' | 'newest'>('priority');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [aiInsight, setAiInsight] = useState<{
    sentiment?: string;
    confidence?: number;
    action?: string;
    internalSummary?: string;
  } | null>(null);

  const priorityScore: Record<TaskPriority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const filteredTickets = tickets
    .filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const scoreA = priorityScore[a.priority || 'Medium'];
        const scoreB = priorityScore[b.priority || 'Medium'];
        if (scoreB !== scoreA) return scoreB - scoreA;
        return b.bounty - a.bounty;
      }
      if (sortBy === 'bounty') {
        return b.bounty - a.bounty;
      }
      return 0;
    });

  const handleOpenCopilot = async (ticket: SupportTicket) => {
    setActiveTicket(ticket);
    setEditedReply(ticket.agentReply || '');
    setAiInsight(null);

    if (ticket.status === 'open') {
      setIsGenerating(true);
      try {
        const res = await fetch('/api/ai/support-copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: ticket.customerName,
            customerQuery: ticket.message,
            productTitle: ticket.productTitle,
            orderNumber: ticket.orderNumber,
            ticketType: ticket.issueCategory,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setEditedReply(data.data.customerResponse || '');
          setAiInsight({
            sentiment: data.data.sentiment,
            confidence: data.data.resolutionConfidence,
            action: data.data.recommendedAction,
            internalSummary: data.data.internalSummary,
          });
        }
      } catch (err) {
        console.error('Failed to invoke AI copilot:', err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleRegenerateWithTone = async (tone: string) => {
    if (!activeTicket) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/support-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: activeTicket.customerName,
          customerQuery: `${activeTicket.message} (Please adjust response tone: ${tone})`,
          productTitle: activeTicket.productTitle,
          orderNumber: activeTicket.orderNumber,
          ticketType: activeTicket.issueCategory,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEditedReply(data.data.customerResponse || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendAndClaim = () => {
    if (!activeTicket) return;
    resolveTicket(activeTicket.id, editedReply);
    setActiveTicket(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Customer Support Tickets Queue
          </h2>
          <p className="text-sm text-stone-500">
            Represent partner merchants, resolve customer inquiries with Gemini AI, and earn commissions per closed ticket.
          </p>
        </div>

        {/* Filter Tabs & Priority Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'open'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pending ({tickets.filter((t) => t.status === 'open').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'resolved'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Resolved ({tickets.filter((t) => t.status === 'resolved').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                priorityFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Priorities
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
              <option value="priority">Sort: Urgent Priority First</option>
              <option value="bounty">Sort: Highest Bounty</option>
              <option value="newest">Sort: Default Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-base font-medium text-stone-900">No tickets matching selected filters</p>
            <p className="text-xs text-stone-500 mt-1">
              Adjust your status or priority filter to view more tickets.
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                ticket.status === 'resolved'
                  ? 'border-stone-200 opacity-80'
                  : ticket.priority === 'High'
                  ? 'border-rose-300 shadow-xs hover:border-rose-400'
                  : 'border-stone-300 shadow-xs hover:border-amber-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={ticket.productImage}
                      alt={ticket.productTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono mb-1">
                      {/* Priority Flag */}
                      {ticket.priority === 'High' ? (
                        <span className="flex items-center gap-1 font-bold text-rose-700 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                          High Priority
                        </span>
                      ) : ticket.priority === 'Medium' ? (
                        <span className="flex items-center gap-1 font-semibold text-amber-700 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Medium Priority
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-stone-500 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                          Low Priority
                        </span>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-stone-800 font-semibold font-mono">
                        <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                        Due: {ticket.dueDate}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Order {ticket.orderNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{ticket.merchantName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{ticket.createdAt}</span>
                    </div>

                    <h3 className="text-base font-semibold text-stone-900">
                      {ticket.customerName}
                    </h3>
                    <p className="text-xs font-medium text-amber-800 mt-0.5">
                      Issue: {ticket.issueCategory}
                    </p>
                    <p className="text-sm text-stone-700 mt-2 bg-stone-50 p-3 rounded-lg border border-stone-200 italic">
                      "{ticket.message}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-500 uppercase font-mono block">
                      Resolution Bounty
                    </span>
                    <span className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                      +${ticket.bounty.toFixed(2)}
                    </span>
                  </div>

                  {ticket.status === 'open' ? (
                    <button
                      onClick={() => handleOpenCopilot(ticket)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Solve with AI Copilot</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolved & Commission Paid</span>
                    </div>
                  )}
                </div>
              </div>

              {ticket.status === 'resolved' && ticket.agentReply && (
                <div className="mt-4 pt-4 border-t border-stone-100 pl-4 border-l-2 border-l-emerald-500">
                  <span className="text-xs font-medium text-stone-500 block mb-1">
                    Your Sent Customer Resolution:
                  </span>
                  <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                    {ticket.agentReply}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Resolution Modal / Drawer */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                  <span>Ticket {activeTicket.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTicket.merchantName}</span>
                  <span aria-hidden="true">·</span>
                  <span className={activeTicket.priority === 'High' ? 'text-rose-600 font-bold' : activeTicket.priority === 'Medium' ? 'text-amber-600 font-semibold' : 'text-stone-500'}>
                    {activeTicket.priority} Priority
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-800 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Deadline: {activeTicket.dueDate}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  AI Support Copilot: {activeTicket.customerName}
                </h3>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Message Context */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1.5">
                <span>Inquiry on {activeTicket.productTitle}</span>
                <span className="text-stone-700 font-semibold">{activeTicket.issueCategory}</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed italic">
                "{activeTicket.message}"
              </p>
            </div>

            {/* AI Insights Bar */}
            {aiInsight && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Gemini AI Resolution Confidence: {aiInsight.confidence}%
                  </span>
                  <span className="text-stone-600">
                    Detected Sentiment: <strong className="text-stone-900">{aiInsight.sentiment}</strong>
                  </span>
                </div>
                <p className="text-xs text-amber-900">
                  <strong>Recommended Strategy:</strong> {aiInsight.action}
                </p>
              </div>
            )}

            {/* Response Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono">
                  Customer Reply Draft
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-400 mr-1 hidden sm:inline">Tone:</span>
                  <button
                    type="button"
                    onClick={() => handleRegenerateWithTone('Warm, reassuring, and highly apologetic')}
                    disabled={isGenerating}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Warm Reassurance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegenerateWithTone('Executive, brief, and action-oriented')}
                    disabled={isGenerating}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Direct Action
                  </button>
                </div>
              </div>

              {isGenerating ? (
                <div className="h-44 bg-stone-50 border border-stone-200 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-500">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                  <span className="text-xs font-mono">Generating policy-compliant resolution...</span>
                </div>
              ) : (
                <textarea
                  value={editedReply}
                  onChange={(e) => setEditedReply(e.target.value)}
                  rows={6}
                  className="w-full text-sm text-stone-800 p-3.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-sans leading-relaxed"
                  placeholder="Draft your customer response..."
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-mono">Guaranteed Commission:</span>
                <span className="text-base font-bold text-emerald-700 font-mono tabular-nums">
                  +${activeTicket.bounty.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendAndClaim}
                  disabled={!editedReply.trim() || isGenerating}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send & Claim ${activeTicket.bounty.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
