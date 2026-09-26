import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project, isVideoUrl, getOptimizedImageUrl } from '../data/projects';
import { 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Layers, 
  Sparkles,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface SlideShowcaseProps {
  project: Project;
}

export const SlideShowcase: React.FC<SlideShowcaseProps> = ({ project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideColors, setSlideColors] = useState<string[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const dialTrackRef = useRef<HTMLDivElement>(null);
  const dialContainerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<any>(null);
  const ambientImageRef = useRef<HTMLImageElement>(null);
  const cardAuraRef = useRef<HTMLDivElement>(null);

  // References to animate text blocks
  const textNumRef = useRef<HTMLSpanElement>(null);
  const textTitleRef = useRef<HTMLHeadingElement>(null);
  const textDescRef = useRef<HTMLParagraphElement>(null);
  const textInsightsRef = useRef<HTMLDivElement>(null);

  // Touch tracking for mobile swipe gestures
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Reference to track active index inside scroll callbacks without stale closures
  const activeIdxRef = useRef(0);
  const scrollTriggerRef = useRef<any>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Compile all images of the project
  const slides = useMemo(() => {
    const items: { 
      title: string; 
      text: string; 
      image: string; 
      num: string;
      metricLabel?: string;
      metricValue?: string;
      secondaryLabel?: string;
      secondaryValue?: string;
      badge1?: string;
      badge2?: string;
    }[] = [];
    let count = 1;
    project.specs.forEach((spec: any) => {
      if (spec.images && spec.images.length > 0) {
        spec.images.forEach((imgUrl: string, subIdx: number) => {
          items.push({
            title: spec.images.length > 1 ? `${spec.title} — Part ${subIdx + 1}` : spec.title,
            text: spec.text || 'High-fidelity CAD engineering architecture.',
            image: imgUrl,
            num: String(count++).padStart(2, '0'),
            metricLabel: spec.metricLabel,
            metricValue: spec.metricValue,
            secondaryLabel: spec.secondaryLabel,
            secondaryValue: spec.secondaryValue,
            badge1: spec.badge1,
            badge2: spec.badge2
          });
        });
      } else if (spec.image) {
        items.push({
          title: spec.title,
          text: spec.text || 'High-fidelity CAD engineering architecture.',
          image: spec.image,
          num: String(count++).padStart(2, '0'),
          metricLabel: spec.metricLabel,
          metricValue: spec.metricValue,
          secondaryLabel: spec.secondaryLabel,
          secondaryValue: spec.secondaryValue,
          badge1: spec.badge1,
          badge2: spec.badge2
        });
      }
    });

    // Fallback to project main image
    if (items.length === 0) {
      items.push({
        title: project.title,
        text: project.shortDesc,
        image: project.image,
        num: '01'
      });
    }
    return items;
  }, [project]);

  const totalSlides = slides.length;

  useEffect(() => {
    // Initialize with default background
    const defaultColors = new Array(slides.length).fill('#0B0D10');
    setSlideColors(defaultColors);

    let active = true;

    slides.forEach((slide, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = slide.image;
      img.onload = () => {
        if (!active) return;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 1, 1);
            const data = ctx.getImageData(0, 0, 1, 1).data;
            const r = data[0];
            const g = data[1];
            const b = data[2];
            
            const factor = 0.12;
            const darkR = Math.max(8, Math.round(r * factor));
            const darkG = Math.max(9, Math.round(g * factor));
            const darkB = Math.max(12, Math.round(b * factor));
            const color = `rgb(${darkR}, ${darkG}, ${darkB})`;
            
            setSlideColors(prev => {
              const next = [...prev];
              next[idx] = color;
              return next;
            });
          }
        } catch (e) {
          let hash = 0;
          for (let i = 0; i < slide.image.length; i++) {
            hash = slide.image.charCodeAt(i) + ((hash << 5) - hash);
          }
          const options = [
            '#0a0f18',
            '#120e0a',
            '#0a120e',
            '#100a12',
            '#0c0c0e'
          ];
          const chosen = options[Math.abs(hash) % options.length];
          setSlideColors(prev => {
            const next = [...prev];
            next[idx] = chosen;
            return next;
          });
        }
      };
      img.onerror = () => {
        if (!active) return;
        let hash = 0;
        for (let i = 0; i < slide.image.length; i++) {
          hash = slide.image.charCodeAt(i) + ((hash << 5) - hash);
        }
        const options = ['#0a0f18', '#120e0a', '#0a120e', '#100a12', '#0c0c0e'];
        const chosen = options[Math.abs(hash) % options.length];
        setSlideColors(prev => {
          const next = [...prev];
          next[idx] = chosen;
          return next;
        });
      };
    });

    return () => {
      active = false;
    };
  }, [slides]);

  // Pre-cache all slide images for instant, lag-free transitions
  useEffect(() => {
    slides.forEach(slide => {
      if (slide.image && !isVideoUrl(slide.image)) {
        const img = new Image();
        img.src = getOptimizedImageUrl(slide.image, 1600);
        const thumb = new Image();
        thumb.src = getOptimizedImageUrl(slide.image, 300);
      }
    });
  }, [slides]);

  // Decoupled, lag-free animation engine to update active view elements
  const animateToSlide = useCallback((targetIndex: number, direction: number = 1) => {
    // 1. Kill any existing in-flight animation immediately to avoid stacking & stutter
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }

    setIsTransitioning(true);
    setCurrentIndex(targetIndex);
    activeIdxRef.current = targetIndex;

    const projectImage = slides[targetIndex].image;
    const optimizedImage = getOptimizedImageUrl(projectImage, 1600);
    const optimizedAmbient = getOptimizedImageUrl(projectImage, 200);

    // 2. Center Dial Navigation Item smoothly
    const dialTrack = dialTrackRef.current;
    const dialContainer = dialContainerRef.current;
    if (dialTrack && dialContainer) {
      const activeItem = dialTrack.children[targetIndex] as HTMLElement;
      if (activeItem) {
        const isMobileLayout = window.innerWidth < 1024;
        if (isMobileLayout) {
          const containerWidth = dialContainer.clientWidth;
          const itemWidth = activeItem.clientWidth;
          const itemOffsetLeft = activeItem.offsetLeft;
          const targetX = -(itemOffsetLeft - containerWidth / 2 + itemWidth / 2);

          gsap.to(dialTrack, {
            x: targetX,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          const containerHeight = dialContainer.clientHeight;
          const itemHeight = activeItem.clientHeight;
          const itemOffsetTop = activeItem.offsetTop;
          const targetY = -(itemOffsetTop - containerHeight / 2 + itemHeight / 2);

          gsap.to(dialTrack, {
            x: 0,
            y: targetY,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      }
    }

    // 3. Fast, smooth, non-blocking media crossfade on GPU
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        setIsTransitioning(false);
      }
    });
    activeTimelineRef.current = tl;

    if (mainImageRef.current) {
      tl.fromTo(mainImageRef.current,
        { opacity: 0.3, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }
      );
    }

    if (ambientImageRef.current) {
      tl.fromTo(ambientImageRef.current,
        { opacity: 0.05 },
        { opacity: 0.2, duration: 0.3, ease: 'power2.out' },
        '<'
      );
    }

    const animElements = [
      textNumRef.current,
      textTitleRef.current,
      textInsightsRef.current,
      textDescRef.current
    ].filter(Boolean);

    if (animElements.length > 0) {
      tl.fromTo(animElements,
        { y: direction > 0 ? 6 : -6, opacity: 0.25 },
        { y: 0, opacity: 1, duration: 0.22, stagger: 0.015, ease: 'power2.out' },
        '<0.05'
      );
    }
  }, [slides]);

  const animateToSlideRef = useRef(animateToSlide);
  useEffect(() => {
    animateToSlideRef.current = animateToSlide;
  }, [animateToSlide]);

  // ScrollTrigger Setup: silky-smooth progress tracking with native CSS sticky locking
  useEffect(() => {
    const triggerElem = containerRef.current;
    if (!triggerElem) return;

    // Refresh ScrollTrigger to calculate exact DOM offsets
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: triggerElem,
      start: 'top top+=80',
      end: 'bottom bottom',
      scrub: 0.2,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(0.999, self.progress));
        const targetIndex = Math.min(
          Math.floor(progress * totalSlides),
          totalSlides - 1
        );

        if (targetIndex !== activeIdxRef.current) {
          const direction = targetIndex > activeIdxRef.current ? 1 : -1;
          activeIdxRef.current = targetIndex;
          animateToSlideRef.current(targetIndex, direction);
        }
      }
    });

    scrollTriggerRef.current = scrollTriggerInstance;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
    };
  }, [totalSlides]);

  useEffect(() => {
    // Initial centering of dial track for slide 0
    const timer = setTimeout(() => {
      if (dialTrackRef.current && dialContainerRef.current) {
        animateToSlide(0, 1);
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [animateToSlide]);

  // Handle direct navigation via click
  const handleDialClick = (idx: number) => {
    const targetIdx = Math.max(0, Math.min(idx, totalSlides - 1));
    const direction = targetIdx > currentIndex ? 1 : -1;
    animateToSlide(targetIdx, direction);

    const scrollTrigger = scrollTriggerRef.current;
    if (scrollTrigger && typeof window !== 'undefined') {
      const start = scrollTrigger.start;
      const end = scrollTrigger.end;
      const totalDistance = end - start;
      const targetScroll = start + ((targetIdx + 0.5) / totalSlides) * totalDistance;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
    handleDialClick(prevIdx);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextIdx = (currentIndex + 1) % totalSlides;
    handleDialClick(nextIdx);
  };

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) return;
      if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
        handleDialClick(prevIdx);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % totalSlides;
        handleDialClick(nextIdx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalSlides, isLightboxOpen]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div 
      ref={containerRef} 
      style={{ height: `${Math.max(200, totalSlides * 70)}vh` }}
      className="relative w-full bg-transparent"
    >
      {/* Native Sticky layout container - rock-solid page lock and full viewport fit */}
      <div
        ref={stickyRef}
        className="sticky top-16 lg:top-20 z-20 w-full flex flex-col justify-between p-3 sm:p-4 lg:p-5 bg-[#0B0D10]/95 border border-[#1A1D22] rounded-2xl shadow-2xl backdrop-blur-xl transition-colors duration-500 h-[calc(100dvh-4.75rem)] lg:h-[calc(100dvh-5.5rem)] max-h-[860px]"
      >
        {/* Soft background light */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute w-[45vw] h-[45vw] rounded-full bg-white blur-[150px] opacity-[0.02] -top-1/4 -left-1/4" />
          <div className="absolute w-[35vw] h-[35vw] rounded-full bg-[#8A5A3C] blur-[140px] opacity-[0.015] -bottom-1/4 -right-1/4" />
        </div>

        {/* Top Header Bar for the Slider Showcase */}
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-3 pb-3 sm:pb-4 border-b border-[#1A1D22]/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#121418] border border-[#1A1D22] px-3 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A3C] animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-[#D6D2C4] font-bold uppercase">
                CAD SPEC {currentSlide.num} / {String(totalSlides).padStart(2, '0')}
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-[#888780]/50">|</span>
            <span className="hidden sm:inline text-[11px] font-mono text-[#888780] tracking-wider uppercase truncate max-w-xs md:max-w-md">
              {currentSlide.title}
            </span>
          </div>

          {/* Quick navigation controls & Lightbox trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous Slide"
              className="w-8 h-8 rounded-lg bg-[#121418] hover:bg-[#8A5A3C]/20 border border-[#1A1D22] hover:border-[#8A5A3C]/50 text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-[#888780] px-1">
              <span className="text-[#D6D2C4] font-bold">{currentIndex + 1}</span> / {totalSlides}
            </span>
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next Slide"
              className="w-8 h-8 rounded-lg bg-[#121418] hover:bg-[#8A5A3C]/20 border border-[#1A1D22] hover:border-[#8A5A3C]/50 text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-[#1A1D22] mx-1" />
            <button
              onClick={() => setIsLightboxOpen(true)}
              type="button"
              title="Inspect image in fullscreen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121418] hover:bg-[#8A5A3C]/20 border border-[#1A1D22] hover:border-[#8A5A3C]/50 text-[#888780] hover:text-[#D6D2C4] text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#8A5A3C]" />
              <span className="hidden sm:inline">Inspect Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch flex-1 min-h-0 my-3 sm:my-4 overflow-hidden">
          
          {/* Dial controller (left col on desktop, horizontal carousel on mobile) */}
          <div className="w-full lg:col-span-3 flex flex-col justify-start lg:h-full relative overflow-hidden order-2 lg:order-1 pt-1 lg:pt-0 shrink-0">
            <div 
              ref={dialContainerRef} 
              className="relative h-auto lg:h-full w-full overflow-hidden select-none scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div 
                ref={dialTrackRef} 
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative flex flex-row lg:flex-col gap-2 transition-all duration-100 ease-out py-0.5 items-center lg:items-stretch will-change-transform"
              >
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleDialClick(idx)}
                    className={`dial-item shrink-0 w-20 sm:w-24 lg:w-full cursor-pointer p-1.5 rounded-xl border transition-all duration-300 ${
                      currentIndex === idx 
                        ? 'bg-[#14171D] border-[#8A5A3C] shadow-[0_0_15px_rgba(138,90,60,0.25)] ring-1 ring-[#8A5A3C]/40' 
                        : 'bg-[#0E1013]/60 border-[#1A1D22] hover:border-[#888780]/40 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] font-mono mb-1 tracking-wider">
                      <span className={`font-bold transition-colors duration-300 ${
                        currentIndex === idx ? 'text-[#8A5A3C]' : 'text-[#888780]/70'
                      }`}>
                        #{slide.num}
                      </span>
                      <span className="hidden lg:inline text-[7px] text-[#888780]/50 uppercase tracking-widest truncate ml-1 max-w-[110px]">
                        {slide.badge1 || 'STAGE'}
                      </span>
                    </div>

                    {/* Uncropped Thumbnail Container */}
                    <div className="relative overflow-hidden rounded-lg aspect-video bg-[#07080a] border border-[#1A1D22]/60 flex items-center justify-center p-0.5">
                      {isVideoUrl(slide.image) ? (
                        <video
                          key={slide.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-contain"
                        >
                          <source src={slide.image} type="video/webm" />
                          <source src={slide.image} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={getOptimizedImageUrl(slide.image, 300)}
                          alt={`Preview ${slide.num}`}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core media showcase (right col) */}
          <div className="w-full lg:col-span-9 flex flex-col justify-between h-full min-h-0 overflow-hidden order-1 lg:order-2 gap-2 sm:gap-3">
            
            {/* Visual media card box - responsive containment with full viewport visibility */}
            <div 
              className="flex items-center justify-center w-full relative flex-1 min-h-0 overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative w-full h-full rounded-2xl cursor-zoom-in select-none shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden border border-[#1A1D22] transition-colors duration-300"
                onClick={() => setIsLightboxOpen(true)}
              >
                {/* Aura shadow */}
                <div ref={cardAuraRef} className="absolute inset-[-15px] rounded-2xl opacity-10 blur-2xl transition-all duration-500 bg-white/10" />
                
                {/* Visual frame container with blurred ambient backdrop + uncropped crisp foreground */}
                <div className="relative w-full h-full z-10 overflow-hidden bg-[#07080a] flex items-center justify-center rounded-2xl">
                  
                  {/* Subtle Blurred Ambient Backdrop */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
                    <img
                      ref={ambientImageRef}
                      src={getOptimizedImageUrl(currentSlide.image, 200)}
                      alt=""
                      className="w-full h-full object-cover blur-3xl opacity-20 scale-110 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-[#07080a]/70" />
                  </div>

                  {/* Corner Engineering Precision Crosshairs */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#8A5A3C]/50 z-20 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#8A5A3C]/50 z-20 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#8A5A3C]/50 z-20 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#8A5A3C]/50 z-20 pointer-events-none" />

                  {/* On-Card Previous & Next Chevron Buttons */}
                  <button
                    onClick={handlePrev}
                    type="button"
                    aria-label="Previous Slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0B0D10]/85 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    type="button"
                    aria-label="Next Slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0B0D10]/85 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Primary Uncropped CAD Visual */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                    {isVideoUrl(currentSlide.image) ? (
                      <video
                        key={currentSlide.image}
                        ref={mainImageRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
                      >
                        <source src={currentSlide.image} type="video/webm" />
                        <source src={currentSlide.image} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        ref={mainImageRef}
                        src={getOptimizedImageUrl(currentSlide.image, 1600)}
                        alt={currentSlide.title}
                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
                      />
                    )}
                  </div>

                  {/* Quick Expand Hint Tag */}
                  <div className="absolute top-3 right-3 z-20 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B0D10]/80 border border-[#1A1D22] text-[#888780] text-[8px] font-mono tracking-wider pointer-events-none uppercase">
                    <Maximize2 className="w-2.5 h-2.5 text-[#8A5A3C]" />
                    Click to Zoom
                  </div>
                </div>
              </div>
            </div>

            {/* Non-intrusive Technical Information & Parameters Dock - Full Content Visible Without Cropping */}
            <div className="relative z-20 w-full bg-[#121418]/90 backdrop-blur-md border border-[#1A1D22] rounded-xl p-3 sm:p-4 shadow-xl shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
              <div className="space-y-1 flex-1 min-w-0 pr-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span ref={textNumRef} className="text-xs sm:text-sm font-black text-[#8A5A3C] font-mono leading-none">
                    PHASE {currentSlide.num}
                  </span>
                  <span className="h-px w-4 bg-[#1A1D22]" />
                  <h4 ref={textTitleRef} className="text-xs sm:text-sm font-bold uppercase text-[#D6D2C4] tracking-tight">
                    {currentSlide.title}
                  </h4>
                </div>
                <p ref={textDescRef} className="text-[11px] sm:text-xs text-[#888780] font-normal leading-relaxed">
                  {currentSlide.text}
                </p>
              </div>

              {/* Engineering Parameters Tag */}
              <div ref={textInsightsRef} className="flex flex-wrap md:flex-col gap-1.5 shrink-0 bg-[#0B0D10]/80 border border-[#1A1D22] rounded-lg p-2 text-[8px] sm:text-[9px] font-mono text-[#888780] self-start md:self-auto">
                <div className="flex items-center gap-1.5 text-[#D6D2C4] font-semibold whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A3C] animate-pulse" />
                  <span className="text-[#888780]">{currentSlide.metricLabel || '# Structural:'}</span>{' '}
                  <span className="text-[#D6D2C4]">{currentSlide.metricValue || 'GI/GS Enclosure'}</span>
                </div>
                {currentSlide.secondaryValue && (
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-[#888780]/70">{currentSlide.secondaryLabel || '# Mounting:'}</span>{' '}
                    <span className="text-[#8A5A3C] font-medium">{currentSlide.secondaryValue}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Footer controls & slide tracker */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-[9px] sm:text-[10px] relative z-10 shrink-0 border-t border-[#1A1D22]/60">
          <div className="flex items-center gap-2 text-[#888780] font-mono">
            <div className="w-4 h-4 rounded-full border border-[#1A1D22] flex items-center justify-center bg-[#121418] text-[#8A5A3C]">
              <ArrowDown className="w-2.5 h-2.5 animate-bounce" />
            </div>
            <span>Scroll page or use arrow keys / swipe to navigate technical deck</span>
          </div>

          <div className="flex items-center gap-2.5 font-mono">
            <span className="text-[#888780]/50 uppercase tracking-widest text-[8px]">SLIDE INDEX:</span>
            <div className="flex items-center gap-1">
              <span className="text-[#D6D2C4] font-bold">{currentSlide.num}</span>
              <span className="text-[#888780]/30">/</span>
              <span className="text-[#888780]">{String(totalSlides).padStart(2, '0')}</span>
            </div>
            <div className="flex gap-1.5 pl-2">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => handleDialClick(dotIdx)}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentIndex ? 'w-5 bg-[#8A5A3C]' : 'w-1.5 bg-[#1A1D22] hover:bg-[#888780]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen High-Resolution Inspection Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#07080a]/98 backdrop-blur-xl z-[9999] flex flex-col justify-between p-4 sm:p-6 md:p-8"
          >
            {/* Lightbox Header Bar */}
            <div className="relative w-full z-20 flex justify-between items-center pb-4 border-b border-[#1A1D22]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8A5A3C] font-bold bg-[#8A5A3C]/10 border border-[#8A5A3C]/20 px-2.5 py-1 rounded">
                  CAD STAGE {currentSlide.num} / {String(totalSlides).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline font-mono text-xs text-[#888780]">|</span>
                <span className="font-mono text-xs sm:text-sm uppercase text-[#D6D2C4] font-semibold truncate max-w-md">
                  {currentSlide.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline font-mono text-[9px] text-[#888780] uppercase tracking-wider">
                  Arrow Keys [← / →] to navigate • ESC to close
                </span>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121418] hover:bg-[#8A5A3C]/20 border border-[#1A1D22] hover:border-[#8A5A3C]/50 text-[#888780] hover:text-[#D6D2C4] rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Lightbox Visual Area with Uncropped View */}
            <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                type="button"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image Uncropped */}
              <div className="relative max-h-full max-w-full flex items-center justify-center">
                {isVideoUrl(currentSlide.image) ? (
                  <video
                    key={currentSlide.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-h-[75vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl border border-[#1A1D22] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                  >
                    <source src={currentSlide.image} type="video/webm" />
                    <source src={currentSlide.image} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={getOptimizedImageUrl(currentSlide.image, 2000)}
                    alt={currentSlide.title}
                    className="max-h-[75vh] max-w-[90vw] w-auto h-auto object-contain rounded-xl border border-[#1A1D22] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                  />
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                type="button"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0B0D10]/90 hover:bg-[#8A5A3C] border border-[#1A1D22] hover:border-[#8A5A3C] text-[#888780] hover:text-[#D6D2C4] flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Bottom Info & Thumbnails Bar */}
            <div className="relative w-full z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1A1D22]">
              <p className="font-mono text-xs text-[#888780] max-w-2xl text-left">
                {currentSlide.text}
              </p>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto max-w-full py-1 scrollbar-none items-center shrink-0">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDialClick(idx)}
                    className={`w-14 h-9 rounded-lg overflow-hidden border p-0.5 bg-[#0e1013] transition-all duration-300 shrink-0 cursor-pointer ${
                      currentIndex === idx
                        ? 'border-[#8A5A3C] ring-2 ring-[#8A5A3C]/40 scale-105 opacity-100'
                        : 'border-[#1A1D22] opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getOptimizedImageUrl(s.image, 150)}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-contain"
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
};
