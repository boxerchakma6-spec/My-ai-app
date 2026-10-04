import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShipmentTracking } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Send,
  Loader2,
  X,
  ExternalLink,
  MapPin,
} from 'lucide-react';

export const TrackingBoard: React.FC = () => {
  const { shipments, verifyShipment } = useApp();
  const [activeShipment, setActiveShipment] = useState<ShipmentTracking | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    humanSummary?: string;
    delayRisk?: string;
    estimatedDeliveryDays?: number;
    customerNotice?: string;
    agentActionPlan?: string;
  } | null>(null);
  const [editedNotice, setEditedNotice] = useState('');

  const handleOpenAudit = async (shipment: ShipmentTracking) => {
    setActiveShipment(shipment);
    setIsAuditing(true);
    setAuditResult(null);

    try {
      const res = await fetch('/api/ai/track-shipment-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber: shipment.trackingNumber,
          carrier: shipment.carrier,
          status: shipment.currentStatus,
          destination: shipment.destination,
          lastScanLocation: shipment.lastScanLocation,
          daysInTransit: shipment.daysInTransit,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAuditResult(data.data);
        setEditedNotice(data.data.customerNotice || '');
      }
    } catch (err) {
      console.error('Failed to audit tracking:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleConfirmAndClaim = () => {
    if (!activeShipment) return;
    verifyShipment(activeShipment.id, editedNotice);
    setActiveShipment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Order Fulfillment & Logistics Watch
          </h2>
          <p className="text-sm text-stone-500">
            Track outbound customer parcels, run AI delay risk audits, proactively notify buyers, and claim monitoring commissions.
          </p>
        </div>

        <div className="text-xs text-stone-600 font-mono bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
          Active Shipments: <strong className="text-stone-900">{shipments.length}</strong>
        </div>
      </div>

      {/* Shipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shipments.map((shipment) => (
          <div
            key={shipment.id}
            className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
              shipment.isVerified
                ? 'border-stone-200 opacity-85'
                : 'border-stone-300 shadow-xs hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-stone-500">
                  {shipment.carrier}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    shipment.currentStatus === 'Carrier Delay Hold'
                      ? 'text-amber-700'
                      : shipment.currentStatus === 'Out for Delivery'
                      ? 'text-blue-700'
                      : 'text-stone-700'
                  }`}
                >
                  {shipment.currentStatus}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={shipment.productImage}
                    alt={shipment.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                    {shipment.productTitle}
                  </h4>
                  <p className="text-xs text-stone-500 font-mono">
                    Order {shipment.orderNumber} · {shipment.customerName}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200 font-mono mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Tracking:</span>
                  <span className="font-semibold text-stone-900">{shipment.trackingNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Destination:</span>
                  <span className="text-stone-800 truncate max-w-[170px]">{shipment.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Last Scan:</span>
                  <span className="text-stone-800 truncate max-w-[170px]">{shipment.lastScanLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Transit Days:</span>
                  <span className="text-stone-900">{shipment.daysInTransit} days</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  Monitoring Commission
                </span>
                <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                  +${shipment.monitoringBounty.toFixed(2)}
                </span>
              </div>

              {shipment.isVerified ? (
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified & Paid</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenAudit(shipment)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audit & Claim</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logistics Audit Modal */}
      {activeShipment && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-300 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-mono text-stone-500">
                  Carrier Inspection: {activeShipment.carrier}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  Logistics Audit: #{activeShipment.trackingNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveShipment(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAuditing ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-stone-500">
                <Loader2 className="w-7 h-7 animate-spin text-stone-900" />
                <span className="text-xs font-mono">Running Gemini carrier route & delay audit...</span>
              </div>
            ) : auditResult ? (
              <div className="space-y-4">
                {/* Risk Badge & Summary */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-500">Calculated Delay Risk</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        auditResult.delayRisk === 'High Risk Stalled'
                          ? 'bg-red-100 text-red-800'
                          : auditResult.delayRisk === 'Minor Carrier Hold'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {auditResult.delayRisk}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {auditResult.humanSummary}
                  </p>
                </div>

                {/* Proactive Customer Message */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1.5">
                    Proactive Customer Reassurance Notice (Prevents Inquiries & Disputes)
                  </label>
                  <textarea
                    value={editedNotice}
                    onChange={(e) => setEditedNotice(e.target.value)}
                    rows={4}
                    className="w-full text-xs text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-sans leading-relaxed"
                  />
                </div>

                {auditResult.agentActionPlan && (
                  <div className="text-[11px] text-stone-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                    <strong className="text-amber-900">Operator Protocol:</strong> {auditResult.agentActionPlan}
                  </div>
                )}
              </div>
            ) : null}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-xs font-mono text-stone-600">
                Reward: <strong className="text-emerald-700 font-bold">+${activeShipment.monitoringBounty.toFixed(2)}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveShipment(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndClaim}
                  disabled={isAuditing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notice & Claim ${activeShipment.monitoringBounty.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
