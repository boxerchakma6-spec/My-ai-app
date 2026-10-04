import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { CustomerInquiryModal } from './CustomerInquiryModal';
import {
  ShoppingBag,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Truck,
  ArrowRight,
  Eye,
  X,
  Plus,
} from 'lucide-react';

export const Storefront: React.FC = () => {
  const { products, addToCart, setRoleMode } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const categories = ['All', 'Watches & Accessories', 'Skincare & Botanicals', 'Audio & Acoustics', 'Leather Goods & Travel'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const handleOpenInquiry = (product?: Product) => {
    setInquiryProduct(product || null);
    setInquiryModalOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* 1. Storefront Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-stone-900 text-white border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono uppercase tracking-wider mb-3">
                <span>Curated Merchant Storefront</span>
                <span aria-hidden="true">·</span>
                <span>Autumn Collection 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight max-w-xl">
                Precision Goods Powered by Independent Artisans.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed">
                Direct-from-maker timepieces, botanical skincare, acoustic studio hardware, and full-grain travel gear. Supported 24/7 by dedicated AI-assisted remote customer specialists.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <a
                href="#catalog-grid"
                className="px-6 py-3 bg-white text-stone-950 text-xs font-semibold rounded-xl hover:bg-stone-100 transition-colors shadow-sm"
              >
                Explore Collection
              </a>
              <button
                onClick={() => handleOpenInquiry()}
                className="flex items-center gap-2 px-5 py-3 bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Contact Support Desk</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_merchant_operations_1791143793893.jpg"
              alt="Curated merchant studio workspace"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-900 via-stone-900/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* 2. Interactive Category Filter Bar */}
      <section id="catalog-grid" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Featured Merchandise Collection
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Every purchase triggers instant sales commission & courier tracking milestones
            </p>
          </div>

          {/* Clean Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-400 overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div>
                {/* Product Image Slot (65-75% visual dominance) */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  {product.isOptimizedByAI && (
                    <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-mono px-2 py-0.5 rounded shadow-xs">
                      AI Optimized
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                    <span className="truncate max-w-[140px]">{product.category}</span>
                    <span className="text-stone-600">{product.merchantName}</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-amber-900 transition-colors">
                    {product.title}
                  </h3>

                  {product.tagline && (
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      ${product.retailPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono font-medium">
                      {product.commissionPercentage}% Affiliate Comm.
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewProduct(product)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenInquiry(product)}
                  className="w-full text-center text-[11px] text-stone-500 hover:text-stone-900 font-mono py-1 cursor-pointer transition-colors block"
                >
                  Ask Customer Support &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Support Guarantee & Operator Dispatch Callout */}
      <section className="bg-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              OperateX Buyer Guarantee & Remote Support Escrow
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
              Every parcel is monitored with live tracking by certified freelance operators. Need an address update, shipping status, or product specification? Our operators reply in under 15 minutes.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenInquiry()}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Open Support Inquiry Ticket</span>
        </button>
      </section>

      {/* 5. Product Quick View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-mono text-stone-500">
                  {viewProduct.category} · {viewProduct.merchantName}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">{viewProduct.title}</h3>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-xl overflow-hidden bg-stone-100 aspect-4/3 border border-stone-200">
                <img
                  src={viewProduct.imageUrl}
                  alt={viewProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-2xl font-bold text-stone-900 font-mono">
                    ${viewProduct.retailPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-stone-400 font-mono block mt-0.5">
                    Stock Available: {viewProduct.stock} units
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  {viewProduct.description}
                </p>

                {viewProduct.featureBullets && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold font-mono uppercase text-stone-600 block">
                      Key Highlights:
                    </span>
                    {viewProduct.featureBullets.map((bullet, idx) => (
                      <p key={idx} className="text-[11px] text-stone-600 leading-normal">
                        • {bullet}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  handleOpenInquiry(viewProduct);
                  setViewProduct(null);
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-mono flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Support About This</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart(viewProduct);
                  setViewProduct(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <CustomerInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        selectedProduct={inquiryProduct}
      />
    </div>
  );
};
