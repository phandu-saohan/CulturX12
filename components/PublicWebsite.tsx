'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ShoppingBag, Calendar, Mail, Phone, MapPin, 
  ChevronRight, Check, CheckCircle, Info, ShoppingCart, Share2, Copy, Facebook, Twitter, Send,
  Trash2, Landmark, ShieldCheck, HeartPulse, Search, BookOpen, Clock, User, ExternalLink, Activity, CreditCard, Wallet
} from 'lucide-react';
import { CulturXData, Product, Booking, Enquiry, Order, OrderItem, MedicalArticle, PaymentConfig, AppSettings, defaultAppSettings } from '@/lib/initialData';
import AIChatbot from '@/components/public/AIChatbot';

interface PublicWebsiteProps {
  siteData: CulturXData;
  articles: MedicalArticle[];
  paymentConfig: PaymentConfig;
  appSettings?: AppSettings;
  onBookTreatment: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  onSubmitEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => void;
  onPlaceOrder: (orderData: { clientName: string; clientEmail: string; clientPhone: string; shippingAddress: string; items: OrderItem[]; totalAmount: number }) => void;
  toggleCms: () => void;
}

export default function PublicWebsite({
  siteData,
  articles,
  paymentConfig,
  appSettings: appSettingsProp,
  onBookTreatment,
  onSubmitEnquiry,
  onPlaceOrder,
  toggleCms
}: PublicWebsiteProps) {
  const appSettings = appSettingsProp ?? defaultAppSettings;
  const currencySymbol = appSettings.localization.currencySymbol || '$';
  const brandName = appSettings.brand.logoText || siteData.hero.brandLogo;
  const visible: any = siteData.sectionVisibility || {};
  const showHero = visible.hero !== false;
  const showManifesto = visible.manifesto !== false;
  const showDuality = visible.duality !== false;
  const showEcosystem = visible.ecosystem !== false;
  const showProducts = visible.products !== false;
  const showShop = visible.shop !== false;
  const showBodyworks = visible.bodyworks !== false;
  const showExhaleWork = visible.exhaleWork !== false;
  const showConcierge = visible.concierge !== false;
  const showPhilosophy = visible.philosophy !== false;
  const showVault = visible.vault !== false;
  const showArticles = visible.articles !== false;
  const showContact = visible.contact !== false;

  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  // Checkout form state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Booking Form state
  const [selectedTxId, setSelectedTxId] = useState<string>(siteData.bodyworks?.treatments?.[0]?.id || '');

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    hotelName: '',
    hotelRoom: '',
    preferredTime: '',
    therapistProfile: siteData.bodyworks?.cardTexts?.[0] || 'Senior Practitioner - General Recovery'
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Enquiry Form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    type: siteData.contact?.enquiries?.[0] || 'Product enquiry',
    message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Medical Articles reader states
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('All');
  const [articleSearchQuery, setArticleSearchQuery] = useState<string>('');
  const [selectedArticleToRead, setSelectedArticleToRead] = useState<MedicalArticle | null>(null);
  const [selectedProductSeo, setSelectedProductSeo] = useState<Product | null>(null);
  const [successTxId, setSuccessTxId] = useState<string>('');
  const [shareProductId, setShareProductId] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] = useState<{ total: number; items: OrderItem[] }>({ total: 0, items: [] });

  // Australian payment methods & compliance policies states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'afterpay' | 'payid' | 'apple_google_pay' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [afterpayDetails, setAfterpayDetails] = useState({ phoneOrEmail: '' });
  const [payidDetails, setPayidDetails] = useState({ bankName: '', reference: '' });

  // Dynamic SEO Canonical tag management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (selectedArticleToRead && selectedArticleToRead.seoCanonicalUrl) {
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', selectedArticleToRead.seoCanonicalUrl);
      } else {
        if (canonicalLink) {
          canonicalLink.removeAttribute('href');
        }
      }
    }
  }, [selectedArticleToRead]);

  // Handle Stripe redirect callbacks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('checkout') === 'success') {
        const sessionId = searchParams.get('session_id') || `STRIPE-${Math.floor(100000 + Math.random() * 900000)}`;
        setSuccessTxId(sessionId);
        
        let successOrderItems: { id: string; sku: string; name: string; price: number; qty: number }[] = [];
        let successTotal = 0;

        const pendingOrderJson = sessionStorage.getItem('culturx_pending_order');
        if (pendingOrderJson) {
          try {
            const pendingOrder = JSON.parse(pendingOrderJson);
            successOrderItems = pendingOrder.items.map((i: any) => ({
              id: i.product.id,
              sku: i.product.sku,
              name: i.product.name,
              price: i.product.salePriceVal !== undefined && i.product.salePriceVal !== null ? i.product.salePriceVal : i.product.priceVal,
              qty: i.qty
            }));
            successTotal = pendingOrder.totalAmount;

            pendingOrder.status = 'paid';
            pendingOrder.stripeSessionId = sessionId;
            onPlaceOrder(pendingOrder);

            sessionStorage.removeItem('culturx_pending_order');
          } catch(e) {
             console.error("Error parsing pending order", e);
          }
        }

        setSuccessSummary({ total: successTotal, items: successOrderItems });
        setCheckoutStep('success');
        setCartOpen(true);
        setCart([]);
        
        // Remove params from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (searchParams.get('checkout') === 'cancelled') {
        alert('Payment was cancelled. You can try again.');
        setCartOpen(true);
        setCheckoutStep('cart');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // activePolicyModal state stays local — only used in FooterSection
  const [activePolicyModal, setActivePolicyModal] = useState<'accessibility' | 'disclaimer' | 'privacy' | 'refund' | 'terms' | null>(null);

  // Share product helper
  const handleShareProduct = (platform: string, prod: Product) => {
    const shareUrl = `${window.location.origin}/?product=${prod.sku.toLowerCase()}`;
    const shareText = `Check out ${prod.name} on CulturX!`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      alert(`Copied link to clipboard: ${shareUrl}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
    setShareProductId(null);
  };

  const triggerNativeShare = async (prod: Product) => {
    const shareUrl = `${window.location.origin}/?product=${prod.sku.toLowerCase()}`;
    const shareText = `Check out ${prod.name} on CulturX!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: prod.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Native share cancelled or failed, falling back", err);
      }
    }
    setShareProductId(shareProductId === prod.id ? null : prod.id);
  };

  // Add to cart helper
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
    setCheckoutStep('cart');
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean) as { product: Product; qty: number }[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // total cart quantity
  const cartTotalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.product.salePriceVal !== undefined && item.product.salePriceVal !== null ? item.product.salePriceVal : item.product.priceVal;
    return acc + (price * item.qty);
  }, 0);

  // handle checkout submit
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all payment and shipping information.');
      return;
    }

    if (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'apple_google_pay') {
      setIsCheckoutLoading(true);
      try {
        const pendingOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const pendingOrder = {
          id: pendingOrderId,
          createdAt: new Date().toISOString(),
          customerInfo: { ...customerInfo },
          items: cart.map(item => ({
            product: item.product,
            qty: item.qty
          })),
          totalAmount: cartSubtotal,
          status: 'pending',
          paymentMethod: 'card'
        };
        sessionStorage.setItem('culturx_pending_order', JSON.stringify(pendingOrder));

        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map(item => ({
              id: item.product.id,
              name: item.product.name,
              sku: item.product.sku,
              qty: item.qty,
              price: item.product.salePriceVal !== undefined && item.product.salePriceVal !== null ? item.product.salePriceVal : item.product.priceVal,
              imageUrl: item.product.imageUrl
            })),
            customerInfo
          })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          alert('Failed to initialize secure checkout: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(err);
        alert('Network error initializing checkout.');
      }
      setIsCheckoutLoading(false);
      return;
    }

    // Mock local payments (Afterpay, PayID, PayPal)
    onPlaceOrder({
      clientName: customerInfo.name,
      clientEmail: customerInfo.email,
      clientPhone: customerInfo.phone,
      shippingAddress: customerInfo.address,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        qty: item.qty,
        price: item.product.salePriceVal !== undefined && item.product.salePriceVal !== null ? item.product.salePriceVal : item.product.priceVal
      })),
      totalAmount: cartSubtotal
    });

    const randomTxId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    setSuccessTxId(randomTxId);
    setSuccessSummary({
      total: cartSubtotal,
      items: cart.map(item => ({
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        category: item.product.category,
        price: item.product.salePriceVal !== undefined && item.product.salePriceVal !== null ? item.product.salePriceVal : item.product.priceVal,
        qty: item.qty
      }))
    });

    setCheckoutStep('success');
    setCart([]);
  };

  // handle booking submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.hotelName || !bookingForm.preferredTime) {
      alert('Please fill in all required fields marked with (*).');
      return;
    }

    const txObj = siteData.bodyworks?.treatments?.find(t => t.id === selectedTxId);
    if (!txObj) return;

    onBookTreatment({
      treatmentId: txObj.id,
      treatmentName: txObj.name,
      costUSD: txObj.costUSD,
      durationMin: txObj.durationMin,
      clientName: bookingForm.name,
      clientEmail: bookingForm.email,
      clientPhone: bookingForm.phone,
      hotelName: bookingForm.hotelName,
      hotelRoom: bookingForm.hotelRoom,
      preferredTime: bookingForm.preferredTime,
      therapistProfile: bookingForm.therapistProfile
    });

    setBookingSuccess(true);
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      hotelName: '',
      hotelRoom: '',
      preferredTime: '',
      therapistProfile: 'Senior Practitioner'
    });
    setTimeout(() => setBookingSuccess(false), 9000);
  };

  // handle contact submit
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.message) {
      alert('Please fill in your Name, Email, and Message.');
      return;
    }

    onSubmitEnquiry({
      clientName: enquiryForm.name,
      clientEmail: enquiryForm.email,
      enquiryType: enquiryForm.type,
      message: enquiryForm.message
    });

    setEnquirySuccess(true);
    setEnquiryForm({
      name: '',
      email: '',
      type: siteData.contact?.enquiries?.[0] || 'Product enquiry',
      message: ''
    });
    setTimeout(() => setEnquirySuccess(false), 9000);
  };

  const activeTreatment = siteData.bodyworks?.treatments?.find(t => t.id === selectedTxId);

  return (
    <div id="top" className="min-h-screen bg-brand-black text-white relative flex flex-col selection:bg-brand-gold selection:text-brand-black">

      {/* MAINTENANCE MODE SCREEN */}
      {appSettings.store.maintenanceMode && (
        <div className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center text-center px-6">
          <div className="space-y-6 max-w-md">
            <p className="text-brand-gold font-mono text-xs uppercase tracking-widest animate-pulse">System Maintenance</p>
            <h1 className="text-4xl font-black tracking-[4px] text-white font-display uppercase">{brandName}</h1>
            <div className="w-16 h-0.5 bg-brand-gold/40 mx-auto rounded-full" />
            <p className="text-sm text-brand-soft leading-relaxed">{appSettings.store.maintenanceMessage}</p>
            <button
              onClick={toggleCms}
              className="mt-4 text-[10px] text-slate-600 hover:text-slate-400 transition font-mono uppercase tracking-widest"
            >
              Admin Access →
            </button>
          </div>
        </div>
      )}

      {/* STRUCTURED JSON-LD SCHEMAS FOR SEO CRAWLERS & ACTIVE SEARCH CRITERIA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://culturx.com.au/#organization",
                "name": "CulturX™ Australia",
                "url": "https://culturx.com.au",
                "logo": "https://culturx.com.au/logo.png",
                "sameAs": [
                  "https://instagram.com/culturx.au",
                  "https://linkedin.com/company/culturx-au"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+61-457-788-884",
                  "contactType": "customer service",
                  "email": "GP@Culturx.com.au",
                  "areaServed": "AU"
                }
              },
              {
                "@type": "MedicalBusiness",
                "@id": "https://culturx.com.au/#localbusiness",
                "name": "CulturX™ Melbourne Clinic — Human Biohacking Recovery",
                "image": "https://picsum.photos/seed/culturx/800/600",
                "telephone": "+61 457 788 884",
                "email": "GP@Culturx.com.au",
                "priceRange": "$$$",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Collins Street Corridor",
                  "addressLocality": "Melbourne",
                  "addressRegion": "Victoria",
                  "postalCode": "3000",
                  "addressCountry": "AU"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "-37.8136",
                  "longitude": "144.9631"
                },
                "url": "https://culturx.com.au",
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "07:00",
                  "closes": "22:00"
                }
              }
            ]
          })
        }}
      />

      {/* HEADER NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-24 py-4 bg-brand-black/90 border-b border-brand-line/50 backdrop-blur-md">
        <div className="brand" id="nav-brand">
          <a href="#top" className="text-xl font-bold tracking-[3px] text-brand-gold font-display transition hover:opacity-80">
            {siteData.hero.brandLogo}
          </a>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-wider font-semibold">
          <a href="#manifesto" className="text-brand-soft hover:text-brand-gold transition duration-200">Manifesto</a>
          <a href="#duality" className="text-brand-soft hover:text-brand-gold transition duration-200">Systems</a>
          <a href="#ecosystem" className="text-brand-soft hover:text-brand-gold transition duration-200">Ecosystem</a>
          <a href="#products" className="text-brand-soft hover:text-brand-gold transition duration-200">Products</a>
          <a href="#shop" className="text-brand-soft hover:text-brand-gold transition duration-200">Shop</a>
          <a href="#bodyworks" className="text-brand-soft hover:text-brand-gold transition duration-200">Bodyworks</a>
          <a href="#exhalework" className="text-brand-soft hover:text-brand-gold transition duration-200">ExhaleWork</a>
          <a href="#articles" className="text-brand-soft hover:text-brand-gold transition duration-200">Articles</a>
          <a href="#philosophy" className="text-brand-soft hover:text-brand-gold transition duration-200">Philosophy</a>
          <a href="#contact" className="text-brand-soft hover:text-brand-gold transition duration-200">Contact</a>
        </div>

        <div className="flex items-center space-x-3">
          {/* Shopping cart trigger */}
          <button 
            id="cart-toggle-btn"
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 bg-neutral-950 border border-brand-line/45 rounded-full hover:bg-neutral-900 transition text-brand-gold"
            aria-label="Toggle Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartTotalQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartTotalQty}
              </span>
            )}
          </button>

          {/* Central Admin CMS Link */}
          <button
            id="cms-toggle-btn"
            onClick={toggleCms}
            className="hidden sm:flex items-center space-x-2 text-xs bg-brand-gold/15 border border-brand-gold text-brand-gold px-4 py-2 rounded-full cursor-pointer hover:bg-brand-gold hover:text-brand-black font-semibold transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>
            <span>CMS Portal</span>
          </button>

          {/* Mobile menu trigger */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-soft hover:text-brand-gold transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE SCREEN NAVIGATION OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-brand-black/95 backdrop-blur-xl border-b border-brand-line/60 py-8 px-6 flex flex-col space-y-3 text-center text-xs font-semibold uppercase tracking-widest lg:hidden shadow-2xl"
          >
            <a href="#manifesto" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Manifesto</a>
            <a href="#duality" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Systems</a>
            <a href="#ecosystem" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Ecosystem</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Products</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Shop</a>
            <a href="#bodyworks" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Bodyworks</a>
            <a href="#exhalework" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">ExhaleWork</a>
            <a href="#articles" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Articles</a>
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-brand-line/10 text-brand-soft hover:text-brand-gold transition duration-200">Philosophy</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-3 text-brand-soft hover:text-brand-gold transition duration-200">Contact</a>
            
            <button
              onClick={() => { setMobileMenuOpen(false); toggleCms(); }}
              className="mt-4 w-full py-3 bg-brand-gold/15 border border-brand-gold text-brand-gold rounded-full text-xs font-bold tracking-wider hover:bg-brand-gold hover:text-brand-black transition duration-250 cursor-pointer"
            >
              ⚙️ CMS Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER PANEL */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-screen max-w-md bg-neutral-950 border-l border-brand-line flex flex-col shadow-2xl h-full"
              >
                {/* Drawer Header */}
                <div className="px-6 py-5 border-b border-brand-line flex items-center justify-between bg-neutral-900">
                  <div className="flex items-center space-x-2 text-brand-gold">
                    <ShoppingCart className="w-5 h-5" />
                    <h2 className="text-md font-bold uppercase tracking-wider font-display">Optimization Cart</h2>
                  </div>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="p-1 rounded-full text-brand-soft hover:text-brand-gold hover:bg-neutral-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {checkoutStep === 'cart' && (
                    <>
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-center py-12">
                          <ShoppingBag className="w-12 h-12 text-zinc-600 mb-4" />
                          <h3 className="text-md font-semibold text-zinc-400">Your Cart is Empty</h3>
                          <p className="text-xs text-zinc-500 mt-2 max-w-xs">
                            Browse the shop below and add premium precision products into your personal recovery protocol.
                          </p>
                          <button 
                            onClick={() => setCartOpen(false)}
                            className="mt-6 px-6 py-2.5 bg-zinc-900 border border-brand-line text-xs font-bold uppercase rounded-full text-brand-gold hover:bg-neutral-900 transition"
                          >
                            Return to Shop
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-brand-soft uppercase tracking-wider mb-2">Selected Products:</p>
                          {cart.map((item, index) => (
                            <div key={item.product.id || index} className="p-4 bg-neutral-900 rounded-xl border border-brand-line/30 flex items-start gap-3 justify-between">
                              {item.product.imageUrl && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                                  <img 
                                    src={item.product.imageUrl} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 pr-1">
                                <span className="text-[9px] text-brand-gold uppercase tracking-widest font-mono font-bold block">{item.product.category}</span>
                                <h4 className="text-sm font-semibold text-white mt-1 truncate">{item.product.name}</h4>
                                <p className="text-xs text-brand-gold font-bold mt-1 font-mono">
                                  {item.product.salePriceVal !== undefined && item.product.salePriceVal !== null ? (
                                    <>
                                      <span className="line-through text-zinc-505 text-zinc-500 mr-2">${item.product.priceVal}</span>
                                      <span>${item.product.salePriceVal} USD</span>
                                    </>
                                  ) : (
                                    `$${item.product.priceVal} USD`
                                  )}
                                </p>
                                <span className="text-[9px] text-zinc-500 block truncate">SKU: {item.product.sku}</span>
                              </div>
                              <div className="flex flex-col items-end space-y-4 shrink-0">
                                <button 
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-zinc-500 hover:text-red-400 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="flex items-center space-x-2 bg-neutral-950 px-2.5 py-1.5 rounded-full border border-neutral-800">
                                  <button onClick={() => updateCartQty(item.product.id, -1)} className="text-brand-soft hover:text-brand-gold font-bold text-xs px-1">-</button>
                                  <span className="text-xs font-mono text-white font-semibold">{item.qty}</span>
                                  <button onClick={() => updateCartQty(item.product.id, 1)} className="text-brand-soft hover:text-brand-gold font-bold text-xs px-1">+</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {checkoutStep === 'shipping' && (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4 py-2">
                      <div className="flex items-center space-x-2 border-b border-brand-line pb-3">
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Provide Delivery Details</span>
                      </div>
                      
                      <div>
                        <label className="text-[11px] text-brand-soft uppercase tracking-widest font-semibold block mb-1">Your Name *</label>
                        <input 
                          type="text" 
                          required
                          value={customerInfo.name}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Gabriela"
                          className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white" 
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-brand-soft uppercase tracking-widest font-semibold block mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={customerInfo.email}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="client@culturx.com"
                          className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white" 
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-brand-soft uppercase tracking-widest font-semibold block mb-1">Phone Number *</label>
                        <input 
                          type="text" 
                          required
                          value={customerInfo.phone}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+61 457 788 884"
                          className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white" 
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-brand-soft uppercase tracking-widest font-semibold block mb-1">Shipping & Carriage Address *</label>
                        <textarea 
                          rows={3} 
                          required
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="12/35 Collins St, Melbourne, VIC 3000, Australia"
                          className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white" 
                        />
                      </div>

                      {/* AUSTRALIAN STANDARD PAYMENT SELECTION */}
                      <div className="space-y-3 pt-2">
                        <label className="text-[11.5px] text-brand-gold font-mono uppercase tracking-[2px] font-bold block">
                          Payment Method *
                        </label>
                        
                        {/* Selector Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                          {paymentConfig.card?.enabled && (
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentMethod('card')}
                              className={`p-3 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between h-[76px] ${
                                selectedPaymentMethod === 'card'
                                  ? 'bg-brand-gold/10 border-brand-gold text-white'
                                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-brand-soft'
                              }`}
                            >
                              <CreditCard className="w-4 h-4 text-brand-gold" />
                              <div>
                                <span className="block font-bold">{paymentConfig.card?.title || 'Credit/Debit Card'}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">{paymentConfig.card?.details || 'AU Visa, Mastercard'}</span>
                              </div>
                            </button>
                          )}

                          {paymentConfig.afterpay?.enabled && (
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentMethod('afterpay')}
                              className={`p-3 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between h-[76px] ${
                                selectedPaymentMethod === 'afterpay'
                                  ? 'bg-[#b2f2d2]/15 border-emerald-400 text-white'
                                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-brand-soft'
                              }`}
                            >
                              <span className="text-emerald-400 font-extrabold text-[10px] tracking-widest font-mono">AFTERPAY ❖</span>
                              <div>
                                <span className="block font-bold text-emerald-300">{paymentConfig.afterpay?.title || 'Afterpay AU'}</span>
                                <span className="text-[9px] text-emerald-400/80 font-mono">{paymentConfig.afterpay?.details || '4 Interest-Free Split'}</span>
                              </div>
                            </button>
                          )}

                          {paymentConfig.payid?.enabled && (
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentMethod('payid')}
                              className={`p-3 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between h-[76px] ${
                                selectedPaymentMethod === 'payid'
                                  ? 'bg-indigo-500/10 border-indigo-400 text-white'
                                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-brand-soft'
                              }`}
                            >
                              <Landmark className="w-4 h-4 text-indigo-400" />
                              <div>
                                <span className="block font-bold text-indigo-200">{paymentConfig.payid?.title || 'PayID / Osko'}</span>
                                <span className="text-[9px] text-indigo-400/80 font-mono">{paymentConfig.payid?.details || 'Direct AU Transfer'}</span>
                              </div>
                            </button>
                          )}

                          {paymentConfig.apple_google_pay?.enabled && (
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentMethod('apple_google_pay')}
                              className={`p-3 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between h-[76px] ${
                                selectedPaymentMethod === 'apple_google_pay'
                                  ? 'bg-brand-gold/10 border-brand-gold text-white'
                                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-brand-soft'
                              }`}
                            >
                              <Wallet className="w-4 h-4 text-brand-gold" />
                              <div>
                                <span className="block font-bold">{paymentConfig.apple_google_pay?.title || 'Smart Wallet'}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">{paymentConfig.apple_google_pay?.details || 'Apple & Google Pay'}</span>
                              </div>
                            </button>
                          )}
                        </div>

                        {/* Extra selector for Paypal */}
                        {paymentConfig.paypal?.enabled && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedPaymentMethod('paypal')}
                              className={`px-3 py-1.5 rounded-lg border text-[9px] font-mono font-semibold uppercase tracking-wider cursor-pointer transition ${
                                selectedPaymentMethod === 'paypal'
                                  ? 'bg-blue-500/10 border-blue-400 text-blue-300'
                                  : 'bg-neutral-900 border-neutral-800 text-brand-soft hover:text-white'
                              }`}
                            >
                              {paymentConfig.paypal?.title || 'Pay with PayPal AU'}
                            </button>
                          </div>
                        )}

                        {/* Dynamic fields based on Payment Method */}
                        <div className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-xl space-y-3 font-sans text-xs">
                          {selectedPaymentMethod === 'card' && (
                            <div className="space-y-3 animate-fadeIn">
                              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-zinc-500 block border-b border-neutral-900 pb-1.5">Secure Credit Card Transaction</span>
                              <div>
                                <label className="text-[10px] text-zinc-400 block mb-1">Card Number *</label>
                                <input
                                  type="text"
                                  required
                                  value={cardDetails.number}
                                  onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                  placeholder="4540 1234 5678 9012"
                                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-brand-gold text-xs"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-zinc-400 block mb-1">Expiry *</label>
                                  <input
                                    type="text"
                                    required
                                    value={cardDetails.expiry}
                                    onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    placeholder="MM/YY"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono placeholder-zinc-700 text-center focus:outline-none focus:border-brand-gold text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-zinc-400 block mb-1">CVV *</label>
                                  <input
                                    type="text"
                                    required
                                    value={cardDetails.cvv}
                                    onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    placeholder="123"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono placeholder-zinc-700 text-center focus:outline-none focus:border-brand-gold text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedPaymentMethod === 'afterpay' && (
                            <div className="space-y-2 animate-fadeIn">
                              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-emerald-400 flex items-center justify-between border-b border-neutral-900 pb-1.5 w-full">
                                <span>Afterpay Installments Timeline</span>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded font-mono uppercase">Interest-Free AU</span>
                              </span>
                              
                              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                                Split your total of <strong className="text-emerald-300">${cartSubtotal} USD</strong> into 4 interest-free payments of <strong className="text-emerald-300">${(cartSubtotal / 4).toFixed(2)} USD</strong> fortnightly.
                              </p>

                              <div className="space-y-2.5 pt-1.5 text-[10px] font-mono">
                                <div className="flex items-start space-x-2 text-emerald-400/90 bg-emerald-500/5 p-2 rounded border border-emerald-500/10 leading-normal font-sans">
                                  <span className="text-xs pt-0.5">❖</span>
                                  <span>The first installment of ${(cartSubtotal / 4).toFixed(2)} USD will be processed today.</span>
                                </div>
                                <div className="font-sans">
                                  <label className="text-[10px] text-zinc-400 block mb-1">Afterpay Account Identifier (Email or Mobile) *</label>
                                  <input
                                    type="text"
                                    required
                                    value={afterpayDetails.phoneOrEmail}
                                    onChange={e => setAfterpayDetails({ phoneOrEmail: e.target.value })}
                                    placeholder="e.g. +61 457 788 884 or customer@domain.au"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-[#b2f2d2] text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedPaymentMethod === 'payid' && (
                            <div className="space-y-3 animate-fadeIn">
                              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-indigo-400 block border-b border-neutral-900 pb-1.5">Direct PayID (Osko Instant Transfer)</span>
                              <div className="bg-[#0b0c16] border border-indigo-500/20 p-3 rounded-lg text-zinc-300 text-[10px] leading-relaxed space-y-1 font-mono">
                                <p className="text-white font-sans text-xs mb-1 font-bold">How to pay instantly via your banking app:</p>
                                <p><span className="text-zinc-500">PayID Email:</span> <strong className="text-brand-gold">{paymentConfig.payid?.payidEmail || 'finance@culturx.com.au'}</strong></p>
                                <p><span className="text-zinc-500">Business ABN:</span> <strong className="text-white">{paymentConfig.payid?.businessAbn || '84 657 788 884'}</strong></p>
                                <p><span className="text-zinc-500">Amount to send:</span> <strong className="text-brand-gold">${cartSubtotal} USD</strong></p>
                              </div>
                              <div className="space-y-2 font-sans text-xs">
                                <div>
                                  <label className="text-[10px] text-zinc-400 block mb-1">Your Banking Entity (e.g. CBA, NAB, Westpac, ANZ) *</label>
                                  <input
                                    type="text"
                                    required
                                    value={payidDetails.bankName}
                                    onChange={e => setPayidDetails({ ...payidDetails, bankName: e.target.value })}
                                    placeholder="e.g. Commonwealth Bank of Australia"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-400 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-zinc-400 block mb-1">Your Transaction Memo Reference / Code *</label>
                                  <input
                                    type="text"
                                    required
                                    value={payidDetails.reference}
                                    onChange={e => setPayidDetails({ ...payidDetails, reference: e.target.value })}
                                    placeholder="e.g. CULTURX-ORDER"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-indigo-400 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedPaymentMethod === 'apple_google_pay' && (
                            <div className="space-y-3 text-center py-2 animate-fadeIn">
                              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-zinc-500 block border-b border-neutral-900 pb-1.5">Express Digital Wallet Authorization</span>
                              <div className="flex flex-col space-y-2 max-w-[240px] mx-auto pt-1">
                                <button
                                  type="button"
                                  onClick={() => alert('Apple Pay is integrated in sandbox mode. Click "Place Order" to finalize.')}
                                  className="bg-white hover:bg-zinc-100 text-black py-2 rounded-xl font-bold font-sans uppercase tracking-wider text-[10.5px] flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md"
                                >
                                  <span> Pay with Apple Pay</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => alert('Google Pay is integrated in sandbox mode. Click "Place Order" to finalize.')}
                                  className="bg-[#1f1f1f] hover:bg-black border border-neutral-800 text-white py-2 rounded-xl font-sans text-[10.5px] flex items-center justify-center space-x-1.5 transition cursor-pointer"
                                >
                                  <span className="text-zinc-300 font-bold">Google Pay</span>
                                </button>
                              </div>
                              <p className="text-[9px] text-zinc-500 font-mono leading-relaxed pt-2">
                                Placing your order authorizes simulated digital payment authorization with your authenticated device credentials.
                              </p>
                            </div>
                          )}

                          {selectedPaymentMethod === 'paypal' && (
                            <div className="space-y-2 animate-fadeIn">
                              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-blue-400 block border-b border-neutral-900 pb-1.5">PayPal Australia Secure Checkout</span>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">
                                Enter your registered PayPal address. We will launch a simulated PayPal gateway window upon pressing placement.
                              </p>
                              <div>
                                <label className="text-[10px] text-zinc-400 block mb-1">PayPal Account Email *</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="e.g. user@paypal.com.au"
                                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-blue-400 text-xs"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800 text-[11px] text-zinc-400 space-y-2">
                        <div className="flex items-center space-x-2 text-brand-gold mb-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="font-bold uppercase tracking-wider">Culturx Precision Delivery</span>
                        </div>
                        <p>Orders are dispatched from Melbourne utilizing climate-controlled transport bags to safeguard raw active ferments and bioactive lipids.</p>
                      </div>
                    </form>
                  )}

                  {checkoutStep === 'success' && (
                    <div className="h-full flex flex-col justify-center items-center text-center py-12 space-y-4">
                      <div className="bg-brand-gold/10 p-5 rounded-full border border-brand-gold">
                        <CheckCircle className="w-10 h-10 text-brand-gold" />
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">System Actioned</h3>
                      <p className="text-xs text-brand-soft">
                        Your order details have been synchronized into the CulturX recovery core queue. Our dispatch coordinator will notify you using your contact credentials once verification clears.
                      </p>
                      <div className="p-4 bg-neutral-900 rounded-xl text-left border border-brand-line/45 w-full mt-4">
                        <span className="text-[10px] text-zinc-500 font-mono block">SIMULATED ORDER INCOMING</span>
                        <p className="text-xs text-brand-gold font-semibold mt-1">Transaction logged into CMS portal database!</p>
                      </div>

                      {/* ADVANCED ECOMMERCE SEO TRACKING EVENT */}
                      <div className="p-4 bg-[#0a0a0a] rounded-xl text-left border border-brand-line/35 w-full space-y-2.5 font-mono text-[10.5px]">
                        <div className="flex items-center justify-between text-brand-gold border-b border-brand-line/10 pb-1 font-bold">
                          <span>📊 ADVANCED ECOMMERCE SEO LOGS</span>
                          <span className="text-green-500">RUNNING LIVE</span>
                        </div>
                        <div className="space-y-1">
                          <p><span className="text-brand-soft">Gtag Event:</span> <span className="text-white">&quot;purchase&quot;</span></p>
                          <p><span className="text-brand-soft">Transaction ID:</span> <span className="text-white">{successTxId}</span></p>
                          <p><span className="text-brand-soft">Payment Method:</span> <span className="text-[#b2f2d2] uppercase">{selectedPaymentMethod}</span></p>
                          <p><span className="text-brand-soft">Value:</span> <span className="text-brand-gold">${successSummary.total} USD</span></p>
                          <p><span className="text-brand-soft">Local Segment:</span> <span className="text-white">Melbourne, Australia</span></p>
                        </div>
                        <pre className="bg-black/90 p-2.5 rounded text-[8.5px] text-zinc-300 overflow-x-auto max-h-24 leading-normal scrollbar-thin">
{`gtag('event', 'purchase', {
  transaction_id: '${successTxId}',
  value: ${successSummary.total},
  currency: 'USD',
  payment_method: '${selectedPaymentMethod.toUpperCase()}',
  shipping_tier: 'Melbourne Express Dispatched',
  items: ${JSON.stringify(successSummary.items.map(item => ({
    item_id: item.sku,
    item_name: item.name,
    price: item.price,
    quantity: item.qty
  })), null, 2)}
});`}
                        </pre>
                      </div>

                      <button 
                        onClick={() => {
                          setCartOpen(false);
                          setCheckoutStep('cart');
                        }}
                        className="mt-6 px-8 py-3 bg-brand-gold text-brand-black text-xs font-bold uppercase rounded-full hover:opacity-90 transition"
                      >
                        Acknowledge
                      </button>
                    </div>
                  )}
                </div>

                {/* Drawer Footer */}
                {cart.length > 0 && checkoutStep !== 'success' && (
                  <div className="px-6 py-5 border-t border-brand-line bg-neutral-900 space-y-4">
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span>Items Count:</span>
                        <span className="font-mono text-white">{cartTotalQty} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carriage & Tax:</span>
                        <span className="font-mono text-zinc-500">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                        <span className="text-brand-gold uppercase tracking-widest text-xs">Direct Subtotal:</span>
                        <span className="font-mono text-brand-gold">${cartSubtotal} USD</span>
                      </div>
                    </div>

                    {checkoutStep === 'cart' ? (
                      <button 
                        onClick={() => setCheckoutStep('shipping')}
                        className="w-full py-3 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider rounded-full hover:opacity-95 transition flex items-center justify-center space-x-2"
                      >
                        <span>Proceed to Carrier</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setCheckoutStep('cart')}
                          className="w-1/3 py-3 bg-neutral-950 border border-brand-line text-brand-gold text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-neutral-900 transition"
                        >
                          Back
                        </button>
                        <button 
                          onClick={handleCheckoutSubmit}
                          disabled={isCheckoutLoading}
                          className="w-2/3 py-3 bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider rounded-full hover:opacity-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isCheckoutLoading ? 'Processing...' : 'Place Order'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT MODE ALERT FOR CMS CHANGE */}
      <AIChatbot siteData={siteData} />

      {/* HERO SECTION */}
      {showHero && (
      <section className="relative min-h-[60vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-24 pt-24 xs:pt-28 sm:pt-32 pb-8 sm:pb-12 bg-radial-gradient">
        {/* Glow ambient circle background as requested in original style */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-brand-gold/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="kicker text-[12px] uppercase tracking-[6px] text-brand-gold font-bold font-mono">
              {siteData.hero.brandKicker}
            </div>
            
            <h1 className="text-4xl xs:text-5xl md:text-7xl lg:text-8xl font-black tracking-[4px] xs:tracking-[8px] font-display mb-2 uppercase leading-[1.05] text-white">
              {siteData.hero.brandLogo}
            </h1>

            <h2 className="text-md md:text-xl font-bold tracking-[4px] font-sans text-brand-soft uppercase mt-4 max-w-3xl mx-auto">
              {siteData.hero.subline}
            </h2>

            <p className="text-xs md:text-sm font-mono text-indigo-400 font-bold tracking-[3px] uppercase mt-2">
              The Future of Health Engineering.
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-brand-soft text-sm md:text-base max-w-3xl mx-auto leading-relaxed pt-2"
          >
            {siteData.hero.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <a 
              href="#shop" 
              className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-brand-black bg-gradient-to-r from-brand-gold to-yellow-600 rounded-full transition duration-300 hover:scale-105"
            >
              Shop the System
            </a>
            <a 
              href="#bodyworks" 
              className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-brand-gold border border-brand-line hover:border-brand-gold rounded-full bg-transparent hover:bg-neutral-900/40 transition duration-300"
            >
              Book Clinical Bodywork
            </a>
          </motion.div>
        </div>
      </section>
      )}

      {/* MANIFESTO SECTION */}
      {showManifesto && (
      <section id="manifesto" className="bg-brand-black py-10 sm:py-12 px-4 sm:px-6 lg:px-24 border-t border-brand-line/30 scroll-mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="kicker text-center text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block mb-4">
            {siteData.manifesto.kicker}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center uppercase font-display mb-6 text-white tracking-wide">
            {siteData.manifesto.heading}
          </h2>

          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            className="card bg-neutral-950 border border-brand-line/75 rounded-[24px] p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-xl rounded-full" />
            
            <div className="space-y-6 sm:space-y-8">
              {/* Introduction terms */}
              <div className="space-y-4 text-center max-w-2xl mx-auto">
                <p className="text-base md:text-lg font-bold tracking-tight text-white leading-relaxed font-display">
                  {siteData.manifesto.terms[0] || "Through discipline, structure, and intelligent systems… comes freedom."}
                </p>
                <div className="flex justify-center items-center space-x-4 py-1">
                  <span className="h-px bg-neutral-800 w-8 md:w-12"></span>
                  <span className="text-brand-gold text-xs font-black uppercase tracking-[4px] font-mono">
                    {siteData.manifesto.terms[1] || "Not restriction. Liberation."}
                  </span>
                  <span className="h-px bg-neutral-800 w-8 md:w-12"></span>
                </div>
              </div>

              {/* Duality section: Freedom From vs. Freedom To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Freedom From - Clinical Downregulation */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 p-5 sm:p-6 rounded-2xl space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-[#aa8612] font-black uppercase block border-b border-neutral-900 pb-2">
                    Dissolving Restrictions
                  </span>
                  <ul className="space-y-3.5 text-xs text-zinc-400">
                    {(siteData.manifesto.terms.slice(2, 10).length > 0 
                      ? siteData.manifesto.terms.slice(2, 10) 
                      : [
                          "Freedom from disorder.",
                          "Freedom from stagnation.",
                          "Freedom from dysfunction.",
                          "Freedom from unnecessary suffering.",
                          "Freedom from bloating.",
                          "Freedom from inflammation.",
                          "Freedom from fatigue.",
                          "Freedom from nervous system overload."
                        ]
                    ).map((term, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="text-red-500/80 font-bold shrink-0">✕</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Freedom To - Performance Activation */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 p-5 sm:p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-brand-gold font-black uppercase block border-b border-neutral-900 pb-2">
                      Activating Human Potential
                    </span>
                    <ul className="space-y-4 text-xs text-zinc-300">
                      {(siteData.manifesto.terms.slice(10, 14).length > 0
                        ? siteData.manifesto.terms.slice(10, 14)
                        : [
                            "Freedom to think clearly.",
                            "Freedom to move freely.",
                            "Freedom to perform optimally.",
                            "Freedom to become what you are capable of becoming."
                          ]
                      ).map((term, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5">
                          <span className="text-brand-gold font-bold shrink-0">✓</span>
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 hidden md:block">
                    <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">System Integration Level: Elite</span>
                  </div>
                </div>
              </div>

              {/* Conclusion term */}
              <div className="text-center max-w-xl mx-auto pt-6 border-t border-neutral-900">
                <p className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 mb-1">THE SOVEREIGN STATE</p>
                <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed font-display">
                  {siteData.manifesto.terms[14] || "The ultimate freedom is not escape."}{" "}
                  <span className="text-brand-gold block md:inline font-bold">
                    {siteData.manifesto.terms[15] || "It is the ability to fully inhabit yourself."}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* SYSTEMS SPLIT BENTO */}
      {showDuality && (
      <section id="duality" className="scroll-mt-12 border-t border-b border-brand-line/30">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Black System */}
          <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 px-4 sm:px-8 lg:px-20 py-12 sm:py-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-brand-line/30 min-h-[300px] sm:min-h-[400px]">
            <div className="max-w-lg mx-auto space-y-6">
              <span className="text-[10px] tracking-[4px] font-mono text-brand-gold font-bold uppercase">{siteData.blackSystem.kicker}</span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-display leading-[1.1] tracking-tight">
                {siteData.blackSystem.heading.split('.').map(p => p.trim()).filter(Boolean).map((part, index, arr) => {
                  const isGold = part.toLowerCase() === 'activation';
                  return (
                    <React.Fragment key={index}>
                      <span className={isGold ? "text-brand-gold" : "text-white"}>{part}</span>
                      {index < arr.length - 1 && <span className={isGold ? "text-brand-gold" : "text-white"}>.</span>}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  );
                })}
              </h2>
              <div className="space-y-4">
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                  {siteData.blackSystem.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {siteData.blackSystem.pills.map((pill, idx) => (
                  <span key={idx} className="inline-block border border-brand-line/50 rounded-full px-4 py-2 text-[10px] font-mono font-bold tracking-widest uppercase text-brand-gold bg-neutral-900">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* White System */}
          <div className="bg-gradient-to-br from-neutral-100 to-amber-50/70 text-zinc-900 px-4 sm:px-8 lg:px-20 py-12 sm:py-14 flex flex-col justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="max-w-lg mx-auto space-y-6">
              <span className="text-[10px] tracking-[4px] font-mono text-[#aa8612] font-semibold uppercase">{siteData.whiteSystem.kicker}</span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-950 uppercase font-display leading-[1.1] tracking-tight">
                {siteData.whiteSystem.heading.split('.').map(p => p.trim()).filter(Boolean).map((part, index, arr) => {
                  const isHighlight = part.toLowerCase() === 'regulation';
                  return (
                    <React.Fragment key={index}>
                      <span className={isHighlight ? "text-[#aa8612]" : "text-neutral-950"}>{part}</span>
                      {index < arr.length - 1 && <span className={isHighlight ? "text-[#aa8612]" : "text-neutral-950"}>.</span>}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  );
                })}
              </h2>
              <div className="space-y-4">
                <p className="text-zinc-700 text-xs md:text-sm leading-relaxed">
                  {siteData.whiteSystem.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {siteData.whiteSystem.pills.map((pill, idx) => (
                  <span key={idx} className="inline-block border border-[#aa8612]/35 rounded-full px-4 py-2 text-[10px] font-mono font-black tracking-widest uppercase text-[#aa8612] bg-white/70">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integration Hub / Connecting Ribbon */}
        <div className="bg-neutral-950 border-t border-brand-line/25 py-6 px-6 text-center">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse shrink-0"></span>
            <p className="text-xs font-mono font-semibold text-brand-soft uppercase tracking-[3px]">
              Together they form one integrated system.
            </p>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse shrink-0 hidden md:block"></span>
          </div>
        </div>
      </section>
      )}

      {/* ECOSYSTEM BENTO GRID */}
      {showEcosystem && (
      <section id="ecosystem" className="bg-gradient-to-br from-[#0c0c0c] to-black py-10 sm:py-12 px-4 sm:px-6 lg:px-24 border-t border-b border-brand-line/30 scroll-mt-12">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center">
            <span className="kicker text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block mb-2">{siteData.ecosystem.kicker}</span>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display text-white">
              {siteData.ecosystem.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteData.ecosystem.items.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -6, borderColor: 'rgba(212,175,55,.85)' }}
                className="bg-neutral-950 border border-brand-line/50 p-6 rounded-[20px] shadow-lg flex flex-col justify-between transition-all duration-300 relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 bg-brand-gold/10 text-brand-gold rounded-full border border-brand-gold/20">
                    CX · {item.title}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover:animate-ping" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-white mb-2">{item.title}</h3>
                  <p className="text-brand-gold text-xs font-semibold mb-3">{item.subtitle}</p>
                  <p className="text-zinc-400 text-xs leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* PRODUCT SYSTEM VIEW */}
      {showProducts && (
      <section id="products" className="bg-gradient-to-b from-white to-[#f7f3ea] text-zinc-900 py-10 sm:py-14 px-4 sm:px-6 lg:px-24 scroll-mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Section header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[4px] text-[#9c741d] font-mono font-black block">CulturX Product System</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-950 uppercase font-display tracking-tight leading-none">
              Internal Order.<br />
              <span className="text-[#a5801e]">External Excellence.</span>
            </h2>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {siteData.products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl border border-[#9c741d]/20 hover:border-[#d4af37]/60 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#fdfaf4]">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#c4a84a] text-3xl">🧬</div>
                  )}
                  {/* Category badge overlay */}
                  <span className="absolute top-3 left-3 text-[9px] font-black font-mono tracking-wider text-[#7a5c10] bg-[#fdf8e8]/90 backdrop-blur-sm border border-[#c4a84a]/30 px-2.5 py-1 rounded-full uppercase">
                    {prod.category}
                  </span>
                  {prod.isComingSoon && (
                    <span className="absolute top-3 right-3 text-[9px] font-black font-mono tracking-wider text-amber-800 bg-amber-100/90 backdrop-blur-sm border border-amber-300/50 px-2.5 py-1 rounded-full uppercase">
                      Soon
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4 space-y-3">
                  {/* Name + description */}
                  <div>
                    <h3 className="text-sm font-black font-display text-neutral-900 uppercase leading-tight tracking-wide">
                      {prod.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-650 mt-1.5 leading-relaxed line-clamp-3">
                      {prod.description}
                    </p>
                  </div>

                  {/* Feature pills */}
                  {prod.features && prod.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {prod.features.slice(0, 3).map((feat, i) => (
                        <span key={i} className="text-[9px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-full">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer: price + SKU */}
                  <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[9px] text-zinc-400 font-mono">{prod.sku}</span>
                    <div className="text-right">
                      {prod.isComingSoon ? (
                        <span className="text-[10px] text-amber-700 font-mono font-bold">Coming Soon</span>
                      ) : prod.salePriceVal !== undefined && prod.salePriceVal !== null ? (
                        <div>
                          <span className="line-through text-[10px] text-zinc-400 mr-1">${prod.priceVal}</span>
                          <span className="text-sm font-extrabold text-emerald-600 font-mono">${prod.salePriceVal}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-extrabold text-neutral-900 font-mono">${prod.priceVal}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* INTERACTIVE STOREFRONT SHOP */}
      {showShop && (
      <section id="shop" className="bg-[#050505] py-10 sm:py-14 px-4 sm:px-6 lg:px-24 border-t border-brand-line/30 scroll-mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block mb-2">Shop CulturX</span>
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display text-white tracking-wide leading-none">
                Operational From Launch.<br />
                <span className="text-brand-gold">Built to Sell the System.</span>
              </h2>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs md:text-right">
              Products marked as ready ship now. Coming Soon items lock to preview.
            </p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {siteData.products.map((prod) => (
              <div
                key={prod.id}
                className="group bg-neutral-950 border border-neutral-800 hover:border-brand-gold/50 rounded-2xl flex flex-col overflow-hidden transition-all duration-200"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-[10px] uppercase">No Image</div>
                  )}
                  {/* Badges */}
                  <span className="absolute top-3 left-3 text-[9px] font-bold font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/20 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase">
                    {prod.category}
                  </span>
                  {prod.isComingSoon && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold font-mono text-zinc-400 bg-neutral-900/80 border border-neutral-700 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase">
                      Soon
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold font-display text-white uppercase leading-tight tracking-wide">{prod.name}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">{prod.description}</p>
                  </div>

                  {/* Price + SKU row */}
                  <div className="mt-auto pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[9px] text-zinc-600 font-mono">{prod.sku}</span>
                    <div className="text-right">
                      {prod.isComingSoon ? (
                        <span className="text-[10px] text-zinc-500 font-mono">Price TBC</span>
                      ) : prod.salePriceVal !== undefined && prod.salePriceVal !== null ? (
                        <div>
                          <span className="line-through text-[10px] text-zinc-600 mr-1">${prod.priceVal}</span>
                          <span className="text-sm font-extrabold text-brand-gold font-mono">${prod.salePriceVal}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-extrabold text-brand-gold font-mono">${prod.priceVal}</span>
                      )}
                    </div>
                  </div>

                  {/* SEO link + CTA */}
                  <div className="flex items-center gap-2">
                    {prod.isComingSoon ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 bg-neutral-900 border border-neutral-800 text-zinc-600 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed text-center"
                      >
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(prod)}
                        className="flex-1 py-2.5 bg-brand-gold text-brand-black hover:bg-white rounded-xl text-xs font-black uppercase tracking-wider text-center transition cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => triggerNativeShare(prod)}
                        title="Share Product"
                        className="p-2.5 rounded-xl border border-neutral-800 hover:border-brand-gold/40 text-zinc-400 hover:text-brand-gold transition cursor-pointer flex items-center justify-center bg-neutral-900"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {shareProductId === prod.id && (
                        <div className="absolute right-0 bottom-full mb-2 z-[60] bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl shadow-2xl flex flex-col gap-1.5 w-40 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => handleShareProduct('copy', prod)}
                            className="w-full text-left text-[10.5px] font-bold text-zinc-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-neutral-800 transition flex items-center gap-2"
                          >
                            <Copy className="w-3 h-3 text-brand-gold" />
                            <span>Copy Link</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareProduct('facebook', prod)}
                            className="w-full text-left text-[10.5px] font-bold text-zinc-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-neutral-800 transition flex items-center gap-2"
                          >
                            <Facebook className="w-3 h-3 text-indigo-400" />
                            <span>Facebook</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareProduct('twitter', prod)}
                            className="w-full text-left text-[10.5px] font-bold text-zinc-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-neutral-800 transition flex items-center gap-2"
                          >
                            <Twitter className="w-3 h-3 text-sky-400" />
                            <span>Twitter / X</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareProduct('telegram', prod)}
                            className="w-full text-left text-[10.5px] font-bold text-zinc-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-neutral-800 transition flex items-center gap-2"
                          >
                            <Send className="w-3 h-3 text-cyan-400" />
                            <span>Telegram</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* TREATMENT BODYWORKS & IN-ROOM RECOVERY */}
      {showBodyworks && (
      <section id="bodyworks" className="bg-[#050505] py-10 sm:py-12 px-4 sm:px-6 lg:px-24 border-t border-neutral-900 scroll-mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-12">
          
          {/* Info Side */}
          <div className="xl:col-span-7 space-y-6">
            <span className="kicker text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block">{siteData.bodyworks.kicker}</span>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display text-white tracking-wider leading-none">
              {siteData.bodyworks.heading.includes('.') ? (
                <>
                  {siteData.bodyworks.heading.split('.')[0]}.<br />
                  <span className="text-brand-gold">{siteData.bodyworks.heading.split('.').slice(1).join('.')}</span>
                </>
              ) : (
                <span className="text-brand-gold">{siteData.bodyworks.heading}</span>
              )}
            </h2>
            <p className="text-brand-soft text-sm md:text-base italic max-w-xl">
              {siteData.bodyworks.subline}
            </p>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-2xl">
              {siteData.bodyworks.paragraph}
            </p>

            <div className="py-2">
              <span className="text-2xl md:text-4xl font-black uppercase tracking-wider font-display block leading-none text-white">
                {siteData.bodyworks.statement.includes('.') ? (
                  <>
                    {siteData.bodyworks.statement.split('.')[0]}.<br />
                    <span className="text-brand-gold">{siteData.bodyworks.statement.split('.').slice(1).join('.')}</span>
                  </>
                ) : (
                  <span className="text-brand-gold">{siteData.bodyworks.statement}</span>
                )}
              </span>
            </div>

            {/* Core physical text card */}
            <div className="card bg-neutral-950 border border-brand-line/65 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold text-brand-gold uppercase tracking-widest font-display flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-brand-gold" />
                <span>{siteData.bodyworks.cardTitle}</span>
              </h3>
              {siteData.bodyworks.cardTexts.map((txtStr, idx) => (
                <p key={idx} className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  {txtStr}
                </p>
              ))}
            </div>

            {/* Treatment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {siteData.bodyworks.treatments.map((tx) => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTxId === tx.id 
                      ? 'bg-neutral-900 border-brand-gold' 
                      : 'bg-neutral-950 border-brand-line/20 hover:border-brand-line/50'
                  }`}
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase text-white font-display tracking-wider">{tx.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                      <span>{tx.durationMin} MIN</span>
                      <span className="text-zinc-600 font-normal">·</span>
                      <span className="text-brand-gold text-[13px] font-black tracking-wider">${tx.costUSD} USD</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-snug line-clamp-3">
                      {tx.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-neutral-900 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Select Protocol</span>
                    {selectedTxId === tx.id && <Check className="w-4 h-4 text-brand-gold" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Request Form Side */}
          <div className="xl:col-span-5">
            <div className="bg-neutral-950 border border-brand-line p-6 md:p-8 rounded-3xl sticky top-24 shadow-2xl space-y-6">
              
              <div className="space-y-1">
                <span className="text-[10px] text-brand-gold font-mono font-bold tracking-widest block uppercase">RECOVERY CONCIERGE scheduler</span>
                <h3 className="text-lg font-bold font-display text-white uppercase">Instant Hotel Scheduler</h3>
                {activeTreatment && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Book <strong className="text-brand-gold uppercase">{activeTreatment.name}</strong> ({activeTreatment.durationMin} min - ${activeTreatment.costUSD} USD)
                  </p>
                )}
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-950 border border-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-md font-bold text-white uppercase tracking-wider font-display">Enquiry Submitted</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Your luxury recovery booking request has been securely recorded into our central CRM coordinator. A therapist lead will contact your phone number to coordinate security clearances.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={bookingForm.name}
                      onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Marcus Aurelius"
                      className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={bookingForm.email}
                        onChange={e => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="marcus@gmail.com"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={bookingForm.phone}
                        onChange={e => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+61 411 222 333"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Luxury Hotel Name *</label>
                      <input 
                        type="text" 
                        required
                        value={bookingForm.hotelName}
                        onChange={e => setBookingForm(prev => ({ ...prev, hotelName: e.target.value }))}
                        placeholder="Park Hyatt Melbourne"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Suite / Room No.</label>
                      <input 
                        type="text" 
                        value={bookingForm.hotelRoom}
                        onChange={e => setBookingForm(prev => ({ ...prev, hotelRoom: e.target.value }))}
                        placeholder="Suite 405"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Preferred Time *</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={bookingForm.preferredTime}
                        onChange={e => setBookingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Therapist Profile</label>
                      <select 
                        value={bookingForm.therapistProfile}
                        onChange={e => setBookingForm(prev => ({ ...prev, therapistProfile: e.target.value }))}
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4-2 py-3 text-xs text-white focus:outline-none focus:border-brand-gold"
                      >
                        <option value="Senior Practitioner">Senior Practitioner (Default)</option>
                        <option value="Visceral Specialist">Visceral Gut Specialist</option>
                        <option value="Deep Tissue Therapist">Deep Fascial Specialist</option>
                        <option value="Male Architect preferred">Male Therapist Preferred</option>
                        <option value="Female Architect preferred">Female Therapist Preferred</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 mt-2 bg-gradient-to-r from-brand-gold to-yellow-600 text-brand-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-[1.01] transition duration-200 cursor-pointer text-center"
                  >
                    Transmit Booking Request
                  </button>

                  <p className="text-[10px] text-center text-zinc-500 max-w-xs mx-auto">
                    By submitting this scheduler, you consent to coordinate with verified therapist architects dispatched from the Melb central pool.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
      )}

      {/* EXHALEWORK MINIMAL BRIEF */}
      {showExhaleWork && (
      <section id="exhalework" className="bg-[#050505] py-16 px-4 sm:px-6 lg:px-24 border-t border-b border-brand-line/35 text-center relative overflow-hidden scroll-mt-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[500px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="kicker text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block">{siteData.exhaleWork.kicker}</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-display text-white uppercase tracking-wider">
            {siteData.exhaleWork.heading}
          </h2>
          
          <p className="text-2xl md:text-5xl font-black uppercase tracking-wide font-display text-white leading-tight">
            One System.<br />
            <span className="text-brand-gold">You can exhale now.</span><br />
            Press reset.
          </p>

          <p className="text-brand-soft text-sm md:text-base max-w-xl mx-auto pt-4 leading-relaxed font-semibold">
            {siteData.exhaleWork.explanation}
          </p>
        </div>
      </section>
      )}

      {/* HOW IT WORKS / CONCIERGE CARDS */}
      {showConcierge && (
      <section className="bg-gradient-to-b from-[#fff] to-[#f4efe3] text-zinc-900 py-12 px-4 sm:px-6 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="kicker text-[10px] uppercase tracking-[4px] text-[#aa8612] font-mono font-black block">{siteData.concierge.kicker}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase font-display text-neutral-950">
              {siteData.concierge.heading}
            </h2>
            <p className="text-zinc-600 text-xs md:text-sm max-w-2xl mx-auto">
              {siteData.concierge.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {siteData.concierge.columns.map((col, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-8 border border-[#9c741d]/30 shadow-xl flex flex-col space-y-5"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-yellow-100 text-brand-gold flex items-center justify-center font-bold text-xs uppercase font-mono">
                    0{idx + 1}
                  </span>
                  <h3 className="text-md font-black uppercase text-neutral-950 font-display tracking-wider">
                    {col.title}
                  </h3>
                </div>
                <ul className="space-y-4 text-xs text-zinc-700 leading-relaxed pl-1">
                  {col.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-brand-gold shrink-0 mr-2 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* PHILOSOPHY SECTIONS */}
      {showPhilosophy && (
      <section id="philosophy" className="bg-[#050505] py-14 px-4 sm:px-6 lg:px-24 border-t border-neutral-950 scroll-mt-12 overflow-hidden relative">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-3">
            <span className="kicker text-[10px] uppercase tracking-[6px] text-brand-gold font-mono font-black block">
              CORE PHILOSOPHY
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase font-display text-white tracking-widest leading-[1.1]">
              From Personal Failure<br className="hidden md:block"/> to System Failure
            </h2>
          </div>

          {/* Majestic Large Slogan Accent Card */}
          <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-brand-line/60 rounded-[32px] p-8 md:p-14 text-center max-w-4xl mx-auto space-y-6 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
            
            <p className="text-xl md:text-3xl font-black uppercase tracking-normal font-display text-white leading-snug">
              {"\"People don't need more products."}<br />
              {"They need "}<span className="text-brand-gold">{"better systems for being human.\""}</span>
            </p>
            
            <div className="flex justify-center items-center space-x-4">
              <span className="h-px bg-neutral-800 w-12" />
              <p className="text-xs uppercase tracking-[5px] font-mono text-cyan-400 font-bold">
                Internal Order. External Excellence.
              </p>
              <span className="h-px bg-neutral-800 w-12" />
            </div>
          </div>

          {/* ONE Integrated Recovery Ecosystem Grid */}
          <div className="space-y-8 pt-6">
            <div className="text-center">
              <span className="text-xs font-mono tracking-[4px] uppercase text-zinc-500 font-bold">
                ONE INTEGRATED RECOVERY ECOSYSTEM
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Labs */}
              <div className="bg-neutral-950/80 border border-neutral-800/80 p-8 rounded-3xl space-y-4 text-left hover:border-brand-gold/50 transition-all duration-300 relative group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold/5 blur-lg rounded-full group-hover:bg-brand-gold/15 transition-all" />
                <span className="text-[10px] font-mono text-[#aa8612] font-semibold tracking-widest uppercase">SYSTEM 01</span>
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-display animate-pulse">
                  CulturX Labs
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  The deep clinical research core. Specialized in precision-fermented microbiome compounds, gut-health architecture, and bio-available lipid matrices to restore homeostatic pH.
                </p>
              </div>

              {/* Bodyworks */}
              <div className="bg-neutral-950/80 border border-neutral-800/80 p-8 rounded-3xl space-y-4 text-left hover:border-brand-gold/50 transition-all duration-300 relative group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 blur-lg rounded-full group-hover:bg-pink-500/10 transition-all" />
                <span className="text-[10px] font-mono text-[#aa8612] font-semibold tracking-widest uppercase">SYSTEM 02</span>
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-display">
                  CulturX Bodyworks
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Nervous system downregulation, clinical visceral manipulation, lymphatic drainage, and soft muscular kinetic reset systems designed to release modern neuro-vagal load.
                </p>
              </div>

              {/* Concierge */}
              <div className="bg-neutral-950/80 border border-neutral-800/80 p-8 rounded-3xl space-y-4 text-left hover:border-brand-gold/50 transition-all duration-300 relative group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 blur-lg rounded-full group-hover:bg-indigo-500/10 transition-all" />
                <span className="text-[10px] font-mono text-[#aa8612] font-semibold tracking-widest uppercase">SYSTEM 03</span>
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-display">
                  CulturX Concierge
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Premium hospitality partnerships, corporate high-performance program structures, in-room clinic support, and luxury elite-tier wellness distribution globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* THE VAULT SECTION */}
      {showVault && (
      <section id="vault" className="bg-black py-14 px-4 sm:px-6 lg:px-24 border-t border-b border-brand-line/30 relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-gold/5 to-transparent pointer-events-none" />
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[8px] text-zinc-500 font-bold uppercase block">
              RESTRICTED DIRECTIVE
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-display text-white uppercase tracking-widest">
              THE VAULT
            </h2>
          </div>

          {/* Premium Vault Activation Interactive Card */}
          <motion.div 
            whileHover={{ scale: 1.01, borderColor: 'rgba(212,175,55,1)' }}
            className="card bg-neutral-950/90 border border-brand-line p-8 md:p-16 rounded-[36px] shadow-2xl relative overflow-hidden"
          >
            {/* Vault lock status dot */}
            <div className="absolute top-6 right-8 flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400 font-bold">OPERATIONAL</span>
            </div>

            <div className="space-y-8">
              <p className="text-xl md:text-3xl font-extrabold uppercase font-display text-white tracking-widest leading-none">
                Unlock the Vault.
              </p>

              <div className="max-w-md mx-auto space-y-4 border-y border-neutral-900 py-6 my-6 text-zinc-400 text-xs md:text-sm font-semibold tracking-wide uppercase font-mono text-left">
                <div className="flex justify-between items-center px-4">
                  <span>01 // ELEVATE THE SYSTEM</span>
                  <span className="text-brand-gold">✓</span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span>02 // ACTIVATE HUMAN POTENTIAL</span>
                  <span className="text-brand-gold">✓</span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span>03 // LEAVE NOTHING DORMANT</span>
                  <span className="text-brand-gold">✓</span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span>04 // EVERYTHING MUST BE OPERATIONAL</span>
                  <span className="text-brand-gold">✓</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-mono text-brand-gold tracking-[5px] uppercase font-black">
                  Action Activates the System.
                </p>
                
                <a 
                  href="#contact" 
                  className="inline-block px-10 py-5 text-xs font-black uppercase tracking-[4px] text-brand-black bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-600 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-brand-gold/10"
                >
                  Initiate System Activation
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* MEDICAL ARTICLES & NEWS SYSTEM */}
      {showArticles && (
      <section id="articles" className="bg-[#050505] py-16 px-4 sm:px-6 lg:px-24 border-t border-b border-brand-line/40 scroll-mt-12 relative overflow-hidden">
        
        {/* Ambient background accent */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-line/30 pb-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[5px] text-brand-gold font-mono font-bold block">07 // CLINICAL INTELLIGENCE LAB</span>
              <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tight font-display text-white">
                Medical & Clinical Articles
              </h2>
              <p className="text-brand-soft text-sm max-w-2xl font-sans">
                Vetted clinical research and treatment protocols concerning the gut-brain axis, lymphatic circulation optimization, and biological cellular longevity, centered in Melbourne, Victoria.
              </p>
            </div>
            
            {/* Search inputs */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-soft group-focus-within:text-brand-gold transition duration-200" />
              <input 
                type="text"
                value={articleSearchQuery}
                onChange={e => setArticleSearchQuery(e.target.value)}
                placeholder="Search articles, excerpts, keywords..."
                className="w-full bg-neutral-950 border border-brand-line/45 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-brand-soft focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition font-sans"
              />
            </div>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Gut Health', 'Clinical Bodywork', 'Supplements', 'Executive Focus'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedArticleCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border transition duration-200 cursor-pointer ${
                  selectedArticleCategory === cat
                    ? 'bg-brand-gold text-brand-black border-brand-gold shadow-md'
                    : 'bg-neutral-950 border-brand-line/45 text-brand-soft hover:border-brand-gold hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Publications' : cat}
              </button>
            ))}
          </div>

          {/* Articles Grid list */}
          {(() => {
            const filtered = articles.filter(art => {
              const matchesCat = selectedArticleCategory === 'All' || art.category.toLowerCase() === selectedArticleCategory.toLowerCase();
              const text = (art.title + ' ' + art.excerpt + ' ' + art.content + ' ' + (art.seoKeywords ? art.seoKeywords.join(' ') : '')).toLowerCase();
              const matchesSearch = text.includes(articleSearchQuery.toLowerCase());
              return matchesCat && matchesSearch;
            });

            if (filtered.length === 0) {
              return (
                <div className="text-center py-16 border border-brand-line/30 bg-neutral-950/40 rounded-3xl text-brand-soft font-mono text-xs">
                  No clinical publications match the active selection.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(art => (
                  <motion.div
                    key={art.id}
                    layoutId={`art-container-${art.id}`}
                    whileHover={{ y: -6 }}
                    className="bg-neutral-950 border border-brand-line/35 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-brand-gold/60 transition-all duration-300 relative group overflow-hidden text-left"
                  >
                    {/* Top glow */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-widest">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-brand-soft font-mono flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{art.readTime}</span>
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-brand-gold transition duration-200">
                        {art.title}
                      </h3>
                      
                      <p className="text-xs text-brand-soft leading-relaxed line-clamp-3 font-sans">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-line/20 flex items-center justify-between text-[11px] font-mono text-brand-soft">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="truncate max-w-[120px]">{art.author}</span>
                      </span>
                      <button
                        onClick={() => setSelectedArticleToRead(art)}
                        className="text-brand-gold font-bold uppercase tracking-widest hover:underline flex items-center space-x-1 group/btn cursor-pointer"
                      >
                        <span>Read Protocol</span>
                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })()}

        </div>
      </section>
      )}

      {/* DETAILED ARTICLE READER MODAL WITH STRUCTURAL LOCAL SEO DATA */}
      <AnimatePresence>
        {selectedArticleToRead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Structured Schema inside reading viewport specifically for dynamically opened article page */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "MedicalWebPage",
                  "@id": `https://culturx.com.au/articles/${selectedArticleToRead.id}`,
                  "url": selectedArticleToRead.seoCanonicalUrl || `https://culturx.com.au/articles/${selectedArticleToRead.id}`,
                  "name": selectedArticleToRead.title,
                  "description": selectedArticleToRead.excerpt,
                  "aspect": selectedArticleToRead.category,
                  "about": {
                    "@type": "MedicalCondition",
                    "name": selectedArticleToRead.category === "Gut Health" ? "Microbiome imbalance" : "Post-flight muscle soreness"
                  },
                  "author": {
                    "@type": "Organization",
                    "name": selectedArticleToRead.author
                  },
                  "publisher": {
                    "@type": "Organization",
                    "@id": "https://culturx.com.au/#organization"
                  },
                  "datePublished": selectedArticleToRead.publishDate,
                  "audience": {
                    "@type": "MedicalAudience",
                    "audienceType": "Mobile executives and high performance athletes"
                  }
                })
              }}
            />

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md" 
              onClick={() => setSelectedArticleToRead(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 border border-brand-line/45 rounded-[36px] max-w-3xl w-full max-h-[85vh] overflow-y-auto z-10 p-6 md:p-10 space-y-8 shadow-2xl relative text-left scrollbar-thin text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticleToRead(null)}
                className="absolute top-6 right-6 p-2 bg-[#0c0c0c] border border-brand-line/50 rounded-full text-brand-soft hover:text-brand-gold transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-brand-gold uppercase">
                  <span className="bg-brand-gold/10 px-2.5 py-1 border border-brand-gold/30 rounded font-bold tracking-widest">{selectedArticleToRead.category}</span>
                  <span>•</span>
                  <span>{selectedArticleToRead.readTime}</span>
                  <span>•</span>
                  <span>Published: {selectedArticleToRead.publishDate}</span>
                </div>
                
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight font-display uppercase">
                  {selectedArticleToRead.title}
                </h1>

                <div className="flex items-center space-x-3 pt-2 text-xs font-mono text-brand-soft">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center font-bold text-brand-gold">
                    CX
                  </div>
                  <div>
                    <p className="text-white font-semibold">{selectedArticleToRead.author}</p>
                    <p className="text-[10px] text-brand-soft">CulturX Clinical Intelligence — Verified Article</p>
                  </div>
                </div>
              </div>

              {/* Rich Content formatted beautifully */}
              <div className="markdown-body text-brand-soft text-sm leading-relaxed space-y-6 border-t border-b border-brand-line/25 py-6 font-sans">
                {selectedArticleToRead.content.includes('<') && (selectedArticleToRead.content.includes('</') || selectedArticleToRead.content.includes('/>')) ? (
                  <div 
                    className="prose prose-invert max-w-none text-brand-soft prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-h2:text-brand-gold prose-h2:text-xl prose-h3:text-white prose-h3:font-mono prose-strong:text-brand-gold prose-a:text-brand-gold prose-a:underline hover:prose-a:text-white transition-all space-y-4"
                    dangerouslySetInnerHTML={{ __html: selectedArticleToRead.content }}
                  />
                ) : (
                  selectedArticleToRead.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold uppercase tracking-wide text-brand-gold font-display mt-6 mb-2">{para.replace('## ', '')}</h2>;
                    }
                    if (para.startsWith('### ')) {
                      return <h3 key={i} className="text-base font-bold uppercase tracking-tight text-white font-mono mt-4 mb-2">{para.replace('### ', '')}</h3>;
                    }
                    if (para.startsWith('- ') || para.startsWith('* ')) {
                      return (
                        <ul key={i} className="list-disc pl-6 space-y-1 text-zinc-300">
                          {para.split('\n').map((li, idx) => (
                            <li key={idx}>{li.replace(/^[\s-*]+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (para.startsWith('1. ') || para.startsWith('2. ') || para.startsWith('3. ')) {
                      return (
                        <ol key={i} className="list-decimal pl-6 space-y-1 text-zinc-300">
                          {para.split('\n').map((li, idx) => (
                            <li key={idx}>{li.replace(/^\d+\.\s*/, '')}</li>
                          ))}
                        </ol>
                      );
                    }
                    // Normal Paragraph
                    // Bold processing
                    const parts = para.split('**');
                    if (parts.length > 1) {
                      return (
                        <p key={i}>
                          {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-brand-gold font-semibold">{p}</strong> : p)}
                        </p>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })
                )}
              </div>

              {/* Citation & Melbourne local Clinical guidelines */}
              <div className="bg-[#0b0b0b] border border-brand-line/30 p-5 rounded-2xl space-y-3 font-sans text-xs text-brand-soft">
                <div className="flex items-center space-x-2 text-brand-gold font-bold">
                  <Activity className="w-4 h-4" />
                  <p className="uppercase tracking-widest text-[10px]">CulturX Melbourne Licensing & Clinical Citations</p>
                </div>
                <p className="leading-relaxed">
                  Headquarters: <strong>Collins Street Medical Corridor, Melbourne, VIC 3000, Australia</strong>. All recovery protocols are reviewed and certified by <strong>Dr. Gabriela Popa</strong> (Founder / Chief of Clinical Intelligence CulturX). Medical and therapeutic licensing strictly conforms with current guidelines set by the <strong>Australian Commission on Safety and Quality in Health Care (ACSQHC)</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] font-mono text-brand-gold pt-1">
                  <span>Licence: CX-AU-2026-8899</span>
                  <span>ABN: 84 657 788 884</span>
                  <span>Tel: +61 457 788 884</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1.5 overflow-x-auto">
                  {selectedArticleToRead.seoKeywords ? selectedArticleToRead.seoKeywords.map((kw, i) => (
                    <span key={i} className="text-[9px] uppercase tracking-wider bg-neutral-900 border border-brand-line/30 px-2 py-0.5 rounded text-brand-soft font-mono shrink-0">
                      #{kw}
                    </span>
                  )) : null}
                </div>
                <button
                  onClick={() => setSelectedArticleToRead(null)}
                  className="px-6 py-2.5 bg-brand-gold text-brand-black text-xs font-bold uppercase rounded-full cursor-pointer tracking-wider hover:bg-white transition shrink-0"
                >
                  Close Article Reader
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED DYNAMIC PRODUCT SEO SPECIFICATIONS & SERP SIMULATOR MODAL */}
      <AnimatePresence>
        {selectedProductSeo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md" 
              onClick={() => setSelectedProductSeo(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 border border-brand-line/45 rounded-[36px] max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10 p-6 md:p-8 space-y-6 shadow-2xl relative text-left scrollbar-thin text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProductSeo(null)}
                className="absolute top-6 right-6 p-2 bg-[#0c0c0c] border border-brand-line/50 rounded-full text-brand-soft hover:text-brand-gold transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-widest">
                  SEO & Indexing Diagnostics
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white font-display tracking-tight mt-2">
                  {selectedProductSeo.name} — Metadata Sheet
                </h3>
                <p className="text-xs text-brand-soft mt-1">Configure keyword indexes, Rich Snippets, canonical tags, and localization targets tailored for Melbourne, Victoria.</p>
              </div>

              {/* SECTION 1: GOOGLE SERP SIMULATOR */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#a5801e] font-mono">Google SERP Snippet Simulator (Google Search Presentation)</h4>
                
                <div className="bg-white rounded-2xl p-5 border border-zinc-200 text-zinc-900 font-sans shadow-sm">
                  {/* Google citation hierarchy */}
                  <div className="flex items-center space-x-1 text-xs text-zinc-600 mb-1 leading-none font-mono">
                    <span>https://culturx.com.au</span>
                    <span>›</span>
                    <span>shop</span>
                    <span>›</span>
                    <span className="text-zinc-500 font-bold">{selectedProductSeo.sku.toLowerCase()}</span>
                  </div>
                  {/* Google Blue Link Title */}
                  <a href="#shop" className="text-lg md:text-xl text-[#1a56db] hover:underline font-medium leading-tight block">
                    CULTURX™ {selectedProductSeo.name} | Premium Human Optimization Melbourne
                  </a>
                  {/* Google Meta Description with Melbourne target */}
                  <p className="text-xs text-zinc-700 leading-relaxed mt-2">
                    CULTURX™ is premium science: Buy **{selectedProductSeo.name}** in Melbourne, Australia. Clinical gut microbiota restoration biohacking and executive recovery formulas configured directly.
                  </p>
                </div>
              </div>

              {/* SECTION 2: METADATA SUMMARY METRICS */}
              <div className="border-t border-brand-line/25 pt-4 space-y-3 font-mono text-[11px]">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#a5801e]">Direct Meta & Header Elements</h4>
                
                <div className="space-y-2 divide-y divide-brand-line/10 bg-[#0c0c0c] border border-brand-line/25 p-4 rounded-xl">
                  <div className="pt-2 flex justify-between gap-4">
                    <span className="text-brand-soft shrink-0">Meta Title:</span>
                    <span className="text-white text-right font-sans font-bold">CULTURX™ {selectedProductSeo.name} | Melbourne Premium Biohacking</span>
                  </div>
                  <div className="pt-2 flex justify-between gap-4">
                    <span className="text-brand-soft shrink-0">Meta Description:</span>
                    <span className="text-white text-right font-sans max-w-sm text-xs leading-normal">CULTURX™ {selectedProductSeo.name}. Buy clinical-grade digestive microbiome optimization and premium executive recovery formulas in Melbourne, Victoria, Australia.</span>
                  </div>
                  <div className="pt-2 flex justify-between gap-4">
                    <span className="text-brand-soft shrink-0">Canonical URL:</span>
                    <span className="text-brand-gold">https://culturx.com.au/shop/{selectedProductSeo.sku.toLowerCase()}</span>
                  </div>
                  <div className="pt-2 flex justify-between gap-4">
                    <span className="text-brand-soft shrink-0">Local Targeting:</span>
                    <span className="text-slate-200">Melbourne VIC, Collins St, Ritz-Carlton, Park Hyatt</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SCHEMAS RAW PLAYLOAD PREVIEW */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-[#a5801e] uppercase font-mono">
                  <span>Product Schema Payload (JSON-LD)</span>
                  <span className="text-green-500">✓ Valid Schema.org Struct</span>
                </div>
                
                <pre className="bg-[#060606] border border-brand-line/20 p-4 rounded-xl text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-40 leading-relaxed scrollbar-thin">
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

              <div className="flex justify-end pt-2 border-t border-brand-line/25">
                <button
                  onClick={() => setSelectedProductSeo(null)}
                  className="px-6 py-2.5 bg-brand-gold text-brand-black text-xs font-bold uppercase rounded-full cursor-pointer hover:bg-white transition"
                >
                  Close SEO Diagnostics
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTACT & SUBMISSION FORM */}
      {showContact && (
      <section id="contact" className="bg-gradient-to-b from-[#fff] to-[#f4efe3] text-zinc-900 py-12 px-4 sm:px-6 lg:px-24 scroll-mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="kicker text-[10px] uppercase tracking-[4px] text-[#90701d] font-mono font-black block">{siteData.contact.kicker}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase font-display text-neutral-950 tracking-wide">
              {siteData.contact.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact details */}
            <div className="space-y-6">
              <div className="bg-white border border-[#9c741d]/35 p-8 rounded-3xl space-y-6 shadow-xl">
                <div>
                  <span className="text-[10px] text-[#aa8612] font-mono font-bold block uppercase tracking-widest mb-1">CULTURX FOUNDER</span>
                  <p className="text-lg font-black text-zinc-950 uppercase font-display">{siteData.contact.founderName}</p>
                  <p className="text-xs text-zinc-500 font-semibold">{siteData.contact.founderTitle}</p>
                </div>

                <div className="space-y-3.5 text-xs text-zinc-700 border-t border-zinc-100 pt-5 font-mono">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                    <span><strong>Email:</strong> {siteData.contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                    <span><strong>Phone:</strong> {siteData.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Landmark className="w-4 h-4 text-brand-gold shrink-0" />
                    <span><strong>Website:</strong> {siteData.contact.website}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                    <span><strong>Location:</strong> {siteData.contact.location}</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Categories Card */}
              <div className="bg-white border border-[#9c741d]/35 p-8 rounded-3xl shadow-xl">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 font-display">Specialist Enquiries Managed</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700 font-semibold">
                  {siteData.contact.enquiries.map((enq, idx) => (
                    <li key={idx} className="flex items-center space-x-2 bg-[#fbf8ef] p-2.5 border border-[#aa8612]/15 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-brand-gold shrink-0"></span>
                      <span>{enq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Inquiries form */}
            <div className="bg-white border border-[#9c741d]/35 p-8 rounded-3xl shadow-xl space-y-6">
              <h3 className="text-md font-black text-neutral-950 uppercase font-display tracking-widest pb-2 border-b border-zinc-100">Contact Transceiver Form</h3>
              
              {enquirySuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 border border-green-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-md font-bold text-neutral-950 uppercase tracking-wider font-display">Message Lodged</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your request was securely transmitted to our centralized local CRM inbox storage. Our Melbourne office representatives will authenticate your details and reply prompt.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={enquiryForm.name}
                      onChange={e => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Elena Rostova"
                      className="w-full bg-[#fbf8ef] border border-[#d4af37]/40 rounded-xl px-4 py-3.5 text-xs text-neutral-900 placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={enquiryForm.email}
                      onChange={e => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="elena@biohackers.de"
                      className="w-full bg-[#fbf8ef] border border-[#d4af37]/40 rounded-xl px-4 py-3.5 text-xs text-neutral-900 placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Inquiry Vector Type *</label>
                    <select 
                      value={enquiryForm.type}
                      onChange={e => setEnquiryForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-[#fbf8ef] border border-[#d4af37]/40 rounded-xl px-4 py-3.5 text-xs text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                    >
                      {siteData.contact.enquiries.map((enqOption, optIdx) => (
                        <option key={optIdx} value={enqOption}>{enqOption}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Detailed Message *</label>
                    <textarea 
                      rows={5} 
                      required
                      value={enquiryForm.message}
                      onChange={e => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="We are looking to explore integrating the CulturX Recovery Architecture across our wellness retreats..."
                      className="w-full bg-[#fbf8ef] border border-[#d4af37]/40 rounded-xl px-4 py-3.5 text-xs text-neutral-900 placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]" 
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-b from-[#d4af37] to-[#8f6f16] hover:brightness-105 active:scale-[0.99] text-brand-black text-xs font-black uppercase tracking-wider rounded-full transition cursor-pointer text-center"
                  >
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#020202] text-zinc-400 border-t border-neutral-900 overflow-hidden relative">
        {/* Subtle grid pattern background header lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10 relative z-10 space-y-16">
          {/* Top Row: Brand & Key Directories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-left">
            
            {/* Column 1: Brand Wordmark & Mission */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-6 bg-gradient-to-b from-brand-gold to-yellow-600 rounded-xs" />
                  <span className="font-display font-black text-xl text-white uppercase tracking-[4px]">
                    CulturX<span className="text-brand-gold">™</span>
                  </span>
                </div>
                <p className="text-[10px] font-mono tracking-[3px] text-brand-gold uppercase">
                  BIO-SYSTEMS INTEGRATION
                </p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans font-normal max-w-sm">
                Melbourne&apos;s premium human optimization ecosystem. Science-directed gut microbiota activation, somatic recovery systems, and targeted cellular hydration engineered for elite executives.
              </p>
              <div className="flex items-center space-x-3 text-white">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-brand-gold hover:border-brand-gold transition-colors duration-200 cursor-pointer">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-brand-gold hover:border-brand-gold transition-colors duration-200 cursor-pointer">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 hover:text-brand-gold hover:border-brand-gold transition-colors duration-200 cursor-pointer">
                  <HeartPulse className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Column 2: Ecosystem Directory Navigation */}
            <div className="space-y-5">
              <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] border-b border-neutral-900 pb-2">
                Ecosystem Index
              </h4>
              <ul className="space-y-3 text-xs font-medium">
                {[
                  { label: 'Intelligence Vault', href: '#manifesto' },
                  { label: 'Dual System Dynamics', href: '#duality' },
                  { label: 'Product Inventory', href: '#shop' },
                  { label: 'Somatic Bodyworks', href: '#bodyworks' },
                  { label: 'Scientific Articles', href: '#articles' },
                  { label: 'Concierge Booking', href: '#contact' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.href} 
                      className="group flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors duration-150"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-650 group-hover:text-brand-gold transition-colors duration-150" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Dynamic Somatic Protocols */}
            <div className="space-y-5">
              <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] border-b border-neutral-900 pb-2">
                Somatic Therapies
              </h4>
              <ul className="space-y-3 text-xs font-medium">
                {siteData.bodyworks.treatments.slice(0, 5).map((tx) => (
                  <li key={tx.id}>
                    <a 
                      href="#bodyworks"
                      className="group flex items-center space-x-2 text-zinc-450 hover:text-white transition-colors duration-150"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40 group-hover:bg-brand-gold transition-colors duration-150" />
                      <span>{tx.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Systems Verification */}
            <div className="space-y-5">
              <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-[4px] border-b border-neutral-900 pb-2">
                Melbourne HQ
              </h4>
              <div className="space-y-3.5 text-xs text-zinc-400">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-zinc-450">
                    Melbourne Corporate Hub & Concierge Suites, VIC, Australia
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>+61 1300 CULTURX</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>concierge@culturx.com.au</span>
                </div>
                <div className="pt-2">
                  <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-neutral-900 rounded-sm px-2.5 py-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-black">
                      SYSTEMS ONLINE
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Middle Row: Advanced Payment & Compliance Badges Strip */}
          <div className="border-t border-b border-neutral-900/60 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[2px] text-zinc-500 font-bold">
                CulturX Secure Checkout Protocols
              </span>
              <span className="text-[9px] font-sans text-zinc-650">
                PCI Compliance verified. End-to-end multi-currency payment authorization.
              </span>
            </div>
            
            {/* Payment brand labels formatted in high class mono blocks */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Visa', 'Mastercard', 'Afterpay', 'PayID', 'Apple Pay', 'Google Pay'].map((method) => (
                <span 
                  key={method} 
                  className="text-[9px] font-mono tracking-wider uppercase font-extrabold text-zinc-400 bg-neutral-950 border border-neutral-900 px-2.5 py-1 rounded-xs hover:border-brand-gold hover:text-white transition duration-150 select-none cursor-default"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Row: Legal Modal Links & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-4 gap-6 text-[10px]">
            {/* Compliance Modal Access points */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 font-mono uppercase tracking-[2px] text-zinc-450 font-medium">
              {[
                { label: 'Accessibility Statement', key: 'accessibility' },
                { label: 'Disclaimer', key: 'disclaimer' },
                { label: 'Privacy Policy', key: 'privacy' },
                { label: 'Refund Policy', key: 'refund' },
                { label: 'Terms & Conditions', key: 'terms' }
              ].map((policy) => (
                <button 
                  key={policy.key}
                  type="button"
                  onClick={() => setActivePolicyModal(policy.key as any)} 
                  className="hover:text-brand-gold transition cursor-pointer relative group"
                >
                  <span>{policy.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-brand-gold transition-all duration-200 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Back to top & signature */}
            <div className="flex flex-col items-center md:items-end space-y-1.5 font-mono">
              <a 
                href="#top" 
                className="group flex items-center space-x-1.5 text-[10px] font-black uppercase text-brand-gold tracking-[3px] hover:text-white transition-colors duration-150"
              >
                <span>BACK TO SUMMIT</span>
                <span className="text-[12px] group-hover:-translate-y-0.5 transition-transform duration-150 inline-block font-sans">↑</span>
              </a>
              <span className="text-[9px] text-zinc-650 uppercase tracking-[2px]">
                CULTURX™ © {new Date().getFullYear()} — HEAL WITH CLINICAL CONVICTION
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* LEGAL POLICY MODALS DISPLAY PANEL */}
      <AnimatePresence>
        {activePolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md" 
              onClick={() => setActivePolicyModal(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 border border-brand-line/45 rounded-[36px] max-w-2xl w-full max-h-[80vh] overflow-y-auto z-10 p-6 md:p-8 space-y-6 shadow-2xl relative text-left scrollbar-thin text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActivePolicyModal(null)}
                className="absolute top-6 right-6 p-2 bg-[#0c0c0c] border border-brand-line/50 rounded-full text-brand-soft hover:text-brand-gold transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {activePolicyModal === 'accessibility' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-widest">
                      SYSTEM COMPLIANCE
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white font-display tracking-tight pt-1">
                      CULTURX™ Accessibility Statement
                    </h3>
                  </div>

                  <div className="markdown-body text-zinc-300 text-xs leading-relaxed space-y-4 pt-4 border-t border-neutral-900 font-sans">
                    <p className="text-sm font-semibold text-white">
                      CULTURX™ is committed to creating an accessible and inclusive online experience.
                    </p>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Accessibility Commitment</h4>
                      <p>We aim to ensure our website is accessible across devices and usable by as many people as possible.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Ongoing Improvements</h4>
                      <p>Accessibility improvements are continuously reviewed and implemented where practical.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Contact</h4>
                      <p>If you experience accessibility issues, please contact:</p>
                      <ul className="list-none space-y-0.5 text-zinc-400 font-mono text-[11px]">
                        <li>GP@Culturx.com.au</li>
                        <li>Melbourne, Victoria, Australia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'disclaimer' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest">
                      DISCLAIMER
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white font-display tracking-tight pt-1">
                      CULTURX™ Disclaimer
                    </h3>
                  </div>

                  <div className="markdown-body text-zinc-300 text-xs leading-relaxed space-y-4 pt-4 border-t border-neutral-900 font-sans">
                    <p className="text-sm font-semibold text-white">
                      The information provided by CULTURX™ is for educational and wellness purposes only.
                    </p>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">No Medical Advice</h4>
                      <p>Products, supplements, kombucha and bodywork services are not intended to diagnose, treat, cure or prevent disease.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Professional Advice</h4>
                      <p>Always consult a qualified healthcare practitioner before beginning any wellness or supplementation program.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Individual Results</h4>
                      <p>Results vary between individuals and no specific outcomes are guaranteed.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Liability</h4>
                      <p>Use of this website and services is at your own discretion and risk.</p>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'privacy' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-widest">
                      PRIVACY CONTROL
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white font-display tracking-tight pt-1">
                      CULTURX™ Privacy Policy
                    </h3>
                    <p className="text-[9px] text-[#80501a] font-mono uppercase tracking-wider">Effective Date: May 2026</p>
                  </div>

                  <div className="markdown-body text-zinc-300 text-xs leading-relaxed space-y-4 pt-4 border-t border-neutral-900 font-sans">
                    <p className="text-sm font-semibold text-white">
                      CULTURX™ respects your privacy and is committed to protecting your personal information.
                    </p>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Information We Collect</h4>
                      <p>We may collect:</p>
                      <ul className="list-disc pl-5 space-y-0.5 text-zinc-400">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Booking/contact form submissions</li>
                        <li>Website analytics data</li>
                        <li>Browser/device information</li>
                      </ul>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">How We Use Information</h4>
                      <p>Your information may be used to:</p>
                      <ul className="list-disc pl-5 space-y-0.5 text-zinc-400">
                        <li>Respond to enquiries</li>
                        <li>Process bookings</li>
                        <li>Improve website performance</li>
                        <li>Send updates or marketing communications</li>
                        <li>Maintain security and analytics</li>
                      </ul>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Analytics & Cookies</h4>
                      <p>CULTURX™ may use Google Analytics and cookies to improve website performance and user experience.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Third-Party Services</h4>
                      <p>We may use trusted third-party platforms for payment processing, email communication, booking systems and analytics.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Data Protection</h4>
                      <p>We take reasonable measures to protect your personal information from misuse, loss or unauthorized access.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Contact</h4>
                      <ul className="list-none space-y-0.5 text-zinc-400 font-mono text-[11px]">
                        <li>GP@Culturx.com.au</li>
                        <li>Melbourne, Victoria, Australia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'refund' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-widest">
                      REFUND & RETURNS
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white font-display tracking-tight pt-1">
                      CULTURX™ Refund Policy
                    </h3>
                  </div>

                  <div className="markdown-body text-zinc-300 text-xs leading-relaxed space-y-4 pt-4 border-t border-neutral-900 font-sans">
                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Products</h4>
                      <p>Unopened products may be eligible for refund within 14 days of purchase.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Opened Consumables</h4>
                      <p>Due to hygiene and safety standards, opened consumable products are generally non-refundable.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Bookings & Services</h4>
                      <p>Cancellations require advance notice. Late cancellations or no-shows may incur fees.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Damaged Orders</h4>
                      <p>Please contact us within 48 hours of receiving damaged products.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Contact</h4>
                      <p className="font-mono text-zinc-400">Email: GP@Culturx.com.au</p>
                    </div>
                  </div>
                </div>
              )}

              {activePolicyModal === 'terms' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 uppercase tracking-widest">
                      TERMS & BOUNDARIES
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white font-display tracking-tight pt-1">
                      CULTURX™ Terms & Conditions
                    </h3>
                  </div>

                  <div className="markdown-body text-zinc-300 text-xs leading-relaxed space-y-4 pt-4 border-t border-neutral-900 font-sans">
                    <p className="text-sm font-semibold text-white">
                      By using this website, you agree to these Terms & Conditions.
                    </p>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Intellectual Property</h4>
                      <p>All branding, graphics, content, logos and materials are the property of CULTURX™ unless otherwise stated.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Website Use</h4>
                      <p>You agree not to misuse, reproduce or distribute website materials without written permission.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Products & Services</h4>
                      <p>All products and services are provided subject to availability.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Limitation of Liability</h4>
                      <p>CULTURX™ is not liable for indirect or consequential damages arising from the use of this website or its products/services.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Wellness Information</h4>
                      <p>Content is provided for informational purposes only and should not replace professional medical advice.</p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <h4 className="font-bold text-[11px] uppercase tracking-wider text-brand-gold font-mono">Jurisdiction</h4>
                      <p>These terms are governed by the laws of Victoria, Australia.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-neutral-900">
                <button
                  onClick={() => setActivePolicyModal(null)}
                  className="px-6 py-2 bg-brand-gold text-brand-black text-xs font-bold uppercase rounded-full cursor-pointer hover:bg-white transition"
                >
                  Close Policy
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
