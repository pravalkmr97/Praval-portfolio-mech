import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { 
  ArrowUpRight, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap,
  DraftingCompass,
  Linkedin
} from 'lucide-react';
import { InteractiveProjectCard } from './components/InteractiveProjectCard';
import ProjectDetail from './components/ProjectDetail';
import DesignSystem from './components/DesignSystem';
import { projectsData, getOptimizedImageUrl } from './data/projects';
import CountUp from './components/CountUp';
import OrbitingSkillsCursor from './components/OrbitingSkillsCursor';
import ProjectShowcase from './components/ProjectShowcase';
import MarqueeBanner from './components/MarqueeBanner';
import TextReveal from './components/TextReveal';
import dieCastCapabilityImage from './assets/images/capability-die-cast.webp';
import npiCapabilityImage from './assets/images/capability-npi-mass-production.png';
import thermalCapabilityImage from './assets/images/capability-thermal.webp';
import complianceCapabilityImage from './assets/images/capability-compliance-validation.gif';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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



const capabilities = [
  {
    id: 'thermal',
    num: '01',
    label: 'Thermal Systems',
    tag: 'Focus Area 01',
    title: 'Thermal Systems Design',
    desc: 'Advanced thermal management for high-density compute. Specializing in liquid cooling architectures (OCP ORv3) and managing 4.6kW+ TDP systems through rigorous CFD and ANSYS validation.',
    pills: ['High-Density Cooling', 'Liquid Cooling', 'CFD Analysis'],
    image: thermalCapabilityImage,
    icon: <Zap className="w-12 h-12 text-accent-orange opacity-40" />
  },
  {
    id: 'enclosure',
    num: '02',
    label: 'Enclosure Engineering',
    tag: 'Focus Area 02',
    title: 'Enclosure Engineering',
    desc: 'Structural design for harsh environments and consumer markets. Expertise in complex die casting, precision sheet metal, and injection molding for 5G RRUs, server chassis, and laptops.',
    pills: ['Die Casting', 'Sheet Metal', 'IP67 Enclosures'],
    image: dieCastCapabilityImage,
    icon: <Layers className="w-12 h-12 text-accent-orange opacity-40" />
  },
  {
    id: 'npi',
    num: '03',
    label: 'NPI & Mass Prod.',
    tag: 'Focus Area 03',
    title: 'NPI & Mass Production',
    desc: 'Taking concepts to the factory floor. Proven track record in cost-down engineering (sub-$18 MBOM targets), global vendor management, and end-to-end product lifecycle ownership.',
    pills: ['Cost Optimization', 'DFM/DFA', 'Supply Chain'],
    image: npiCapabilityImage,
    icon: <Cpu className="w-12 h-12 text-accent-orange opacity-40" />
  },
  {
    id: 'compliance',
    num: '04',
    label: 'Compliance & Validation',
    tag: 'Focus Area 04',
    title: 'Compliance & Validation',
    desc: 'Rigorous testing for mission-critical hardware. SVTP validation, GR-487-CORE environmental testing, and managing certifications for global market entry.',
    pills: ['SVTP Validation', 'GR-487-CORE', 'IEC 60068-2'],
    image: complianceCapabilityImage,
    icon: <ShieldCheck className="w-12 h-12 text-accent-orange opacity-40" />
  }
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCap, setActiveCap] = useState(capabilities[0]);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
    
    // Setup initial clean slate for animations
    gsap.set('.gsap-nav-item', { opacity: 0, x: -20 });
    gsap.set('.gsap-hero-card', { opacity: 0, y: 50 });
    gsap.set('.gsap-hero-avatar', { scale: 0.85, opacity: 0 });
    gsap.set('.gsap-hero-name', { opacity: 0, y: 35 });
    gsap.set('.gsap-hero-text', { opacity: 0, y: 20 });
    
    tl.to('.gsap-hero-card', {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: 'power3.out'
    })
    .to('.gsap-hero-avatar', {
      scale: 1,
      opacity: 1,
      duration: 1.1,
      ease: 'back.out(1.15)'
    }, '-=0.8')
    .to('.gsap-hero-name', {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.9
    }, '-=0.6')
    .to('.gsap-hero-text', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.7')
    .to('.gsap-nav-item', {
      opacity: 1,
      x: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.9');
  }, []);

  const [isSlidePaused, setIsSlidePaused] = useState(false);

  const laptopProject = 
    projectsData.find(p => p.slug === 'laptop-npi') || 
    projectsData.find(p => p.category.toLowerCase().includes('consumer')) || 
    projectsData[1];

  const switchProject = 
    projectsData.find(p => p.slug === '64 port-switch' || p.slug === '800g-switch' || p.slug === '64-port-switch') || 
    projectsData.find(p => p.category.toLowerCase().includes('compute')) || 
    projectsData[0];

  const slides = [
    laptopProject,
    switchProject
  ].filter((p): p is typeof projectsData[0] => !!p).map((p, i) => {
    let featuredStats: { label: string; value: string; highlight?: boolean }[] = [];
    let mediaSubtitle = '';

    if (p.slug === 'laptop-npi') {
      featuredStats = [
        { label: 'NPI CYCLE', value: '11MO' },
        { label: 'MBOM TARGET', value: '$18', highlight: true },
        { label: 'DROP TEST', value: '1.5M' },
        { label: 'VALIDATION', value: 'SVTP' }
      ];
      mediaSubtitle = 'A/B/C/D PANEL TOOLING + SVTP VALIDATION';
    } else if (p.slug === '64 port-switch' || p.slug === '800g-switch' || p.slug === '64-port-switch' || p.category === 'High Performance Compute' || p.slug === 'liquid-cooling') {
      featuredStats = [
        { label: 'TDP CAPACITY', value: '4.6KW' },
        { label: 'QSFP PORTS', value: '64' },
        { label: 'TH6 TEMP', value: '85°C', highlight: true },
        { label: 'FLOOR DENSITY', value: '94%' }
      ];
      mediaSubtitle = 'DIRECT-TO-CHIP LIQUID COOLING + OCP ORv3 BLIND-MATE';
    } else {
      featuredStats = [
        ...(p.stats || []).map(s => ({ label: s.label.toUpperCase(), value: s.value })),
        ...((p as any).results || []).slice(0, 2).map((r: any) => ({ label: r.label.toUpperCase(), value: r.value }))
      ].slice(0, 4);
      mediaSubtitle = (p.tags || []).slice(0, 3).join(' + ').toUpperCase();
    }

    return {
      id: i + 1,
      slug: p.slug,
      title: p.title,
      subtitle: p.shortDesc,
      year: p.year,
      desc: p.fullDesc,
      image: p.image,
      featuredStats,
      mediaSubtitle
    };
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1 || isSlidePaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isSlidePaused, currentSlide]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['home', 'projects', 'capabilities', 'about', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'capabilities', label: 'Focus', href: '#capabilities' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="flex min-h-screen relative">
      <OrbitingSkillsCursor />
      
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-screen w-16 border-r border-[#1A1D22] flex flex-col items-center justify-between py-12 z-50 bg-[#0B0D10]/80 backdrop-blur-md">
        
        {/* Navigation Link Stack */}
        <div className="flex flex-col items-center gap-6 mt-4">
          {navItems.map((item, i) => (
            <div key={item.id} className="flex flex-col items-center gap-6 gsap-nav-item">
              <a 
                href={item.href} 
                className={`mono text-[13px] uppercase tracking-widest transition-all duration-300 [writing-mode:vertical-rl] rotate-180 py-1 hover:text-white ${activeSection === item.id ? 'text-white font-semibold' : 'text-[#888780]'}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </a>
              {i < navItems.length - 1 && (
                <div 
                  className="w-px h-6 bg-[#1A1D22]" 

                />
              )}
            </div>
          ))}
        </div>
      </nav>

      <main className="flex-1 ml-16 px-6 lg:px-12 py-12 max-w-7xl mx-auto overflow-hidden">
        
        {/* HERO SECTION */}
        <section id="home" className="mb-24">
          {/* Top Fold: About Me & Featured Projects (Screen-height bounded) */}
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-6rem)] lg:min-h-[580px] lg:max-h-[820px] mb-6"
          >
            {/* Identity Card */}
            <motion.div 
              variants={fadeIn} 
              className="lg:col-span-4 glass-card p-8 rounded-xl flex flex-col justify-between h-full relative group overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(255,255,255,0.03)] gsap-hero-card"
            >
              <div className="flex items-center gap-3 mb-6 justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-[#888780]">Industrial Design & Engineering</span>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 py-4">
                {/* Black & White Oval Profile Image with Falloff Fading Effect */}
                <div className="relative w-36 h-48 md:w-40 md:h-52 rounded-[50%/40%] overflow-hidden border border-white/5 bg-brand-slate mb-6 flex items-center justify-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:border-white/20 gsap-hero-avatar">
                  <img 
                    src={getOptimizedImageUrl("https://lh3.googleusercontent.com/d/17QxNLnRwmAcvQ6oC299LEt0bhZRqxUuO", 400)} 
                    alt="Praval Kumar" 
                    className="w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:scale-105"
                    style={{
                      filter: 'grayscale(100%) brightness(0.85) contrast(1.2)',
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Radial & linear gradients for the soft falloff fade at borders and bottom */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 20%, rgba(18, 20, 24, 0.95) 100%), linear-gradient(to top, rgba(18, 20, 24, 1) 0%, transparent 50%)'
                    }}
                    />
                </div>

                <div className="text-center font-display">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[0.85] mb-4 text-[#D6D2C4] uppercase gsap-hero-name">
                    PRAVAL<br />
                    <span className="text-[#D6D2C4]/20 group-hover:text-white/25 transition-colors duration-500">KUMAR</span>
                  </h1>
                  <p className="mono text-[11px] text-[#888780] leading-relaxed uppercase tracking-widest mt-4 gsap-hero-text">
                    Mechanical Design Manager<br />
                    Enclosure & Thermal Systems
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col items-center w-full">
                <a 
                  href="mailto:praval.office@gmail.com" 
                  className="mono text-[10px] text-[#888780] hover:text-white transition-colors mb-3 tracking-tighter"
                >
                  praval.office@gmail.com
                </a>
                <div className="flex items-center gap-2 justify-center">
                  <span className="px-3 py-1 rounded-full bg-white text-black font-bold mono text-[9px] uppercase">6+ Yrs Experience</span>
                  <a 
                    href="https://www.linkedin.com/in/praval-kumar/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-[#0a66c2]/20 border border-white/10 hover:border-[#0a66c2]/40 text-[#D6D2C4] hover:text-white font-mono text-[9px] uppercase tracking-wider transition-all duration-300 group/linkedin"
                    title="Connect on LinkedIn"
                  >
                    <Linkedin className="w-3 h-3 text-[#0a66c2] group-hover/linkedin:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Featured Slideshow */}
            <motion.div 
              variants={fadeIn} 
              onMouseEnter={() => setIsSlidePaused(true)}
              onMouseLeave={() => setIsSlidePaused(false)}
              className="lg:col-span-8 glass-card p-8 rounded-xl relative overflow-hidden flex flex-col justify-between h-full gsap-hero-card"
            >
              {/* Card Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-4 pb-3 border-b border-white/5 z-10">
                {/* Pill badge left & slide dots */}
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full border border-white/10 bg-[#121418]/50 text-white text-[10px] sm:text-[11px] font-mono tracking-widest font-bold uppercase">
                    Featured Project
                  </span>
                  
                  {/* Direct slide switcher dots */}
                  <div className="flex items-center gap-1.5 ml-1">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlide === idx 
                            ? 'w-6 bg-accent-orange' 
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        title={`Switch to project ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation and year right */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Prev button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-[#121418]/60 flex items-center justify-center text-[#888780] hover:text-white hover:bg-white/5 hover:border-white/25 transition-all cursor-pointer active:scale-95 animate-none"
                    title="Previous project"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Circular index indicator */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                      <circle 
                        cx="20" 
                        cy="20" 
                        r="16" 
                        fill="transparent" 
                        stroke="#FFFFFF" 
                        strokeWidth="2.5" 
                        strokeDasharray={100}
                        strokeDashoffset={100 - (((currentSlide % slides.length) + 1) / slides.length) * 100}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-mono font-bold text-[#D6D2C4]">
                      {(currentSlide % slides.length) + 1}
                    </span>
                  </div>

                  {/* Next button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-[#121418]/60 flex items-center justify-center text-[#888780] hover:text-white hover:bg-white/5 hover:border-white/25 transition-all cursor-pointer active:scale-95 animate-none"
                    title="Next project"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <span className="mono text-[10px] text-[#888780]/90 uppercase tracking-widest ml-1 font-semibold">
                    {slides[currentSlide]?.year}
                  </span>
                </div>
              </div>

              {/* Central Media/Image Box */}
              <div className="relative w-full aspect-[21/10] sm:aspect-[21/8] lg:aspect-auto lg:flex-1 lg:min-h-0 bg-[#121418]/40 border border-[#1A1D22] rounded-xl overflow-hidden mb-4">
                {/* 5-second animated progress timer bar */}
                {!isSlidePaused && (
                  <motion.div
                    key={`timer-${currentSlide}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute top-0 left-0 h-[2px] bg-accent-orange z-20 pointer-events-none"
                  />
                )}
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={getOptimizedImageUrl(slides[currentSlide].image, 1000)} 
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    {/* Soft falloff shadows for branding and caption legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Technical Sub-caption with rolling transition overlay at bottom */}
                <div className="absolute bottom-4 left-0 right-0 text-center z-10 px-4 overflow-hidden h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSlide}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="mono text-[10px] md:text-xs text-white tracking-widest font-bold uppercase font-mono block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                      {slides[currentSlide].mediaSubtitle}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Title & Description Column with rolling text roll up animation */}
              <div className="text-left w-full mb-4 relative overflow-hidden min-h-[90px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ y: "100%", opacity: 0, rotateX: -30, transformOrigin: "bottom" }}
                    animate={{ y: 0, opacity: 1, rotateX: 0, transformOrigin: "bottom" }}
                    exit={{ y: "-100%", opacity: 0, rotateX: 30, transformOrigin: "top" }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                    style={{ perspective: 1000 }}
                  >
                    <Link to={`/project/${slides[currentSlide].slug}`} className="group/title block">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-none mb-3 text-[#D6D2C4] group-hover/title:text-white transition-colors">
                        {slides[currentSlide].title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm md:text-base text-[#888780]/90 font-light leading-relaxed max-w-3xl font-sans">
                      {slides[currentSlide].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stats Grid Footer with rolling transition */}
              <div className="border-t border-white/5 pt-4 text-left w-full relative overflow-hidden min-h-[60px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ y: "100%", opacity: 0, rotateX: -20, transformOrigin: "bottom" }}
                    animate={{ y: 0, opacity: 1, rotateX: 0, transformOrigin: "bottom" }}
                    exit={{ y: "-100%", opacity: 0, rotateX: 20, transformOrigin: "top" }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full"
                    style={{ perspective: 1000 }}
                  >
                    {slides[currentSlide].featuredStats.map((stat) => (
                      <div key={stat.label} className="flex flex-col">
                        <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.highlight ? 'text-white' : 'text-[#D6D2C4]'}`}>
                          <CountUp value={stat.value} />
                        </span>
                        <span className="mono text-[9px] uppercase text-[#888780]/70 tracking-widest mt-1">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Lower Stats Grid Rows */}
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Stats Grid */}
            <motion.div variants={fadeIn} className="lg:col-span-4 glass-card p-8 rounded-xl flex flex-col justify-between min-h-[180px]">
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-accent-orange">
                    <CountUp value="6" />
                  </span>
                  <span className="text-2xl text-white/20">+</span>
                </div>
                <p className="mono text-[10px] uppercase text-white/40 tracking-[0.2em]">Years Experience</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Liquid Cooling', 'OCP ORv3', 'Thermal FEA'].map(skill => (
                  <span key={skill} className="text-[9px] mono px-2 py-1 bg-white/5 rounded border border-white/10 text-white/40 uppercase">{skill}</span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="lg:col-span-5 glass-card p-8 rounded-xl">
              <p className="mono text-[10px] uppercase text-white/40 tracking-[0.2em] mb-6">Design Ecosystem</p>
              <div className="space-y-4">
                {[
                  { label: 'SolidWorks', value: '95%' },
                  { label: 'Creo', value: '88%' },
                  { label: 'ANSYS FEA', value: '82%' }
                ].map(tool => (
                  <div key={tool.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] mono uppercase">
                      <span className="text-white/60">{tool.label}</span>
                      <span className="text-accent-orange">
                        <CountUp value={tool.value} />
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: tool.value }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-accent-orange" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="lg:col-span-3 glass-card p-8 rounded-xl flex flex-col justify-center items-center text-center min-h-[180px]">
              <p className="text-5xl font-bold mb-2 text-accent-orange">
                <CountUp value="10+" />
              </p>
              <p className="mono text-[10px] uppercase text-white/40 tracking-[0.2em]">Products Shipped</p>
              <div className="mt-6 pt-6 border-t border-white/5 w-full flex justify-center text-accent-orange">
                <DraftingCompass className="w-6 h-6 opacity-40" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* KINETIC MARQUEE TICKER 1 */}
        <div className="mb-24 -mx-6 lg:-mx-12">
          <MarqueeBanner speed={0.12} />
        </div>

        {/* PROJECTS SECTION */}
        <section id="projects" className="mb-32 pt-12">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex items-baseline gap-6 mb-12"
          >
            <TextReveal text="Portfolio" as="h2" className="text-5xl font-bold tracking-tighter uppercase whitespace-nowrap" />
            <div className="h-px bg-white/5 flex-1" />
            <span className="mono text-xs text-accent-orange">/ {projectsData.length.toString().padStart(2, '0')} Key Projects</span>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="flex flex-col gap-8 md:gap-10"
          >
            {projectsData.map((project, index) => {
              const indexStr = String(index + 1).padStart(2, '0');
              return (
                <InteractiveProjectCard 
                  key={project.slug} 
                  project={project} 
                  indexStr={indexStr} 
                />
              );
            })}
          </motion.div>
        </section>

        {/* KINETIC MARQUEE TICKER 2 (REVERSE DIRECTION) */}
        <div className="mb-24 -mx-6 lg:-mx-12">
          <MarqueeBanner speed={0.12} direction="right" />
        </div>

        {/* 3D WEBGL SMOOTH-SCROLL PROJECT SHOWCASE / TECHNICAL ARCHIVE */}
        <ProjectShowcase />

        {/* CAPABILITIES SECTION */}
        <section id="capabilities" className="mb-32">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex items-baseline gap-6 mb-16"
          >
            <TextReveal text="Capabilities" as="h2" className="text-5xl font-bold tracking-tighter uppercase whitespace-nowrap" />
            <div className="h-px bg-white/5 flex-1" />
            <span className="mono text-xs text-accent-orange">/ Technical Core</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* Index Column */}
            <div className="lg:col-span-3 glass-card p-8 rounded-xl flex flex-col justify-center space-y-8">
              {capabilities.map((cap) => (
                <button 
                  key={cap.id}
                  onClick={() => setActiveCap(cap)}
                  className={`group flex items-start gap-4 text-left transition-all duration-300 ${activeCap.id === cap.id ? 'translate-x-2' : ''}`}
                >
                  <span className={`font-display text-[10px] mt-1 transition-colors ${activeCap.id === cap.id ? 'text-accent-orange' : 'text-white/20'}`}>
                    {cap.num}
                  </span>
                  <span className={`text-sm font-bold uppercase transition-colors ${activeCap.id === cap.id ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
                    {cap.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="lg:col-span-5 glass-card p-10 rounded-xl flex flex-col justify-center relative overflow-hidden">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="mono text-accent-orange text-[10px] uppercase tracking-[0.3em] mb-4 block">{activeCap.tag}</span>
                    <h3 className="text-4xl font-bold uppercase tracking-tighter mb-8 leading-none" dangerouslySetInnerHTML={{ __html: activeCap.title.replace(' ', '<br />') }} />
                    <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                      {activeCap.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeCap.pills.map(p => (
                        <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] mono text-white/40 uppercase">{p}</span>
                      ))}
                    </div>
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* Visual Display */}
            <div className="lg:col-span-4 glass-card p-5 sm:p-8 rounded-xl flex items-center justify-center bg-black/20 min-h-[360px] overflow-hidden">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCap.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src={activeCap.image}
                      alt={`${activeCap.title} capability`}
                      className="w-full max-h-[420px] object-contain rounded-lg"
                      loading="lazy"
                    />
                  </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <TextReveal text="About Me" as="h2" className="text-5xl font-bold tracking-tighter uppercase mb-8" />
              <p className="text-2xl text-white/70 font-light font-serif italic mb-8 leading-relaxed">
                &ldquo;I build hardware that actually ships.&rdquo;
              </p>
              <div className="space-y-6 text-white/40 text-sm leading-relaxed max-w-lg">
                <p>Mechanical Design Manager with 6+ years driving complex enclosure and product development — laptops, 5G radios, tablets, EVSE, high-density switching systems.</p>
                <p>Focused on the intersection of advanced thermal management and cost-optimized mass production. Expertise in hyperscale liquid cooling (OCP ORv3) and global vendor management.</p>
              </div>
            </motion.div>

            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
              className="glass-card p-10 rounded-xl"
            >
              <h4 className="mono text-[10px] uppercase text-accent-orange tracking-widest mb-8">Standards & Compliance</h4>
              <div className="space-y-8">
                {[
                  { id: '01', title: 'OCP ORv3', sub: 'Hyperscale rack liquid cooling' },
                  { id: '02', title: 'GR-487-CORE', sub: 'Telecom environmental reqs' },
                  { id: '03', title: 'IEC 60068-2', sub: 'Mechanical testing standards' }
                ].map((item) => (
                  <div key={item.id} className="flex gap-6 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <span className="mono text-white/20 text-xs">{item.id}</span>
                    <div>
                      <p className="font-bold text-white/80 uppercase">{item.title}</p>
                      <p className="text-[10px] mono text-white/30 mt-1 uppercase">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#ef7048] rounded-xl p-12 lg:p-20 text-black flex flex-col lg:flex-row justify-between items-center gap-12"
          >
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-6xl font-black tracking-tighter leading-[0.85] uppercase mb-6">
                Let&apos;s build<br />something.
              </h2>
              <p className="text-black/70 text-lg font-medium leading-relaxed">
                Open to senior mechanical design and thermal systems roles. Interested in data infrastructure and high-density cooling.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:praval.office@gmail.com"
                className="bg-black text-accent-orange py-6 px-12 rounded-xl font-bold mono uppercase tracking-widest text-center flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5" />
                Email Me
              </motion.a>
              <div className="flex justify-center items-center gap-6 mt-4">
                <a 
                  href="https://www.linkedin.com/in/praval-kumar/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] mono font-bold uppercase tracking-widest border-b border-black/30 pb-0.5 hover:border-black transition-colors flex items-center gap-1.5 text-black hover:text-black/80 cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a 
                  href="mailto:praval.office@gmail.com?subject=Resume%20Request%20-%20Praval%20Kumar" 
                  className="text-[10px] mono font-bold uppercase tracking-widest border-b border-black/20 pb-0.5 hover:border-black transition-colors text-black/80 hover:text-black cursor-pointer"
                >
                  Request Resume
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CONFIDENTIALITY & IP PROTECTION NOTICE */}
        <section className="mb-20">
          <div className="glass-card p-6 md:p-8 rounded-xl border border-white/10 bg-[#121418]/60 backdrop-blur-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-accent-orange shrink-0 mt-0.5 sm:mt-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="mono text-[10px] text-accent-orange uppercase tracking-[0.25em] font-semibold">Confidentiality & IP Notice</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                    <span className="mono text-[9px] text-white/40 uppercase">NDA Compliant</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#888780] font-light leading-relaxed max-w-3xl">
                    All technical CAD renders, thermal simulation figures, and mechanical specifications presented across this portfolio have been curated, generalized, or sanitized to protect proprietary client trade secrets and strictly adhere to bilateral Non-Disclosure Agreements (NDAs). Proprietary internal schematics, PCB artwork, and confidential vendor BOM matrices remain non-public.
                  </p>
                </div>
              </div>
              <div className="shrink-0 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mono text-[9px] text-[#D6D2C4]/70 uppercase tracking-widest whitespace-nowrap">
                  IP Protected &bull; Sanitized
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 mb-8">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-accent-orange" />
            <span className="mono text-[10px] uppercase tracking-widest">Praval Kumar &copy; 2026</span>
          </div>
          <div className="flex gap-8 items-center flex-wrap justify-center">
            <Link to="/" className="mono text-[10px] uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40">Home</Link>
            <span className="w-1 h-1 rounded-full bg-brand-ash/50 block" />
            <a 
              href="https://www.linkedin.com/in/praval-kumar/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mono text-[10px] uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40 flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
            <span className="w-1 h-1 rounded-full bg-brand-ash/50 block" />
            <Link to="/design-system" className="mono text-[10px] uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40">Design System</Link>
            <span className="w-1 h-1 rounded-full bg-brand-ash/50 block" />
            <span className="mono text-[10px] uppercase tracking-widest">Mechanical Design Manager</span>
            <span className="w-1 h-1 rounded-full bg-brand-ash/50 block" />
            <span className="mono text-[10px] uppercase tracking-widest whitespace-nowrap">Bengaluru, IN</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/design-system" element={<DesignSystem />} />
      </Routes>
    </Router>
  );
}
