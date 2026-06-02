'use client';
import React from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import { CulturXData, Product } from '@/lib/initialData';

interface ProductsTabProps {
  siteData: CulturXData;
  handleOpenProductModal: (prod?: Product) => void;
  onDeleteProduct: (id: string) => void;
  showToast: (msg: string) => void;
  productModalOpen: boolean;
  setProductModalOpen: (open: boolean) => void;
  editingProduct: Product | null;
  productForm: any;
  setProductForm: (form: any) => void;
  handleProductFormSubmit: (e: React.FormEvent) => void;
  isDragActive: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewProductSeo?: (prod: Product) => void;
}

export default function ProductsTab({
  siteData,
  handleOpenProductModal,
  onDeleteProduct,
  showToast,
  productModalOpen,
  setProductModalOpen,
  editingProduct,
  productForm,
  setProductForm,
  handleProductFormSubmit,
  isDragActive,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleImageFileChange,
  onViewProductSeo
}: ProductsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">Optimization Catalog</h2>
          <p className="text-xs text-slate-500 font-mono">Create, update pricing, SKU descriptors, and toggle launch items.</p>
        </div>
        <button
          onClick={() => handleOpenProductModal()}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider hover:bg-indigo-700 flex items-center space-x-2 w-fit cursor-pointer shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Configure New Product</span>
        </button>
      </div>

      {/* PRODUCTS LIST TABLE */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-bold">Item Description</th>
              <th className="py-3 px-4 font-bold">Category</th>
              <th className="py-3 px-4 font-bold">SKU Code</th>
              <th className="py-3 px-4 font-bold">Valuation price</th>
              <th className="py-3 px-4 font-bold">Operational status</th>
              <th className="py-3 px-4 font-bold text-right">Database Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {siteData.products.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/50 transition duration-150">
                <td className="py-4 px-4 font-sans text-slate-800">
                  <div>
                    <span className="block font-bold text-slate-900 text-xs">{prod.name}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 max-w-xs">{prod.description}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-slate-100 px-2.5 py-1 border border-slate-200 rounded text-[10px] uppercase font-bold text-slate-650 font-mono">{prod.category}</span>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-600 font-mono">{prod.sku}</td>
                <td className="py-4 px-4 text-indigo-650 font-bold font-mono">
                  {prod.salePriceVal !== undefined && prod.salePriceVal !== null ? (
                    <div>
                      <span className="line-through text-slate-400 mr-1.5">${prod.priceVal}</span>
                      <span className="text-emerald-600">${prod.salePriceVal} USD</span>
                    </div>
                  ) : (
                    `$${prod.priceVal} USD`
                  )}
                </td>
                <td className="py-4 px-4 font-sans">
                  {prod.isComingSoon ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-5 border border-amber-200 px-2.5 py-1 rounded-full">
                      🔒 Coming Soon
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-5 border border-emerald-200 px-2.5 py-1 rounded-full">
                      🛒 Buy Now Active
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right space-x-1.5 font-sans">
                  <button
                    onClick={() => onViewProductSeo && onViewProductSeo(prod)}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer"
                  >
                    SEO
                  </button>
                  <button
                    onClick={() => handleOpenProductModal(prod)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete product: ${prod.name}?`)) {
                        onDeleteProduct(prod.id);
                        showToast(`Deleted product "${prod.name}" successfully`);
                      }
                    }}
                    className="p-1 px-2 text-slate-400 hover:text-red-500 transition cursor-pointer inline-flex items-center align-middle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL WINDOW FOR PRODUCT ADD / EDIT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setProductModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-xl w-full text-slate-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-md font-bold uppercase tracking-wider text-indigo-650 font-display">
                {editingProduct ? '📝 Update Stock Descriptor' : '✨ Provision New Health Unit'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-slate-605 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4 text-xs font-sans text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Product Category Range *</label>
                  <select 
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Ferments">Ferments</option>
                    <option value="Functional Tonic">Functional Tonic</option>
                    <option value="Recovery Formula">Recovery Formula</option>
                    <option value="MCT + EVOO Hybrid">MCT + EVOO Hybrid</option>
                    <option value="Targeted Nutrition">Targeted Nutrition</option>
                    <option value="Bundles / Stacks">Bundles & Protocols</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">SKU Unique Identifier *</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-850 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Product Title / Name *</label>
                <input 
                  type="text" 
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Microbiome Trinity Elixir"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-850 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <label className="font-semibold">Product Claims & Narrative</label>
                  <span className="text-slate-400 font-mono text-[10px]">{productForm.description?.length || 0} chars</span>
                </div>
                <textarea 
                  rows={6}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Precision-fermented kombucha elixirs for microbiome protection."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-850 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Launch Sale Status</label>
                  <select 
                    value={String(productForm.isComingSoon)}
                    onChange={e => setProductForm({ ...productForm, isComingSoon: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-850 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                  >
                    <option value="true">Coming Soon</option>
                    <option value="false">Buy Now Active</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Valuation price ($ USD) *</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={productForm.priceVal}
                    onChange={e => setProductForm({ ...productForm, priceVal: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-850 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs" 
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1 font-semibold">Sale off price ($ USD)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={productForm.salePriceVal !== undefined && productForm.salePriceVal !== null ? productForm.salePriceVal : ''}
                    onChange={e => setProductForm({ ...productForm, salePriceVal: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="None"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-850 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-505 text-slate-500 block mb-1 font-semibold">Features (bullet points - split with commas) *</label>
                <input 
                  type="text" 
                  required
                  value={productForm.featuresString}
                  onChange={e => setProductForm({ ...productForm, featuresString: e.target.value })}
                  placeholder="Raw live cultures, Digestive support, Classic ginger profile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-850 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Separated bullets with comma separators i.e: Raw cultures, Organic ginger, Gut flora support</span>
              </div>

              <div className="space-y-3">
                <label className="text-slate-500 block mb-1 font-semibold">Product Image Configuration</label>
                
                {/* Drag and drop upload zone */}
                <div 
                  id="product-image-drop-zone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive 
                      ? 'border-indigo-600 bg-indigo-50/40' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-350'
                  }`}
                  onClick={() => {
                    const fileInput = document.getElementById('product-image-file-input');
                    if (fileInput) fileInput.click();
                  }}
                >
                  <input 
                    type="file"
                    id="product-image-file-input"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  
                  {productForm.imageUrl ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-xs relative group">
                        <img src={productForm.imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Custom Image Loaded</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                          {productForm.imageUrl.startsWith('data:') ? 'Base64 Local Asset Data' : productForm.imageUrl}
                        </p>
                      </div>
                      <button
                        type="button"
                        id="clear-product-image-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductForm((prev: any) => ({ ...prev, imageUrl: '' }));
                          showToast("Image link cleared.");
                        }}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold uppercase rounded-lg border border-rose-200 flex items-center gap-1 cursor-pointer transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Reset / Clear Image</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="p-3 bg-white rounded-full border border-slate-200 shadow-2xs text-slate-400">
                        <Upload className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Drag & drop your product image here</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">or <span className="text-indigo-600 underline font-semibold">browse your files</span></p>
                      </div>
                      <p className="text-[9px] text-slate-400">Supports PNG, JPG, WEBP, GIF, SVG (max 5MB)</p>
                    </div>
                  )}
                </div>

                {/* Alternate direct manual URL input */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#a5801e] font-mono">Alternative: Canonical Image Link URL</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={productForm.imageUrl}
                      onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      placeholder="https://picsum.photos/seed/elixir/600/600"
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]" 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">If you have a publicly hosted URL, you can input it directly or leave it empty to use a stock visual representation.</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition cursor-pointer"
                >
                  {editingProduct ? 'Commit Updates' : 'Provision Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
