'use client';

import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
      <div className="relative glass-effect p-8 rounded-2xl h-full">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}