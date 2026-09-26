import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

export default function OrbitingSkillsCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProjectHover, setIsProjectHover] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast-tracking spring for the core inner dot (high responsiveness)
  const dotSpringConfig = { damping: 45, stiffness: 450, mass: 0.15 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Smooth, lagging spring for the outer trailing ring (luxurious drag feel)
  const ringSpringConfig = { damping: 28, stiffness: 120, mass: 0.75 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    setMounted(true);

    // Add CSS class to hide default cursor on desktop
    const style = document.createElement('style');
    style.id = 'custom-cursor-styles';
    style.innerHTML = `
      @media (min-width: 1024px) {
        .custom-cursor-active, .custom-cursor-active * {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!visible) {
        setVisible(true);
        document.documentElement.classList.add('custom-cursor-active');
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
      document.documentElement.classList.remove('custom-cursor-active');
    };

    const handleMouseEnter = () => {
      setVisible(true);
      document.documentElement.classList.add('custom-cursor-active');
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    // Smart event delegation for identifying hover states of any interactive element
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, [data-interactive="true"]');
      
      if (interactiveEl) {
        setIsHovered(true);
        
        // Contextually determine if it is a project link or project card
        const isProject = interactiveEl.closest('[href^="/project/"]') || 
                          interactiveEl.closest('.interactive-project-card') ||
                          interactiveEl.classList.contains('group/title') ||
                          interactiveEl.closest('#projects') ||
                          interactiveEl.getAttribute('data-project') === 'true';
        setIsProjectHover(!!isProject);
      } else {
        setIsHovered(false);
        setIsProjectHover(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      
      const existingStyle = document.getElementById('custom-cursor-styles');
      if (existingStyle) existingStyle.remove();
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY, visible]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer Lagging Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isMouseDown ? 0.8 : isHovered ? (isProjectHover ? 0 : 1.6) : 1,
          opacity: visible ? (isProjectHover ? 0 : 1) : 0,
        }}
        transition={isProjectHover ? { duration: 0.1, ease: 'easeOut' } : { type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div 
          className={`rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered 
              ? isProjectHover 
                ? 'w-14 h-14 bg-white/10 border border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'w-10 h-10 bg-white/5 border border-white'
              : 'w-8 h-8 border border-white/20'
          }`}
        >
          {/* Custom text layer that fades in inside the expanded ring when hovering projects */}
          <AnimatePresence>
            {isHovered && isProjectHover && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="text-[7px] font-bold tracking-[0.25em] text-[#8A5A3C] font-mono leading-none select-none uppercase ml-[2px]"
              >
                VIEW
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Inner Responsive Target Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block mix-blend-screen"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isMouseDown ? 0.6 : isHovered ? (isProjectHover ? 0 : 0.4) : 1,
          opacity: visible ? (isProjectHover ? 0 : 1) : 0,
        }}
        transition={isProjectHover ? { duration: 0.08, ease: 'easeOut' } : { type: 'spring', damping: 30, stiffness: 350 }}
      >
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>
    </>
  );
}

