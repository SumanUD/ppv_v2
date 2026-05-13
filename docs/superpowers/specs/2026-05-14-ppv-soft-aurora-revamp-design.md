# Platform Play Venture — Soft Aurora Revamp

**Date:** 2026-05-14
**Status:** Approved direction; spec for implementation
**Owner:** Sumit (sunny@rovedashcam.com)

## Goal

Completely revamp the single-page Platform Play Venture brand site into a premium, "out-of-world" experience using a light-leaning **Soft Aurora** aesthetic, an Astro project structure, and a Three.js growth-engine orb in the hero. Sections, anchor IDs, and content stay the same; visual language, motion, and interactivity are rebuilt from scratch.

## Constraints

- Keep section order and anchor IDs: `#home`, `#clarity`, `#who`, `#solutions`, `#principles`, `#why`, `#faq`, `#contact`.
- Keep brand name, logo (`logo.jpeg`), and contact form fields (Name, Email, Phone, Message; `mailto:` action).
- Keep copy ~unchanged (light edits only for clarity if necessary).
- No external/paid imagery; all assets local. Google Fonts via CDN allowed.
- Responsive mobile-first; full `prefers-reduced-motion` fallbacks; 60fps target.

## Design Direction

### Aesthetic — Soft Aurora

Pearl/ivory base with mint, electric teal, warm coral, and honey amber accents. Iridescent glass panels, soft volumetric glow, animated gradient mesh. Closest reference: oryzo.ai. Not dark.

### Color Tokens

```css
--ivory:  #F8F6F1;
--pearl:  #FFFFFF;
--mist:   #EEF2EF;
--ink:    #0B1F2A;
--slate:  #2A3F4C;
--haze:   #6B7F8C;
--teal:   #00C4A7;
--mint:   #7DD3C0;
--coral:  #FF7A59;
--honey:  #F4D58D;
--line:   rgba(11, 31, 42, 0.08);
--glass:  rgba(255, 255, 255, 0.55);
--glow-teal:  0 0 60px rgba(0, 196, 167, 0.35);
--glow-coral: 0 0 60px rgba(255, 122, 89, 0.30);
--shadow-soft: 0 24px 60px rgba(11, 31, 42, 0.08);
--shadow-lift: 0 34px 80px rgba(11, 31, 42, 0.14);
```

### Typography

- Display: **Space Grotesk** (700/800) — headings, eyebrows.
- UI/Body: **Inter** (400/500/600) — paragraphs, labels.
- Mono (small accents): **JetBrains Mono** (400/500) — version stamps, micro-labels.
- Loaded from Google Fonts with `preconnect` + `display=swap`.
- Heading scale fluid via `clamp()`; body line-height 1.65.

### Surface System

Three depth layers:

1. **Solid pearl card** — flat surface with `--shadow-soft`.
2. **Frosted glass** — `background: var(--glass)`, `backdrop-filter: blur(20px) saturate(140%)`, 1px gradient border.
3. **Lifted card** — pearl base + colored glow on hover (`--glow-teal` or accent equivalent).

## Tech Stack

- **Astro 4.x** project. Static output.
- **Three.js r160+** (npm or CDN ESM import) — hero orb only.
- **GSAP 3.x + ScrollTrigger** — scroll choreography, timeline orchestration, FAQ accordion.
- **Vanilla CSS** with custom properties; no Tailwind, no CSS framework.
- Client islands hydrate selectively (`client:load`, `client:visible`).

## File Structure

```
ppv_v2/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── logo.jpeg
│   └── cybernetic-profile.jpg
├── src/
│   ├── pages/index.astro
│   ├── layouts/Base.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Loader.astro
│   │   ├── Footer.astro
│   │   ├── ScrollProgress.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── Clarity.astro
│   │   │   ├── WhoWeAre.astro
│   │   │   ├── Solutions.astro
│   │   │   ├── Principles.astro
│   │   │   ├── WhyUs.astro
│   │   │   ├── Faq.astro
│   │   │   └── Contact.astro
│   │   └── islands/
│   │       ├── HeroOrb.astro          # client:visible
│   │       ├── ScrollChoreography.astro  # client:load
│   │       ├── TiltCards.astro        # client:visible
│   │       └── FaqAccordion.astro     # client:visible
│   └── styles/
│       ├── tokens.css
│       ├── base.css
│       └── components.css
└── docs/superpowers/specs/2026-05-14-ppv-soft-aurora-revamp-design.md
```

## Section Specifications

### Nav

- Fixed top, transparent over hero, becomes frosted ivory glass capsule (`backdrop-filter: blur(20px)`, 80% ivory bg) once scrolled past 18px.
- Logo left; link cluster right inside a pill container with subtle 1px border.
- Active link → teal pill background, ink text.
- Mobile: hamburger toggles a light frosted glass drawer (NOT dark) anchored below the nav.

### Loader

- Full-screen ivory background.
- Brand name "Platform Play Venture" in Space Grotesk 800, animated reveal (split into two lines, staggered 180ms).
- Below: a 2px teal line that draws across `min(420px, 68vw)` over 1.6s.
- Exits at `window.load + 1500ms`, fading + scaling brand 1.02× before hiding.

### 1. Hero (#home)

**Layout:** Full viewport (min `100svh`). Desktop: 50/50 split — text left, Three.js canvas right. Mobile: stacked, orb above text at 60% viewport height.

**Content (preserved):**
- Eyebrow: "STRATEGIC GROWTH OS · v.2026" with blinking teal dot (micro-mono).
- Subheading kicker: "Strategic Growth Company"
- H1: "Go Beyond Activity / Build Strategic Clarity" — "Strategic Clarity" gradient-filled teal→mint with soft glow.
- Lead copy unchanged.
- CTA pair: "Start with Clarity" (primary teal pill), "Explore the System" (ghost ink pill).

**Three.js scene** (`src/components/islands/HeroOrb.astro`, `client:visible`):
- Renderer: `WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })`, `setPixelRatio(min(devicePixelRatio, 2))`.
- Camera: PerspectiveCamera, fov 45, positioned at `(0, 0, 5)`.
- Central object: `IcosahedronGeometry(1.4, 4)` with `MeshPhysicalMaterial({ transmission: 1.0, thickness: 0.6, ior: 1.45, roughness: 0.05, color: #C9F5EB, transparent: true, opacity: 0.9 })`.
- Inner core: a smaller `IcosahedronGeometry(0.7, 2)` with emissive teal at 0.4 intensity for refractive depth.
- Lattice: ~120 `SphereGeometry(0.04)` instances placed via Fibonacci sphere distribution at radius 2.2; colors weighted 70% mint, 20% honey, 10% coral; each animated with `position += sin(time + offset) * 0.05`.
- Pulse rings: 2 `TorusGeometry(2.5, 0.01, 16, 100)` instances at offset axes, slow rotation, opacity 0.3.
- Lights: `DirectionalLight(#F4D58D, 1.2)` at `(3, 2, 4)`, `DirectionalLight(#00C4A7, 0.8)` at `(-3, -1, 2)`, `AmbientLight(#FFFFFF, 0.15)`.
- Interaction: orb rotates following mouse with damped lerp (factor 0.05), max ±12° tilt.
- Scroll: orb translates Y up to 80px and lattice scale expands to 1.08 over scroll range of hero section.
- Performance: paused via `IntersectionObserver` when canvas leaves viewport. ResizeObserver re-aspects camera + renderer.
- Fallback: if `prefers-reduced-motion` OR WebGL unavailable, render an SVG aurora-orb placeholder (concentric gradient rings + center glow).

**Background:** CSS gradient mesh — 4 radial gradients (teal, mint, honey, coral at 10–18% opacity) drifting on independent 20–35s sine animations over ivory. Fine 1px grid at 6% opacity on top for "lattice" feel. Both layers `z-index: -2`/`-1`, behind canvas.

**Scroll indicator:** Bottom-center, 1px × 48px vertical hairline with a sliding teal dot animating top-to-bottom infinitely; "SCROLL" micro-label above. Fades after first scroll event.

**Motion (entry):**
1. Loader exits (700ms).
2. Hero background fades in (600ms).
3. Three.js scene fades canvas opacity 0 → 1 over 800ms.
4. Eyebrow slides up + fades (450ms).
5. H1 split into words, stagger 60ms each, slide up 24px + fade (650ms).
6. Lead copy slides up + fades (550ms).
7. CTAs slide up + fade (450ms).
8. Lattice nodes pop into existence in two waves over 1.2s.

### 2. Clarity (#clarity) — "Decision Path"

**Header split** kept: heading + copy left, framed cybernetic-profile image right.
- Image frame: rounded 24px, 1px gradient border, teal underglow via `box-shadow`, 4° rotateY tilt on hover with `transform-style: preserve-3d`.

**Journey (4 nodes)** redesigned:
- Horizontal flow, equal-width glass capsules on a thin gradient connector line (teal→mint→honey→coral).
- Each capsule: 64px circular orb with numbered "01"…"04" in Space Grotesk 800, beneath which sits the step title and short copy.
- Connector line has 3 light particles traveling along it via SVG `<animateMotion>` (8s loop).
- Hover: capsule tilts ~4° on `rotateX/Y` based on mouse position; orb scales 1.1 + brighter glow; copy color deepens.
- Mobile: stacks vertically, connector becomes a vertical line, orb left + content right.

### 3. Who We Are (#who) — "Strategic Growth Company"

**Layout** kept: 2-col grid (visual left, content right).

**Visual:** Existing growth-chart SVG retained but re-skinned in Soft Aurora colors (teal/mint gradient for line, ivory bars going darker with honey accents). Wrapped in a 24px-radius frosted glass panel with subtle teal glow. "Clarity First → Growth Always" badge floats bottom-left in a pearl pill with animated teal pulse dot.

**Content right column:**
- Truth statement: glass card with left teal accent bar, slightly larger type than current, soft aurora behind it.
- Body paragraph kept.
- "Not more activity — more direction" callout: pearl card with line-icon (no emoji), 1px gradient border, soft shadow.
- Capability chips: 5 pill-shaped tokens, each with a 16px line-icon (no emojis), white pearl background, colored accent dot, lifts 4px on hover with colored shadow.

### 4. Solutions (#solutions) — "Floating Panels"

**Layout:** 2×2 grid of large glass cards (min-height 360px).

**Each card:**
- Top half: section-specific aurora gradient (Solution 01 teal/mint, 02 honey/teal, 03 coral/honey, 04 mint/teal) at 30% opacity over pearl.
- Bottom half: pearl surface with content (Solution meta pill, existing SVG icon re-colored, H3, copy, "Know More" button).
- Tilt on hover: `transform: perspective(900px) rotateX/Y(±6deg)` driven by mouse position via `TiltCards.astro` island.
- Inner SVG icon translates `Z(12px)` via `transform-style: preserve-3d` for parallax-within-card depth.
- Soft drop shadow becomes more pronounced + accent glow appears on hover.
- "Know More" button: ghost ink pill, fills with teal on hover.

### 5. Principles (#principles) — "Triadic Engine"

**Light theme** (no longer dark band). Background: mist-tinted with subtle aurora mesh.

**Pillar centerpiece:** Three-pillar row (Clarity / Direction / Momentum) reframed as a triangular composition:
- Triangle SVG anchors three vertex orbs (100px circles).
- Each orb: colored glass with the icon (Clarity = teal, Direction = honey, Momentum = mint).
- Active pillar advances with scroll via `ScrollTrigger.scrub` across the section's scroll range: Clarity active in first third, Direction in middle, Momentum in final third. Active orb scales to 1.08 and gains brighter accent glow; the other two dim to 70% opacity.
- Arrows between pillars become animated gradient lines.

**Core insight card:** Larger glass card with the three highlighted phrases (clarity / direction / action) each gaining their accent color.

**Two-column problem/belief:** Glass cards with left accent bars (teal + honey).

**Why/What/How cards:** Three stacked glass cards, each with a small offset (e.g., card 2 sits 12px right of card 1 visually before reveal). Reveal in sequence with `gsap.timeline` and `ScrollTrigger`.

**Closing rhythm bar:** Three colored line segments (teal/honey/mint) animate-draw on scroll into view.

### 6. Why Us (#why) — "Strategic Timeline"

**Vertical timeline** replacing the current stacked card list.

- Left column (sticky on desktop): large numeral "01"…"05" in Space Grotesk 800 at ~6rem with teal-to-mint gradient text fill. Numeral updates as you scroll its corresponding card past the viewport center.
- Right column: glass content card per reason. Each card lifts on hover with teal glow.
- Spine: 2px gradient line down the left edge between columns, with a traveling 12px teal dot tied to scroll progress (`ScrollTrigger.scrub`).
- Mobile: numeral inline (smaller), card below it, spine becomes left-edge line.

CTA at bottom unchanged: "Connect With Us" → primary teal pill.

### 7. FAQ (#faq) — "Crystalline Accordion"

- Each item: glass card, 20px radius, 1px border.
- Closed: question + animated `+` icon (right-aligned, teal).
- Open: `+` rotates to `×`, content slides down with GSAP-animated height + fade, soft teal underglow appears under the card.
- Behavior: only one open at a time (radio-style). Closing animation runs before opening the next.
- Implemented in `FaqAccordion.astro` island; falls back to native `<details>` behavior if JS fails.

### 8. Contact (#contact) — "Aurora Console"

**Layout:** Center-aligned headline + lead + glass console form panel.

**Background:** Static aurora mesh (no drift) at higher saturation than other sections for visual destination feel.

**Form panel:** Frosted glass, 32px radius, 1px gradient border, large internal padding. Two-row grid:
- Row 1: Name | Email | Phone (3-col on desktop, stacks on mobile)
- Row 2: Message (full width textarea, 4 rows)
- Submit button: full-width teal primary, "Send Message" + arrow icon, lifts on hover.

**Input styling:**
- Floating-label: label sits over input, translates up + scales 0.85 + colors to teal on focus.
- 1px haze border that animates to teal on focus.
- On focus: soft 16px teal underglow appears beneath the input.
- Placeholder hidden when label floats up.

Fields and `mailto:hello@platformplayventure.com` action preserved exactly.

### Footer

- Ivory tinted band (not dark) with subtle aurora mesh at 4% opacity.
- 3-col layout: brand (logo + statement + social icons) | Explore | References.
- Social icons: outlined circles, teal hover.
- Bottom bar: copyright + 2 inline links + back-to-top.

## Motion & Performance

- **GSAP + ScrollTrigger** (CDN ESM) for: section reveals, timeline orchestration, FAQ accordion height tween, Why Us spine dot scrubbing, Solutions card tilt damping.
- **Three.js** for hero orb only. Paused when off-screen via `IntersectionObserver`.
- All hover/scroll effects animate `transform` and `opacity` only.
- `prefers-reduced-motion`:
  - Three.js scene replaced with static SVG aurora orb.
  - All GSAP timelines fast-forward to end state.
  - CSS transitions reduced to 1ms (existing pattern preserved).
  - Background mesh drift paused.
- **Bundle:** Three.js ~150KB gzip, GSAP ~50KB gzip; both lazy-loaded via Astro client islands. CSS hand-written, no framework.
- **Fonts:** Google Fonts with `display=swap`; preload critical weights (Space Grotesk 700/800, Inter 400/500).

## Accessibility

- All interactive elements keyboard-reachable, visible focus rings (2px teal outline with 2px offset).
- `aria-expanded` on FAQ items and mobile nav toggle.
- `aria-label` on icon-only buttons and social links.
- Form labels properly associated (existing `for`/`id` pattern preserved).
- Color contrast: ink-on-ivory exceeds WCAG AA (verified); teal-on-ivory used only for ≥18px display text; haze used only for secondary copy at ≥14px.
- `prefers-reduced-motion` honored throughout.
- Three.js canvas has `aria-hidden="true"` (decorative); no critical content lives in it.

## Out of Scope

- No CMS integration. Content stays in `.astro` files.
- No analytics/tracking added.
- No new sections or content beyond what exists.
- No build pipeline beyond `astro build` defaults.
- No SEO meta beyond what currently exists in `index.html` (title + description preserved).

## Success Criteria

1. All 9 sections + nav + footer + loader implemented in Astro with the visual language above.
2. Hero Three.js orb renders on a modern desktop browser at 60fps; lazy-loaded; degrades to SVG fallback under reduced-motion or WebGL failure.
3. Site is responsive from 360px to 1920px viewports without layout breakage.
4. Lighthouse Performance ≥ 85 on desktop, ≥ 75 on mobile (acceptable with Three.js cost).
5. All existing anchor IDs (`#home`, `#clarity`, …, `#contact`) still scroll to their sections.
6. Contact form fields and `mailto:` action unchanged and functional.
7. No external image assets beyond the existing local `logo.jpeg` and `cybernetic-profile.jpg`.
