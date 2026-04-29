# AGENTS.md

## PURPOSE

This is a personal presentation website.

It is NOT:
- a portfolio
- a SaaS UI
- a generic React app

It is:
> a SYSTEM INTERFACE representing a person

---

## TECH STACK (MANDATORY)

- Vite
- React
- TypeScript
- TailwindCSS
- SVG (for all visual systems)

Do NOT introduce:
- Next.js
- component libraries (shadcn, MUI, etc.)
- animation libraries (GSAP, Framer Motion)
- canvas or WebGL

---

## PROJECT STRUCTURE (MANDATORY)

src/
  app/
  components/
    layout/
    system/
    signal/
    library/
    installations/
    logs/
  data/
  styles/
    tokens.css
    globals.css

Do NOT create new top-level folders.

---

## DESIGN SYSTEM RULES

### 1. Colors (ONLY THESE)

Defined in `styles/tokens.css`:

--amber-core: #FFC94A  
--amber-base: #FFB000  
--amber-dim: #B37400  

--bg-crt: #0D0B08  
--bg-crt-soft: #1A1206  

Do NOT hardcode hex values in components.

---

### 2. Typography

- Mono → labels, commands
- Sans → content, headings

Fonts must be loaded globally in `index.html`.

Do NOT:
- mix font roles
- introduce new fonts

---

### 3. Effects

Allowed:
- text glow (via CSS variable)
- subtle SVG glow

Forbidden:
- blur backgrounds
- gradients on components
- heavy glow
- glitch effects

---

## COMPONENT SYSTEM (STRICT)

### SystemModule (PRIMARY)

All content must use this structure:

- Header (ID + Status)
- Title
- Labeled blocks
- Optional command

File:
`components/system/SystemModule.tsx`

Do NOT create alternative layouts.

---

### SignalMonitorNav (HOMEPAGE ONLY)

- Overlapping waveform lines
- No labels at rest
- Label appears only on hover
- SVG only
- No row separation

File:
`components/signal/SignalMonitorNav.tsx`

Do NOT:
- convert into buttons
- add visible nav lists
- add multiple UI layers

---

## STYLING RULES

### ALWAYS

- Use Tailwind classes
- Use CSS variables from tokens.css
- Use SVG for complex visuals

### NEVER

- inline styles (except dynamic SVG values)
- random spacing values
- ad-hoc colors

---

## INTERACTION RULES

- Animation must communicate state
- Keep transitions <150ms
- Use CSS animations only

Allowed:
- waveform drift
- hover amplification

Forbidden:
- looping decorative animation
- cinematic transitions

---

## DATA SEPARATION

All content must come from `/data`:

- work.ts
- installations.ts
- movies.ts
- logs.ts

Do NOT hardcode content inside components.

---

## NAVIGATION

Use hash-based navigation:

#system  
#work  
#installations  
#library  
#logs  
#contact  

Do NOT introduce routing libraries.

---

## FAILURE MODES (STRICTLY AVOID)

1. Generic portfolio UI
2. Sci-fi dashboard UI
3. Overdesigned visual noise

If a solution resembles:
- a SaaS product
- a Dribbble shot
- a game UI

→ it is wrong

---

## DEFINITION OF DONE

A feature is complete ONLY IF:

- Uses existing components
- Introduces no new visual language
- Uses tokens.css
- Builds successfully
- Matches system aesthetic

---

## ESCALATION RULE

If unsure:

1. Remove complexity
2. Reuse SystemModule
3. Use fewer elements

---

## PRIORITY ORDER

1. Structure
2. Clarity
3. Interaction
4. Aesthetic

Never invert this.

---

## FINAL PRINCIPLE

This site should feel like:

"A machine interface exposing a person"

NOT:

"A designed React website"