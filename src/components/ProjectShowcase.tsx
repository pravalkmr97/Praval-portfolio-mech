import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  X, 
  Eye, 
  Layers, 
  Maximize2,
  Calendar,
  Tag,
  ArrowUpRight,
  Sparkles,
  Binary
} from 'lucide-react';
import { getOptimizedImageUrl } from '../data/projects';
import TextReveal from './TextReveal';
import smallCellImg from '../assets/images/small_cell.png';

interface ShowcaseImage {
  id: number;
  title: string;
  category: string;
  year: string;
  desc: string;
  url: string;
  projectSlug: string;
}

const SHOWCASE_IMAGES: ShowcaseImage[] = [
  {
    id: 1,
    title: "800G Liquid-Cooled Server Chassis",
    category: "High Performance Compute",
    year: "2024 — 2025",
    desc: "Advanced liquid-cooled enterprise rack-mount server. Incorporates redundant microfluidic cooling channels and precision slide rail guides.",
    url: "https://lh3.googleusercontent.com/d/1DmGSMJpu-yjWY3_uv8jQ89rmF4prvSSd",
    projectSlug: "800g-switch"
  },
  {
    id: 2,
    title: "High-Frequency Network Router Shield",
    category: "Thermal Engineering",
    year: "2024",
    desc: "Electro-magnetic interference (EMI) shield casing featuring honeycomb airflow venting arrays and low-profile die-cast mounting bosses.",
    url: "https://lh3.googleusercontent.com/d/1ilWbSID4UhsuCj4jYjaiuThbKuroI5dw",
    projectSlug: "800g-switch"
  },
  {
    id: 3,
    title: "Fanless Industrial Gateway Casing",
    category: "Thermal Engineering",
    year: "2024",
    desc: "High-density heat-sink extrusion block with vertical fin geometry optimized for natural convection and passive heat rejection.",
    url: "https://lh3.googleusercontent.com/d/1hSdfbwRw2J2cDXwx0hgpFNb9PhfRUbck",
    projectSlug: "800g-switch"
  },
  {
    id: 4,
    title: "Dual-SIM Rugged IoT Router Sled",
    category: "Prototyping Labs",
    year: "2024",
    desc: "Internal sheet metal carrier plate with integrated vibration dampeners and toolless access latches for cellular module servicing.",
    url: "https://lh3.googleusercontent.com/d/1vq-ma5VG3oCwN0R43UM-Dgpi45tbmcHC",
    projectSlug: "800g-switch"
  },
  {
    id: 5,
    title: "Outdoor Small Cell Transmitter Enclosure",
    category: "Outdoor Infrastructure",
    year: "2022 — 2024",
    desc: "8T8R high-power outdoor housing. Integrates vertical convective fin profiles designed to reduce mass while maximizing heat-dissipation surface area.",
    url: smallCellImg,
    projectSlug: "5g-radio-unit"
  },
  {
    id: 6,
    title: "5G Small Cell Mounting Gland",
    category: "Outdoor Infrastructure",
    year: "2023",
    desc: "Weatherproof cable entry glands and environmental seal validation arrays designed for long-term field stability.",
    url: "https://lh3.googleusercontent.com/d/1A22A5JmmBmBgpxgxhMTrsuDsnuuL5dwM",
    projectSlug: "5g-radio-unit"
  }
];

// Asymmetrical layout configuration dictionary to map index positions to offset rules
const ASYMMETRIC_METADATA = [
  { span: "lg:col-span-6 lg:col-start-1", align: "justify-self-start", speed: -90, offset: "mt-0" },
  { span: "lg:col-span-5 lg:col-start-8", align: "justify-self-end", speed: 50, offset: "lg:mt-32" },
  { span: "lg:col-span-5 lg:col-start-1", align: "justify-self-start", speed: -40, offset: "lg:-mt-16" },
  { span: "lg:col-span-6 lg:col-start-7", align: "justify-self-end", speed: 70, offset: "lg:mt-12" },
  { span: "lg:col-span-5 lg:col-start-1", align: "justify-self-start", speed: -60, offset: "lg:mt-8" },
  { span: "lg:col-span-5 lg:col-start-8", align: "justify-self-end", speed: 30, offset: "lg:-mt-8" }
];

function FloatingParallaxCard({ 
  img, 
  index, 
  onOpen 
}: { 
  img: ShowcaseImage; 
  index: number; 
  onOpen: () => void;
  key?: React.Key;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const layout = ASYMMETRIC_METADATA[index % ASYMMETRIC_METADATA.length];
  const indexStr = String(index + 1).padStart(2, '0');

  // Track scroll depth of this element relative to viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Calculate dynamic floating parallax offset for the card container
  const y = useTransform(scrollYProgress, [0, 1], [0, layout.speed]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full ${layout.span} ${layout.offset} group/card select-none`}
    >
      {/* Decorative High-Contrast Layout Markers */}
      <div className="absolute -top-3 -left-3 font-mono text-[9px] text-white/10 flex items-center gap-1.5 pointer-events-none">
        <span>+</span>
        <span className="opacity-60">{indexStr} / POS_ASYM</span>
      </div>

      {/* Actual Card Housing */}
      <div 
        onClick={onOpen}
        className="relative rounded-2xl overflow-hidden bg-[#07090E]/60 border border-white/5 hover:border-accent-orange/20 transition-all duration-500 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] cursor-pointer group-hover/card:shadow-[0_25px_60px_rgba(239,112,72,0.04)]"
      >
        {/* Natural Aspect Ratio Image Frame with smooth scale boundary hover */}
        <div className="relative w-full overflow-hidden">
          <img
            src={getOptimizedImageUrl(img.url, 1000)}
            alt={img.title}
            referrerPolicy="no-referrer"
            className="w-full h-auto block object-contain grayscale group-hover/card:grayscale-0 transition-all duration-750 ease-out group-hover/card:scale-[1.012]"
          />
        </div>

        {/* Dynamic Dark Vignette Layer on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Ambient Overlay HUD metadata on Card Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 md:p-5 lg:p-6 pt-8 sm:pt-10 md:pt-12 flex flex-col justify-end translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 pointer-events-none z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
          <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5 md:mb-2">
            <span className="text-[9px] sm:text-[10px] font-mono text-accent-orange tracking-widest uppercase font-semibold truncate">
              {img.category}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-white/40 shrink-0">
              {img.year}
            </span>
          </div>
          <h4 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white uppercase leading-snug">
            {img.title}
          </h4>

          <div className="mt-2.5 sm:mt-3 md:mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-2 sm:pt-2.5 md:pt-3">
            <span className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase truncate">DRAG/SCROLL PARALLAX ACTIVE</span>
            <div className="flex items-center gap-1.5 text-accent-orange font-mono text-[8px] sm:text-[9px] shrink-0">
              <span>VIEW TELEMETRY</span>
              <Maximize2 className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectShowcase() {
  const [activeCard, setActiveCard] = useState<ShowcaseImage | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const categories = ["ALL", "COMPUTE & THERMAL", "INFRASTRUCTURE & POWER"];

  // Filter images based on selected category tab
  const filteredImages = SHOWCASE_IMAGES.filter((img) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "COMPUTE & THERMAL") {
      return (
        img.category === "High Performance Compute" || 
        img.category === "Thermal Engineering" || 
        img.category === "Prototyping Labs"
      );
    }
    if (activeFilter === "INFRASTRUCTURE & POWER") {
      return img.projectSlug === "5g-radio-unit" || img.projectSlug === "evse-station";
    }
    return true;
  });

  return (
    <section id="technical-archive" className="py-32 max-w-5xl mx-auto px-6 relative selection:bg-accent-orange/20">
      
      {/* Background Precision Crosshairs / Grid Accent */}
      <div className="absolute inset-y-0 left-12 w-px border-l border-dashed border-white/5 pointer-events-none z-0 hidden lg:block" />
      <div className="absolute inset-y-0 right-12 w-px border-r border-dashed border-white/5 pointer-events-none z-0 hidden lg:block" />

      {/* Editorial Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-20 relative z-10">
        <div className="flex flex-col">
          <span className="mono text-[10px] text-accent-orange uppercase tracking-[0.3em] mb-2 block">System Simulation & Validation Files</span>
          <TextReveal text="TECHNICAL ARCHIVE" as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase whitespace-nowrap text-white" />
        </div>
        <div className="h-px bg-white/10 flex-1 hidden sm:block mx-6 animate-pulse" />
        <span className="mono text-xs text-white/30 whitespace-nowrap flex items-center gap-2">
          <Binary className="w-3.5 h-3.5 text-accent-orange" />
          / PARALLAX COMPLIANT ARCHIVE
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-20 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer border ${
              activeFilter === cat
                ? 'bg-accent-orange text-black border-accent-orange font-bold shadow-[0_0_20px_rgba(239,112,72,0.25)]'
                : 'bg-[#0B0D10]/40 border-white/5 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Natural Vertical Parallax Grid (Asymmetrical column system with relative floating velocities) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-24 md:gap-y-32 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img, index) => (
            <FloatingParallaxCard
              key={img.id}
              img={img}
              index={index}
              onOpen={() => setActiveCard(img)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* FULL-SCREEN IMMERSIVE SPECIFICATIONS DETAIL MODAL */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto selection:bg-white/10"
            onClick={() => setActiveCard(null)}
          >
            {/* Modal Dialog Shell */}
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 190 }}
              className="relative w-full max-w-4xl bg-[#090b11]/98 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame with Aspect Preservation */}
              <div className="w-full md:w-1/2 relative bg-black/50 flex items-center justify-center min-h-[260px] sm:min-h-[350px] md:min-h-0 border-b md:border-b-0 md:border-r border-white/5 p-6">
                <img
                  src={getOptimizedImageUrl(activeCard.url, 1000)}
                  alt={activeCard.title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-xl border border-white/5"
                />
                
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-white/40 bg-[#050608]/90 px-2.5 py-1.5 rounded border border-white/5 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-accent-orange animate-pulse" />
                  <span>ANALYSIS STATUS: OPTIMIZED</span>
                </div>
              </div>

              {/* Description Content Column */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#101320]/15">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-accent-orange uppercase font-bold">
                      {activeCard.category}
                    </span>
                    <span className="text-xs font-mono text-white/30 font-semibold">
                      {activeCard.year}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 uppercase">
                    {activeCard.title}
                  </h3>

                  <p className="text-sm text-white/70 font-light leading-relaxed mb-6 font-sans">
                    {activeCard.desc}
                  </p>

                  <div className="h-px bg-white/5 my-5" />

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/30">LINKED NPI PROJECT:</span>
                      <span className="text-white font-semibold uppercase">{activeCard.projectSlug.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">VALIDATION SPEC:</span>
                      <span className="text-accent-orange font-semibold">COMPLIANT</span>
                    </div>
                  </div>
                </div>

                {/* Footer Link to Project Sled */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <a
                    href={`#projects`}
                    onClick={() => {
                      setActiveCard(null);
                      const el = document.getElementById(`project-${activeCard.projectSlug}`);
                      if (el) {
                        setTimeout(() => {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 350);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-orange hover:bg-[#ff865c] text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer w-full text-center"
                  >
                    <span>VIEW FULL PORTFOLIO PROJECT</span>
                    <Layers className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Close Button Overlay */}
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 border border-white/10 hover:bg-white/15 text-white/80 hover:text-white rounded-full backdrop-blur transition-all duration-200 z-10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
