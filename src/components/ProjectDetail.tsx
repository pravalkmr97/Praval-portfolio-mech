import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Layers, 
  DraftingCompass, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  ArrowUpRight
} from 'lucide-react';
import { projectsData, isVideoUrl, getOptimizedImageUrl } from '../data/projects';
import ariaCoolingLoopsImg from '../assets/images/slide1_original_cad.webp';
import blindMateQdsImg from '../assets/images/slide2_original_cad.webp';
import { SlideShowcase } from './SlideShowcase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800'
];

const SWITCH_GALLERY_IMAGES: Record<number, string[]> = {
  0: [
    ariaCoolingLoopsImg,
    'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800'
  ],
  1: [
    blindMateQdsImg,
    'https://images.unsplash.com/photo-1563306406-e66174fa3787?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800'
  ],
  2: [
    'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517420712361-2e6194e504e3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  ],
  3: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800'
  ]
};

const GALLERY_IMAGES_BY_STAGE: Record<string, Record<number, string[]>> = {
  '800g-switch': SWITCH_GALLERY_IMAGES,
  '64 port-switch': SWITCH_GALLERY_IMAGES,
  '64-port-switch': SWITCH_GALLERY_IMAGES,
  'laptop-npi': {
    0: [
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800'
    ],
    1: [
      'https://images.unsplash.com/photo-1581092918056-0ea4d3265811?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=800'
    ],
    2: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
    ],
    3: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
    ]
  }
};

function getSpecImages(projectSlug: string, spec: any, index: number): string[] {
  if (spec && spec.images && spec.images.length > 0) {
    return spec.images;
  }
  const staticList = GALLERY_IMAGES_BY_STAGE[projectSlug]?.[index];
  if (staticList && staticList.length > 0) {
    const res = [...staticList];
    if (spec && spec.image) {
      res[0] = spec.image;
    }
    return res;
  }
  return spec && spec.image ? [spec.image, ...DEFAULT_IMAGES.slice(1)] : DEFAULT_IMAGES;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function ParallaxShowcaseItem({ spec, index, projectSlug }: { spec: any; index: number; projectSlug: string; key?: any }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightUpperRef = useRef<HTMLDivElement>(null);
  const rightLowerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const images = getSpecImages(projectSlug, spec, index);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const primaryImage = images[currentIndex % images.length];
  const secondImage = images[(currentIndex + 1) % images.length];
  const thirdImage = images[(currentIndex + 2) % images.length];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left Column Parallax: y: -60px to 60px
      gsap.fromTo(leftColRef.current,
        { y: -60 },
        {
          y: 60,
          ease: "none",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        }
      );

      // Right Column Upper Parallax: y: 40px to -60px
      gsap.fromTo(rightUpperRef.current,
        { y: 40 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        }
      );

      // Right Column Lower Parallax: y: 70px to -30px
      gsap.fromTo(rightLowerRef.current,
        { y: 70 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        }
      );

      // Text Column floating: y: 30px to -30px
      gsap.fromTo(textRef.current,
        { y: 30 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        }
      );
    }, itemRef);

    return () => ctx.revert();
  }, []);

  // Keyboard navigation for ParallaxShowcaseItem's full-screen viewer
  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        const nextIdx = (images.indexOf(activeImage) + 1) % images.length;
        setActiveImage(images[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (images.indexOf(activeImage) - 1 + images.length) % images.length;
        setActiveImage(images[prevIdx]);
      } else if (e.key === 'Escape') {
        setActiveImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, images]);

  return (
    <div 
      ref={itemRef} 
      className="relative w-full flex flex-col justify-center items-center py-20 lg:py-28 border-b border-[#1A1D22]/60 last:border-0"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Descriptive block details */}
        <div 
          ref={textRef}
          className="lg:col-span-5 space-y-6 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="mono text-[10px] text-[#8A5A3C] uppercase tracking-[0.25em] font-bold">
              ● Stage 0{index + 1}
            </span>
            <div className="h-px w-10 bg-[#1A1D22]" />
            <span className="mono text-[9px] text-[#888780] uppercase tracking-widest font-semibold bg-[#121418] px-3 py-1 rounded border border-[#1A1D22]">
              Specs Verified
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#D6D2C4] display leading-none">
            {spec.title}
          </h3>

          <p className="text-sm sm:text-base text-[#888780] leading-relaxed font-light">
            {spec.text}
          </p>

          <div className="glass-card p-5 rounded-2xl bg-[#121418]/60 border border-[#1A1D22] divide-y divide-[#1A1D22] text-xs font-mono space-y-3 pt-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#8A5A3C] font-semibold pb-2">
              <span>Engineering specifications</span>
              <span>Stage 0{index+1}</span>
            </div>
            
            <div className="flex justify-between py-2 items-center text-[#888780]">
              <span className="uppercase text-[9px] tracking-widest text-[#888780]/70">{spec?.metricLabel?.replace('#', '') || "Calculated Limit"}</span>
              <span className="text-[#D6D2C4] font-medium font-mono">
                {spec?.metricValue || (
                  index === 0 ? "Max stress < 4.2 GPa" :
                  index === 1 ? "Accuracy ±0.015 mm" :
                  index === 2 ? "Fluid Plume > 2.8 m/s" :
                  "MBOM Target < $18"
                )}
              </span>
            </div>

            <div className="flex justify-between py-2 items-center text-[#888780]">
              <span className="uppercase text-[9px] tracking-widest text-[#888780]/70">{spec?.secondaryLabel?.replace('#', '') || "Process Method"}</span>
              <span className="text-[#8A5A3C] font-semibold font-mono">
                {spec?.secondaryValue || (
                  index === 0 ? "Anisotropic FEA Matrix" :
                  index === 1 ? "FDM Carbon-Resin Layering" :
                  index === 2 ? "Multiphase Navier CFD" :
                  "Cimatron Progress Tooling"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Vertical asymmetrical parallax split gallery */}
        <div className="lg:col-span-7 h-[500px] sm:h-[550px] lg:h-[650px] w-full rounded-[2.5rem] overflow-hidden border border-[#1A1D22] bg-[#0B0D10] relative grid grid-cols-2 gap-4 p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] group/gallery">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(#D6D2C4_1px,transparent_1px),linear-gradient(90deg,#D6D2C4_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Left flowing column - slightly slower */}
          <div className="relative h-full overflow-hidden w-full rounded-2xl">
            <div 
              ref={leftColRef}
              onClick={() => setActiveImage(primaryImage)}
              className="absolute inset-x-0 top-[10%] h-[90%] w-full rounded-2xl overflow-hidden border border-[#1A1D22] bg-gradient-to-b from-[#101216] to-[#050608] shadow-2xl cursor-zoom-in group hover:border-[#8A5A3C]/60 transition-all duration-300 flex items-center justify-center"
            >
              {/* Backlight Spot */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,90,60,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
              
              {/* Ground Shadow */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[72%] h-4 bg-black/85 rounded-full blur-md pointer-events-none z-0" />

              <img 
                src={getOptimizedImageUrl(primaryImage, 1000)} 
                alt="Mechanical split view A" 
                className="relative max-h-[80%] max-w-[80%] object-contain opacity-75 group-hover:opacity-100 transition-all duration-700 group-hover:scale-103 z-10"
                style={{
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.95)) drop-shadow(0 0 15px rgba(138,90,60,0.12))'
                }}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-[#0B0D10]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#1A1D22] opacity-85">
                <span className="mono text-[8px] text-[#D6D2C4]/90 uppercase tracking-widest font-bold">RECON_REFL_0{index+1}.A</span>
                <span className="mono text-[7px] text-[#8A5A3C] uppercase tracking-wider font-extrabold">PRMY</span>
              </div>
            </div>
          </div>

          {/* Right flowing column - slightly faster with two vertically offset visual plates */}
          <div className="relative h-full overflow-hidden w-full flex flex-col gap-4">
            <div 
              ref={rightUpperRef}
              onClick={() => setActiveImage(secondImage)}
              className="absolute inset-x-0 top-0 h-[46%] w-full rounded-2xl overflow-hidden border border-[#1A1D22] bg-gradient-to-b from-[#101216] to-[#050608] shadow-2xl cursor-zoom-in group hover:border-[#8A5A3C]/60 transition-all duration-300 flex items-center justify-center"
            >
              {/* Backlight Spot */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,90,60,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
              
              {/* Ground Shadow */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[72%] h-3 bg-black/85 rounded-full blur-md pointer-events-none z-0" />

              <img 
                src={getOptimizedImageUrl(secondImage, 800)} 
                alt="Mechanical split view B" 
                className="relative max-h-[78%] max-w-[78%] object-contain opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-103 z-10"
                style={{
                  filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.95)) drop-shadow(0 0 12px rgba(138,90,60,0.1))'
                }}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1558494949-ef8b5655d939?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center bg-[#0B0D10]/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#1A1D22]/80 opacity-85">
                <span className="mono text-[7px] text-[#888780] uppercase tracking-widest">STAGE_STP_01</span>
                <span className="mono text-[7px] text-[#55635A] font-bold">PASS</span>
              </div>
            </div>

            <div 
              ref={rightLowerRef}
              onClick={() => setActiveImage(thirdImage)}
              className="absolute inset-x-0 bottom-[5%] h-[46%] w-full rounded-2xl overflow-hidden border border-[#1A1D22] bg-gradient-to-b from-[#101216] to-[#050608] shadow-2xl cursor-zoom-in group hover:border-[#8A5A3C]/60 transition-all duration-300 flex items-center justify-center"
            >
              {/* Backlight Spot */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,90,60,0.12)_0%,transparent_65%)] pointer-events-none z-0" />
              
              {/* Ground Shadow */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[72%] h-3 bg-black/85 rounded-full blur-md pointer-events-none z-0" />

              <img 
                src={getOptimizedImageUrl(thirdImage, 800)} 
                alt="Mechanical split view C" 
                className="relative max-h-[78%] max-w-[78%] object-contain opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-103 z-10"
                style={{
                  filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.95)) drop-shadow(0 0 12px rgba(138,90,60,0.1))'
                }}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center bg-[#0B0D10]/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#1A1D22]/80 opacity-85">
                <span className="mono text-[7px] text-[#888780] uppercase tracking-widest">DIAG_STP_02</span>
                <span className="mono text-[7px] text-[#55635A] font-bold">STBL</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-[#0B0D10]/90 backdrop-blur-md border border-[#1A1D22] px-3 py-1 rounded-full mono text-[8px] text-[#888780] pointer-events-none uppercase tracking-widest z-20">
            {String(currentIndex+1).padStart(2, '0')} // {String(images.length).padStart(2, '0')}
          </div>

          {/* Tactical Left/Right Overlays inside Parallax Card */}
          <div className="absolute inset-x-2 inset-y-0 flex justify-between items-center pointer-events-none z-30 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300">
            <button 
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-[#0B0D10]/95 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg active:scale-90 group/btn"
            >
              <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            <button 
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#0B0D10]/95 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg active:scale-90 group/btn"
            >
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Interactive micro docking tray */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-1.5 overflow-x-auto bg-[#0B0D10]/95 backdrop-blur-md border border-[#1A1D22]/80 p-1.5 rounded-2xl max-w-full justify-center scrollbar-none opacity-90 hover:opacity-100 transition-opacity">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`w-11 h-8 rounded-lg overflow-hidden border transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  i === currentIndex
                    ? 'border-[#8A5A3C] ring-2 ring-[#8A5A3C]/20 scale-105 opacity-100'
                    : 'border-[#1A1D22] opacity-40 hover:opacity-100'
                }`}
              >
                <img src={getOptimizedImageUrl(img, 150)} alt={`Asset Mini ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Full-screen high definition review modal with complete asset gallery navigation */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0D10]/98 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Modal Closer Background */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setActiveImage(null)} 
            />

            <div className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden border border-[#1A1D22] shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-[#0B0D10] flex items-center justify-center p-2 sm:p-4">
              <img 
                src={getOptimizedImageUrl(activeImage, 1600)} 
                alt="Zoomed Stage Spec" 
                className="max-h-full max-w-full w-auto h-auto object-contain" 
                referrerPolicy="no-referrer"
              />
              
              {/* Top info bar */}
              <div className="absolute top-6 left-6 mono text-[10px] text-[#D6D2C4] bg-[#0B0D10]/95 backdrop-blur-md border border-[#1A1D22] px-4 py-2.5 rounded-xl uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-[#8A5A3C] rounded-full animate-pulse" />
                {spec.title} — IMAGE 0{images.indexOf(activeImage) + 1}
              </div>

              {/* Counter / Keyboard Indicators */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="mono text-[8px] text-[#888780] bg-[#121418]/95 backdrop-blur-md border border-[#1A1D22] px-2.5 py-1.5 rounded-lg uppercase hidden sm:inline-block">
                  Keyboard ← / →
                </span>
                <span className="mono text-[10px] text-[#D6D2C4] bg-[#0B0D10]/95 border border-[#1A1D22] px-3.5 py-1.5 rounded-xl font-bold">
                  {images.indexOf(activeImage) + 1} / {images.length}
                </span>
              </div>

              {/* On-Screen Chevrons */}
              <div className="absolute inset-y-0 inset-x-4 flex justify-between items-center pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevIdx = (images.indexOf(activeImage) - 1 + images.length) % images.length;
                    setActiveImage(images[prevIdx]);
                  }}
                  className="w-12 h-12 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-2xl active:scale-95 group/modal-btn"
                >
                  <ChevronLeft className="w-5 h-5 group-hover/modal-btn:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextIdx = (images.indexOf(activeImage) + 1) % images.length;
                    setActiveImage(images[nextIdx]);
                  }}
                  className="w-12 h-12 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-2xl active:scale-95 group/modal-btn"
                >
                  <ChevronRight className="w-5 h-5 group-hover/modal-btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Click background info */}
              <div className="absolute bottom-6 right-6 mono text-[8px] text-[#888780] bg-[#0B0D10]/95 border border-[#1A1D22] px-3 py-1.5 rounded-lg pointer-events-none uppercase tracking-widest">
                Click background to return
              </div>
            </div>

            {/* Bottom slides slider indicator */}
            <div className="mt-6 flex gap-2 max-w-full overflow-x-auto scrollbar-none py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-9 rounded-xl overflow-hidden border transition-all duration-300 flex-shrink-0 ${
                    img === activeImage 
                      ? 'border-[#8A5A3C] ring-4 ring-[#8A5A3C]/20 scale-105' 
                      : 'border-[#1A1D22] opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={getOptimizedImageUrl(img, 150)} alt={`Collage thumb ${idx+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface GSAPBentoImageShowcaseProps {
  project: any;
}

function GSAPBentoImageShowcase({ project }: GSAPBentoImageShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Collect all images for this project with stage information
  const allImages = useMemo(() => {
    const list: { url: string; specTitle: string; specText: string; stageIndex: number }[] = [];
    project.specs.forEach((spec: any, i: number) => {
      const specImages = getSpecImages(project.slug, spec, i);
      specImages.forEach((imgUrl: string) => {
        if (!list.some(item => item.url === imgUrl)) {
          list.push({
            url: imgUrl,
            specTitle: spec.title,
            specText: spec.text,
            stageIndex: i
          });
        }
      });
    });
    return list;
  }, [project]);

  const visibleImages = useMemo(() => {
    return allImages.filter(img => !failedImages[img.url]);
  }, [allImages, failedImages]);

  const activeFullScreenIdx = useMemo(() => {
    if (!activeUrl) return null;
    const idx = visibleImages.findIndex(img => img.url === activeUrl);
    return idx !== -1 ? idx : null;
  }, [activeUrl, visibleImages]);

  // Keyboard navigation
  useEffect(() => {
    if (activeFullScreenIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveUrl(prev => {
          if (!prev) return null;
          const currentIdx = visibleImages.findIndex(img => img.url === prev);
          if (currentIdx === -1) return null;
          const prevIdx = (currentIdx - 1 + visibleImages.length) % visibleImages.length;
          return visibleImages[prevIdx].url;
        });
      } else if (e.key === 'ArrowRight') {
        setActiveUrl(prev => {
          if (!prev) return null;
          const currentIdx = visibleImages.findIndex(img => img.url === prev);
          if (currentIdx === -1) return null;
          const nextIdx = (currentIdx + 1) % visibleImages.length;
          return visibleImages[nextIdx].url;
        });
      } else if (e.key === 'Escape') {
        setActiveUrl(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFullScreenIdx, visibleImages]);

  if (visibleImages.length === 0) return null;

  // Retrieve project results metrics for progress card
  const finalYieldValue = project.results?.[0]?.value || project.stats?.[0]?.value || "98.5%";
  const finalYieldLabel = project.results?.[0]?.label || project.stats?.[0]?.label || "NPI YIELD RATE";
  const secondYieldValue = project.results?.[1]?.value || project.stats?.[1]?.value || "100%";
  const secondYieldLabel = project.results?.[1]?.label || project.stats?.[1]?.label || "DFM COMPLIANCE";

  return (
    <div ref={containerRef} className="w-full space-y-8">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1A1D22]">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-[#8A5A3C] animate-pulse" />
          <span className="mono text-[8.5px] uppercase tracking-widest text-[#888780]">
            SPECIFICATION IMAGES — HIGH RESOLUTION GALLERY
          </span>
        </div>
        <div className="mono text-[8.5px] text-[#888780] tracking-wider">
          GALLERY: 0{visibleImages.length} ITEMS
        </div>
      </div>

      {/* Main Massive Hero Image (Bigger size than the rest) */}
      {visibleImages.length > 0 && (
        <div
          onClick={() => setActiveUrl(visibleImages[0].url)}
          className="bento-showcase-card group relative rounded-[2rem] border border-[#1A1D22] bg-[#0B0D10]/95 overflow-hidden transition-all duration-500 hover:border-[#8A5A3C]/45 cursor-zoom-in h-[320px] sm:h-[420px] md:h-[500px] w-full"
        >
          {/* Millimeter engineering graph lines overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(#D6D2C4_1px,transparent_1px),linear-gradient(90deg,#D6D2C4_1px,transparent_1px)] bg-[size:16px_16px] z-0" />

          {/* Large Hero Image Background */}
          <img 
            src={getOptimizedImageUrl(visibleImages[0].url, 1200)} 
            alt={visibleImages[0].specTitle}
            className="bento-parallax-img w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.02] filter grayscale group-hover:grayscale-0"
            referrerPolicy="no-referrer"
            onError={() => {
              setFailedImages(prev => ({ ...prev, [visibleImages[0].url]: true }));
            }}
          />

          {/* Dark copper gradient overlays for readable text */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/95 via-[#0B0D10]/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/45 via-transparent to-transparent pointer-events-none" />

          {/* Top micro tag */}
          <div className="absolute top-0 inset-x-0 p-6 md:p-8 flex justify-between items-start z-10 select-none pointer-events-none">
            <span className="mono text-[9px] md:text-xs bg-[#8A5A3C] border border-[#8A5A3C]/50 px-3 py-1 rounded-full text-white font-bold tracking-widest uppercase">
              HERO SPECIFICATION — PHASE 01
            </span>
            
            <div className="grid grid-cols-4 gap-[3px] w-4 h-4 text-white/30 group-hover:text-[#8A5A3C]/80 transition-colors">
              {[...Array(16)].map((_, i) => (
                <span key={i} className="w-[2.5px] h-[2.5px] rounded-full bg-current" />
              ))}
            </div>
          </div>

          {/* Bottom text overlay & action button */}
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 pt-16 z-10 flex flex-col gap-1 pr-24 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8A5A3C] shrink-0 animate-pulse" />
              <h3 className="font-extrabold text-base md:text-xl text-[#D6D2C4] uppercase tracking-tight group-hover:text-white transition-colors">
                {visibleImages[0].specTitle}
              </h3>
            </div>
            
            <p className="text-[10px] md:text-[11px] text-[#888780] font-mono leading-relaxed uppercase tracking-wider max-w-[85%]">
              {visibleImages[0].specText}
            </p>

            {/* Micro action button indicator */}
            <div className="absolute right-6 md:right-8 bottom-6 md:bottom-8 w-10 h-10 rounded-xl bg-[#8A5A3C]/10 border border-[#8A5A3C]/35 text-[#8A5A3C] group-hover:bg-[#8A5A3C] group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg">
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </div>
        </div>
      )}

      {/* Styled Masonry Columns Structure for remaining images */}
      {visibleImages.length > 1 && (
        <div 
          className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]"
        >
          {visibleImages.slice(1).map((img, idx) => {
            const actualIdx = idx + 1;
            return (
              <div
                key={img.url}
                onClick={() => setActiveUrl(img.url)}
                className="bento-showcase-card break-inside-avoid mb-6 group relative rounded-[2rem] border border-[#1A1D22] bg-[#0B0D10]/95 overflow-hidden transition-all duration-500 hover:border-[#8A5A3C]/45 cursor-zoom-in"
              >
                {/* Millimeter engineering graph lines overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(#D6D2C4_1px,transparent_1px),linear-gradient(90deg,#D6D2C4_1px,transparent_1px)] bg-[size:16px_16px] z-0" />

                {/* Natural aspect ratio image background */}
                <img 
                  src={getOptimizedImageUrl(img.url, 800)} 
                  alt={img.specTitle}
                  className="bento-parallax-img w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.03] filter grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() => {
                    setFailedImages(prev => ({ ...prev, [img.url]: true }));
                  }}
                />

                {/* Dark copper gradient overlays for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/95 via-[#0B0D10]/15 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/35 via-transparent to-transparent pointer-events-none" />

                {/* Top micro tag */}
                <div className="absolute top-0 inset-x-0 p-5 flex justify-between items-start z-10 select-none pointer-events-none">
                  <span className="mono text-[8.5px] bg-[#0B0D10]/80 border border-[#1A1D22] px-2.5 py-1 rounded-full text-[#888780] tracking-widest uppercase">
                    PHASE_0{img.stageIndex + 1}
                  </span>
                  
                  {/* Clean dot matrix accent inspired from the photo */}
                  <div className="grid grid-cols-3 gap-[3px] w-3 h-3 text-[#D6D2C4]/25 group-hover:text-[#8A5A3C]/80 transition-colors">
                    {[...Array(9)].map((_, i) => (
                      <span key={i} className="w-[2.5px] h-[2.5px] rounded-full bg-current" />
                    ))}
                  </div>
                </div>

                {/* Bottom text overlay & corner orange action button */}
                <div className="absolute bottom-0 inset-x-0 p-5 p-5 pt-8 z-10 flex flex-col gap-1 pr-16 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A3C] shrink-0" />
                    <h4 className="font-bold text-xs text-[#D6D2C4] uppercase tracking-tight group-hover:text-white transition-colors truncate">
                      {img.specTitle}
                    </h4>
                  </div>

                  {/* Small action button directly on top of bottom overlay */}
                  <div className="absolute right-5 bottom-5 w-7 h-7 rounded-lg bg-[#8A5A3C]/10 border border-[#8A5A3C]/30 text-[#8A5A3C] group-hover:bg-[#8A5A3C] group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-md">
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Interactive Cinematic Slider Lightbox */}
      <AnimatePresence>
        {activeFullScreenIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0D10]/98 backdrop-blur-xl z-[999] flex flex-col items-center justify-between p-4 sm:p-8"
          >
            {/* Seamless closing background tap zone */}
            <div 
              className="absolute inset-0 cursor-zoom-out z-0" 
              onClick={() => setActiveUrl(null)} 
            />

            {/* LIGHTBOX HEADER */}
            <div className="relative w-full max-w-6xl z-10 flex justify-between items-center select-none pt-4 pb-3 border-b border-[#1A1D22]/60 bg-transparent">
              <div className="flex items-center gap-4">
                <span className="mono text-[9px] uppercase tracking-widest text-[#8A5A3C] font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A3C] animate-ping" />
                  SPECIFICATION IMAGE DETAIL
                </span>
                <span className="hidden md:inline text-[9px] font-mono text-[#888780]">|</span>
                <span className="hidden md:inline mono text-[9px] text-[#888780] uppercase tracking-tight">
                  {visibleImages[activeFullScreenIdx].specTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="mono text-[9px] text-[#888780] tracking-widest uppercase">
                  IMAGE 0{activeFullScreenIdx + 1} / 0{visibleImages.length}
                </span>
                <button 
                  onClick={() => setActiveUrl(null)}
                  className="px-4 py-1.5 bg-[#121418] hover:bg-[#8A5A3C]/10 border border-[#1A1D22] hover:border-[#8A5A3C]/40 text-[#888780] hover:text-[#D6D2C4] rounded-lg mono text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
                >
                  CLOSE [X]
                </button>
              </div>
            </div>

            {/* LIGHTBOX STAGE & PREV/NEXT NAVIGATIONS */}
            <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 z-15">
              {/* Previous Side Controller */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveUrl(prev => {
                    if (!prev) return null;
                    const currentIdx = visibleImages.findIndex(img => img.url === prev);
                    if (currentIdx === -1) return null;
                    const prevIdx = (currentIdx - 1 + visibleImages.length) % visibleImages.length;
                    return visibleImages[prevIdx].url;
                  });
                }}
                className="absolute left-0 lg:-left-20 xl:-left-24 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#1A1D22] bg-[#0B0D10]/85 hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] transition-all flex items-center justify-center cursor-pointer group shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-20"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Main Dynamic aspect-safe rendering core */}
              <div className="relative max-h-full max-w-full flex items-center justify-center h-[55vh] sm:h-[65vh] md:h-[72vh] w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFullScreenIdx}
                    initial={{ opacity: 0, scale: 0.98, x: 15 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative max-h-full max-w-full flex items-center justify-center z-10"
                  >
                    <img 
                      src={getOptimizedImageUrl(visibleImages[activeFullScreenIdx].url, 1600)} 
                      alt=""
                      className="max-h-[52vh] sm:max-h-[62vh] md:max-h-[68vh] w-auto max-w-full rounded-2xl border border-[#1A1D22] shadow-[0_30px_70px_rgba(0,0,0,0.9)] object-contain"
                      referrerPolicy="no-referrer"
                    />

                    {/* Technical Crosshairs Decal in each corner to reinforce the blueprint context */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#8A5A3C]/40" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#8A5A3C]/40" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#8A5A3C]/40" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#8A5A3C]/40" />
                  </motion.div>
                </AnimatePresence>

                {/* Micro Ambient blurred backglow */}
                <div className="absolute inset-0 select-none pointer-events-none z-0 overflow-hidden opacity-25 filter blur-[100px] scale-105">
                  <img src={getOptimizedImageUrl(visibleImages[activeFullScreenIdx].url, 150)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

              {/* Next Side Controller */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveUrl(prev => {
                    if (!prev) return null;
                    const currentIdx = visibleImages.findIndex(img => img.url === prev);
                    if (currentIdx === -1) return null;
                    const nextIdx = (currentIdx + 1) % visibleImages.length;
                    return visibleImages[nextIdx].url;
                  });
                }}
                className="absolute right-0 lg:-right-20 xl:-right-24 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#1A1D22] bg-[#0B0D10]/85 hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] transition-all flex items-center justify-center cursor-pointer group shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-20"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* LIGHTBOX HUD FOOTER WITH SPEC DETAILS */}
            <div className="relative w-full max-w-4xl z-10 select-text bg-[#0C0E11]/90 backdrop-blur-md border border-[#1A1D22] p-5 sm:p-7 rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div className="space-y-1.5 md:max-w-[70%]">
                <div className="flex items-center gap-3">
                  <span className="mono text-[8px] tracking-[0.25em] text-[#8A5A3C] uppercase font-bold bg-[#8A5A3C]/15 border border-[#8A5A3C]/20 px-2 py-0.5 rounded">
                    PHASE 0{visibleImages[activeFullScreenIdx].stageIndex + 1}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#1A1D22]" />
                  <span className="mono text-[9px] uppercase tracking-wider text-[#D6D2C4] font-semibold">
                    {visibleImages[activeFullScreenIdx].specTitle}
                  </span>
                </div>
                <p className="text-xs text-[#888780] font-light leading-relaxed uppercase pr-1 font-mono tracking-tight balance">
                  {visibleImages[activeFullScreenIdx].specText}
                </p>
              </div>

              {/* Mini Thumbnail Carousel in Lightbox Footer for quick jumping */}
              <div className="flex gap-2 self-start md:self-center overflow-x-auto max-w-full pb-1 scrollbar-none items-center">
                {visibleImages.map((img, i) => (
                  <button 
                    key={img.url}
                    onClick={() => setActiveUrl(img.url)}
                    className={`w-8 h-8 rounded-lg overflow-hidden border transition-all duration-300 relative group shrink-0 cursor-pointer ${
                      activeFullScreenIdx === i 
                        ? 'border-[#8A5A3C] scale-110 shadow-[0_0_8px_rgba(138,90,60,0.4)] ring-2 ring-[#8A5A3C]/30' 
                        : 'border-[#1A1D22] hover:border-[#888780]/40'
                    }`}
                  >
                    <img 
                      src={getOptimizedImageUrl(img.url, 150)} 
                      alt="" 
                      className={`w-full h-full object-cover ${activeFullScreenIdx === i ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StageImageGallery({ index, baseImage, title, spec }: { index: number; baseImage: string; title: string; spec?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const galleryImagesByStage: Record<number, string[]> = {
    0: [
      baseImage || ariaCoolingLoopsImg,
      'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600', // Blueprint sketches
      ariaCoolingLoopsImg
    ],
    1: [
      baseImage || blindMateQdsImg,
      'https://images.unsplash.com/photo-1563306406-e66174fa3787?auto=format&fit=crop&q=80&w=600', // CNC Spark machining representation
      blindMateQdsImg
    ],
    2: [
      baseImage,
      'https://images.unsplash.com/photo-1517420712361-2e6194e504e3?auto=format&fit=crop&q=80&w=600', // Oscilloscope readout signal inspection
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600'  // Laser probe thermal inspection
    ],
    3: [
      baseImage,
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600', // Massive heavy structural tooling mold lines
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=600'  // Robotic visual detection line assembly
    ]
  };

  const rawImages = (spec && spec.images) || galleryImagesByStage[index] || [baseImage, baseImage, baseImage];
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const images = useMemo(() => {
    const filtered = rawImages.filter(img => !failedImages[img]);
    return filtered.length > 0 ? filtered : galleryImagesByStage[index];
  }, [rawImages, failedImages, index]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Safely clamp the currentIndex if images size changes
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(Math.max(0, images.length - 1));
    }
  }, [images.length, currentIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fan left card
      if (card1Ref.current) {
        gsap.fromTo(card1Ref.current,
          { x: -50, rotate: -12 },
          {
            x: 50,
            rotate: 8,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          }
        );
      }

      // Slide center card
      if (card2Ref.current) {
        gsap.fromTo(card2Ref.current,
          { scale: 1.02, rotate: 2 },
          {
            scale: 1.05,
            rotate: -2,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          }
        );
      }

      // Fan right card
      if (card3Ref.current) {
        gsap.fromTo(card3Ref.current,
          { x: 50, rotate: 10 },
          {
            x: -50,
            rotate: -8,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Keyboard navigation inside fullscreen viewer
  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        const nextIdx = (images.indexOf(activeImage) + 1) % images.length;
        setActiveImage(images[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (images.indexOf(activeImage) - 1 + images.length) % images.length;
        setActiveImage(images[prevIdx]);
      } else if (e.key === 'Escape') {
        setActiveImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, images]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const centerImage = images[currentIndex];
  const leftImage = images[(currentIndex - 1 + images.length) % images.length];
  const rightImage = images[(currentIndex + 1) % images.length];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[460px] flex flex-col items-center justify-between bg-[#0B0D10]/20 rounded-[2.5rem] border border-[#1A1D22]/50 overflow-hidden p-6 hover:border-[#8A5A3C]/30 transition-all duration-500"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(#D6D2C4_1px,transparent_1px),linear-gradient(90deg,#D6D2C4_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* HUD Header Bar */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5 bg-[#0B0D10]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#1A1D22]">
          <span className="w-1.5 h-1.5 bg-[#8A5A3C] rounded-full animate-pulse" />
          <span className="mono text-[8px] uppercase tracking-wider text-[#D6D2C4]">Active_Deck_0{index+1}</span>
        </div>
        <div className="mono text-[9px] text-[#888780] bg-[#121418] border border-[#1A1D22] px-3 py-1 rounded">
          <span className="text-[#8A5A3C] font-semibold">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(images.length).padStart(2, '0')}
        </div>
      </div>

      {/* Main Fanned Stack */}
      <div className="relative w-full max-w-[390px] aspect-video flex items-center justify-center -my-4">
        {/* Card 1 - Left */}
        <div 
          ref={card1Ref}
          onClick={() => setActiveImage(leftImage)}
          className="absolute w-[80%] aspect-video rounded-2xl overflow-hidden border border-[#1A1D22] bg-gradient-to-b from-[#101216] to-[#050608] shadow-2xl origin-bottom cursor-zoom-in transition-all duration-500 hover:border-[#8A5A3C]/40 z-10 hover:z-30 group flex items-center justify-center"
        >
          {/* Backlight Spot */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,90,60,0.1)_0%,transparent_60%)] pointer-events-none z-0" />
          
          {/* Ground Shadow */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-3 bg-black/85 rounded-full blur-md pointer-events-none z-0" />

          <img 
            src={getOptimizedImageUrl(leftImage, 600)} 
            alt="Mechanical Stage Setup"
            className="relative max-h-[75%] max-w-[75%] object-contain opacity-40 group-hover:opacity-100 transition-all duration-500 z-10"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.95))'
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => {
              setFailedImages(prev => ({ ...prev, [leftImage]: true }));
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0D10]/90 via-transparent to-transparent p-3 flex items-end z-20">
            <span className="mono text-[7px] text-[#888780] bg-[#0b0d10]/95 px-2 py-0.5 rounded border border-[#1a1d22]">TECH_SCHEME_A</span>
          </div>
        </div>

        {/* Card 2 - Center (Focused Active) */}
        <div 
          ref={card2Ref}
          onClick={() => setActiveImage(centerImage)}
          className="absolute w-[88%] aspect-video rounded-2xl overflow-hidden border border-[#1A1D22] bg-[#0E1013] shadow-2xl z-20 cursor-zoom-in hover:border-[#8A5A3C] group transition-all duration-300 flex items-center justify-center"
        >
          <img 
            src={getOptimizedImageUrl(centerImage, 1200)} 
            alt="Mechanical Stage Hero"
            className="w-full h-full object-contain p-1 transition-all duration-300 z-10"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => {
              setFailedImages(prev => ({ ...prev, [centerImage]: true }));
            }}
          />
        </div>

        {/* Card 3 - Right */}
        <div 
          ref={card3Ref}
          onClick={() => setActiveImage(rightImage)}
          className="absolute w-[80%] aspect-video rounded-2xl overflow-hidden border border-[#1A1D22] bg-gradient-to-b from-[#101216] to-[#050608] shadow-2xl origin-bottom cursor-zoom-in transition-all duration-500 hover:border-[#8A5A3C]/40 z-10 hover:z-30 group flex items-center justify-center"
        >
          {/* Backlight Spot */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,90,60,0.1)_0%,transparent_60%)] pointer-events-none z-0" />
          
          {/* Ground Shadow */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-3 bg-black/85 rounded-full blur-md pointer-events-none z-0" />

          <img 
            src={getOptimizedImageUrl(rightImage, 600)} 
            alt="Mechanical Stage Diagnostic"
            className="relative max-h-[75%] max-w-[75%] object-contain opacity-40 group-hover:opacity-100 transition-all duration-500 z-10"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.95))'
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => {
              setFailedImages(prev => ({ ...prev, [rightImage]: true }));
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0D10]/90 via-transparent to-transparent p-3 flex items-end justify-between z-20">
            <span className="mono text-[7px] text-[#888780] bg-[#0b0d10]/95 px-2 py-0.5 rounded border border-[#1a1d22]">DIAGNOSTIC_B</span>
          </div>
        </div>

        {/* Tactical HUD Left/Right Buttons */}
        <div className="absolute inset-x-[-16px] flex justify-between items-center pointer-events-none z-30">
          <button 
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg active:scale-90 group/btn"
          >
            <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg active:scale-90 group/btn"
          >
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Interactive Micro-thumbnails strip */}
      <div className="w-full flex flex-col items-center gap-2 z-10">
        <div className="flex gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`relative w-12 h-8 rounded-lg overflow-hidden border transition-all duration-300 flex-shrink-0 cursor-pointer ${
                i === currentIndex 
                  ? 'border-[#8A5A3C] scale-105 shadow-[0_0_10px_rgba(138,90,60,0.3)]' 
                  : 'border-[#1A1D22] opacity-40 hover:opacity-85 hover:border-[#888780]'
              }`}
            >
              <img 
                src={getOptimizedImageUrl(img, 150)} 
                alt={`Thumb ${i+1}`} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                loading="lazy"
                onError={() => {
                  setFailedImages(prev => ({ ...prev, [img]: true }));
                }}
              />
            </button>
          ))}
        </div>
        <span className="mono text-[8px] text-[#55635A] uppercase tracking-widest font-semibold flex items-center gap-1 leading-none">
          <span className="inline-block w-1 h-1 bg-[#8A5A3C] rotate-45" /> Drag or click thumbnail to dock item
        </span>
      </div>

      {/* Fullscreen Video Zoom Modal with Keyboard Support & Slider List */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0D10]/98 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Modal Closer Background */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setActiveImage(null)} 
            />

            <div className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden border border-[#1A1D22] shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-[#0B0D10] flex items-center justify-center p-2 sm:p-4 group">
              <img 
                src={getOptimizedImageUrl(activeImage, 1600)} 
                alt="Zoomed Stage Spec" 
                className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-700 hover:scale-[1.02]" 
                referrerPolicy="no-referrer"
              />
              
              {/* Fullscreen Overlay Specs */}
              <div className="absolute top-6 left-6 mono text-[10px] text-[#D6D2C4] bg-[#0B0D10]/90 backdrop-blur-md border border-[#1A1D22] px-4 py-2.5 rounded-xl uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-[#8A5A3C] rounded-full animate-pulse" />
                {title} // ASSET_0{images.indexOf(activeImage) + 1}
              </div>

              {/* Arrow Keys indicators */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="mono text-[8px] text-[#888780] bg-[#121418]/90 backdrop-blur-md border border-[#1A1D22] px-2.5 py-1.5 rounded-lg uppercase hidden sm:inline-block">
                  Keyboard ← / →
                </span>
                <span className="mono text-[10px] text-[#D6D2C4] bg-[#0B0D10]/95 border border-[#1A1D22] px-3.5 py-1.5 rounded-xl font-bold">
                  {images.indexOf(activeImage) + 1} / {images.length}
                </span>
              </div>

              {/* On-Screen Chevrons */}
              <div className="absolute inset-y-0 inset-x-4 flex justify-between items-center pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevIdx = (images.indexOf(activeImage) - 1 + images.length) % images.length;
                    setActiveImage(images[prevIdx]);
                  }}
                  className="w-12 h-12 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-2xl active:scale-95 group/modal-btn"
                >
                  <ChevronLeft className="w-5 h-5 group-hover/modal-btn:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextIdx = (images.indexOf(activeImage) + 1) % images.length;
                    setActiveImage(images[nextIdx]);
                  }}
                  className="w-12 h-12 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer shadow-2xl active:scale-95 group/modal-btn"
                >
                  <ChevronRight className="w-5 h-5 group-hover/modal-btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Click instruction banner */}
              <div className="absolute bottom-6 right-6 mono text-[8px] text-[#888780] bg-[#0B0D10]/90 border border-[#1A1D22] px-3 py-1.5 rounded-lg pointer-events-none uppercase tracking-widest">
                Click background to return
              </div>
            </div>
            
            {/* Interactive slide tracker in full-screen */}
            <div className="mt-6 flex gap-2 max-w-full overflow-x-auto scrollbar-none py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-9 rounded-xl overflow-hidden border transition-all duration-300 flex-shrink-0 cursor-pointer ${
                    img === activeImage 
                      ? 'border-[#8A5A3C] ring-4 ring-[#8A5A3C]/20 scale-105' 
                      : 'border-[#1A1D22] opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={getOptimizedImageUrl(img, 150)} alt={`Modal thumb ${idx+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const decodedId = id ? decodeURIComponent(id) : '';
  const project = projectsData.find(p => p.slug === id || p.slug === decodedId) ||
    (id === '800g-switch' || decodedId === '800g-switch' ? projectsData.find(p => p.slug === '64 port-switch') : undefined) ||
    (id === '64 port-switch' || decodedId === '64 port-switch' ? projectsData.find(p => p.slug === '800g-switch') : undefined) ||
    (id === 'multiport-ev-pole-charger' || id === 'multiport-ev-pole-charge' || id?.toLowerCase().includes('multiport') ? projectsData.find(p => p.slug === 'evse-station') : undefined);

  const containerRef = useRef<HTMLDivElement>(null);
  const is800g = id === '800g-switch' || decodedId === '800g-switch' || id === '64 port-switch' || decodedId === '64 port-switch' || project?.slug === '64 port-switch' || project?.slug === '800g-switch';
  const isEvse = id === 'evse-station' || decodedId === 'evse-station' || project?.slug === 'evse-station' || project?.title.includes('EV Pole');
  const isSlideOnly = is800g || isEvse;
  const [viewMode, setViewMode] = useState<'timeline' | 'slide'>(isSlideOnly ? 'slide' : 'timeline');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setViewMode(isSlideOnly ? 'slide' : 'timeline');
  }, [isSlideOnly]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D10] text-[#D6D2C4] p-6">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4 uppercase">404</h1>
          <p className="text-[#888780] mb-8 uppercase tracking-widest mono">System core out of bounds</p>
          <Link to="/" className="text-[#8A5A3C] hover:text-[#8A5A3C]/85 transition-colors mono uppercase tracking-widest border-b border-[#8A5A3C] pb-1">Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#D6D2C4]">
      
      {/* Header Nav */}
      <nav className="sticky top-0 w-full z-50 bg-[#0B0D10]/50 backdrop-blur-md border-b border-[#1A1D22] py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-3 text-[#888780] hover:text-[#D6D2C4] transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#8A5A3C]" />
            <span className="mono text-[10px] uppercase tracking-widest font-semibold">Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="mono text-[10px] text-[#8A5A3C] uppercase tracking-widest font-bold bg-[#8A5A3C]/10 px-3 py-1 rounded-full border border-[#8A5A3C]/20">{project.category}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        {/* Intro */}
        <section className="mb-20">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="lg:col-span-9 min-w-0">
              <span className="mono text-[#888780] text-[12px] uppercase tracking-[0.3em] mb-4 block">Hardware Engineering Stack // {project.year}</span>
              <h1 className="max-w-full break-words text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-8">
                {project.title.split(' ').map((word, i, words) => {
                  if (word === '&') {
                    return (
                      <span key={i} className="text-[#D6D2C4]">&amp;{' '}</span>
                    );
                  }

                  return (
                    <React.Fragment key={i}>
                      <span className={i % 2 === 1 ? 'text-[#888780]' : 'text-[#D6D2C4]'}>{word}{' '}</span>
                      {i === 1 && <br className="hidden md:block" />}
                    </React.Fragment>
                  );
                })}
              </h1>
              <p className="text-lg lg:text-xl text-[#888780] font-light leading-relaxed max-w-2xl bg-gradient-to-r from-[#D6D2C4]/90 to-[#D6D2C4]/75 bg-clip-text text-transparent">
                {project.fullDesc}
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="lg:col-span-3 flex justify-end w-full min-w-0">
               <div className="glass-card p-6 sm:p-8 rounded-3xl w-full bg-[#121418]/60 border border-[#1A1D22]">
                  <p className="mono text-[10px] uppercase text-[#888780] mb-5 tracking-widest font-bold">● Operational Specifications</p>
                  <div className="space-y-4 sm:space-y-5">
                    {project.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 border-b border-[#1A1D22] last:border-0 pb-3.5 last:pb-0">
                        <span className="text-xs sm:text-sm font-bold uppercase text-[#D6D2C4]/80 tracking-wide text-left">{stat.label}</span>
                        <span className="text-xl sm:text-2xl font-black text-[#8A5A3C] text-right font-mono tracking-tight shrink-0 whitespace-nowrap">{stat.value}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Hero Image */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-24"
        >
          <div className={`relative ${isEvse ? 'aspect-[16/9]' : 'aspect-[21/9]'} rounded-[3rem] overflow-hidden bg-[#121418] border border-[#1A1D22] group`}>
            {isVideoUrl(project.heroImage || project.image) && !videoError ? (
              <video 
                key={project.heroImage || project.image}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
              >
                <source src={project.heroImage || project.image} type="video/webm" />
                <source src={project.heroImage || project.image} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={getOptimizedImageUrl(videoError ? 'https://lh3.googleusercontent.com/d/16wtAyeJQFpw1M-n6oKzsWSiLGsHtbAiZ' : (project.heroImage || project.image), 1600)} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/95 via-[#0B0D10]/20 to-transparent flex flex-col justify-end p-12">
               <div className="flex gap-4">
                 {project.tags.map(tag => (
                   <span key={tag} className="px-4 py-2 bg-[#0B0D10]/90 backdrop-blur-md rounded-full border border-[#1A1D22] mono text-[10px] uppercase tracking-widest text-[#D6D2C4]/80 font-bold">{tag}</span>
                 ))}
               </div>
            </div>
          </div>
        </motion.section>

        {/* INTERACTIVE MODE CONTROL STATION */}
        {!isSlideOnly && (
          <div className="mb-16 glass-card p-6 md:p-8 rounded-[2.5rem] bg-[#121418]/30 border border-[#1A1D22] flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-left">
              <span className="mono text-[#8A5A3C] text-xs sm:text-sm uppercase tracking-[0.2em] block font-bold">● View Selection Options</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#D6D2C4] tracking-tight">Select Development Track</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#0B0D10]/90 border border-[#1A1D22] rounded-2xl shadow-inner shrink-0">
              <button 
                onClick={() => setViewMode('timeline')}
                className={`px-5 py-2.5 rounded-xl text-center uppercase tracking-wider text-[10px] mono transition-all duration-300 font-bold flex items-center gap-2 select-none ${
                  viewMode === 'timeline' 
                    ? 'bg-[#8A5A3C] text-[#D6D2C4] shadow-md' 
                    : 'text-[#888780] hover:text-[#D6D2C4]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${viewMode === 'timeline' ? 'bg-[#D6D2C4] animate-pulse' : 'bg-transparent'}`} />
                Timeline View
              </button>
              <button 
                onClick={() => setViewMode('slide')}
                className={`px-5 py-2.5 rounded-xl text-center uppercase tracking-wider text-[10px] mono transition-all duration-300 font-bold flex items-center gap-2 select-none ${
                  viewMode === 'slide' 
                    ? 'bg-[#8A5A3C] text-[#D6D2C4] shadow-md' 
                    : 'text-[#888780] hover:text-[#D6D2C4]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${viewMode === 'slide' ? 'bg-[#D6D2C4] animate-pulse' : 'bg-transparent'}`} />
                Slide View
              </button>
            </div>
          </div>
        )}

        {/* Technical Deep Dive Container with State views */}
        <section ref={containerRef} className="relative mb-16 sm:mb-24 lg:mb-32">
          
          {/* Header & View Mode Switch Board */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16 border-b border-[#1A1D22] pb-5 sm:pb-8">
            <div className="flex items-baseline gap-6 flex-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter uppercase whitespace-nowrap text-[#D6D2C4] display">Technical Deep Dive</h2>
              <div className="h-px bg-[#1A1D22] flex-1 block" />
              <span className="mono text-xs text-[#8A5A3C] hidden lg:inline-block">
                / Product Lifecycle
              </span>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {viewMode === 'timeline' && (
                <motion.div
                  key="timeline-mode"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Vertical Timeline Rule Line */}
                  <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#1A1D22] -translate-x-1/2" />
                  <motion.div 
                    style={{ scaleY, originY: 0 }}
                    className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#8A5A3C] -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(138,90,60,0.5)]" 
                  />

                  <div className="space-y-32">
                    {project.specs.map((spec, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
                      >
                        {/* Timeline Concentric Interface Node */}
                        <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-[#0B0D10] border-2 border-[#8A5A3C] -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(138,90,60,0.3)]" />
                        
                        {/* Content Side */}
                        <div className={`w-full md:w-1/2 ml-8 md:ml-0 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8A5A3C]/10 border border-[#8A5A3C]/20 mb-8 ${i % 2 === 0 ? 'md:ml-auto' : ''}`}
                          >
                            {i === 0 && <Cpu className="w-7 h-7 text-[#8A5A3C]" />}
                            {i === 1 && <Layers className="w-7 h-7 text-[#8A5A3C]" />}
                            {i === 2 && <ShieldCheck className="w-7 h-7 text-[#8A5A3C]" />}
                            {i === 3 && <DraftingCompass className="w-7 h-7 text-[#8A5A3C]" />}
                            {i > 3 && <Zap className="w-7 h-7 text-[#8A5A3C]" />}
                          </motion.div>
                          
                          {/* Phase Title Badge */}
                          <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                            <span className="mono text-[9px] uppercase tracking-widest text-[#55635A] font-bold">● Stage 0{i+1}</span>
                          </div>
                          
                          <h4 className="text-3xl font-extrabold uppercase tracking-tighter mb-4 leading-none text-[#D6D2C4]">{spec.title}</h4>
                          <p className="text-[#888780] leading-relaxed text-sm sm:text-base font-light mb-6">
                            {spec.text}
                          </p>
                          <div className={`flex flex-wrap gap-3 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                             <span className="mono text-[10px] uppercase px-3 py-1 bg-[#121418] border border-[#1A1D22] rounded-full text-[#888780]">
                               {spec.badge1 || "Compliance Validated"}
                             </span>
                             <span className="mono text-[10px] uppercase px-3 py-1 bg-[#8A5A3C]/10 border border-[#8A5A3C]/20 rounded-full text-[#8A5A3C] font-semibold">
                               {spec.badge2 || "Precision Assembly"}
                             </span>
                          </div>
                        </div>
                        
                        {/* Image Side with Scroll-Animated Gallery */}
                        <div className="w-full md:w-1/2">
                          <StageImageGallery index={i} baseImage={spec.image || ''} title={spec.title} spec={spec} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              {viewMode === 'slide' && (
                <motion.div
                  key="slide-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <SlideShowcase project={project} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Results Banner */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="glass-card rounded-[3rem] p-12 lg:p-20 relative overflow-hidden bg-[#121418]/40 border border-[#1A1D22]"
        >
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-extrabold uppercase tracking-tighter mb-6 text-[#D6D2C4]">Project Outcome</h3>
                <p className="text-lg text-[#888780] font-light leading-relaxed">
                  {project.outcome}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {project.results.map((res, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.6 }}
                  >
                    <p className="text-5xl font-black text-[#8A5A3C] mb-2">{res.value}</p>
                    <p className="mono text-[10px] uppercase text-[#888780] tracking-[0.2em] font-semibold">{res.label}</p>
                  </motion.div>
                ))}
              </div>
           </div>
           
           {/* Visual Flourish */}
           <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-5">
              <Maximize2 className="w-96 h-96 -translate-y-12 translate-x-12 text-[#D6D2C4]" />
           </div>
        </motion.section>

        {/* NDA & IP Protection Notice */}
        <div className="mt-12 glass-card rounded-2xl p-6 border border-white/5 bg-[#121418]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-accent-orange shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="mono text-[11px] uppercase tracking-wider text-[#888780] leading-relaxed">
              <strong className="text-white/90 font-semibold">NDA & Proprietary IP Notice:</strong> CAD models, thermal performance loads, and mechanical specifications shown for this project have been generalized or sanitized to protect proprietary client IP under non-disclosure agreements.
            </span>
          </div>
          <span className="mono text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 uppercase tracking-widest shrink-0">
            Sanitized / NDA Compliant
          </span>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-[#1A1D22] flex flex-col sm:flex-row justify-between items-center gap-6 opacity-60">
        <span className="mono text-[10px] uppercase tracking-widest text-[#888780] font-semibold">Praval Kumar &copy; 2026</span>
        <div className="flex gap-8 items-center">
          <Link to="/" className="mono text-[10px] uppercase tracking-widest text-[#888780] hover:text-[#D6D2C4] border-b border-transparent hover:border-[#D6D2C4] transition-colors cursor-pointer font-semibold">Home</Link>
          <a 
            href="https://www.linkedin.com/in/praval-kumar/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mono text-[10px] uppercase tracking-widest text-[#888780] hover:text-[#D6D2C4] border-b border-transparent hover:border-[#D6D2C4] transition-colors cursor-pointer font-semibold flex items-center gap-1"
          >
            <Linkedin className="w-3 h-3 text-[#0a66c2]" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
