"use client";
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const EcoLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();
  
  const backgroundY = useTransform(scrollY, [0, 500], [0, -100]);
  const formY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

const handleSubmit = async () => {
  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("[login] status:", res.status, "body:", data);

    if (!res.ok) {
      toast.error(data.error || "Login failed");
      setLoading(false);
      return;
    }

    // Save token + user
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

    // Determine role (defensive)
    const rawRole = data.user?.role ?? data.role ?? (() => {
      try { return JSON.parse(localStorage.getItem("user") || "{}").role; } catch { return undefined; }
    })();

    const role = typeof rawRole === "string" ? rawRole.toLowerCase() : undefined;

    // Debug toast so you can visually confirm role immediately
    toast.success(`Logged in as ${role ?? 'user'}`, { duration: 2000 });

    setLoading(false);

    // Redirect based on role — use replace so earlier route checks don't push over it
    if (role === "admin") {
      router.replace("/admin");
      return;
    }

    router.replace("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Something went wrong");
    setLoading(false);
  }
};






  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Interactive Background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          y: backgroundY 
        }}
      >
        {/* Floating Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-2xl md:text-4xl opacity-30 hover:opacity-70 transition-opacity">
              {['🌱', '🌿', '🍃', '🌳', '🌲', '🦋', '🐝', '🌸'][i % 8]}
            </span>
          </motion.div>
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        style={{ y: formY }}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Welcome Badge */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-emerald-100/80 backdrop-blur-md rounded-full px-6 py-3 mb-4 border border-emerald-200/50 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 20px 10px rgba(34, 197, 94, 0.1)",
                  "0 0 0 0 rgba(34, 197, 94, 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌿
              </motion.span>
              <span className="text-emerald-700 font-bold">Welcome Back, Guardian</span>
            </motion.div>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            className="relative bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/50"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated Background Glow */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-teal-400/10 rounded-3xl blur-xl pointer-events-none -z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative z-20">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-4xl font-black text-gray-800 mb-2">
                  Continue Your <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Legacy</span>
                </h2>
                <p className="text-gray-600">Sign in to track your green impact</p>
              </motion.div>

              <div className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    Your Campus Email
                  </label>
                  <div className="relative">
                    <motion.input
                      type="email"
                      required
                      className="relative z-30 w-full px-6 py-4 bg-white/50 backdrop-blur-md border-2 border-emerald-200/50 rounded-2xl focus:outline-none focus:border-emerald-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="guardian@campus.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg opacity-0 pointer-events-none -z-10"
                      animate={{ 
                        opacity: focusedField === 'email' ? 0.5 : 0,
                        scale: focusedField === 'email' ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    Your Green Key
                  </label>
                  <div className="relative">
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="relative z-30 w-full px-6 py-4 pr-12 bg-white/50 backdrop-blur-md border-2 border-emerald-200/50 rounded-2xl focus:outline-none focus:border-emerald-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 z-40"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </motion.button>
                    <motion.div 
                      className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg opacity-0 pointer-events-none -z-10"
                      animate={{ 
                        opacity: focusedField === 'password' ? 0.5 : 0,
                        scale: focusedField === 'password' ? 1.02 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
                
                {/* Remember Me & Forgot Password */}
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-600">Remember my growth</span>
                  </label>
                  <motion.button 
                    type="button"
                    onClick={() => router.push('/.')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                    whileHover={{ scale: 1.05 }}
                  >
                    Forgot your key?
                  </motion.button>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <motion.div 
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Entering the Garden...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Your Garden</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🌱
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              {/* Sign Up Link */}
              <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <p className="text-gray-600">
                  New to our ecosystem?{' '}
                  <motion.button 
                    type="button"
                    onClick={() => router.push('/signup')}
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    Plant Your First Seed 🌱
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div 
            className="mt-8 text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <div className="flex justify-center space-x-6 text-emerald-600">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>🔒</span>
                <span className="text-sm font-medium">Secure Login</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>🌍</span>
                <span className="text-sm font-medium">Carbon Neutral</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>🏆</span>
                <span className="text-sm font-medium">5K+ Students</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EcoLogin;