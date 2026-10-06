import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;

      if (cursorTarget) {
        const cursorType = cursorTarget.getAttribute('data-cursor');
        setIsHovered(true);
        if (cursorType === 'project') {
          setCursorText('VIEW');
        } else if (cursorType === 'link') {
          setCursorText('→');
        } else {
          setCursorText('');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 pointer-events-none flex items-center justify-center rounded-full mix-blend-difference"
      animate={{
        x: mousePos.x - (isHovered ? 40 : 8),
        y: mousePos.y - (isHovered ? 40 : 8),
        width: isHovered ? 80 : 16,
        height: isHovered ? 80 : 16,
        backgroundColor: '#CBDDE9',
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.2 }}
    >
      {cursorText && (
        <span className="text-[10px] font-bold text-arch-dark uppercase tracking-wider">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
};
