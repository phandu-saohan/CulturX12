'use client';

import React, { useState, useEffect } from 'react';
import { 
  defaultCulturXData, 
  defaultBookings, 
  defaultEnquiries, 
  defaultArticles,
  defaultPaymentConfig,
  CulturXData, 
  Booking, 
  Enquiry, 
  Order, 
  OrderItem,
  Product,
  MedicalArticle,
  PaymentConfig
} from '@/lib/initialData';
import PublicWebsite from '@/components/PublicWebsite';
import CmsDashboard from '@/components/CmsDashboard';
import CmsLoginGate from '@/components/CmsLoginGate';
import { supabase, fetchStateFromSupabase, saveStateToSupabase } from '@/lib/supabase';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [isCmsView, setIsCmsView] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // States
  const [siteData, setSiteData] = useState<CulturXData>(defaultCulturXData);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [articles, setArticles] = useState<MedicalArticle[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(defaultPaymentConfig);

  // 1. Core cloud loader on initialization
  useEffect(() => {
    async function initSystem() {
      try {
        // Check Auth session
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          setIsAuthenticated(!!session);
          if (!session && isCmsView) {
            // Logged out
          }
        });

        const fetchedSite = await fetchStateFromSupabase<CulturXData>('site_data', defaultCulturXData);
        setSiteData(fetchedSite);

        const fetchedBookings = await fetchStateFromSupabase<Booking[]>('bookings', defaultBookings);
        setBookings(fetchedBookings);

        const fetchedEnquiries = await fetchStateFromSupabase<Enquiry[]>('enquiries', defaultEnquiries);
        setEnquiries(fetchedEnquiries);

        const fetchedOrders = await fetchStateFromSupabase<Order[]>('orders', []);
        setOrders(fetchedOrders);

        const fetchedArticles = await fetchStateFromSupabase<MedicalArticle[]>('articles', defaultArticles);
        setArticles(fetchedArticles);

        const fetchedPaymentConfig = await fetchStateFromSupabase<PaymentConfig>('payment_config', defaultPaymentConfig);
        setPaymentConfig(fetchedPaymentConfig);

        setMounted(true);
      } catch (err) {
        console.error("Failed to load cloud ledger:", err);
        setMounted(true);
      }
    }
    initSystem();
  }, []);

  // Graceful state synchronizers
  const saveSiteDataToStorage = async (newData: CulturXData) => {
    setSiteData(newData);
    await saveStateToSupabase('site_data', newData);
  };

  const saveBookingsToStorage = async (newBookings: Booking[]) => {
    setBookings(newBookings);
    await saveStateToSupabase('bookings', newBookings);
  };

  const saveEnquiriesToStorage = async (newEnquiries: Enquiry[]) => {
    setEnquiries(newEnquiries);
    await saveStateToSupabase('enquiries', newEnquiries);
  };

  const saveOrdersToStorage = async (newOrders: Order[]) => {
    setOrders(newOrders);
    await saveStateToSupabase('orders', newOrders);
  };

  const saveArticlesToStorage = async (newArticles: MedicalArticle[]) => {
    setArticles(newArticles);
    await saveStateToSupabase('articles', newArticles);
  };

  const savePaymentConfigToStorage = async (newConfig: PaymentConfig) => {
    setPaymentConfig(newConfig);
    await saveStateToSupabase('payment_config', newConfig);
    // Also keep localStorage in sync for immediate reads
    try { localStorage.setItem('culturx_payment_config', JSON.stringify(newConfig)); } catch {}
  };

  // HANDLERS FOR PUBLIC SITE SUBMISSIONS
  const handleBookTreatment = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const bookingId = `b-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newBooking, ...bookings];
    saveBookingsToStorage(updated);
  };

  const handleSubmitEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const enquiryId = `e-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: enquiryId,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    const updated = [newEnquiry, ...enquiries];
    saveEnquiriesToStorage(updated);
  };

  const handlePlaceOrder = (orderData: { clientName: string; clientEmail: string; clientPhone: string; shippingAddress: string; items: OrderItem[]; totalAmount: number }) => {
    const orderId = `cx-order-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      clientName: orderData.clientName,
      clientEmail: orderData.clientEmail,
      clientPhone: orderData.clientPhone,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
  };

  // HANDLERS FOR CMS DISPATCH ACTIONS
  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
    saveBookingsToStorage(updated);
  };

  const handleDeleteBooking = (bookingId: string) => {
    const updated = bookings.filter(b => b.id !== bookingId);
    saveBookingsToStorage(updated);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    saveOrdersToStorage(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId);
    saveOrdersToStorage(updated);
  };

  const handleUpdateEnquiryStatus = (enquiryId: string, newStatus: Enquiry['status']) => {
    const updated = enquiries.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e);
    saveEnquiriesToStorage(updated);
  };

  const handleDeleteEnquiry = (enquiryId: string) => {
    const updated = enquiries.filter(e => e.id !== enquiryId);
    saveEnquiriesToStorage(updated);
  };

  // PRODUCT MANAGEMENT METHODS
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const productUrlId = `prod-${Math.floor(1000 + Math.random() * 9000)}`;
    const productItem: Product = {
      ...newProd,
      id: productUrlId,
    };
    const updatedProducts = [productItem, ...siteData.products];
    saveSiteDataToStorage({
      ...siteData,
      products: updatedProducts
    });
  };

  const handleEditProduct = (updatedProd: Product) => {
    const updatedProducts = siteData.products.map(p => p.id === updatedProd.id ? updatedProd : p);
    saveSiteDataToStorage({
      ...siteData,
      products: updatedProducts
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = siteData.products.filter(p => p.id !== productId);
    saveSiteDataToStorage({
      ...siteData,
      products: updatedProducts
    });
  };

  // ARTICLES OPERATIONS
  const handleAddArticle = (newArt: Omit<MedicalArticle, 'id'>) => {
    const id = `art-${Math.floor(1000 + Math.random() * 9000)}`;
    const fresh: MedicalArticle = { ...newArt, id };
    saveArticlesToStorage([fresh, ...articles]);
  };

  const handleEditArticle = (art: MedicalArticle) => {
    const updated = articles.map(a => a.id === art.id ? art : a);
    saveArticlesToStorage(updated);
  };

  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    saveArticlesToStorage(updated);
  };

  // BACKUP OPERATIONS
  const handleImportBackup = (importedDataJson: string): boolean => {
    try {
      const parsed = JSON.parse(importedDataJson);
      if (parsed.siteData && Array.isArray(parsed.bookings) && Array.isArray(parsed.enquiries) && Array.isArray(parsed.orders)) {
        saveSiteDataToStorage(parsed.siteData);
        saveBookingsToStorage(parsed.bookings);
        saveEnquiriesToStorage(parsed.enquiries);
        saveOrdersToStorage(parsed.orders);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleResetToDefaults = async () => {
    await saveSiteDataToStorage(defaultCulturXData);
    await saveBookingsToStorage(defaultBookings);
    await saveEnquiriesToStorage(defaultEnquiries);
    await saveOrdersToStorage([]);
    await saveArticlesToStorage(defaultArticles);
    await savePaymentConfigToStorage(defaultPaymentConfig);
  };

  // Avoid hydration mismatch loader
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-display relative">
        <div className="absolute top-[30%] text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-[5px] text-brand-gold animate-pulse">CULTURX™</h1>
          <div className="w-16 h-0.5 bg-brand-line/50 mx-auto rounded-full overflow-hidden">
            <div className="w-8 h-full bg-brand-gold rounded-full animate-ping" />
          </div>
          <p className="text-[10px] text-brand-soft uppercase tracking-widest">Initializing Health Engineering System...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isCmsView ? (
        isAuthenticated ? (
          <CmsDashboard
            siteData={siteData}
          bookings={bookings}
          enquiries={enquiries}
          orders={orders}
          articles={articles}
          paymentConfig={paymentConfig}
          onSaveSiteData={saveSiteDataToStorage}
          onSavePaymentConfig={savePaymentConfigToStorage}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
          onDeleteEnquiry={handleDeleteEnquiry}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddArticle={handleAddArticle}
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle}
          onImportBackup={handleImportBackup}
          onResetToDefaults={handleResetToDefaults}
          toggleLiveSite={() => setIsCmsView(false)}
          onLogout={async () => {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }}
        />
        ) : (
          <CmsLoginGate onLoginSuccess={() => setIsAuthenticated(true)} />
        )
      ) : (
        <PublicWebsite
          siteData={siteData}
          articles={articles}
          paymentConfig={paymentConfig}
          onBookTreatment={handleBookTreatment}
          onSubmitEnquiry={handleSubmitEnquiry}
          onPlaceOrder={handlePlaceOrder}
          toggleCms={() => setIsCmsView(true)}
        />
      )}
    </>
  );
}
