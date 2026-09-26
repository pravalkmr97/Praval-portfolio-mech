import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Project, isVideoUrl, getOptimizedImageUrl } from '../data/projects';

interface InteractiveProjectCardProps {
  project: Project;
  indexStr: string;
}

export const InteractiveProjectCard: React.FC<InteractiveProjectCardProps> = ({ project, indexStr }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Motion values for the relative coordinates inside the image visual container
  const mX = useMotionValue(130);
  const mY = useMotionValue(130);
  const mRadius = useMotionValue(0);

  // Springs for fluid coordinate tracking
  const springConfig = { damping: 32, stiffness: 180, mass: 0.6 };
  const smoothX = useSpring(mX, springConfig);
  const smoothY = useSpring(mY, springConfig);
  
  // Spring for the radius to expand and contract with elegant elasticity
  const radiusSpringConfig = { damping: 26, stiffness: 48, mass: 1.3 };
  const smoothRadius = useSpring(mRadius, radiusSpringConfig);

  // Calculate mouse coordinate relative to card for subtle background glow
  const cardMX = useMotionValue(200);
  const cardMY = useMotionValue(200);
  const cardSmoothX = useSpring(cardMX, springConfig);
  const cardSmoothY = useSpring(cardMY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Update overall card coordinate for subtle backdrop glow
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      cardMX.set(e.clientX - cardRect.left);
      cardMY.set(e.clientY - cardRect.top);
    }

    // 2. Update image visual box coordinate for precision spotlight mapping
    if (visualRef.current) {
      const visualRect = visualRef.current.getBoundingClientRect();
      mX.set(e.clientX - visualRect.left);
      mY.set(e.clientY - visualRect.top);
    }
  };

  const handleCardMouseEnter = () => {
    setIsCardHovered(true);
    mRadius.set(650); // Expand spotlight radius on card hover to fully reveal the image
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    mRadius.set(0); // Shrink spotlight radius to 0
  };

  const handleImageMouseEnter = () => {
    setIsImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };

  // Combine into a single dynamic clip-path motion template
  const clipPathString = useMotionTemplate`circle(${smoothRadius}px at ${smoothX}px ${smoothY}px)`;

  // Transform smoothX/smoothY to template style properties for card background glow
  const glowXTemplate = useMotionTemplate`${cardSmoothX}px`;
  const glowYTemplate = useMotionTemplate`${cardSmoothY}px`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      data-project="true"
      className="group relative z-10 hover:z-20 rounded-xl border border-[#1A1D22]/80 bg-[#121418]/60 backdrop-blur-md overflow-hidden transition-all duration-500 cursor-pointer"
    >
      <Link to={`/project/${project.slug}`} className="block relative p-8 sm:p-10 lg:p-14 z-10">
        {/* Decorative subtle ambient backdrop glow mapping to mouse with smooth tracking */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,255,255,0.04)_0%,transparent_60%)] pointer-events-none z-0 transition-opacity duration-500"
          style={{
            '--x': glowXTemplate,
            '--y': glowYTemplate,
            opacity: isCardHovered ? 1 : 0,
          } as any}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          {/* Left Content Column */}
          <div className="flex-1 flex flex-col justify-between items-start text-left">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-accent-orange text-sm font-display font-extrabold tracking-wider">{indexStr}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-orange/35" />
                <span className="text-[10px] md:text-[11px] font-sans uppercase tracking-widest text-[#888780] font-semibold">
                  {project.category} &nbsp;·&nbsp; {project.year}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#D6D2C4] group-hover:text-white transition-colors tracking-wider leading-none mb-6 uppercase font-display">
                {project.title}
              </h3>
              <p className="text-[#888780]/90 font-light leading-relaxed text-sm md:text-base max-w-xl mb-8">
                {project.shortDesc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3.5 py-2 border border-[#1A1D22] rounded text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#888780] font-semibold bg-[#0B0D10]/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Visual Assets (Interactive Spotlight Graphic) */}
          <div className="w-full lg:w-auto flex justify-end">
            
            {/* Interactive Spotlight Visual Box (High-contrast color inversion) */}
            <div 
              ref={visualRef}
              onMouseEnter={handleImageMouseEnter}
              onMouseLeave={handleImageMouseLeave}
              className="relative w-full sm:w-[400px] md:w-[450px] lg:w-[490px] xl:w-[540px] aspect-[1.5] rounded-xl bg-[#07080a] overflow-hidden select-none flex items-center justify-center shrink-0 border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]"
              data-interactive="true"
              data-project="true"
            >
              {/* Layer 1: Normal Inactive State (Darkened, desaturated grayscale product image on a carbon black base) */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#101216] to-[#050608]">
                {/* Backlight Spot */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,210,196,0.02)_0%,transparent_65%)] pointer-events-none z-0" />
                
                {/* Ground Shadow */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[72%] h-4 bg-black/85 rounded-full blur-md pointer-events-none z-0" />

                {isVideoUrl(project.image) && !videoError ? (
                  <video
                    key={project.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover select-none grayscale brightness-[0.38] contrast-[1.1] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  >
                    <source src={project.image} type="video/webm" />
                    <source src={project.image} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={videoError ? getOptimizedImageUrl('https://lh3.googleusercontent.com/d/16wtAyeJQFpw1M-n6oKzsWSiLGsHtbAiZ', 800) : getOptimizedImageUrl(project.image, 800)} 
                    alt={project.title} 
                    className="w-full h-full object-cover select-none grayscale brightness-[0.38] contrast-[1.1] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                )}
              </div>

              {/* Layer 2: Hover Active State (Full-color vibrant product image on premium black studio lighting) */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#14171d] to-[#040507]"
                style={{
                  clipPath: clipPathString,
                }}
              >
                {/* Deep Warm Amber Studio Backlight */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_75%)] pointer-events-none z-0" />
                
                {/* Ground Shadow */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[72%] h-4 bg-black/95 rounded-full blur-lg pointer-events-none z-0" />

                {isVideoUrl(project.image) && !videoError ? (
                  <video
                    key={project.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover select-none transition-transform duration-700 ease-out scale-[1.03]"
                  >
                    <source src={project.image} type="video/webm" />
                    <source src={project.image} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={videoError ? getOptimizedImageUrl('https://lh3.googleusercontent.com/d/16wtAyeJQFpw1M-n6oKzsWSiLGsHtbAiZ', 800) : getOptimizedImageUrl(project.image, 800)} 
                    alt={project.title} 
                    className="w-full h-full object-cover select-none transition-transform duration-700 ease-out scale-[1.03]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

