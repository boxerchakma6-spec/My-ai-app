import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { MessageSquare, X, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
}

export const CustomerInquiryModal: React.FC<CustomerInquiryModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
}) => {
  const { products, createCustomerTicket } = useApp();
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [customerEmail, setCustomerEmail] = useState('s.jenkins@preview.com');
  const [orderNumber, setOrderNumber] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [productId, setProductId] = useState<string>(
    selectedProduct ? selectedProduct.id : products[0]?.id || ''
  );
  const [issueCategory, setIssueCategory] = useState<
    'Where is my order?' | 'Product Defect / Return' | 'Address Correction' | 'Pre-Purchase Question' | 'Warranty Claim'
  >('Where is my order?');
  const [priority, setPriority] = useState<import('../../types').TaskPriority>('Medium');
  const [message, setMessage] = useState(
    'Hi! I wanted to check on the delivery estimate for my order and confirm whether signature is required upon delivery.'
  );

  if (!isOpen) return null;

  const targetProd = products.find((p) => p.id === productId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    createCustomerTicket({
      customerName,
      customerEmail,
      orderNumber,
      productTitle: targetProd.title,
      productImage: targetProd.imageUrl,
      merchantName: targetProd.merchantName,
      issueCategory,
      priority,
      message,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-300 shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Buyer Support Desk</h3>
              <p className="text-xs text-stone-500 font-mono">
                Routed directly to certified remote support operators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs font-medium text-stone-900 p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                Order # (Optional)
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full text-xs font-medium text-stone-900 p-2.5 rounded-xl border border-stone-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                Product Item
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full text-xs font-medium text-stone-800 p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 truncate"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                Inquiry Topic
              </label>
              <select
                value={issueCategory}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setIssueCategory(cat);
                  if (cat === 'Address Correction' || cat === 'Product Defect / Return') {
                    setPriority('High');
                  }
                }}
                className="w-full text-xs font-medium text-stone-800 p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              >
                <option value="Where is my order?">Where is my order?</option>
                <option value="Product Defect / Return">Product Defect / Return</option>
                <option value="Address Correction">Address Correction</option>
                <option value="Pre-Purchase Question">Pre-Purchase Question</option>
                <option value="Warranty Claim">Warranty Claim</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                Urgency Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs font-semibold text-stone-800 p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              >
                <option value="High">High (Urgent)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Low">Low (Inquiry)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
              Your Message
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 leading-relaxed font-sans"
            />
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-500 font-mono">
            Submitting sends this ticket directly to the <strong>Operator Workspace</strong>, where you can solve it with AI and claim the resolution commission.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Support Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
