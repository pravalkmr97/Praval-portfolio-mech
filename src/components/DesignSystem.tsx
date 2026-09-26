import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Type, 
  Palette, 
  Square, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Activity, 
  Maximize2 
} from 'lucide-react';

interface ColorSwatchProps {
  name: string;
  variable: string;
  hex: string;
  desc: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, variable, hex, desc }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-4 rounded-xl relative group overflow-hidden bg-brand-slate/40 border border-brand-steel/50 flex flex-col justify-between h-44">
      <div 
        className="w-full h-14 rounded-lg border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-[1.02]" 
        style={{ backgroundColor: hex }}
      />
      <div className="mt-3">
        <div className="flex justify-between items-start">
          <span className="font-display text-sm tracking-wider uppercase text-brand-bone">{name}</span>
          <button 
            onClick={copyToClipboard}
            className="text-brand-ash hover:text-brand-bone transition-colors p-1 rounded-md bg-white/5 border border-white/5 hover:border-white/15"
            title="Copy Hex"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-[10px] mono text-brand-ash uppercase mt-1 tracking-wider">{variable}</p>
        <p className="text-[11px] text-brand-ash/80 leading-snug mt-1.5 font-sans italic">{desc}</p>
      </div>
    </div>
  );
};

export default function DesignSystem() {
  const [copiedClass, setCopiedClass] = useState<string | null>(null);
  const [animTrigger, setAnimTrigger] = useState(0);
  const [cardRadiusPreview, setCardRadiusPreview] = useState<'override' | 'default'>('override');

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClass(text);
    setTimeout(() => setCopiedClass(null), 2000);
  };

  // Color Swatches Definitions
  const swatches: ColorSwatchProps[] = [
    { name: 'Brand Ink', variable: '--color-brand-ink', hex: '#050608', desc: 'The deep matte background, providing ultimate dark contrast.' },
    { name: 'Brand Slate', variable: '--color-brand-slate', hex: '#0B0D10', desc: 'Card background and container fill level.' },
    { name: 'Brand Steel', variable: '--color-brand-steel', hex: '#1A1D22', desc: 'Standard gray borders and partition lines.' },
    { name: 'Accent Copper', variable: '--color-accent-copper', hex: '#D6D2C4', desc: 'Monochrome silver/bone used for micro highlights.' },
    { name: 'Accent Sage', variable: '--color-accent-sage', hex: '#888780', desc: 'Dim gray used for secondary labels and descriptive text.' },
    { name: 'Active White', variable: '--color-brand-bone', hex: '#FFFFFF', desc: 'Pure high-contrast white for bold primary text.' },
  ];

  return (
    <div className="min-h-screen bg-brand-ink text-brand-bone font-sans selection:bg-accent-copper/20 relative overflow-hidden pb-32">
      {/* Decorative Radial Shadows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFFFFF]/3 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFFFFF]/2 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Primary Container */}
      <main className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 border-b border-brand-steel/50 pb-10">
          <div className="space-y-3">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs mono text-brand-ash hover:text-white transition-all uppercase tracking-widest group border border-brand-steel/40 hover:border-white/25 px-4 py-2 rounded-full bg-brand-slate/20"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span className="mono text-xs uppercase tracking-[0.25em] text-brand-ash font-bold">System Specification Blueprint</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-widest text-white display">
              Design System
            </h1>
          </div>
          <div className="text-left sm:text-right">
            <p className="mono text-[10px] text-brand-ash uppercase tracking-widest">Version 1.0.3 • Production Stable</p>
            <p className="text-xs text-brand-ash/80 mt-1 italic">Crafted under premium monochrome industrial guidelines.</p>
          </div>
        </div>

        {/* Dynamic Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT RAIL: Introduction & Quick Specs */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-6 rounded-xl bg-brand-slate/40 border border-brand-steel/50">
              <span className="mono text-[10px] text-brand-ash uppercase tracking-widest block mb-2 font-bold">● Core Philosophy</span>
              <h2 className="text-lg font-bold uppercase text-white mb-4 tracking-wider display">Architectural Honesty</h2>
              <p className="text-sm text-brand-ash/90 leading-relaxed mb-4">
                The aesthetics of this system derive from premium mechanical blueprints and dark hardware labs. We avoid colorful gradients, high-contrast drop shadows, and visual noise.
              </p>
              <p className="text-sm text-brand-ash/90 leading-relaxed">
                By pairing <strong>Syne</strong>'s high-impact display widths with <strong>Space Grotesk</strong>'s structured metrics and <strong>DM Mono</strong>'s mechanical accuracy, the layout conveys technical craftsmanship.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl bg-brand-slate/40 border border-brand-steel/50">
              <span className="mono text-[10px] text-brand-ash uppercase tracking-widest block mb-2 font-bold">● System Quick Metrics</span>
              <ul className="space-y-3.5 text-xs">
                <li className="flex justify-between border-b border-brand-steel/30 pb-2">
                  <span className="text-brand-ash">Base Theme</span>
                  <span className="text-white font-bold uppercase tracking-wider mono">Deep Matte Ink</span>
                </li>
                <li className="flex justify-between border-b border-brand-steel/30 pb-2">
                  <span className="text-brand-ash">Base Border Radius</span>
                  <span className="text-white font-bold uppercase tracking-wider mono">12px (Compact)</span>
                </li>
                <li className="flex justify-between border-b border-brand-steel/30 pb-2">
                  <span className="text-brand-ash">Primary Text Contrast</span>
                  <span className="text-white font-bold uppercase tracking-wider mono">100% (Active White)</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-brand-ash">Animations Lib</span>
                  <span className="text-white font-bold uppercase tracking-wider mono">Motion / GSAP</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT CONTENT WORKSPACE */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. TYPOGRAPHY SPECIFICATION */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-steel/50 pb-4">
                <Type className="w-5 h-5 text-brand-ash" />
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-widest display">01. Typography</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Font Family Cards */}
                <div className="glass-card p-6 rounded-xl bg-brand-slate/30 border border-brand-steel/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="mono text-[10px] text-brand-ash uppercase tracking-widest">DISPLAY FAMILY</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase mono tracking-widest text-white">Syne</span>
                  </div>
                  <h3 className="text-4xl font-black uppercase text-white tracking-[0.15em] leading-none display">
                    SYNE
                  </h3>
                  <p className="text-xs text-brand-ash italic">
                    Used exclusively for high-impact display titles, page headers, section titles, and project names. Always capitalized with loose letter-spacing.
                  </p>
                  <div className="pt-2">
                    <span 
                      onClick={() => copyText("font-display uppercase tracking-[0.15em]")}
                      className="mono text-[10px] text-brand-ash hover:text-white cursor-pointer select-all border border-white/5 hover:border-white/20 px-2 py-1 rounded bg-black/30 flex justify-between items-center transition-colors"
                    >
                      <span>class: font-display tracking-[0.15em]</span>
                      {copiedClass === "font-display uppercase tracking-[0.15em]" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-brand-slate/30 border border-brand-steel/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="mono text-[10px] text-brand-ash uppercase tracking-widest">SANS-SERIF FAMILY</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase mono tracking-widest text-white">Space Grotesk</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight font-sans">
                    Space Grotesk
                  </h3>
                  <p className="text-xs text-brand-ash italic">
                    Our workhorse for descriptions, paragraphs, buttons, and structural text. Delivers clean proportions with subtle geometric industrial anomalies.
                  </p>
                  <div className="pt-2">
                    <span 
                      onClick={() => copyText("font-sans tracking-tight")}
                      className="mono text-[10px] text-brand-ash hover:text-white cursor-pointer select-all border border-white/5 hover:border-white/20 px-2 py-1 rounded bg-black/30 flex justify-between items-center transition-colors"
                    >
                      <span>class: font-sans tracking-tight</span>
                      {copiedClass === "font-sans tracking-tight" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-brand-slate/30 border border-brand-steel/50 space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <span className="mono text-[10px] text-brand-ash uppercase tracking-widest">MONOSPACED CODE & DATA</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase mono tracking-widest text-white">DM Mono</span>
                  </div>
                  <h3 className="text-lg text-white font-medium tracking-wider mono uppercase">
                    DM MONO - 106206530111_TRACK
                  </h3>
                  <p className="text-xs text-brand-ash italic">
                    Leveraged for engineering tags, numerical telemetry, data tables, metrics, specs, status indicators, and design system codes. Ensures clean vertical rhythm alignment.
                  </p>
                  <div className="pt-2">
                    <span 
                      onClick={() => copyText("font-mono text-xs uppercase tracking-wider")}
                      className="mono text-[10px] text-brand-ash hover:text-white cursor-pointer select-all border border-white/5 hover:border-white/20 px-2 py-1 rounded bg-black/30 flex justify-between items-center transition-colors"
                    >
                      <span>class: font-mono uppercase tracking-wider</span>
                      {copiedClass === "font-mono text-xs uppercase tracking-wider" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* 2. COLORS PALETTE */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-steel/50 pb-4">
                <Palette className="w-5 h-5 text-brand-ash" />
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-widest display">02. Core Color Swatches</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {swatches.map((swatch, idx) => (
                  <ColorSwatch key={idx} {...swatch} />
                ))}
              </div>

              {/* Residual Color Matching Info Box */}
              <div className="glass-card p-5 rounded-xl bg-[#121418]/20 border border-brand-steel/40">
                <div className="flex items-start gap-3">
                  <Activity className="w-4.5 h-4.5 text-brand-ash shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <span className="mono text-[9px] uppercase text-white font-bold tracking-widest block">● Automatic Monochrome Mapping (No Residual Copper/Orange)</span>
                    <p className="text-xs text-brand-ash/90 leading-relaxed">
                      To safeguard design cohesion and ensure complete compliance with the <strong>monochrome slate directive</strong>, our CSS layout contains custom tailwind mapping properties. This dynamically overrides legacy <code>#8A5A3C</code> copper classes and converts active background elements to pristine solid active white (<code>#FFFFFF</code>) and borders to refined transparent silver frames (<code>#D6D2C4</code>).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. CARD RADIUS OVERRIDES */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-steel/50 pb-4">
                <Square className="w-5 h-5 text-brand-ash" />
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-widest display">03. Compact Card Radius</h2>
              </div>

              <div className="glass-card p-6 rounded-xl bg-brand-slate/30 border border-brand-steel/50 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="mono text-[10px] text-brand-ash uppercase tracking-widest font-bold">THE COMPACT RADIUS MANDATE</span>
                    <p className="text-xs text-brand-ash/90">
                      Standard rounded corners like <code>rounded-3xl</code> (24px) or <code>rounded-[2.5rem]</code> look too bulbous for an industrial design framework. We override all standard roundings to <strong>12px (Compact Radius)</strong>.
                    </p>
                  </div>
                  
                  {/* Toggle Preview */}
                  <div className="flex gap-1 p-1 bg-black/60 border border-brand-steel/60 rounded-lg shrink-0">
                    <button 
                      onClick={() => setCardRadiusPreview('override')}
                      className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider mono transition-colors ${
                        cardRadiusPreview === 'override' ? 'bg-white text-brand-ink' : 'text-brand-ash hover:text-white'
                      }`}
                    >
                      Override (12px)
                    </button>
                    <button 
                      onClick={() => setCardRadiusPreview('default')}
                      className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider mono transition-colors ${
                        cardRadiusPreview === 'default' ? 'bg-white text-brand-ink' : 'text-brand-ash hover:text-white'
                      }`}
                    >
                      Standard (40px)
                    </button>
                  </div>
                </div>

                {/* Radius Comparison Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div 
                    className={`border border-brand-steel/60 p-6 bg-brand-slate/80 transition-all duration-500 relative overflow-hidden ${
                      cardRadiusPreview === 'override' ? 'rounded-xl' : 'rounded-[2.5rem]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="mono text-[9px] text-white tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">Component Area A</span>
                        <span className="mono text-[9px] text-brand-ash">{cardRadiusPreview === 'override' ? '12px Radius' : '40px Radius'}</span>
                      </div>
                      <h4 className="text-base font-bold uppercase text-white tracking-wide font-sans">Engineering Terminal Block</h4>
                      <p className="text-[11px] text-brand-ash/90 leading-normal">
                        Notice how the tighter 12px corners align perfectly with small textual components, technical numbers, and strict borders, creating a reliable hardware profile.
                      </p>
                    </div>
                  </div>

                  <div 
                    className={`border border-brand-steel/60 p-6 bg-brand-slate/80 transition-all duration-500 relative overflow-hidden ${
                      cardRadiusPreview === 'override' ? 'rounded-xl' : 'rounded-[2.5rem]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="mono text-[9px] text-white tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">Component Area B</span>
                        <span className="mono text-[9px] text-brand-ash">{cardRadiusPreview === 'override' ? '12px Radius' : '40px Radius'}</span>
                      </div>
                      <h4 className="text-base font-bold uppercase text-white tracking-wide font-sans">Busbar Interface Panel</h4>
                      <p className="text-[11px] text-brand-ash/90 leading-normal">
                        The compact override maps standard classes (e.g., <code>rounded-3xl</code> and <code>rounded-[2.5rem]</code>) globally inside <code>src/index.css</code> to ensure styling safety.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. CARD SHADOWS SPECIFICATION */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-steel/50 pb-4">
                <Layers className="w-5 h-5 text-brand-ash" />
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-widest display">04. Depth & Card Shadows</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Shadow types */}
                <div className="glass-card p-6 rounded-xl bg-brand-slate/40 border border-brand-steel/50 flex flex-col justify-between min-h-[160px] shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)]">
                  <div>
                    <span className="mono text-[9px] text-brand-ash uppercase tracking-widest block mb-1">INSET INDUSTRIAL SPEC</span>
                    <h3 className="text-base font-bold uppercase text-white tracking-wider display mb-2">Inset Deep Shadow</h3>
                    <p className="text-[11px] text-brand-ash/90 leading-relaxed">
                      Creates a physical "wells" or "recessed tray" effect. Ideal for avatars, interactive slider tracks, and background video panels.
                    </p>
                  </div>
                  <div className="pt-3">
                    <code className="text-[10px] mono text-brand-ash bg-black/40 px-2 py-1 rounded block border border-white/5 truncate">
                      shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)]
                    </code>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-brand-slate/40 border border-brand-steel/50 flex flex-col justify-between min-h-[160px] shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                  <div>
                    <span className="mono text-[9px] text-brand-ash uppercase tracking-widest block mb-1">MONOCHROME AMBIENT GLOW</span>
                    <h3 className="text-base font-bold uppercase text-white tracking-wider display mb-2">Monochrome Active Glow</h3>
                    <p className="text-[11px] text-brand-ash/90 leading-relaxed">
                      Replaces default colored glow drop-shadows with a clean white/bone halo. Adds physical weight when elements are selected or active.
                    </p>
                  </div>
                  <div className="pt-3">
                    <code className="text-[10px] mono text-brand-ash bg-black/40 px-2 py-1 rounded block border border-white/5 truncate">
                      shadow-[0_0_15px_rgba(255,255,255,0.35)]
                    </code>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-brand-slate/40 border border-brand-steel/50 flex flex-col justify-between min-h-[160px] md:col-span-2 relative group overflow-hidden">
                  {/* Ambient backglow blur helper */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-12 bg-white/10 rounded-full filter blur-[40px] pointer-events-none group-hover:bg-white/15 transition-all duration-700" />
                  
                  <div className="relative z-10">
                    <span className="mono text-[9px] text-brand-ash uppercase tracking-widest block mb-1">INTERACTIVE MODAL OVERLAYS</span>
                    <h3 className="text-base font-bold uppercase text-white tracking-wider display mb-2">Blurred Backglow Backdrops</h3>
                    <p className="text-[11px] text-brand-ash/90 leading-relaxed">
                      Utilized behind large product images or zoomed overlays. The image itself is scaled, duplicated, and blurred up to 100px behind the panel, warming the environment organically.
                    </p>
                  </div>
                  <div className="pt-3 relative z-10">
                    <code className="text-[10px] mono text-brand-ash bg-black/40 px-2 py-1 rounded block border border-white/5 truncate">
                      filter blur-[100px] scale-105 opacity-25 absolute inset-0 object-cover
                    </code>
                  </div>
                </div>

              </div>
            </section>

            {/* 5. MOTION & ANIMATION PRESETS */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-brand-steel/50 pb-4">
                <Sparkles className="w-5 h-5 text-brand-ash" />
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-widest display">05. Interactive Motion Presets</h2>
              </div>

              <div className="glass-card p-6 rounded-xl bg-brand-slate/30 border border-brand-steel/50 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="mono text-[10px] text-brand-ash uppercase tracking-widest font-bold">INTERACTIVE SIMULATION RIG</span>
                    <p className="text-xs text-brand-ash/90">Click the triggers below to test specific framer-motion transitions inside the rig.</p>
                  </div>
                  <button 
                    onClick={() => setAnimTrigger(prev => prev + 1)}
                    className="p-2 rounded-xl border border-brand-steel bg-brand-slate text-brand-ash hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 text-[10px] uppercase tracking-wider mono font-bold shadow-inner"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Reset Rig
                  </button>
                </div>

                {/* Animation Canvas Rig */}
                <div className="h-44 rounded-xl bg-black/60 border border-brand-steel/80 flex items-center justify-center relative overflow-hidden">
                  {/* Blueprint lines layout */}
                  <div className="absolute inset-0 border-b border-white/5 flex flex-col justify-between py-6 pointer-events-none">
                    <div className="h-px w-full bg-white/5" />
                    <div className="h-px w-full bg-white/5" />
                    <div className="h-px w-full bg-white/5" />
                  </div>
                  <div className="absolute inset-0 border-r border-white/5 flex justify-between px-10 pointer-events-none">
                    <div className="w-px h-full bg-white/5" />
                    <div className="w-px h-full bg-white/5" />
                    <div className="w-px h-full bg-white/5" />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={animTrigger}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: [0.16, 1, 0.3, 1] // Custom fluid cubic ease-out
                      }}
                      className="w-36 py-4 rounded-lg bg-brand-slate border border-accent-copper/40 flex flex-col items-center justify-center space-y-1 relative z-10 shadow-[0_12px_30px_rgba(0,0,0,0.8)]"
                    >
                      <Activity className="w-5 h-5 text-white animate-pulse" />
                      <span className="mono text-[10px] text-white uppercase tracking-wider font-bold">Rig Block v1.0</span>
                      <span className="text-[8px] mono text-brand-ash">EASE_OUT_EXPO</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Micro animation parameter specification cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-brand-steel/50 bg-brand-slate/40 space-y-1">
                    <span className="mono text-[9px] text-white tracking-widest block font-bold">TRANSITION EASE</span>
                    <p className="text-xs text-brand-ash font-sans">We use a custom high-performance Bezier curve for transitions:</p>
                    <code className="text-[10px] mono text-white bg-black/50 px-1.5 py-0.5 rounded block pt-1.5">
                      [0.16, 1, 0.3, 1]
                    </code>
                  </div>

                  <div className="p-4 rounded-lg border border-brand-steel/50 bg-brand-slate/40 space-y-1">
                    <span className="mono text-[9px] text-white tracking-widest block font-bold">HOVER SQUEEZE</span>
                    <p className="text-xs text-brand-ash font-sans">Hover animations use tight, sub-pixel dimensional bounds:</p>
                    <code className="text-[10px] mono text-white bg-black/50 px-1.5 py-0.5 rounded block pt-1.5">
                      scale: 1.03
                    </code>
                  </div>

                  <div className="p-4 rounded-lg border border-brand-steel/50 bg-brand-slate/40 space-y-1">
                    <span className="mono text-[9px] text-white tracking-widest block font-bold">FADE TRANSITIONS</span>
                    <p className="text-xs text-brand-ash font-sans">Staggered list elements fade over extremely snappy durations:</p>
                    <code className="text-[10px] mono text-white bg-black/50 px-1.5 py-0.5 rounded block pt-1.5">
                      duration: 0.35s
                    </code>
                  </div>
                </div>

              </div>
            </section>

          </div>

        </div>

        {/* Dynamic Spec Sheet Block footer */}
        <div className="mt-24 border-t border-brand-steel/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-6">
            <Link to="/" className="mono text-[10px] uppercase tracking-widest text-brand-ash hover:text-white transition-colors underline underline-offset-4">Home</Link>
            <span className="w-1 h-1 rounded-full bg-brand-ash/50 block" />
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-brand-ash" />
              <span className="mono text-[10px] uppercase tracking-widest text-brand-ash">System Design Token Database</span>
            </div>
          </div>
          <span className="mono text-[10px] uppercase tracking-widest text-brand-ash">Verified with local compiler parameters • 2026</span>
        </div>

      </main>
    </div>
  );
}
