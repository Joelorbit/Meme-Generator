# EyuTheme

**EyuTheme is the reusable frontend boilerplate for Eyu interfaces.** It is a Svelte 5 + Vite + Tailwind 4 design system built around a dark-first indigo velvet and monochrome canvas identity, with warm sage, ochre, terracotta, emerald, crimson, and editorial colorways available as named themes.

The system is intentionally broad: it provides foundations, semantic roles, reusable UI primitives, layout helpers, technical texture patterns, theme controls, and a starter cockpit that demonstrates how to compose them in a real product surface.

## Quick start

```bash
npm ci
npm run dev
npm run build
```

After pulling a commit that changes `package.json` or `package-lock.json`, run `npm install` (or `npm ci`) before starting Vite. The Bits UI wrappers are real package imports, so an existing `node_modules` directory from before the integration will not contain `bits-ui` automatically. The `dev`, `check`, and `build` scripts now run a dependency preflight and report this exact recovery command instead of allowing Vite to fail later with an import-analysis error.

If you already pulled the Bits UI integration and see `Failed to resolve import "bits-ui"`, run:

```bash
npm install
npm run check
npm run dev
```

The build output is generated in `dist/` and can be deployed as a static site. The starter cockpit in `src/App.svelte` is the living reference for the system.

## Design-system contract

| Layer | What it provides | Where it lives |
| --- | --- | --- |
| Primitives | Neutral ramps, typography, spacing, shape, motion, elevation, opacity, and z-index. | `src/lib/tokens.css` |
| Semantic roles | Meaning-based colors such as `--primary`, `--on-primary`, `--surface-high`, `--content-muted`, `--status-danger`, and `--focus-ring`. | `src/lib/tokens.css` |
| Component aliases | Stable names for buttons, fields, overlays, charts, and interactive states. | `src/lib/tokens.css` |
| Theme presets | Existing Eyu colorways and paired light/dark canvases. | `src/lib/tokens.css`, `src/lib/data/landing.ts` |
| Layout utilities | Containers, stacks, clusters, auto-fit grids, prose, patterns, skip links, and print behavior. | `src/lib/app.css` |
| UI primitives | Accessible, typed, composable Svelte components. | `src/lib/components/ui/` |
| Public API | One import surface for components, theme helpers, presets, and token metadata. | `src/lib/index.ts` |

### Token usage rule

Use semantic roles in components and application code. Use raw palette values only when defining or extending a theme. Pair foreground roles with their parent fill: `--primary` with `--on-primary`, `--primary-container` with `--on-primary-container`, and so on. This keeps theme swaps coherent and makes contrast review possible.

The token file preserves the original Eyu identity and aliases, so existing consumers can migrate incrementally. New work should prefer the semantic layer over legacy names such as `--accent`, `--surface`, and `--line`.


## Icon System (Iconoir)

EyuTheme uses **[Iconoir](https://iconoir.com)** as its official icon library — an open-source library with 1600+ unique SVG icons, designed on a precision 24×24 pixels grid with 1.5px stroke weight.

Installable directly via standard package managers:

```bash
npm i iconoir
# or
yarn add iconoir
# or
pnpm add iconoir
# or
bun add iconoir
```

### Usage in Svelte

```svelte
<script lang="ts">
  import { Icon } from "$lib";
</script>

<!-- Standard Regular Icon -->
<Icon name="spark" size={24} strokeWidth={1.5} />

<!-- Solid Variant -->
<Icon name="adobe-illustrator" size={24} solid />

<!-- Responsive & Custom Classes -->
<Icon name="nav-arrow-down" size={18} class="text-accent" />
```

All 1671 Iconoir icons (1383 regular + 288 solid) and common aliases (such as `chevron-down`, `sun`, `moon-star`, `sparkles`, `x`, `trash-2`, `check`) are fully typed with TypeScript autocompletion and zero runtime overhead.

## Themes

The system preserves the original named presets, including Eyu Charcoal, Cyber Olive, Solar Ochre, Emerald Sage, Terracotta Rust, Indigo Velvet, Crimson Obsidian, Monochrome Slate, Amber Bronze, Copper Oxide, Plum Basalt, Tobacco Leather, Moss Stone, Midnight Navy, Raw Umber, Burnt Sienna, Sage Titanium, Espresso Roast, Dune Khaki, Graphite Violet, Chalcedony Blue, Warm Basalt, Cypress Pine, and Eyu Light. Every preset has an explicit companion light canvas in `src/lib/tokens.css`; the dark selector remains the source of truth for its dark expression. The landing cockpit intentionally opens on the curated Moss Stone pair with a circuit background texture, while the complete catalog remains available through the exported `ThemePicker` component and theme controller for consuming applications.

Use the shared theme controller instead of mutating `document.documentElement.dataset.theme` in feature code:

```ts
import { applyTheme, toggleMode } from './lib/theme';

applyTheme('indigo-velvet');
const next = toggleMode('indigo-velvet');
```

Use `<ThemeToggle />` for binary mode switching. The landing cockpit uses only this control for the curated Moss Stone pair; use the exported `<ThemePicker />` or `applyTheme()` from an application surface when a product needs to expose the other presets. Both persist safely in the browser and remain inert during server-side rendering.

## Component inventory

The public UI surface includes actions (`Button`, `IconButton`, `ThemeToggle`), surfaces (`Card`, `Surface`, `EmptyState`, `Skeleton`), layout (`Container`, `Stack`, `Cluster`, `Separator`), forms (`Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Slider`), navigation and disclosure (`Accordion`, `Breadcrumb`, `Dropdown`, `Tabs`, `Pagination`, `Tooltip`), feedback (`Alert`, `Toast`, `Progress`, `Spinner`, `StatusDot`), data display (`Table`, `Badge`, `Tag`, `Avatar`, `AvatarGroup`, `Kbd`), and project-specific primitives already present in the repository.

Import from one stable module:

```ts
import { Button, Card, Container, Stack, Surface } from './lib';
```

Use snippets for composition, keep state in the component or feature that owns it, and prefer native HTML semantics before ARIA emulation. All interactive controls should preserve visible focus, keyboard operation, disabled/loading/error states, and a minimum 44px touch target.

## Patterns and visual language

The system includes plus, dots, blueprint, hatch, topographic, isometric, circuit, waves, cross, hex, fine-grain, and coarse-grain patterns. Use them as token-backed surfaces, not as arbitrary background images. The grain and technical marks are brand texture; apply them with restraint and keep essential content legible.

Layout utilities are available as classes or components:

```svelte
<Container size="reading">
  <Stack gap="lg">
    <Cluster justify="between">
      <h1 class="heading heading-lg">Project overview</h1>
      <Button>New project</Button>
    </Cluster>
    <Surface tone="high" padding="lg">Content</Surface>
  </Stack>
</Container>
```

## Accessibility and responsive baseline

Use semantic landmarks, native controls, associated labels, meaningful error descriptions, focus management for dialogs, `prefers-reduced-motion`, and `prefers-contrast: more`. Test narrow layouts from 320px upward, avoid horizontal overflow, and never communicate required meaning through color alone. The shared CSS includes skip-link, visually-hidden, responsive container, print, and reduced-motion foundations.

## Extending the system

Add a new token only when an existing semantic role cannot express the product need. Add the primitive to `tokens.css`, map it to semantic or component aliases, document its purpose in `src/lib/data/tokens.ts`, and demonstrate it in the cockpit or a focused component. Do not scatter raw color or spacing values through components.

Add a new component only when composition of existing primitives is insufficient. Keep its public props typed, make loading/empty/error/success behavior explicit when relevant, and export it from `src/lib/components/ui/index.ts` and `src/lib/index.ts`.

## Repository structure

```text
src/
├── App.svelte                         # living system cockpit
├── main.ts                            # Vite entrypoint
└── lib/
    ├── app.css                        # resets and reusable utilities
    ├── tokens.css                     # token contract and theme values
    ├── index.ts                        # public package exports
    ├── theme.ts                        # browser-safe theme controller
    ├── data/
    │   ├── landing.ts                  # theme and texture catalog
    │   └── tokens.ts                   # typed token manifest
    └── components/
        ├── primitives/                 # icon and low-level identity primitives
        ├── ui/                         # public reusable UI components
        └── sections/                   # demo and page-section compositions

docs/
├── audit-notes.md                      # expansion audit and research sources
└── system-expansion-plan.md            # architecture and compatibility decisions
```

## Advanced interaction layer

Mytheme now includes a small Eyu-styled adaptation layer over Bits UI for the interactions that benefit most from headless state and focus management: `DropdownMenu`, `Popover`, `Sheet`, and `Combobox`. These wrappers keep the interaction behavior composable while applying Eyu semantic surfaces, outlines, focus rings, radius, spacing, shadows, motion, and status roles. Use the wrappers from `src/lib/components/ui/index.ts`; do not copy generic shadcn/Tailwind class strings into product code.

## Theme modes

A theme preset and a canvas mode are separate concepts. The preset controls the accent personality, while `data-mode="light"` or `data-mode="dark"` selects the explicit companion canvas and contrast hierarchy. This means every named Eyu colorway can be used in both a polished light and a polished dark expression without losing its accent identity. The shared controller persists both values in `eyu-theme` and `eyu-mode`, while still reading the legacy `theme` key for compatibility.

```ts
import { applyTheme, readStoredMode, readStoredTheme } from '$lib/theme';

const theme = readStoredTheme('indigo-velvet');
const mode = readStoredMode('dark');
applyTheme(theme, true, mode);
```
