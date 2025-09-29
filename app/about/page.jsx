"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AboutPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Animate heading Y motion on scroll like homepage hero
  const headingY = useTransform(scrollY, [0, 500], [0, -100]);
  const headingOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const teamMembers = [    { name: "Ava Green", role: "Chief Sustainability Officer", emoji: "🌿" },
    { name: "Leo Bloom", role: "Community Engagement Lead", emoji: "🌱" },
    { name: "Maya Rivers", role: "Forest Restoration Expert", emoji: "🌳" },
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-green-50 min-h-screen relative" ref={containerRef}>
      {/* Background Glow Circles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-12 left-12 w-[22rem] h-[22rem] bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-12 right-12 w-[18rem] h-[18rem] bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', transform: 'translate(-50%, -50%)' }}></div>
      </div>

      {/* Interactive Cursor */}
      <div 
        className="fixed w-6 h-6 bg-green-400/30 rounded-full pointer-events-none mix-blend-multiply blur-sm transition-transform duration-300 z-50"
        style={{ 
          left: mousePosition.x - 12, 
          top: mousePosition.y - 12,
          transform: 'scale(1)'
        }}
      />

      {/* Heading Section */}
      <motion.section 
        className="relative pt-32 pb-20 container mx-auto px-4 text-center max-w-4xl"
        style={{ y: headingY, opacity: headingOpacity }}
      >
        <motion.h1 
          className="text-6xl md:text-7xl font-black mb-6 leading-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent">
            Our Mission & Story
          </span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          At Green Legacy Campus, we believe every tree planted and every act of sustainability writes a story of renewal.
          Join us as we cultivate a future where campuses thrive in harmony with nature.
        </motion.p>
      </motion.section>

      {/* Team Section */}
      <section className="container mx-auto px-4 pb-32 max-w-5xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            The passionate guardians nurturing our green legacy, bringing expertise and heart to every action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-white/30 shadow-xl backdrop-blur-sm relative cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.05, y: -8 }}
            >
              <div className="text-7xl mb-6 relative inline-block select-none">
                {member.emoji}
                <motion.div 
                  className="absolute inset-0 bg-white/20 rounded-full blur-lg"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 3 + index, repeat: Infinity }}
                />
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-900">{member.name}</h3>
              <p className="text-gray-700 font-semibold">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values & Impact Section */}
      <section className="py-32 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-800">
              What Drives Us
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-16">
              Sustainability, community, and action: the roots that grow our green legacy. 
              Every student, every tree, every milestone matters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[                { icon: '🌍', title: 'Global Impact', detail: 'Connecting campuses worldwide for change.' },
                { icon: '🌱', title: 'Growth', detail: 'From seed to guardian, nurturing leadership.' },
                { icon: '🤝', title: 'Community', detail: 'Building bonds through shared green goals.' },
              ].map((value, idx) => (
                <motion.div 
                  key={value.title}
                  className="flex flex-col items-center gap-4 p-6 bg-white/80 rounded-3xl border border-green-200 shadow-md cursor-default select-none"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.3, duration: 0.6 }}
                >
                  <div className="text-6xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-bold text-green-800">{value.title}</h3>
                  <p className="text-gray-700 max-w-xs">{value.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-3xl p-12 border border-emerald-200/50 shadow-2xl backdrop-blur-sm">
              <motion.div 
                className="inline-flex items-center gap-3 bg-emerald-100 rounded-full px-6 py-3 mb-8"
                animate={{ 
                  boxShadow: [                    "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    "0 0 20px 10px rgba(34, 197, 94, 0.1)",
                    "0 0 0 0 rgba(34, 197, 94, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-2xl">🌟</span>
                <span className="text-emerald-700 font-bold">Become a Part of Us</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-800">
                Interested in Joining the Green Legacy?
              </h2>

              <p className="text-lg md:text-xl mb-12 text-gray-600 leading-relaxed">
                Reach out to learn how you can support, participate, or collaborate for a greener tomorrow.
              </p>

              <motion.button
                className="group relative inline-flex items-center px-12 py-5 text-xl font-black text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-lg hover:shadow-emerald-600 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Contact Us</span>
                <motion.span 
                  className="ml-4 text-2xl relative z-10"
                  animate={{ x: [0, 5, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  📩
                </motion.span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;