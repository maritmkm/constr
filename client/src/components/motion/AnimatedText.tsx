import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: '60%' },
    visible: {
      opacity: 1,
      y: '0%',
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`flex flex-wrap gap-x-[0.25em] gap-y-1 ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};
