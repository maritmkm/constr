import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'WORK', path: '/projects' },
    { label: 'SERVICES', path: '/services' },
    { label: 'ABOUT', path: '/about' },
    { label: 'JOIN WORKFORCE', path: '/register' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 py-4 text-white shadow-2xl'
            : 'bg-transparent py-6 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2" data-cursor="link">
            <span className="font-display font-extrabold text-xl tracking-tighter uppercase text-white">
              ARCS<span className="text-[#38BDF8]">.</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-widest uppercase border-l pl-2 text-slate-300 border-white/20">
              Architecture + Construction
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-cursor="link"
                  className={`text-xs font-semibold tracking-widest transition-colors relative py-1 ${
                    isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2872A1]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/contact"
              data-cursor="link"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#2872A1] text-white hover:bg-[#1D557A] transition-all shadow-lg shadow-[#2872A1]/20"
            >
              Start a Project <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col justify-between p-8 sm:p-12 overflow-y-auto"
          >
            {/* Header inside overlay */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-xl font-extrabold tracking-tighter uppercase text-white">
                ARCS<span className="text-[#38BDF8]">.</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav items */}
            <div className="py-12 space-y-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white hover:text-[#38BDF8] transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-6 h-6 text-[#2872A1]" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Footer Info */}
            <div className="border-t border-white/10 pt-8 space-y-4">
              <p className="text-xs text-slate-400 tracking-wider uppercase">Contact Inquiry</p>
              <a href="mailto:hello@arcs-studio.com" className="text-sm font-semibold text-white block">
                hello@arcs-studio.com
              </a>
              <p className="text-xs text-slate-500">© 2026 ARCS Studio. All rights reserved.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
