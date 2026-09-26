import laptopImg from '../assets/images/laptop_card_visual_1782227171686.jpg';
import ariaCoolingLoopsImg from '../assets/images/slide1_original_cad.webp';
import blindMateQdsImg from '../assets/images/slide2_original_cad.webp';
import evPoleCharger1Img from '../assets/images/ev_pole_charger_1.webp';
import evPoleCharger2Img from '../assets/images/ev_pole_charger_2.webp';
import evPoleCharger5Img from '../assets/images/ev_pole_charger_5.png';
import evPoleCharger4Img from '../assets/images/ev_pole_charger_4.webp';
import evPoleChargerHeroImg from '../assets/images/ev_pole_charger_hero.webp';

export interface Spec {
  title: string;
  text: string;
  image?: string;
  images?: string[];
  metricLabel?: string;
  metricValue?: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  badge1?: string;
  badge2?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  shortDesc: string;
  fullDesc: string;
  challenge: string;
  tags: string[];
  image: string;
  heroImage?: string;
  stats: { label: string; value: string; color?: string }[];
  specs: Spec[];
  results: { label: string; value: string }[];
  outcome: string;
}

export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.endsWith('.webm') || 
    url.endsWith('.mp4') || 
    url.includes('video')
  );
}

export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url) return '';
  // Support both googleusercontent format (from Google Drive preview link conversions) and other format options
  if (url.includes('lh3.googleusercontent.com/d/') || url.includes('lh3.googleusercontent.com/')) {
    if (!url.includes('=')) {
      return `${url}=w${width}-rw`;
    } else {
      // If there is already a parameter suffix, replace width/size indicators
      return url.replace(/=w\d+/, `=w${width}`).replace(/=s\d+/, `=w${width}`);
    }
  }
  return url;
}

export const projectsData: Project[] = [
  {
    slug: '64 port-switch',
    title: '64 port Network Switch',
    category: 'High Performance Compute',
    year: '2025 — 2026',
    shortDesc: 'Direct-to-chip liquid cooling for 64x QSFP ports in an OCP ORv3 rack (4.6 kW TDP).',
    fullDesc: 'A 2U hyperscale AI networking platform pairing 64 QSFP optical cages with direct-to-chip liquid cooling and dripless OCP ORv3 blind-mate connections.',
    challenge: 'Dissipating 4.6 kW in a dense 2U chassis while balancing flow across 64 optical ports and ensuring zero-drip blind-mate hot-swaps.',
    tags: ['Thermal', 'Liquid Cooling', 'OCP ORv3'],
    image: 'https://lh3.googleusercontent.com/d/13zePoGI5KXo6hLvVAo-BdF3cr-Wh-lKL',
    stats: [
      { label: 'TDP', value: '4.6kW', color: 'text-white' },
      { label: 'QSFP Ports', value: '64' }
    ],
    specs: [
      { 
        title: 'Direct-to-Chip Thermal Loop', 
        text: 'Dual-path direct liquid cooling dissipates 4.6 kW in 2U. Dedicated cold plates chill the switch silicon and 64 optical cages, keeping junctions under 85°C.',
        image: ariaCoolingLoopsImg,
        metricLabel: '# Thermal Load:',
        metricValue: '4.6 kW Sled Total',
        secondaryLabel: '# Core Junction:',
        secondaryValue: '<85°C Junction Temp'
      },
      { 
        title: 'OCP ORv3 Blind-Mate Manifold', 
        text: 'Chassis docks directly to OCP ORv3 rack manifolds using dripless UQD couplings. Floating alignment brackets with ±1.5mm compliance ensure leak-free hot-swapping.',
        image: blindMateQdsImg,
        metricLabel: '# Rack Interface:',
        metricValue: 'OCP ORv3 UQD Dripless',
        secondaryLabel: '# Alignment Float:',
        secondaryValue: '±1.5mm Radial Compliance'
      },
      { 
        title: 'Flow Balancing & CHT Simulation', 
        text: 'FloTHERM conjugate heat transfer simulations tuned flow restrictors across all 64 ports, maintaining balanced PG25 distribution under 15 kPa pressure drop at 2.5 LPM.',
        image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
        metricLabel: '# Hydraulic Target:',
        metricValue: '2.5 LPM @ <15 kPa ΔP',
        secondaryLabel: '# Coolant Medium:',
        secondaryValue: 'Inhibited PG25 (Water-Glycol)'
      },
      { 
        title: 'Leak Defense & Production DFM', 
        text: 'Orbital laser-welded stainless steel tubing and nickel cold plates eliminate hose permeation above 54V busbars, backed by internal rope leak sensors and 150 psi proofing.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        metricLabel: '# Proof Pressure:',
        metricValue: '150 psi Hydrostatic (3x)',
        secondaryLabel: '# Sniffer Leak Rate:',
        secondaryValue: '< 10⁻⁶ mbar·l/s Helium'
      }
    ],
    results: [
      { label: 'TH6 Temp Maintain', value: '85°C' },
      { label: 'Floor pack density', value: '94%' }
    ],
    outcome: 'Passed all thermal qualification and 150 psi proof tests, running switch ASICs reliably below 85°C in live OCP ORv3 test-lab deployments.'
  },
  {
    slug: 'laptop-npi',
    title: 'Laptop Design & Development',
    category: 'Consumer Electronics',
    year: '2023 — 2025',
    shortDesc: 'Complete A/B/C/D cover engineering with sub-$18 MBOM optimization.',
    fullDesc: 'Mass production development for a mid-tier consumer laptop, focusing on premium feel and durability while maintaining aggressive cost targets.',
    challenge: 'Achieving durability and compliance rating while reducing the MBOM costs to under $18 for the entire enclosure assembly.',
    tags: ['DFM', 'Plastic Tooling', 'NPI'],
    image: 'https://lh3.googleusercontent.com/d/1YI_J8b5TKZvCLv2kkVIHVKIKZi1kvw-n',
    heroImage: 'https://lh3.googleusercontent.com/d/1P7UAVe_n0NP-ynzlpJ7uRXcFIvHeOUrH',
    stats: [
      { label: 'MBOM Target', value: '$18', color: 'text-white' },
      { label: 'Drop Rated', value: '1.5m' }
    ],
    specs: [
      { 
        title: 'Concept Development', 
        text: 'Allocating the internal volume of a laptop chassis balancing thermal envelopes, structural rigidity, and human interface ergonomics within a highly restricted Z-height.',
        badge1: 'ID Design',
        image: 'https://lh3.googleusercontent.com/d/1P7UAVe_n0NP-ynzlpJ7uRXcFIvHeOUrH',
        images: [
          'https://lh3.googleusercontent.com/d/1P7UAVe_n0NP-ynzlpJ7uRXcFIvHeOUrH',
          'https://lh3.googleusercontent.com/d/13DWFGB9ozgNNPL8PQkG-r3S0k7djTn80',
          'https://lh3.googleusercontent.com/d/1zqIxUNuaKimxAB4HJQVdeFugQMgLk-tN',
          'https://lh3.googleusercontent.com/d/1qDiot2rjda0_IF6nphrtaGfZ-Tx_Tkft',
          'https://lh3.googleusercontent.com/d/1g9ABshgeuTyHrVwhTA8WQQrrqIT-mart',
          'https://lh3.googleusercontent.com/d/1Un1YUiqi85mz3Bam2g5AnbSGClpWyRFY',
          'https://lh3.googleusercontent.com/d/1Qxwb1C6GaT-a2DK8OBdqXmZFeUxvSFfu',
          'https://lh3.googleusercontent.com/d/16Fs44hOiajr3rp3kHqjy2hMSA1XB3qdb'
        ]
      },
      { 
        title: 'Prototyping Stage', 
        text: 'Rapid precision CNC milling on PC and ABS material to make the A,B,C & D panel for fitment check and design validation.',
        badge1: 'Design and Fitment Validation',
        image: 'https://lh3.googleusercontent.com/d/1XhUa5WQ4eoMMqzCEYBL22pOs5pm1k_Ht',
        images: [
          'https://lh3.googleusercontent.com/d/1XhUa5WQ4eoMMqzCEYBL22pOs5pm1k_Ht',
          'https://lh3.googleusercontent.com/d/1upt2uszxFe9wIqeDjOdTRgma1geveouW',
          'https://lh3.googleusercontent.com/d/1rObWx7ABhReRWRxZgpt-83pZTPaE-8qS',
          'https://lh3.googleusercontent.com/d/1RSs3eUaaqAvVnq8Ur2e-hhA9tNYU_N_Y',
          'https://lh3.googleusercontent.com/d/1dAZ4vOoveKxlwDg6LRIP1oP-1-4-Vxa0'
        ]
      },
      { 
        title: 'Drop Testing Verification', 
        text: 'Executed physical drop testing on a multi-angle drop rig from heights up to 1.5m. Tested impact forces on the motherboard mounts during sudden stops to improve the protective shock pads.',
        image: 'https://lh3.googleusercontent.com/d/15pDpSXOMR5x0DTCRmo1Io2uNXMr7JELK',
        images: [
          'https://lh3.googleusercontent.com/d/15pDpSXOMR5x0DTCRmo1Io2uNXMr7JELK',
          'https://lh3.googleusercontent.com/d/18xaWEPM9PL7DEHFRZUbZt7lqmyJYqa7k',
          'https://lh3.googleusercontent.com/d/1uis3OmZnr-sChyp9KWZm3RHaaxdZaeQz',
          'https://lh3.googleusercontent.com/d/1j1xA6qjF3IFPNSU17Ch3ETOHBNhEjeA2',
          'https://lh3.googleusercontent.com/d/1zlB5Ck8oy5HWeXhNyh4zcyrgSecOywYO',
          'https://lh3.googleusercontent.com/d/1lRMRMopgGtrnxaFx9AGd2NJ2WFDb3aH8',
          'https://lh3.googleusercontent.com/d/1EcS0xoqELUjNLFujuZvf1GgAv-BkF8Vz',
          'https://lh3.googleusercontent.com/d/1jOR1GczB0jnpUXxssDNqc16D7M-ioFBH'
        ]
      },
      { 
        title: 'Tooling & DFM Optimization', 
        text: 'Optimized core locations and cool-down cycles for the hot runner injection mold tools to completely eliminate cosmetic sink marks, yielding a 98.5% first-pass production rate.',
        image: 'https://lh3.googleusercontent.com/d/1fK7gUKO7axoSH7kzRoFbtTTY0-YLcBgr',
        images: [
          'https://lh3.googleusercontent.com/d/1fK7gUKO7axoSH7kzRoFbtTTY0-YLcBgr',
          'https://lh3.googleusercontent.com/d/1lc2iudKZhhQNxAHk4e4eRaf8OoJqn6Db',
          'https://lh3.googleusercontent.com/d/1D7hnJ4qPEskYvxeN9UB00W27RkbGLUz7',
          'https://lh3.googleusercontent.com/d/1075ibNWyPSHCPxVLTuGyFGutx2qcLKb3',
          'https://lh3.googleusercontent.com/d/1yL1zzAsO3zhGS20iJ7XR0sfKBEnac_dW',
          'https://lh3.googleusercontent.com/d/1IFNsKykHThzasWzzPhvHqyU5uBJePme9',
          'https://lh3.googleusercontent.com/d/19jtDtzhfsKyjFrrp-xcOhzAPFe8o_ox1'
        ]
      }
    ],
    results: [
      { label: 'Development Cycle', value: '11 Months' },
      { label: 'Total Weight', value: '1380 GMs' }
    ],
    outcome: 'Indigenously designed and developed laptop within an 11-month development cycle, including mechanical chassis and PCBs.'
  },
  {
    slug: '5g-radio-unit',
    title: '8T8R 5G Radio Unit',
    category: 'Outdoor Infrastructure',
    year: '2022 — 2024',
    shortDesc: 'High-power outdoor telecom enclosure with integrated die-cast thermal fins and conductive EMI gaskets.',
    fullDesc: 'An 8-transmit 8-receive (8T8R) 5G macro radio unit engineered for outdoor pole and wall deployment. Designed to balance passive convection heat sink with structural mass limits and stringent IP67 weather sealing under GR-487-CORE standards.',
    challenge: 'Dissipating up to 650W of thermal energy passively in direct sunlight while staying under the 25kg single-technician installation weight limit and surviving 150 mph wind loads.',
    tags: ['Die Casting', 'IP67', 'FEA'],
    image: 'https://lh3.googleusercontent.com/d/1E_GhmwN9cxABejZServRv5o-8eOryF-D',
    stats: [
      { label: 'Protection', value: 'IP67', color: 'text-white' },
      { label: 'Mass Savings', value: '18%' }
    ],
    specs: [
      { 
        title: 'Concept Exploration', 
        text: 'Iterated on high-aspect-ratio cooling fins and thermal plume drafting. Ran conjugate heat transfer (CHT) simulations in Ansys Icepak to balance fin pitch, draft angles, and solar load radiation while minimizing cast weight.',
        image: 'https://lh3.googleusercontent.com/d/1E_GhmwN9cxABejZServRv5o-8eOryF-D',
        images: [
          'https://lh3.googleusercontent.com/d/1E_GhmwN9cxABejZServRv5o-8eOryF-D',
          'https://lh3.googleusercontent.com/d/1gFfgXYihRvknxJvn6HK7PSfATlmFipCt',
          'https://lh3.googleusercontent.com/d/1kXgit12x9alXn-EMxh128n5okRUMj7M1'
        ]
      },
      { 
        title: 'Tolerance Stack Up & Prototype', 
        text: 'Machined prototype chassis from 6061-T6 aluminum billet to validate component stack-up, thermal interface material (TIM) compression rates, and mounting clearances for internal RF power amplifier boards.',
        image: 'https://lh3.googleusercontent.com/d/1pm40huOzaITZXunzdCLSHick-9vHCCkg',
        images: [
          'https://lh3.googleusercontent.com/d/1pm40huOzaITZXunzdCLSHick-9vHCCkg',
          'https://lh3.googleusercontent.com/d/10Nc-sJFttYHpuEsJLm53Z6yyS5B4Jf5z'
        ]
      },
      { 
        title: 'Thermal & Environmental Testing', 
        text: 'Validated IP67 rating of the device by immersion in water tank for 30mins. Monitored junction temperatures under full 650W load in environmental chambers ranging from -40°C to +55°C ambient.',
        image: 'https://lh3.googleusercontent.com/d/1T0zn5rfE6tPYg6_miPt9F4ggShxS1jUn',
        images: [
          'https://lh3.googleusercontent.com/d/1T0zn5rfE6tPYg6_miPt9F4ggShxS1jUn',
          'https://lh3.googleusercontent.com/d/1RWMPIZ26AoQ0aXhIUr2BakHRZWBGPuv6',
          'https://lh3.googleusercontent.com/d/1utNB3LHPrK-obXX3OVqsBsUe2sg6uOIe'
        ]
      },
      { 
        title: 'FEA & Manufacturing', 
        text: 'Designed multi-cavity ADC12 high-pressure die-casting (HPDC) tooling with optimized runner gating to avoid porosity in critical sealing surfaces. Applied automated CNC finish-machining, chromate conversion, and robotic EMI gasket dispensing.',
        image: 'https://lh3.googleusercontent.com/d/1otHMZst2l87EoyxtNqcIFW82C-wnBzGO',
        images: [
          'https://lh3.googleusercontent.com/d/1otHMZst2l87EoyxtNqcIFW82C-wnBzGO',
          'https://lh3.googleusercontent.com/d/1U6Ue6P8-dx0_wWu4a07MT6msDb0rl1IA'
        ]
      }
    ],
    results: [
      { label: 'Mass Reduction', value: '18%' },
      { label: 'Thermal Delta', value: '-8°C' }
    ],
    outcome: 'Successfully passed GR-487-CORE environmental testing and deployed globally by major telecom providers.'
  },
  {
    slug: 'evse-station',
    title: 'Multiport EV Pole Charger',
    category: 'Mechanical & EV Infrastructure',
    year: '2023 — 2025',
    shortDesc: 'Pedestal EV charger engineered with passive thermal solution, IP65/IK10 sealing, and DFM sheet metal architecture.',
    fullDesc: 'End-to-end mechanical design and engineering for an outdoor EV charging station deployable on floor pedestals. Engineered with an isolated natural convection thermal solution, continuous EPDM compression sealing for IP65/IK10 environmental resistance, and single-technician maintenance DFM.',
    challenge: 'Engineering a modular pedestal chassis capable of 100% passive thermal solution at +55°C ambient and severe public IK10 impacts without cooling fans.',
    tags: ['Mechanical Engineering', 'Pedestal Mount', 'IP65 / IK10', 'Thermal Solution', 'Sheet Metal DFM'],
    image: evPoleChargerHeroImg,
    heroImage: evPoleChargerHeroImg,
    stats: [
      { label: 'Chassis Material', value: 'GI/GS', color: 'text-white' },
      { label: 'Weather & Impact', value: 'IP65 / IK10' },
      { label: 'Thermal Solution', value: '100% Fanless' }
    ],
    specs: [
      { 
        title: 'Passive Convective Thermal Solution', 
        text: '100% fanless natural convection thermal loop utilizing internal isolated air channels and conductive heat sink blocks to reject contactor and metering thermal loads up to +55°C without dust ingress.',
        badge1: 'Fanless Thermal Loop',
        badge2: '-10°C to +55°C Ambient',
        metricLabel: '# Thermal Architecture:',
        metricValue: 'Isolated Natural Convection',
        secondaryLabel: '# Thermal Margin:',
        secondaryValue: 'Zero-Fan Passive Rejection',
        image: evPoleCharger2Img
      },
      { 
        title: 'Pedestal Structural Architecture', 
        text: 'Rigid enclosure chassis accommodating concrete plinth pedestal anchoring with zero mast deflection and reinforced internal structural frames.',
        badge1: 'Pedestal Mount',
        badge2: 'Structural Rigidity',
        metricLabel: '# Structural Chassis:',
        metricValue: 'GI/GS Enclosure & Frame',
        secondaryLabel: '# Mounting Interface:',
        secondaryValue: 'Reinforced Concrete Plinth Mount',
        image: evPoleCharger1Img
      },
      { 
        title: 'IP65 Environmental Sealing & IK10 Defense', 
        text: 'Dual foam-in-place EPDM compression gaskets with recessed labyrinth drainage prevent water intrusion during driving rains and hose-down tests, paired with 2mm steel reinforcement achieving IK10 impact resistance.',
        badge1: 'IP65 Weatherproof',
        badge2: 'IK10 Impact Certified',
        metricLabel: '# Ingress Protection:',
        metricValue: 'Continuous EPDM Labyrinth Seal',
        secondaryLabel: '# Anti-Vandal Rating:',
        secondaryValue: 'IK10 Impact / Tamper-Proof Fasteners',
        image: evPoleCharger5Img
      },
      { 
        title: 'Connector Holsters & Serviceability DFM', 
        text: 'Drop-resistant angled Type-2 / Bharat AC001 connector holsters with gravity water shedding, integrated 5M cable management saddles, and captive-hinged access doors for single-technician field servicing.',
        badge1: 'Gravity Water Shed',
        badge2: 'Single-Tech Servicing',
        metricLabel: '# Cable & Dock DFM:',
        metricValue: 'Drop-Resistant Angled Docks',
        secondaryLabel: '# Field Maintenance:',
        secondaryValue: 'Toolless Captive Hinge Access',
        image: evPoleCharger4Img
      }
    ],
    results: [
      { label: 'Ingress & Impact', value: 'IP65 / IK10' },
      { label: 'Thermal Delta', value: '10°C' }
    ],
    outcome: 'Validated IP65 rain spray and IK10 drop/impact compliance across floor pedestal deployments with 100% fanless thermal stability.'
  }
];
