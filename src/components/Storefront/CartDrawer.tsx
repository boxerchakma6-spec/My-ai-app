import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, processCheckout } = useApp();

  const [name, setName] = useState('Alexander Wright');
  const [phone, setPhone] = useState('+1 (555) 349-8812');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Portland, OR 97201');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.retailPrice * item.quantity,
    0
  );

  const totalCommission = cart.reduce(
    (acc, item) =>
      acc + (item.product.retailPrice * item.quantity * item.product.commissionPercentage) / 100,
    0
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    processCheckout({
      name,
      phone,
      address,
      city,
      paymentMethod: 'Credit Card (Escrow)',
    });

    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white max-w-md w-full h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h3 className="text-base font-bold text-stone-900">Your Shopping Bag</h3>
              <span className="text-xs font-mono text-stone-400">
                ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-900">Your shopping bag is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore the curated merchant storefront and add products to test the order lifecycle.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">
                      {item.product.title}
                    </h5>
                    <span className="text-[11px] text-stone-500 font-mono block">
                      ${item.product.retailPrice} each · {item.product.commissionPercentage}% Comm.
                    </span>

                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-stone-900 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-stone-900 font-mono block">
                      ${(item.product.retailPrice * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-red-600 mt-2 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Commission Incentive Bar */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <strong>Affiliate Commission:</strong>
                </span>
                <span className="font-mono font-bold text-emerald-800 tabular-nums">
                  +${totalCommission.toFixed(2)} to Operator
                </span>
              </div>
            </div>
          )}

          {/* Checkout Details Form */}
          {cart.length > 0 && isCheckingOut && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2 border-t border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                Shipping Destination (Creates Live Logistics Tracking)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 font-mono block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-mono block">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-mono block">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-mono block">City & Postal Code</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 font-sans"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer with Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600 font-mono">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Courier Shipping</span>
                <span className="text-emerald-700 font-medium">Free</span>
              </div>
            </div>

            {isCheckingOut ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="px-3 py-2.5 text-xs font-medium text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>Confirm Order (${subtotal.toFixed(2)})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCheckingOut(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
