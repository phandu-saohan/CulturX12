'use client';

import React, { useState } from 'react';
import { 
  X, Save, Plus, Trash2, Edit2, AlertCircle, CheckCircle2, 
  Settings, ArrowLeft, RefreshCw, Download, Upload, 
  DollarSign, Calendar, Mail, Laptop, HardDrive, 
  ShoppingBag, Check, ListFilter, PlusCircle, CheckSquare, 
  HelpCircle, Sparkles, BookOpen, Layers, Globe, FileText,
  LogOut, Menu
} from 'lucide-react';
import { CulturXData, Product, Booking, Enquiry, Order, defaultCulturXData, MedicalArticle, PaymentConfig, defaultPaymentConfig, PaymentMethodSetting, AppSettings } from '@/lib/initialData';
import OverviewTab from '@/components/cms/tabs/OverviewTab';
import BookingsTab from '@/components/cms/tabs/BookingsTab';
import OrdersTab from '@/components/cms/tabs/OrdersTab';
import InboxTab from '@/components/cms/tabs/InboxTab';
import SeoTab from '@/components/cms/tabs/SeoTab';
import SystemTab from '@/components/cms/tabs/SystemTab';
import EditorialTab from '@/components/cms/tabs/EditorialTab';
import ProductsTab from '@/components/cms/tabs/ProductsTab';
import ContentTab from '@/components/cms/tabs/ContentTab';
import SettingsTab from '@/components/cms/tabs/SettingsTab';

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
  appSettings: AppSettings;
  onSaveAppSettings: (updated: AppSettings) => Promise<void>;
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
  onLogout,
  appSettings,
  onSaveAppSettings,
}: CmsDashboardProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'products' | 'bookings' | 'orders' | 'inbox' | 'system' | 'seo' | 'editorial' | 'settings'>('overview');
  // Mobile sidebar visibility state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const [selectedProductSeo, setSelectedProductSeo] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    category: '',
    name: '',
    description: '',
    featuresString: '',
    priceVal: 0,
    salePriceVal: undefined as number | undefined,
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
  const activeOrdersCount = orders.filter(o => o.status === 'pending').length;

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
        salePriceVal: productToEdit.salePriceVal,
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
        salePriceVal: undefined,
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
      salePriceVal: productForm.salePriceVal !== undefined && productForm.salePriceVal !== null && productForm.salePriceVal !== 0 ? Number(productForm.salePriceVal) : undefined,
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

  // Reusable Sidebar Render Helper
  const renderSidebar = (isMobileView = false) => {
    const tabsConfig = [
      { id: 'overview', label: 'Dashboard Overview', icon: Layers },
      { id: 'content', label: 'Site Text Editor', icon: FileText },
      { id: 'products', label: 'Product Inventory', icon: ShoppingBag },
      { id: 'editorial', label: 'Medical Articles', icon: BookOpen },
      { id: 'bookings', label: 'Clinical Bookings', icon: Calendar },
      { id: 'orders', label: 'Customer Orders', icon: CheckSquare },
      { id: 'inbox', label: 'Client Inbox', icon: Mail },
      { id: 'seo', label: 'SEO & Google Centric', icon: Globe },
      { id: 'system', label: 'System Backups', icon: HardDrive },
      { id: 'settings', label: 'App Settings', icon: Settings },
    ];

    return (
      <div className="flex flex-col h-full bg-slate-900 text-white">
        {/* BRAND HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-650 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Settings className="w-4.5 h-4.5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest font-display text-white uppercase leading-none">CULTURX™</h2>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-none mt-1">CMS Core</p>
            </div>
          </div>
          {isMobileView && (
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* WORKSPACE MODULES NAVIGATION */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Workspace Modules</h3>
          <nav className="space-y-1">
            {tabsConfig.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (isMobileView) {
                      setIsMobileSidebarOpen(false);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                   {tab.id === 'bookings' && activeBookingsCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${isActive ? 'bg-black/35 text-indigo-455' : 'bg-indigo-500/20 text-indigo-300'}`}>
                      {activeBookingsCount}
                    </span>
                  )}
                  {tab.id === 'inbox' && unreadEnquiriesCount > 0 && (
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md font-mono font-bold animate-pulse">
                      {unreadEnquiriesCount}
                    </span>
                  )}
                  {tab.id === 'orders' && activeOrdersCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${isActive ? 'bg-black/35 text-indigo-400' : 'bg-amber-500/20 text-amber-300 animate-pulse'}`}>
                      {activeOrdersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* CONNECTION & SYSTEM HEALTH DIAGNOSTIC */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-[8px] text-[#aa8612] font-mono font-bold tracking-widest block uppercase">DATABASE CONNECTION DIAGNOSTIC</span>
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-green-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span>Supabase Cloud Active</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-normal font-sans">
              State synchronized securely with Supabase platform and backup caching enabled for instant response.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      
      {/* SUCCESS TOAST NOTIFIER */}
      <div className="fixed top-6 right-6 z-50">
        {toastMessage && (
          <div className="flex items-center space-x-3 bg-slate-900 border border-indigo-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">{toastMessage}</span>
          </div>
        )}
      </div>

      {/* MOBILE DRAWER */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 h-full text-white shadow-2xl transition-transform duration-300">
            {renderSidebar(true)}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white shrink-0">
        {renderSidebar(false)}
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black tracking-widest font-display text-slate-900 uppercase">
                {activeTab === 'overview' && '📊 Dashboard Overview'}
                {activeTab === 'content' && '📝 Site Text Editor'}
                {activeTab === 'products' && '📦 Product Inventory'}
                {activeTab === 'editorial' && '✍️ Medical Articles'}
                {activeTab === 'bookings' && '💆 Clinical Bookings'}
                {activeTab === 'orders' && '🛒 Customer Orders'}
                {activeTab === 'inbox' && '📥 Client Inbox'}
                {activeTab === 'seo' && '🔍 SEO & Google Centric'}
                {activeTab === 'system' && '⚙️ System Backups'}
                {activeTab === 'settings' && '🎛️ App Settings'}
              </h1>
            </div>
            <div className="sm:hidden text-xs font-bold text-slate-900 uppercase tracking-widest">
              CULTURX CMS
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleLiveSite}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-bold uppercase cursor-pointer hover:bg-slate-800 transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">👁️ Visit Live Site</span>
              <span className="sm:hidden">👁️ Live Site</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200 cursor-pointer"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px]">
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
                onViewProductSeo={setSelectedProductSeo}
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
            {activeTab === 'seo' && (
              <SeoTab
                siteData={siteData}
                seoChecklist={seoChecklist}
                toggleSeoCheck={toggleSeoCheck}
                seoPages={seoPages}
                handleUpdatePageSeo={handleUpdatePageSeo}
                showToast={showToast}
                appSettings={appSettings}
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

            {/* TAB 10: APP SETTINGS */}
            {activeTab === 'settings' && (
              <SettingsTab
                appSettings={appSettings}
                onSaveAppSettings={onSaveAppSettings}
                showToast={showToast}
              />
            )}
          </div>

          {/* FOOTER */}
          <footer className="mt-8 py-6 text-center text-[10px] text-slate-400 tracking-wider border-t border-slate-200">
            <p className="uppercase">CULTURX™ Admin Board Database Interface — Secure Client Session Sandbox</p>
          </footer>
        </main>
      </div>

      {/* SEO DIAGNOSTIC MODAL SHEET FOR PRODUCTS */}
      {selectedProductSeo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedProductSeo(null)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-xl w-full text-slate-800 shadow-2xl space-y-6">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProductSeo(null)}
              className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-indigo-50 text-indigo-650 border border-indigo-200 uppercase tracking-widest">
                SEO & Indexing Diagnostics
              </span>
              <h3 className="text-md font-bold uppercase text-slate-900 font-display tracking-tight mt-2">
                {selectedProductSeo.name} — Metadata Sheet
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Configure keyword indexes, Rich Snippets, canonical tags, and localization targets tailored for Melbourne, Victoria.</p>
            </div>

            {/* SECTION 1: GOOGLE SERP SIMULATOR */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#a5801e] font-mono">Google SERP Snippet Simulator (Google Search Presentation)</h4>
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 text-zinc-900 font-sans shadow-xs">
                {/* Google citation hierarchy */}
                <div className="flex items-center space-x-1 text-xs text-zinc-500 mb-1 leading-none font-mono">
                  <span>https://culturx.com.au</span>
                  <span>›</span>
                  <span>shop</span>
                  <span>›</span>
                  <span>{selectedProductSeo.sku.toLowerCase()}</span>
                </div>
                {/* Google Blue Link Title */}
                <span className="text-base text-[#1a56db] hover:underline font-medium leading-tight block">
                  CULTURX™ {selectedProductSeo.name} | Premium Human Optimization Melbourne
                </span>
                {/* Google Meta Description with Melbourne target */}
                <p className="text-[11px] text-zinc-650 leading-relaxed mt-2">
                  CULTURX™ is premium science: Buy **{selectedProductSeo.name}** in Melbourne, Australia. Clinical gut microbiota restoration biohacking and executive recovery formulas configured directly.
                </p>
              </div>
            </div>

            {/* SECTION 2: METADATA SUMMARY METRICS */}
            <div className="border-t border-slate-200 pt-4 space-y-3 font-mono text-[10.5px]">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#a5801e]">Direct Meta & Header Elements</h4>
              
              <div className="space-y-2 divide-y divide-slate-100 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Meta Title:</span>
                  <span className="text-slate-900 text-right font-sans font-bold">CULTURX™ {selectedProductSeo.name} | Melbourne Premium Biohacking</span>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Meta Description:</span>
                  <span className="text-slate-900 text-right font-sans max-w-sm text-xs leading-normal">CULTURX™ {selectedProductSeo.name}. Buy clinical-grade digestive microbiome optimization and premium executive recovery formulas in Melbourne, Victoria, Australia.</span>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Canonical URL:</span>
                  <span className="text-indigo-650 font-bold font-mono">https://culturx.com.au/shop/{selectedProductSeo.sku.toLowerCase()}</span>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Local Targeting:</span>
                  <span className="text-slate-800">Melbourne VIC, Collins St, Ritz-Carlton, Park Hyatt</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: SCHEMAS RAW PLAYLOAD PREVIEW */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-[#a5801e] uppercase font-mono">
                <span>Product Schema Payload (JSON-LD)</span>
                <span className="text-emerald-600">✓ Valid Schema.org Struct</span>
              </div>
              
              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-40 leading-relaxed scrollbar-thin">
{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "CulturX™ ${selectedProductSeo.name}",
  "sku": "${selectedProductSeo.sku}",
  "category": "${selectedProductSeo.category}",
  "description": "${selectedProductSeo.description}",
  "brand": {
    "@type": "Brand",
    "name": "CulturX™"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "${selectedProductSeo.salePriceVal !== undefined && selectedProductSeo.salePriceVal !== null ? selectedProductSeo.salePriceVal : selectedProductSeo.priceVal}",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://culturx.com.au/#shop"
  },
  "areaServed": "Melbourne, Victoria, Australia"
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedProductSeo(null)}
                className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition cursor-pointer"
              >
                Close SEO Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
