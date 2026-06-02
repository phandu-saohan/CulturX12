'use client';
import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { MedicalArticle } from '@/lib/initialData';
import RichTextEditor from '../RichTextEditor';

interface EditorialTabProps {
  articles: MedicalArticle[];
  handleOpenArticleModal: (art?: MedicalArticle) => void;
  onDeleteArticle: (id: string) => void;
  showToast: (msg: string) => void;
  articleModalOpen: boolean;
  setArticleModalOpen: (open: boolean) => void;
  editingArticle: MedicalArticle | null;
  articleForm: any;
  setArticleForm: (form: any) => void;
  handleArticleFormSubmit: (e: React.FormEvent) => void;
}

export default function EditorialTab({
  articles,
  handleOpenArticleModal,
  onDeleteArticle,
  showToast,
  articleModalOpen,
  setArticleModalOpen,
  editingArticle,
  articleForm,
  setArticleForm,
  handleArticleFormSubmit
}: EditorialTabProps) {
  const [viewingArticle, setViewingArticle] = useState<MedicalArticle | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">Medical & Clinical Editorial</h2>
          <p className="text-xs text-slate-500 font-mono">Manage clinical evidence reports, medical intelligence publications, and bio-restorative systems.</p>
        </div>
        <button
          onClick={() => handleOpenArticleModal()}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider hover:bg-indigo-700 flex items-center space-x-2 w-fit cursor-pointer shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Draft Publication</span>
        </button>
      </div>

      {/* ARTICLES LIST TABLE */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-bold">Clinical Publication</th>
              <th className="py-3 px-4 font-bold font-bold">Protocol Division</th>
              <th className="py-3 px-4 font-bold">Managing Editor & Pace</th>
              <th className="py-3 px-4 font-bold">Date Published</th>
              <th className="py-3 px-4 font-bold">Target Keywords</th>
              <th className="py-3 px-4 font-bold text-right">Modifications</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50/50 transition duration-150">
                <td className="py-4 px-4">
                  <div>
                    <span className="block font-bold text-slate-900 text-sm">{art.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1 max-w-sm mt-0.5">{art.excerpt}</span>
                    {art.seoCanonicalUrl && (
                      <div className="mt-1">
                        <span className="inline-block text-[9px] font-mono text-purple-700 bg-purple-50 border border-purple-200/55 px-1.5 py-0.5 rounded-md font-semibold truncate max-w-md">
                          🔗 Canonical: {art.seoCanonicalUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-[11px]">
                  <span className="bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-700 font-bold uppercase">{art.category}</span>
                </td>
                <td className="py-4 px-4 text-xs font-mono">
                  <div className="font-semibold text-slate-800">{art.author}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{art.readTime}</div>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500 text-xs">{art.publishDate}</td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {art.seoKeywords ? art.seoKeywords.map((kw, i) => (
                      <span key={i} className="bg-slate-105 text-slate-650 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 uppercase font-mono tracking-tight">
                        #{kw}
                      </span>
                    )) : <span className="text-slate-400">-</span>}
                  </div>
                </td>
                <td className="py-4 px-4 text-right space-x-1.5 font-mono">
                  <button
                    onClick={() => setViewingArticle(art)}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer font-sans"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleOpenArticleModal(art)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer font-sans"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete publication: ${art.title}?`)) {
                        onDeleteArticle(art.id);
                        showToast(`Pruned article "${art.title}" from index`);
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

      {/* VIEW MEDICAL ARTICLE DETAILS MODAL */}
      {viewingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setViewingArticle(null)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-3xl w-full text-slate-800 shadow-2xl space-y-6">
            <button onClick={() => setViewingArticle(null)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-750 border border-indigo-200 uppercase tracking-widest">{viewingArticle.category}</span>
              <h3 className="text-xl font-bold uppercase text-slate-900 mt-2 leading-tight font-display">{viewingArticle.title}</h3>
              
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono mt-3 border-b border-slate-100 pb-3">
                <span>By <strong>{viewingArticle.author}</strong></span>
                <span>•</span>
                <span>{viewingArticle.publishDate}</span>
                <span>•</span>
                <span>⏱️ {viewingArticle.readTime}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#a5801e] font-mono block">Excerpt / Summary:</span>
              <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-xl italic leading-relaxed">{viewingArticle.excerpt}</p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#a5801e] font-mono block mb-1">Article Body Content:</span>
              <div 
                className="text-xs text-slate-750 leading-relaxed space-y-3 prose max-w-none font-sans"
                dangerouslySetInnerHTML={{ __html: viewingArticle.content }}
              />
            </div>

            {viewingArticle.seoKeywords && viewingArticle.seoKeywords.length > 0 && (
              <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold mr-1">Keywords:</span>
                {viewingArticle.seoKeywords.map((kw, i) => (
                  <span key={i} className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded border border-slate-200 uppercase font-mono">#{kw}</span>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setViewingArticle(null)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition cursor-pointer">
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW FOR ARTICLE ADD / EDIT */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setArticleModalOpen(false)} />
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10 p-6 md:p-8 space-y-6 shadow-2xl relative border border-slate-100 text-slate-800 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-600 font-mono">CulturX Clinical Editorial</h4>
                <h3 className="text-xl font-black text-slate-950 tracking-tight font-display">
                  {editingArticle ? 'Update Medical Publication' : 'Draft New Clinical Publication'}
                </h3>
              </div>
              <button onClick={() => setArticleModalOpen(false)} className="text-slate-400 hover:text-slate-650 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleArticleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">Article Publication Title</label>
                  <input 
                    type="text" 
                    required
                    value={articleForm.title} 
                    onChange={e => setArticleForm({ ...articleForm, title: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    placeholder="e.g. Gut-Brain Axis and Cellular Longevity"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">Editorial Category Range</label>
                  <select 
                    value={articleForm.category} 
                    onChange={e => setArticleForm({ ...articleForm, category: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Gut Health">Gut Health (System Microbiome)</option>
                    <option value="Clinical Bodywork">Clinical Bodywork (Biomechanical Tuning)</option>
                    <option value="Supplements">Supplements (Cellular Nutrients)</option>
                    <option value="Executive Focus">Executive Focus (Cognitive Protocols)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">Managing Author</label>
                  <input 
                    type="text" 
                    value={articleForm.author} 
                    onChange={e => setArticleForm({ ...articleForm, author: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">Estimated Read Time</label>
                  <input 
                    type="text" 
                    value={articleForm.readTime} 
                    onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">Publication Date</label>
                  <input 
                    type="date" 
                    value={articleForm.publishDate} 
                    onChange={e => setArticleForm({ ...articleForm, publishDate: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-500 block font-bold uppercase tracking-wider text-[10px]">
                  SEO Keywords / Discoverability Tags
                </label>
                <input 
                  type="text" 
                  value={articleForm.seoKeywordsString} 
                  onChange={e => setArticleForm({ ...articleForm, seoKeywordsString: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  placeholder="Type or click suggested tags below (comma separated)..."
                />
                
                {/* Currently Selected Tag Pills */}
                {articleForm.seoKeywordsString.split(',').map((s: string) => s.trim()).filter(Boolean).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] font-mono text-slate-450 uppercase font-black mr-1 self-center">Active:</span>
                    {articleForm.seoKeywordsString.split(',').map((s: string) => s.trim()).filter(Boolean).map((tag: string, idx: number) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center space-x-1 py-0.5 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-lg font-mono text-[10px]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentTags = articleForm.seoKeywordsString.split(',').map((s: string) => s.trim()).filter(Boolean);
                            const updatedTags = currentTags.filter((t: string) => t.toLowerCase() !== tag.toLowerCase());
                            setArticleForm({ ...articleForm, seoKeywordsString: updatedTags.join(', ') });
                          }}
                          className="text-indigo-400 hover:text-indigo-700 transition font-black ml-0.5 shrink-0"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive Suggestion / Hot Multi-Select Pills */}
                <div className="pt-2 border-t border-dashed border-slate-200">
                  <span className="text-[9px] font-mono text-slate-450 uppercase font-black block mb-1.5">Click to toggle recommendations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'gut health', 'biohacking', 'microbiome', 'kombucha', 
                      'longevity', 'somatic recovery', 'cellular nutrients', 
                      'cognitive protocols', 'nervous system', 'metabolism'
                    ].map((recTag) => {
                      const activeTags = articleForm.seoKeywordsString.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
                      const isActive = activeTags.includes(recTag.toLowerCase());
                      return (
                        <button
                          key={recTag}
                          type="button"
                          onClick={() => {
                            const currentTags = articleForm.seoKeywordsString.split(',').map((s: string) => s.trim()).filter(Boolean);
                            let newTags;
                            if (isActive) {
                              newTags = currentTags.filter((t: string) => t.toLowerCase() !== recTag.toLowerCase());
                            } else {
                              newTags = [...currentTags, recTag];
                            }
                            setArticleForm({ ...articleForm, seoKeywordsString: newTags.join(', ') });
                          }}
                          className={`py-0.5 px-2 rounded-lg text-[9px] font-mono transition duration-150 border uppercase font-medium ${
                            isActive 
                              ? 'bg-amber-50 border-amber-300 text-amber-800 font-black' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {isActive ? '✓ ' : '+ '}{recTag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">SEO Canonical URL (Custom Canonical Tag)</label>
                <input 
                  type="url" 
                  value={articleForm.seoCanonicalUrl} 
                  onChange={e => setArticleForm({ ...articleForm, seoCanonicalUrl: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  placeholder="e.g. https://culturx.com.au/blog/gut-brain-axis"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-bold uppercase tracking-wider text-[10px]">Brief Excerpt Summary</label>
                <input 
                  type="text" 
                  value={articleForm.excerpt} 
                  onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  placeholder="A scannable excerpt displayed on news decks..."
                />
              </div>

              <RichTextEditor
                label="Core Body Content (Clinical Intelligence Rich Text)"
                value={articleForm.content}
                onChange={val => setArticleForm({ ...articleForm, content: val })}
                rows={14}
                placeholder="Start composing your rich clinical publication. Format your text using headings, lists, bold text, and links..."
              />

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-150">
                <button 
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-semibold cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition cursor-pointer text-xs"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
