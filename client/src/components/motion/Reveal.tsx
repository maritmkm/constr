import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = '100%',
  delay = 0.1,
  duration = 0.7,
  yOffset = 30,
  className = '',
}) => {
  return (
    <div style={{ width }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
