import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
  Loader2,
  X,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

export const ListingOptimizerBoard: React.FC = () => {
  const { products, saveOptimizedProduct } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<{
    optimizedTitle?: string;
    tagline?: string;
    narrative?: string;
    featureBullets?: string[];
    suggestedRetailPrice?: number;
    estimatedAgentCommissionPerSale?: number;
    seoTags?: string[];
    targetAudience?: string;
  } | null>(null);

  const handleStartOptimization = async (product: Product) => {
    setSelectedProduct(product);
    setIsOptimizing(true);
    setOptimizedResult(null);

    try {
      const res = await fetch('/api/ai/optimize-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          category: product.category,
          rawDescription: product.description,
          basePrice: product.basePrice,
          commissionRate: product.commissionPercentage,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOptimizedResult(data.data);
      }
    } catch (err) {
      console.error('Failed to optimize product:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyAndClaim = () => {
    if (!selectedProduct || !optimizedResult) return;

    saveOptimizedProduct(selectedProduct.id, {
      title: optimizedResult.optimizedTitle || selectedProduct.title,
      tagline: optimizedResult.tagline || selectedProduct.tagline,
      description: optimizedResult.narrative || selectedProduct.description,
      featureBullets: optimizedResult.featureBullets || selectedProduct.featureBullets,
      retailPrice: optimizedResult.suggestedRetailPrice || selectedProduct.retailPrice,
      seoTags: optimizedResult.seoTags || selectedProduct.seoTags,
    });

    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Product Listing AI Optimization Board
          </h2>
          <p className="text-sm text-stone-500">
            Polish merchant product listings with Gemini AI conversion copywriting, set strategic retail margins, and claim listing bounties.
          </p>
        </div>

        <div className="text-xs text-stone-600 font-mono bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
          Catalog Listings: <strong className="text-stone-900">{products.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
              product.isOptimizedByAI
                ? 'border-stone-200 opacity-90'
                : 'border-stone-300 shadow-xs hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-stone-500">{product.category}</span>
                <span className="text-xs font-mono text-stone-600">By {product.merchantName}</span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-stone-900 leading-snug">
                    {product.title}
                  </h3>
                  {product.tagline && (
                    <p className="text-xs text-stone-600 italic line-clamp-1">{product.tagline}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs font-mono pt-1 text-stone-600">
                    <span>Base: ${product.basePrice}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-stone-900">Retail: ${product.retailPrice}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-semibold">{product.commissionPercentage}% Comm.</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200 mb-4">
                {product.description}
              </p>

              {product.seoTags && product.seoTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-stone-500 font-mono mb-4">
                  {product.seoTags.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">
                  Listing Polish Bounty
                </span>
                <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                  +${product.optimizationBounty.toFixed(2)}
                </span>
              </div>

              {product.isOptimizedByAI ? (
                <div className="flex items-center gap-1 text-xs text-purple-700 font-medium bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Optimized & Active</span>
                </div>
              ) : (
                <button
                  onClick={() => handleStartOptimization(product)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Optimize & Earn ${product.optimizationBounty.toFixed(2)}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Optimization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-mono text-stone-500">
                  Merchant: {selectedProduct.merchantName}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  AI Listing Optimization: {selectedProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isOptimizing ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-stone-500">
                <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
                <span className="text-xs font-mono">
                  Synthesizing high-converting copy, SEO search tags, and pricing strategy...
                </span>
              </div>
            ) : optimizedResult ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                    Optimized Commercial Title
                  </label>
                  <input
                    type="text"
                    value={optimizedResult.optimizedTitle || ''}
                    onChange={(e) =>
                      setOptimizedResult({ ...optimizedResult, optimizedTitle: e.target.value })
                    }
                    className="w-full text-sm font-semibold text-stone-900 p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={optimizedResult.tagline || ''}
                    onChange={(e) =>
                      setOptimizedResult({ ...optimizedResult, tagline: e.target.value })
                    }
                    className="w-full text-xs text-stone-800 p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-xs text-stone-500 font-mono block mb-1">
                      Suggested Retail Price
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-stone-900 font-mono">
                        ${optimizedResult.suggestedRetailPrice}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        (Was ${selectedProduct.retailPrice})
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                    <span className="text-xs text-emerald-800 font-mono block mb-1">
                      Your Est. Commission Per Sale
                    </span>
                    <span className="text-lg font-bold text-emerald-900 font-mono">
                      +${optimizedResult.estimatedAgentCommissionPerSale}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                    Product Narrative (Persuasive Sales Copy)
                  </label>
                  <textarea
                    value={optimizedResult.narrative || ''}
                    onChange={(e) =>
                      setOptimizedResult({ ...optimizedResult, narrative: e.target.value })
                    }
                    rows={4}
                    className="w-full text-xs text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-sans leading-relaxed"
                  />
                </div>

                {optimizedResult.featureBullets && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block">
                      Feature & Benefit Bullets
                    </label>
                    <div className="space-y-1.5">
                      {optimizedResult.featureBullets.map((bullet, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-200"
                        >
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-xs font-mono text-stone-600">
                Listing Bounty:{' '}
                <strong className="text-emerald-700 font-bold">
                  +${selectedProduct.optimizationBounty.toFixed(2)}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyAndClaim}
                  disabled={isOptimizing || !optimizedResult}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Publish & Claim ${selectedProduct.optimizationBounty.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
