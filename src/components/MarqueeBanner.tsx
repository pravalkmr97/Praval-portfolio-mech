import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useAnimationFrame } from 'motion/react';

interface MarqueeBannerProps {
  items?: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

const DEFAULT_ITEMS = [
  'OCP ORv3 LIQUID COOLING',
  '4.6KW TDP THERMAL MANAGEMENT',
  'ANSYS FEA & CFD SIMULATION',
  'IP67 WEATHERPROOF ENCLOSURES',
  'HIGH-DENSITY SWITCHING CHASSIS',
  'SOLIDWORKS & CREO SURFACING',
  'SUB-$18 MBOM TARGETS',
  'SVTP & GR-487-CORE COMPLIANCE',
  '800G OPTICAL TRANSCEIVERS',
  'DFM / DFA PRODUCTION TOOLING'
];

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  items = DEFAULT_ITEMS,
  speed = 0.45,
  direction = 'left',
  className = ''
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useMotionValue(0);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 0.35], {
    clamp: true
  });

  // Track scroll velocity
  let lastScrollY = useRef(0);
  useAnimationFrame((_, delta) => {
    const currentScrollY = scrollY.get();
    const velocity = (currentScrollY - lastScrollY.current) / (delta / 1000);
    lastScrollY.current = currentScrollY;
    scrollVelocity.set(Math.abs(velocity));

    let moveBy = (direction === 'left' ? -1 : 1) * speed * (delta / 16);
    
    // Accelerate slightly on scroll
    if (velocityFactor.get() !== 0) {
      moveBy += (direction === 'left' ? -1 : 1) * velocityFactor.get() * 0.25;
    }

    baseX.set(baseX.get() + moveBy);
  });

  // Infinite loop wrapping logic
  const x = useTransform(baseX, (v) => `${(v % 50)}%`);

  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden py-5 border-y border-white/5 bg-[#07090E]/80 backdrop-blur-sm select-none ${className}`}>
      {/* Edge gradient masks */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#0B0D10] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#0B0D10] to-transparent z-10 pointer-events-none" />

      <motion.div 
        className="flex whitespace-nowrap gap-8 items-center"
        style={{ x }}
      >
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 group cursor-default">
            <span className="mono text-xs leading-6 font-bold uppercase tracking-[0.18em] text-white/65 group-hover:text-accent-orange transition-colors duration-300">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-accent-orange/60 group-hover:scale-125 transition-all duration-300" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeBanner;
