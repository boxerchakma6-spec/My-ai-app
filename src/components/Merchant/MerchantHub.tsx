import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, DelegatedGig, GigCategory } from '../../types';
import {
  Upload,
  PlusCircle,
  Package,
  Briefcase,
  DollarSign,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const MerchantHub: React.FC = () => {
  const { products, addProduct, gigs, addGig, setRoleMode } = useApp();
  const [activeTab, setActiveTab] = useState<'upload' | 'post_task' | 'catalog'>('upload');

  // New Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('Watches & Accessories');
  const [basePrice, setBasePrice] = useState(85);
  const [retailPrice, setRetailPrice] = useState(165);
  const [stock, setStock] = useState(30);
  const [merchantName, setMerchantName] = useState('Nordic Craft Studio');
  const [commissionPercentage, setCommissionPercentage] = useState(15);
  const [optimizationBounty, setOptimizationBounty] = useState(30);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/product_minimalist_watch_1791143810831.jpg');

  // Pre-configured stock studio photography choices for merchant convenience
  const PHOTO_PRESETS = [
    { label: 'Titanium Timepiece', url: '/src/assets/images/product_minimalist_watch_1791143810831.jpg' },
    { label: 'Botanical Skincare', url: '/src/assets/images/product_amber_skincare_1791143825359.jpg' },
    { label: 'Studio Wireless ANC', url: '/src/assets/images/product_wireless_headphones_1791143836957.jpg' },
    { label: 'Tuscan Leather Bag', url: '/src/assets/images/product_leather_bag_1791143847753.jpg' },
  ];

  // New Gig Form State
  const [gigTitle, setGigTitle] = useState('');
  const [gigCategory, setGigCategory] = useState<GigCategory>('Supplier Negotiation');
  const [gigInstructions, setGigInstructions] = useState('');
  const [gigBounty, setGigBounty] = useState(50);
  const [gigPriority, setGigPriority] = useState<import('../../types').TaskPriority>('Medium');
  const [gigDueDate, setGigDueDate] = useState('In 48 hours');
  const [gigMerchant, setGigMerchant] = useState('Nordic Craft Studio');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProduct({
      title,
      category,
      basePrice: Number(basePrice),
      retailPrice: Number(retailPrice),
      stock: Number(stock),
      imageUrl,
      merchantName,
      commissionPercentage: Number(commissionPercentage),
      optimizationBounty: Number(optimizationBounty),
      isOptimizedByAI: false,
      tagline: 'Precision curated craftsmanship.',
      description: description || 'High-durability materials crafted with minimalist design sensibilities.',
      featureBullets: [
        'Direct Merchant Sourcing: No unnecessary middleman markups.',
        'Rigorous Quality Testing: Inspected and verified before warehouse dispatch.',
        'Discreet Premium Finish: Understated aesthetic built for daily longevity.',
        'Comprehensive Warranty: Backed by our standard 1-year merchant protection.'
      ],
      seoTags: ['Direct to Consumer', 'Curated Quality', 'Modern Design']
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setActiveTab('catalog');
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle.trim() || !gigInstructions.trim()) return;

    addGig({
      merchantName: gigMerchant,
      title: gigTitle,
      category: gigCategory,
      instructions: gigInstructions,
      bounty: Number(gigBounty),
      priority: gigPriority,
      dueDate: gigDueDate || 'In 48 hours',
      status: 'open',
    });

    setGigTitle('');
    setGigInstructions('');
    setActiveTab('catalog');
  };

  return (
    <div className="space-y-6">
      {/* Merchant Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-mono uppercase tracking-wider block mb-1">
              Store Owner & Merchant Portal
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Product Upload & Operational Delegation
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Upload your merchandise, define agent commission rates, and delegate customer support, shipment audits, and operational tasks to certified remote operators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              Upload Product
            </button>
            <button
              onClick={() => setActiveTab('post_task')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'post_task'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              Post Delegate Gig
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              Active Catalog ({products.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Upload Product Form */}
      {activeTab === 'upload' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900">List New Product for Sale & Agent Commission</h2>
            <p className="text-xs text-stone-500">
              When you list a product, operators can sell it for commissions, polish the listing with Gemini AI, and handle customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Ceramic Dripper Carafe"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm font-medium text-stone-900 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs font-medium text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="Watches & Accessories">Watches & Accessories</option>
                    <option value="Skincare & Botanicals">Skincare & Botanicals</option>
                    <option value="Audio & Acoustics">Audio & Acoustics</option>
                    <option value="Leather Goods & Travel">Leather Goods & Travel</option>
                    <option value="Home & Workspace">Home & Workspace</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Merchant / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="w-full text-xs font-medium text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                  Raw Description / Manufacturer Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter initial rough details (e.g. material, weight, intended audience). The operator can use AI to optimize this."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Base Cost ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full text-sm font-bold text-stone-900 p-3 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(Number(e.target.value))}
                    className="w-full text-sm font-bold text-stone-900 p-3 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full text-sm font-bold text-stone-900 p-3 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              {/* Commission Incentive Parameters */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-mono block">
                  Agent Incentives & Bounties
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">
                      Sale Commission Rate
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={commissionPercentage}
                        onChange={(e) => setCommissionPercentage(Number(e.target.value))}
                        className="w-20 text-xs font-bold text-stone-900 p-2 rounded-lg border border-stone-300 font-mono bg-white"
                      />
                      <span className="text-xs font-bold text-stone-700">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-600 block mb-1">
                      Listing Polish Bounty ($)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={optimizationBounty}
                      onChange={(e) => setOptimizationBounty(Number(e.target.value))}
                      className="w-24 text-xs font-bold text-stone-900 p-2 rounded-lg border border-stone-300 font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Product Visual Asset Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1.5">
                  Select Visual Showcase
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        imageUrl === preset.url
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>List Product & Activate Operator Commissions</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Post Delegation Gig Form */}
      {activeTab === 'post_task' && (
        <form onSubmit={handleCreateGig} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900">Delegate Operations Task / Gig to Remote Agent</h2>
            <p className="text-xs text-stone-500">
              Need supplier price negotiation, dispute resolution, or VIP email campaigns? Post an escrow bounty for an agent to fulfill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                  Task / Contract Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Draft Supplier Counter-Offer for Q4 Inventory Batch"
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  className="w-full text-sm font-medium text-stone-900 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Category
                  </label>
                  <select
                    value={gigCategory}
                    onChange={(e) => setGigCategory(e.target.value as GigCategory)}
                    className="w-full text-xs font-medium text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="Supplier Negotiation">Supplier Negotiation</option>
                    <option value="Marketing Sequence">Marketing Sequence</option>
                    <option value="Dispute & Chargeback Defense">Dispute & Chargeback Defense</option>
                    <option value="Operations SOP & FAQ">Operations SOP & FAQ</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Escrow Bounty ($)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="500"
                    value={gigBounty}
                    onChange={(e) => setGigBounty(Number(e.target.value))}
                    className="w-full text-sm font-bold text-stone-900 p-3 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                    Priority
                  </label>
                  <select
                    value={gigPriority}
                    onChange={(e) => setGigPriority(e.target.value as any)}
                    className="w-full text-xs font-semibold text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="High">High Priority (Urgent)</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                  Completion Deadline / Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Today by 6:00 PM or In 48 hours"
                  value={gigDueDate}
                  onChange={(e) => setGigDueDate(e.target.value)}
                  className="w-full text-xs font-medium text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 font-mono block mb-1">
                Detailed Directives & Desired Outcome
              </label>
              <textarea
                rows={6}
                required
                placeholder="Specify requirements, constraints, tone, and deliverables for the agent..."
                value={gigInstructions}
                onChange={(e) => setGigInstructions(e.target.value)}
                className="w-full text-xs text-stone-800 p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900 leading-relaxed font-sans"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Post Gig to Operator Board (${gigBounty} Escrow)</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Active Catalog Overview */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">Your Merchant Product Catalog</h3>
              <p className="text-xs text-stone-500 font-mono">
                Products currently active for sales commissions and AI optimizations
              </p>
            </div>
            <button
              onClick={() => setRoleMode('storefront')}
              className="text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              View in Live Storefront &rarr;
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span>{p.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Stock: {p.stock}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5">{p.title}</h4>
                    <span className="text-xs text-stone-600 font-mono">
                      Retail: ${p.retailPrice} · Agent Comm: {p.commissionPercentage}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {p.isOptimizedByAI ? (
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                      AI Optimized Listing
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      ${p.optimizationBounty} Polish Bounty Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
