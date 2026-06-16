import React from 'react';
import { motion } from 'framer-motion';
import './FoodDelivery.css';

/**
 * ServiceCard renders a single service icon with a pastel background and a glass‑morphism hover effect.
 * Props:
 *   icon: React component (lucide icon)
 *   name: string – service display name
 *   bg: string – background pastel color
 *   color: string – icon color (usually dark)
 *   onClick: function – click handler
 */
const ServiceCard = ({ icon: Icon, name, bg, color, onClick }) => (
  <motion.div
    className="fd-glass-card fd-service-card"
    whileHover={{ y: -4, boxShadow: '0 12px 20px rgba(0,0,0,0.12)' }}
    onClick={onClick}
  >
    <div className="fd-service-icon" style={{ backgroundColor: bg }}>
      <Icon size={28} color={color} />
    </div>
    <span className="fd-service-name">{name}</span>
  </motion.div>
);

export default ServiceCard;
