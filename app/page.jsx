"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CarbonCalculatorChatbot from "@/components/CarbonCalculatorChatbot";
import Link from 'next/link';

const EcoHomepage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: '🌳',
      title: 'Plant & Nurture',
      description: 'Transform from Seed to Forest Guardian. Each tree planted creates a legacy that outlasts graduation.',
      stage: 'Sapling Stage',
      impact: '2 people/year oxygen',
      color: 'from-emerald-400 via-green-500 to-teal-600',
      gradient: 'bg-gradient-to-br from-emerald-50 to-green-100'
    },
    {
      icon: '♻️',
      title: 'Recycle & Renew',
      description: 'Join the Waste Watchers guild. Every bottle saved is 450 years of decomposition prevented.',
      stage: 'Sprout Stage',
      impact: '450 years saved',
      color: 'from-blue-400 via-cyan-500 to-sky-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-100'
    },
    {
      icon: '🌿',
      title: 'Clean & Restore',
      description: 'Become a Carbon Crusher. Transform dead zones into thriving campus ecosystems.',
      stage: 'Tree Stage',
      impact: '10lbs coal equivalent',
      color: 'from-purple-400 via-violet-500 to-indigo-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-violet-100'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Trees in Our Forest', icon: '🌲', color: 'text-emerald-600' },
    { number: '5,000+', label: 'Campus Guardians', icon: '👥', color: 'text-blue-600' },
    { number: '50,000kg', label: 'CO₂ Absorbed', icon: '☁️', color: 'text-green-600' },
    { number: '100+', label: 'Eco Milestones', icon: '🏆', color: 'text-yellow-600' }
  ];

  const stages = [
    { name: 'Seed', emoji: '🌱', points: '0-50', color: 'text-green-400' },
    { name: 'Sprout', emoji: '🌿', points: '51-150', color: 'text-green-500' },
    { name: 'Sapling', emoji: '🌳', points: '151-300', color: 'text-green-600' },
    { name: 'Tree', emoji: '🌲', points: '301-500', color: 'text-green-700' },
    { name: 'Guardian', emoji: '🏔️', points: '500+', color: 'text-emerald-800' }
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-green-50" ref={containerRef}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Interactive Cursor Effect */}
      <div 
        className="fixed w-6 h-6 bg-green-400/30 rounded-full pointer-events-none mix-blend-multiply blur-sm transition-all duration-300 z-50"
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12,
          transform: hoveredCard !== null ? 'scale(3)' : 'scale(1)'
        }}
      />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* 3D Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-transparent to-green-100/50">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, rgba(34, 197, 94, 0.05) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(16, 185, 129, 0.05) 25%, transparent 25%)
            `,
            backgroundSize: '60px 60px, 80px 80px, 40px 40px, 40px 40px'
          }}></div>
        </div>

        {/* Floating Ecosystem Elements */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${15 + Math.sin(i) * 20}%`,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-2xl md:text-4xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {['🌱', '🌿', '🍃', '🌳', '🌲', '🦋', '🐝', '🌸', '🌺', '🍀', '🌻', '🌼'][i]}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Evolution Stage Indicator */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-green-200/50 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl">🌱</span>
              <span className="text-green-700 font-semibold">Begin Your Legacy</span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span 
                className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Green Legacy
              </motion.span>
              <br />
              <span className="text-gray-800">Campus</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Every action creates ripples. Every student is a change-maker. 
              <br />
              <span className="text-emerald-600 font-semibold">Your campus, your impact, your future.</span>
            </motion.p>

            {/* Evolution Stages Preview */}
            <motion.div 
              className="flex justify-center items-center gap-4 mb-12 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.name}
                  className={`flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-green-200/30 ${stage.color}`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  <span className="text-lg">{stage.emoji}</span>
                  <span className="font-medium text-sm">{stage.name}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.button
                className="group relative px-10 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-2xl hover:shadow-emerald-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
             <Link href="/signup" aria-label="Sign up to plant a seed">
  <span className="relative z-10 flex items-center justify-center cursor-pointer">
    Plant Your First Seed
    <motion.span 
      className="ml-3 text-xl"
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🌱
    </motion.span>
  </span>
</Link>

                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              <motion.button
                className="group relative px-10 py-5 font-bold text-emerald-700 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/leaderboard" aria-label="View Forest Leaderboard">
  <span className="flex items-center justify-center cursor-pointer">
    View Forest Leaderboard
    <motion.span 
      className="ml-3"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      🏆
    </motion.span>
  </span>
</Link>

              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-emerald-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-emerald-100 rounded-full px-6 py-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl">🌿</span>
              <span className="text-emerald-700 font-semibold">Choose Your Path</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-800">
              Build Your <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every action transforms your campus into a living, breathing ecosystem that responds to your green legacy.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                {/* Card */}
                <motion.div 
                  className={`relative ${feature.gradient} p-8 rounded-3xl border border-white/50 shadow-xl backdrop-blur-sm transition-all duration-500`}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    rotateY: 5,
                    rotateX: 5
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Stage Badge */}
                  <motion.div 
                    className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-emerald-200"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                  >
                    <span className="text-xs font-bold text-emerald-600">{feature.stage}</span>
                  </motion.div>

                  {/* Icon with 3D Effect */}
                  <motion.div 
                    className="text-7xl mb-6 relative"
                    animate={{ 
                      scale: hoveredCard === index ? 1.2 : 1,
                      rotateY: hoveredCard === index ? 15 : 0,
                      z: hoveredCard === index ? 20 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="relative inline-block">
                      {feature.icon}
                      <motion.div 
                        className="absolute inset-0 bg-white/20 rounded-full blur-lg"
                        animate={{ 
                          scale: hoveredCard === index ? 1.5 : 0,
                          opacity: hoveredCard === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-black mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  
                  {/* Impact Meter */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600">Impact</span>
                      <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">
                        {feature.impact}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${feature.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${60 + index * 15}%` }}
                        transition={{ delay: index * 0.3 + 0.8, duration: 1 }}
                      />
                    </div>
                  </div>

                  {/* Hover Action */}
                  <motion.div
                    className="mt-6 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 font-bold cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: hoveredCard === index ? 1 : 0,
                      x: hoveredCard === index ? 0 : -20
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Start Your Journey
                    <motion.svg 
                      className="ml-2 w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ x: hoveredCard === index ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div 
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="m0 0h40v40h-40z"/%3E%3Cpath d="m0 0h20v20h-20z"/%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Our Living <span className="text-emerald-200">Ecosystem</span>
            </h2>
            <p className="text-xl text-emerald-100">Real impact, measured and celebrated</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2 + index * 0.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-3xl md:text-4xl font-black text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-emerald-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 blur-3xl opacity-20 scale-110"></div>
              
              {/* Main Card */}
              <motion.div 
                className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-3xl p-12 lg:p-16 border border-emerald-200/50 shadow-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div 
                  className="inline-flex items-center gap-3 bg-emerald-100 rounded-full px-6 py-3 mb-8"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 20px 10px rgba(34, 197, 94, 0.1)",
                      "0 0 0 0 rgba(34, 197, 94, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl">🌍</span>
                  <span className="text-emerald-700 font-bold">Join the Legacy</span>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-800">
                  Ready to Plant Your
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Green Legacy?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of students already transforming their campus into a living testament to sustainability. 
                  Your journey from Seed to Forest Guardian starts with a single action.
                </p>

                <motion.button
                  className="group relative inline-flex items-center px-12 py-6 text-xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
<Link href="/signup" aria-label="Sign up to start your green journey">
  <span className="relative z-10 cursor-pointer">
    Start Your Green Journey
  </span>
</Link>
                  <motion.span 
                    className="ml-4 text-2xl relative z-10"
                    animate={{ 
                      x: [0, 5, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    🚀
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
<CarbonCalculatorChatbot />
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🌱</div>
                <div className="absolute -top-6 -right-6 text-3xl animate-pulse">🌿</div>
                <div className="absolute -bottom-4 left-8 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🍃</div>
                <div className="absolute -bottom-6 right-12 text-4xl animate-pulse" style={{ animationDelay: '2s' }}>🌸</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EcoHomepage;