'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { CulturXData } from '@/lib/initialData';

interface NavBarProps {
  siteData: CulturXData;
  cartTotalQty: number;
  onOpenCart: () => void;
  toggleCms: () => void;
}

export default function NavBar({ siteData, cartTotalQty, onOpenCart, toggleCms }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* HEADER NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-24 py-4 bg-brand-black/90 border-b border-brand-line/50 backdrop-blur-md">
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
            onClick={onOpenCart}
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
            className="fixed top-[68px] left-0 right-0 z-40 bg-black/95 border-b border-brand-line/60 p-6 flex flex-col space-y-4 text-center text-sm font-semibold uppercase tracking-widest lg:hidden"
          >
            <a href="#manifesto" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Manifesto</a>
            <a href="#duality" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Systems</a>
            <a href="#ecosystem" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Ecosystem</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Products</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Shop</a>
            <a href="#bodyworks" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Bodyworks</a>
            <a href="#exhalework" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">ExhaleWork</a>
            <a href="#articles" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Articles</a>
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Philosophy</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-brand-soft hover:text-brand-gold transition">Contact</a>
            
            <button
              onClick={() => { setMobileMenuOpen(false); toggleCms(); }}
              className="mt-2 w-full py-2 bg-brand-gold/20 border border-brand-gold text-brand-gold rounded-full text-xs"
            >
              ⚙️ CMS Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
