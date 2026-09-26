import React from 'react';
import { motion } from 'motion/react';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  highlightWords?: string[];
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  as = 'h2',
  delay = 0,
  highlightWords = []
}) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 120
      }
    },
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -45
    }
  };

  const Component = motion[as] as any;

  return (
    <Component
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-1 ${className}`}
      style={{ perspective: 1000 }}
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isHighlighted = highlightWords.some(hw => hw.toLowerCase() === cleanWord);

        return (
          <motion.span
            key={index}
            variants={child}
            className={`inline-block origin-bottom ${isHighlighted ? 'text-accent-orange font-extrabold' : ''}`}
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
};

export default TextReveal;
