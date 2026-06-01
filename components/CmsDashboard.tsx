'use client';

import React, { useState } from 'react';
import { 
  X, Save, Plus, Trash2, Edit2, AlertCircle, CheckCircle2, 
  Settings, ArrowLeft, RefreshCw, Download, Upload, 
  DollarSign, Calendar, Mail, Laptop, HardDrive, 
  ShoppingBag, Check, ListFilter, PlusCircle, CheckSquare, 
  HelpCircle, Sparkles, BookOpen, Layers, Globe, FileText,
  LogOut
} from 'lucide-react';
import { CulturXData, Product, Booking, Enquiry, Order, defaultCulturXData, MedicalArticle, PaymentConfig, defaultPaymentConfig, PaymentMethodSetting } from '@/lib/initialData';
import OverviewTab from '@/components/cms/tabs/OverviewTab';
import BookingsTab from '@/components/cms/tabs/BookingsTab';
import OrdersTab from '@/components/cms/tabs/OrdersTab';
import InboxTab from '@/components/cms/tabs/InboxTab';
import SeoTab from '@/components/cms/tabs/SeoTab';
import SystemTab from '@/components/cms/tabs/SystemTab';
import EditorialTab from '@/components/cms/tabs/EditorialTab';
import ProductsTab from '@/components/cms/tabs/ProductsTab';
import ContentTab from '@/components/cms/tabs/ContentTab';

interface CmsDashboardProps {
  siteData: CulturXData;
  bookings: Booking[];
  enquiries: Enquiry[];
  orders: Order[];
  articles: MedicalArticle[];
  onSaveSiteData: (newData: CulturXData) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateEnquiryStatus: (enquiryId: string, newStatus: Enquiry['status']) => void;
  onDeleteEnquiry: (enquiryId: string) => void;
  onAddProduct: (newProd: Omit<Product, 'id'>) => void;
  onEditProduct: (updatedProd: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddArticle: (newArt: Omit<MedicalArticle, 'id'>) => void;
  onEditArticle: (updatedArt: MedicalArticle) => void;
  onDeleteArticle: (articleId: string) => void;
  paymentConfig: PaymentConfig;
  onSavePaymentConfig: (newConfig: PaymentConfig) => void;
  onImportBackup: (importedDataJson: string) => boolean;
  onResetToDefaults: () => void;
  toggleLiveSite: () => void;
  onLogout?: () => void;
}

export default function CmsDashboard({
  siteData,
  bookings,
  enquiries,
  orders,
  articles,
  onSaveSiteData,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateEnquiryStatus,
  onDeleteEnquiry,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
  paymentConfig,
  onSavePaymentConfig,
  onImportBackup,
  onResetToDefaults,
  toggleLiveSite,
  onLogout
}: CmsDashboardProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'products' | 'bookings' | 'orders' | 'inbox' | 'system' | 'seo' | 'editorial'>('overview');

  // SEO Checklist items state backed by localStorage
  const [seoChecklist, setSeoChecklist] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('culturx_seo_checklist');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Fallback
        }
      }
    }
    return {
      title: true,
      metaDesc: true,
      headings: true,
      internalLinks: true,
      imgSizes: true,
      https: true,
      homepageTitle: true,
      homepageDesc: true,
      altTags: true,
      altProducts: true,
      altBodyworks: true,
      altGeom: false,
      altKeywords: true,
      ga4: false,
      searchConsole: false,
      domainVerify: false,
      sitemap: false,
      indexing: false,
      tagManager: false,
      mobileResponsive: true,
      compressImg: true,
      minimizePlugins: true,
      pageSpeed: true,
      smoothScroll: true,
      privacyPolicy: true,
      termsConditions: true,
      refundPolicy: true,
      disclaimer: true,
      accessibility: true,
      blogSystem: false,
      schemaMarkup: false,
      optimizeProductPages: false,
      melbourneLcl: false,
      ecommerceSeo: false,
    };
  });

  const toggleSeoCheck = (key: string) => {
    const updated = { ...seoChecklist, [key]: !seoChecklist[key] };
    setSeoChecklist(updated);
    localStorage.setItem('culturx_seo_checklist', JSON.stringify(updated));
    showToast(`Updated SEO checklist status: ${key.toUpperCase()}`);
  };

  const handleTogglePaymentMethod = (key: keyof PaymentConfig) => {
    const updated = {
      ...paymentConfig,
      [key]: {
        ...paymentConfig[key],
        enabled: !paymentConfig[key].enabled,
      }
    };
    onSavePaymentConfig(updated);
    showToast(`Toggled payment method: ${key.toUpperCase()}`);
  };

  const handleUpdatePaymentDetails = (key: keyof PaymentConfig, fields: Partial<PaymentMethodSetting>) => {
    const updated = {
      ...paymentConfig,
      [key]: {
        ...paymentConfig[key],
        ...fields,
      }
    };
    onSavePaymentConfig(updated);
    showToast(`Updated payment details for: ${key.toUpperCase()}`);
  };

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // State definitions for forms (moved to ContentTab)

  // Site-wide Page SEO State for SEO Content Audit
  type PageSeo = {
    title: string;
    description: string;
    canonicalUrl: string;
  };

  const [seoPages, setSeoPages] = useState<Record<'home' | 'shop' | 'articles', PageSeo>>(() => {
    const defaultPages: Record<'home' | 'shop' | 'articles', PageSeo> = {
      home: {
        title: 'CULTURX™ | Internal. External. Optimized.',
        description: 'CULTURX™ is a premium human optimization ecosystem combining precision-fermented kombucha, targeted supplements, clinical bodywork and concierge recovery for elite human performance.',
        canonicalUrl: 'https://culturx.com.au/'
      },
      shop: {
        title: 'CULTURX™ Shop | Premium Microbiome Restoration & Biohacking Formulas',
        description: 'Purchase our premium collection of bio-engineered kombucha, targeted probiotics, and cellular activation supplements designed to optimize physical and mental output.',
        canonicalUrl: 'https://culturx.com.au/shop'
      },
      articles: {
        title: 'CULTURX™ Intelligence | Scientific Insights on Human Performance',
        description: 'Explore our index of clinical articles, biohacking protocols, and clinical research covering gut microbiome care, somatic recovery, and nervous system regulation.',
        canonicalUrl: 'https://culturx.com.au/articles'
      }
    };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('culturx_seo_pages');
      if (stored) {
        try {
          return { ...defaultPages, ...JSON.parse(stored) };
        } catch {
          // Fallback
        }
      }
    }
    return defaultPages;
  });

  const handleUpdatePageSeo = (pageKey: 'home' | 'shop' | 'articles', field: keyof PageSeo, value: string) => {
    const updated = {
      ...seoPages,
      [pageKey]: {
        ...seoPages[pageKey],
        [field]: value
      }
    };
    setSeoPages(updated);
    localStorage.setItem('culturx_seo_pages', JSON.stringify(updated));
  };

  // Core backup field text
  const [backupJsonText, setBackupJsonText] = useState('');

  // Product Add/Edit Dialog modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    category: '',
    name: '',
    description: '',
    featuresString: '',
    priceVal: 0,
    isComingSoon: true,
    sku: '',
    imageUrl: '',
  });
  
  // Drag and drop / local image upload state
  const [isDragActive, setIsDragActive] = useState(false);

  const handleProductImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("The image is too large. Please select an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProductForm(prev => ({ ...prev, imageUrl: base64String }));
      showToast("Product image processed successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProductImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProductImageFile(e.dataTransfer.files[0]);
    }
  };

  // Article Add/Edit Dialog modal state
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<MedicalArticle | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    category: '',
    author: '',
    readTime: '',
    publishDate: '',
    seoKeywordsString: '',
    content: '',
    seoCanonicalUrl: ''
  });

  // Handler to open Article CRUD modal
  const handleOpenArticleModal = (art?: MedicalArticle) => {
    if (art) {
      setEditingArticle(art);
      setArticleForm({
        title: art.title,
        excerpt: art.excerpt,
        category: art.category,
        author: art.author,
        readTime: art.readTime,
        publishDate: art.publishDate,
        seoKeywordsString: art.seoKeywords ? art.seoKeywords.join(', ') : '',
        content: art.content,
        seoCanonicalUrl: art.seoCanonicalUrl || ''
      });
    } else {
      setEditingArticle(null);
      setArticleForm({
        title: '',
        excerpt: '',
        category: 'Gut Health',
        author: 'Clinical Intelligence Team',
        readTime: '5 min read',
        publishDate: new Date().toISOString().split('T')[0],
        seoKeywordsString: 'gut health, biohacking, kombucha',
        content: '',
        seoCanonicalUrl: ''
      });
    }
    setArticleModalOpen(true);
  };

  const handleArticleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.category) {
      alert('Please provide a complete Article Title and Category.');
      return;
    }

    const keywords = articleForm.seoKeywordsString
      .split(',')
      .map(str => str.trim())
      .filter(str => str.length > 0);

    const commonData = {
      title: articleForm.title,
      excerpt: articleForm.excerpt,
      category: articleForm.category,
      author: articleForm.author,
      readTime: articleForm.readTime,
      publishDate: articleForm.publishDate,
      seoKeywords: keywords,
      content: articleForm.content,
      seoCanonicalUrl: articleForm.seoCanonicalUrl
    };

    if (editingArticle) {
      onEditArticle({
        ...editingArticle,
        ...commonData
      });
      showToast(`Successfully updated article "${commonData.title}"`);
    } else {
      onAddArticle(commonData);
      showToast(`Successfully published article "${commonData.title}"`);
    }

    setArticleModalOpen(false);
  };

  // Calculate high-level summary metrics
  const totalRevenueVal = orders.reduce((acc, current) => current.status !== 'cancelled' ? acc + current.totalAmount : acc, 0);
  const unpaidComingCount = siteData.products.filter(p => p.isComingSoon).length;
  const activeBookingsCount = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const unreadEnquiriesCount = enquiries.filter(e => e.status === 'unread').length;

  // Handler to open Product CRUD modal
  const handleOpenProductModal = (productToEdit?: Product) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setProductForm({
        category: productToEdit.category,
        name: productToEdit.name,
        description: productToEdit.description,
        featuresString: productToEdit.features ? productToEdit.features.join(', ') : '',
        priceVal: productToEdit.priceVal,
        isComingSoon: productToEdit.isComingSoon,
        sku: productToEdit.sku,
        imageUrl: productToEdit.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        category: 'Ferments',
        name: '',
        description: '',
        featuresString: 'Raw cultures, Microbiome friendly',
        priceVal: 15,
        isComingSoon: false,
        sku: `CX-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
        imageUrl: 'https://picsum.photos/seed/kombucha/600/600',
      });
    }
    setProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku) {
      alert('Please fill out both Product Name and SKU.');
      return;
    }

    const cleanedFeatures = productForm.featuresString
      .split(',')
      .map(str => str.trim())
      .filter(str => str.length > 0);

    const commonData = {
      category: productForm.category,
      name: productForm.name,
      description: productForm.description,
      features: cleanedFeatures,
      priceString: productForm.isComingSoon ? "Coming Soon" : `$${productForm.priceVal}.00 USD`,
      priceVal: Number(productForm.priceVal),
      isComingSoon: productForm.isComingSoon,
      sku: productForm.sku,
      imageUrl: productForm.imageUrl || 'https://picsum.photos/seed/kombucha/600/600',
    };

    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
        ...commonData
      });
      showToast(`Updated product "${commonData.name}" successfully`);
    } else {
      onAddProduct(commonData);
      showToast(`Created new product "${commonData.name}" successfully`);
    }

    setProductModalOpen(false);
  };

  // Submit edits for primary textual sections (moved to ContentTab)

  // Export CMS Data download helper
  const handleExportData = () => {
    const backupObj = {
      siteData,
      bookings,
      enquiries,
      orders,
      timestamp: new Date().toISOString(),
      exportVersion: "CX-ADMIN-1.0.0"
    };

    const exportedString = JSON.stringify(backupObj, null, 2);
    setBackupJsonText(exportedString);

    // Create virtual download file
    const element = document.createElement("a");
    const file = new Blob([exportedString], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `culturx_cms_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast("Exported database copy! Raw data copy placed in terminal frame below.");
  };

  // Load database backup text field
  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupJsonText.trim()) {
      alert("Please enter a valid backup JSON string.");
      return;
    }

    const success = onImportBackup(backupJsonText);
    if (success) {
      showToast("Data restoration verified. Site successfully restored to custom state!");
      setBackupJsonText('');
    } else {
      alert("Backup restoration error. The JSON structure is invalid or lacks the core workspace fields.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-955 flex flex-col font-sans">
      
      {/* SUCCESS TOAST NOTIFIER */}
      <div className="fixed top-6 right-6 z-50">
        {toastMessage && (
          <div className="flex items-center space-x-3 bg-slate-900 border border-indigo-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">{toastMessage}</span>
          </div>
        )}
      </div>

      {/* HEADER HUD */}
      <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 shadow-sm shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-200">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest font-display text-slate-900 uppercase">CULTURX™ <span className="text-indigo-600">CMS Core</span></h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Enterprise Human Performance Database & Content Module</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleLiveSite}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-bold uppercase cursor-pointer hover:bg-slate-800 transition shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-450" />
            <span>👁️ Visit Live Site</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center justify-center p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ADMIN WORKSPACE LAYOUT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation panel */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-widest mb-3">Workspace Modules</h3>
            
            <nav className="flex flex-col space-y-1">
              {[
                { id: 'overview', label: '📊 Dashboard Overview' },
                { id: 'content', label: '📝 Site Text Editor' },
                { id: 'products', label: '📦 Product Inventory' },
                { id: 'editorial', label: '✍️ Medical Articles' },
                { id: 'bookings', label: '💆 Clinical Bookings' },
                { id: 'orders', label: '🛒 Customer Orders' },
                { id: 'inbox', label: '📥 Client Inbox' },
                { id: 'seo', label: '🔍 SEO & Google Centric' },
                { id: 'system', label: '⚙️ System Backups' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center justify-between ${
                    activeTab === tab.id 
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'bookings' && activeBookingsCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'bookings' ? 'bg-black text-indigo-400' : 'bg-indigo-500/20 text-indigo-300'}`}>
                      {activeBookingsCount}
                    </span>
                  )}
                  {tab.id === 'inbox' && unreadEnquiriesCount > 0 && (
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md animate-pulse">
                      {unreadEnquiriesCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center space-y-2 text-white shadow-xl">
            <span className="text-[9px] text-[#aa8612] font-mono font-bold tracking-widest block uppercase">DATABASE CONNECTION DIAGNOSTIC</span>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-green-400 font-semibold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span>Supabase Cloud Active</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              State synchronized securely with Supabase platform and backup caching enabled for instant client response.
            </p>
          </div>
        </aside>

        {/* Primary Tab content panel */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px]">
          
          {/* TAB 1: OVERVIEW METRIC SUMMARY */}
          {activeTab === 'overview' && (
            <OverviewTab
              siteData={siteData}
              bookings={bookings}
              enquiries={enquiries}
              orders={orders}
              activeBookingsCount={activeBookingsCount}
              unreadEnquiriesCount={unreadEnquiriesCount}
            />
          )}

          {/* TAB 2: GENERAL TEXT CONTENT EDITORS */}
          {activeTab === 'content' && (
            <ContentTab 
              siteData={siteData} 
              onSaveSiteData={onSaveSiteData} 
              showToast={showToast} 
            />
          )}

           {activeTab === 'products' && (
            <ProductsTab
              siteData={siteData}
              handleOpenProductModal={handleOpenProductModal}
              onDeleteProduct={onDeleteProduct}
              showToast={showToast}
              productModalOpen={productModalOpen}
              setProductModalOpen={setProductModalOpen}
              editingProduct={editingProduct}
              productForm={productForm}
              setProductForm={setProductForm}
              handleProductFormSubmit={handleProductFormSubmit}
              isDragActive={isDragActive}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleImageFileChange={handleImageFileChange}
            />
          )}

          {/* TAB 3.5: MEDICAL ARTICLE CRUD MANAGEMENT */}
          {activeTab === 'editorial' && (
            <EditorialTab
              articles={articles}
              handleOpenArticleModal={handleOpenArticleModal}
              onDeleteArticle={onDeleteArticle}
              showToast={showToast}
              articleModalOpen={articleModalOpen}
              setArticleModalOpen={setArticleModalOpen}
              editingArticle={editingArticle}
              articleForm={articleForm}
              setArticleForm={setArticleForm}
              handleArticleFormSubmit={handleArticleFormSubmit}
            />
          )}

          {/* TAB 4: CLINICAL BOOKING MANAGER */}
          {/* TAB 4: THERAPIST BOOKINGS */}
          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              onUpdateBookingStatus={onUpdateBookingStatus}
              onDeleteBooking={onDeleteBooking}
              showToast={showToast}
            />
          )}

          {/* TAB 5: ACTIVE CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onDeleteOrder={onDeleteOrder}
              showToast={showToast}
            />
          )}

          {/* TAB 6: CLIENT ENQUIRIES MAILBOX */}
          {activeTab === 'inbox' && (
            <InboxTab
              enquiries={enquiries}
              onUpdateEnquiryStatus={onUpdateEnquiryStatus}
              onDeleteEnquiry={onDeleteEnquiry}
              showToast={showToast}
            />
          )}

          {/* TAB 8: SEO & GOOGLE SETUP CHECKLIST CONTROL PANEL */}
          {/* TAB 8: SEO & GOOGLE SETUP CHECKLIST CONTROL PANEL */}
          {activeTab === 'seo' && (
            <SeoTab
              siteData={siteData}
              seoChecklist={seoChecklist}
              toggleSeoCheck={toggleSeoCheck}
              seoPages={seoPages}
              handleUpdatePageSeo={handleUpdatePageSeo}
              showToast={showToast}
            />
          )}

          {/* TAB 7: DATABASE SYSTEM ACTIONS & FILE RESTORE */}
          {activeTab === 'system' && (
            <SystemTab
              handleExportData={handleExportData}
              handleImportData={handleImportData}
              backupJsonText={backupJsonText}
              setBackupJsonText={setBackupJsonText}
              paymentConfig={paymentConfig}
              handleTogglePaymentMethod={handleTogglePaymentMethod}
              handleUpdatePaymentDetails={handleUpdatePaymentDetails}
              onResetToDefaults={onResetToDefaults}
              showToast={showToast}
            />
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-6 text-center text-[10px] text-slate-400 tracking-wider">
        <p className="uppercase">CULTURX™ Admin Board Database Interface — Secure Client Session Sandbox</p>
      </footer>

    </div>
  );
}
