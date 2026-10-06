import React from 'react';
import { motion } from 'framer-motion';

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
}

export const RevealImage: React.FC<RevealImageProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-[16/9]',
}) => {
  return (
    <div className={`relative overflow-hidden bg-arch-dark/10 ${aspectRatio} ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="w-full h-full"
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${imageClassName}`}
          loading="lazy"
        />
      </motion.div>
    </div>
  );
};
