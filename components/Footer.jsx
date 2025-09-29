"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EcoFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const quickLinks = [
    { name: 'About', href: '/about', icon: '🌍' },
    { name: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
    { name: 'Activities', href: '/activities', icon: '🌱' },
    { name: 'Contact', href: '/contact', icon: '📧' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#facebook' },
    { name: 'Twitter', icon: '🐦', href: '#twitter' },
    { name: 'Instagram', icon: '📷', href: '#instagram' },
    { name: 'LinkedIn', icon: '💼', href: '#linkedin' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-emerald-900 text-white overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌿</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Green Legacy
              </h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Transforming campuses into sustainable ecosystems, one action at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-emerald-300">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <motion.a 
                    href={link.href}
                    className="flex items-center space-x-2 text-emerald-100 hover:text-white transition-colors text-sm"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-emerald-300">Stay Connected</h4>
            <p className="text-emerald-200 text-sm mb-4 leading-relaxed">
              Get eco-tips and updates delivered to your inbox.
            </p>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form 
                  onSubmit={handleSubscribe}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-emerald-800/30 backdrop-blur-md border border-emerald-600/30 rounded-xl px-4 py-2 text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 text-sm"
                      required
                    />
                  </div>
                 {/* Replace the motion.button with this */}
<motion.a
  href={`
    mailto:omkarparelkar@gmail.com
    ?subject=${encodeURIComponent('Subscribe to newsletter')}
    ${email ? `&body=${encodeURIComponent('Please subscribe me with this email: ' + email)}` : ''}
  `.replace(/\s+/g, '')}
  target="_blank"
  rel="noopener noreferrer"
  className={`w-full inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-2 rounded-xl transition-all duration-300 text-sm ${
    !email ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'hover:shadow-xl'
  }`}
  whileHover={ !email ? {} : { scale: 1.02, y: -1 } }
  whileTap={ !email ? {} : { scale: 0.98 } }
  aria-disabled={!email}
  role="button"
>
  Subscribe 🌱
</motion.a>

                </motion.form>
              ) : (
                <motion.div 
                  className="text-center py-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="text-emerald-300 text-sm font-medium">Welcome to the movement!</p>
                  <p className="text-emerald-400 text-xs">Check your inbox for confirmation</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-emerald-300">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-emerald-800/30 backdrop-blur-md rounded-xl border border-emerald-600/30 flex items-center justify-center text-lg hover:bg-emerald-700/50 transition-all duration-300 text-emerald-100"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-700/50 pt-6 flex flex-col md:flex-row justify-between items-center text-emerald-200 text-sm">
          <p>&copy; 2024 Green Legacy Campus Tracker. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <motion.a href="/privacy" className="hover:text-white transition-colors" whileHover={{ scale: 1.05 }}>
              Privacy
            </motion.a>
            <span className="text-emerald-600">•</span>
            <motion.a href="/terms" className="hover:text-white transition-colors" whileHover={{ scale: 1.05 }}>
              Terms
            </motion.a>
            <span className="text-emerald-600">•</span>
            <motion.a href="/accessibility" className="hover:text-white transition-colors" whileHover={{ scale: 1.05 }}>
              Accessibility
            </motion.a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white text-lg hover:shadow-emerald-500/25 transition-all duration-300 z-50"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        🌱
      </motion.button>
    </footer>
  );
};

export default EcoFooter;