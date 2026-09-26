# Brand Spec & Mechanical Design System Documentation

This document specifies the typography scales, color palettes, custom border radius properties, shadow details, and motion animation mechanics for the monochrome industrial portfolio application.

---

## 1. Typography Hierarchy

Our system relies on an intentional pairing of display, geometric sans, and high-accuracy monospaced fonts to deliver a premium, technical aesthetic.

### Font Families
- **Display Headings (`font-display`)**: `"Syne"`, sans-serif (Weights: `700`, `800`)
  - *Vibe:* Strong mechanical character, wide visual footprint, high structural impact.
  - *Usage:* Strictly capitalized titles, page hero headers, category highlights.
  - *Attributes:* Loose tracking (`tracking-[0.15em]`), extremely low line-height (`leading-[0.9]`).
- **Body & Controls (`font-sans`)**: `"Space Grotesk"`, sans-serif (Weights: `300` to `700`)
  - *Vibe:* Elegant technical proportions with geometric anomalies.
  - *Usage:* Paragraph descriptions, lists, tabs, interactive labels, action items.
  - *Attributes:* Tight letter spacing (`tracking-tight`), fluid leading.
- **Data & Telemetry (`font-mono`)**: `"DM Mono"`, monospace (Weights: `300` to `700`)
  - *Vibe:* Perfect vertical grid alignment, high diagnostic readability.
  - *Usage:* Technical tags, metric tables, system version numbers, status codes, micro indices.
  - *Attributes:* Capitalized (`uppercase`), snappy tracking (`tracking-wider` / `tracking-[0.25em]`).

---

## 2. Color Tokens

A highly calibrated monochrome slate theme utilizing deep charcoal grays, matte blacks, and active white elements to resemble dark hardware blueprint interfaces.

| Token Name | CSS Variable | Hex Code | Purpose / Context |
| :--- | :--- | :--- | :--- |
| **Brand Ink** | `--color-brand-ink` | `#050608` | Primary background color. Dense matte black preventing optical bleeding. |
| **Brand Slate** | `--color-brand-slate` | `#0B0D10` | Mid-ground layer container background. Used on cards, lists, and popups. |
| **Brand Steel** | `--color-brand-steel` | `#1A1D22` | Boundary partitions, grid lines, and standard component border containers. |
| **Accent Copper** | `--color-accent-copper` | `#D6D2C4` | Monochrome bone/silver. Utilized for micro buttons, active markers, and toggles. |
| **Accent Sage** | `--color-accent-sage` | `#888780` | Muted, lower-contrast text color for sub-labels and paragraphs. |
| **Active White** | `--color-brand-bone` | `#FFFFFF` | Primary readable typography color, high-contrast action states, and logo indicators. |

### Dynamic Monochrome Normalization
To prevent visual incoherence from legacy color codes, a fallback mapper globally intercepts and converts raw class properties:
- Replaces copper backgrounds (`#8A5A3C`) with **Active White** (`#FFFFFF`).
- Replaces highlighted text indicators with **Bone White** (`#D6D2C4`) or **Solid White**.
- Maps legacy border highlights to clean transparent white/steel frames.

---

## 3. Compact Card Radius

Standard large modern cards utilize `3xl` or large custom `2.5rem` values which feel overly organic and soft. For a rigid, manufactured, and industrial appearance, our custom theme overrides these properties to a strict, compact value:

```css
/* Globals override rule in src/index.css */
.rounded-3xl, 
.rounded-\[2\.5rem\], 
.rounded-\[2rem\], 
.rounded-\[3rem\], 
.rounded-\[1\.8rem\],
.rounded-2xl {
  border-radius: var(--radius-xl, 12px) !important;
}
```

*Result:* Clean, sharp, engineered lines that align seamlessly with small text boxes, labels, and mechanical grid alignments.

---

## 4. Card Shadows & Backglows

Depth is defined through clean physical inset shadows and subtle, luminous monochrome highlights instead of traditional heavy dark drop-shadows.

### A. Inset Industrial Spec
Creates a recessed "machined" appearance. Used on background video windows, mini sliders, and image galleries.
- **Tailwind class:** `shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)]`

### B. Active Monochrome Glow
Adds physical weight to active buttons, chosen tags, or interactive design blocks.
- **Tailwind class:** `shadow-[0_0_15px_rgba(255,255,255,0.35)]`

### C. Soft Ambient Backglows
Large overlays (e.g. image lightbox modals) use high-radius Gaussian blur backdrops of the primary content itself to enrich the viewport organically:
- **Tailwind properties:** `filter blur-[100px] scale-105 opacity-25 object-cover absolute inset-0`

---

## 5. Transition & Animation Presets

Animations are designed to mimic precise physical transitions rather than artificial bouncy playfulness.

### Transition Timing Curve
Our core timing curve utilizes an exponential, extremely smooth ease-out:
- **Cubic Bezier Preset:** `[0.16, 1, 0.3, 1]` (*Ease Out Expo*)
- **Attributes:** Extremely fast initial action that decelerates to an elegant settle.

### Standard Framer-Motion Targets
```typescript
// Snappy Slide-Up Entrance
const slideUpEntrance = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

// Fluid Hover Squeeze
const hoverSqueeze = {
  whileHover: { scale: 1.03 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
};
```
