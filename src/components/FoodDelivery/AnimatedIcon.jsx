import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedIcon wraps a given icon component with a hover scale animation.
 * Props:
 *   Icon: React component (e.g., Lucide icon)
 *   size?: number - icon size (default 24)
 *   color?: string - icon color (default inherit)
 */
const AnimatedIcon = ({ Icon, size = 24, color = 'currentColor' }) => (
  <motion.span
    whileHover={{ scale: 1.15 }}
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Icon size={size} color={color} />
  </motion.span>
);

export default AnimatedIcon;
