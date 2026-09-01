import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const regDir = join(root, "node_modules", "iconoir", "icons", "regular");
const solidDir = join(root, "node_modules", "iconoir", "icons", "solid");
const outDir = join(root, "src", "lib", "icons");

mkdirSync(outDir, { recursive: true });

function extractInner(svg) {
  return svg
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>/i, "")
    .trim();
}

const regFiles = readdirSync(regDir).filter((f) => f.endsWith(".svg")).sort();
const solidFiles = readdirSync(solidDir).filter((f) => f.endsWith(".svg")).sort();

const regularIcons = {};
const solidIcons = {};

for (const f of regFiles) {
  const name = f.replace(/\.svg$/, "");
  const raw = readFileSync(join(regDir, f), "utf8");
  regularIcons[name] = extractInner(raw);
}

for (const f of solidFiles) {
  const name = f.replace(/\.svg$/, "");
  const raw = readFileSync(join(solidDir, f), "utf8");
  solidIcons[name] = extractInner(raw);
}

const regularNames = Object.keys(regularIcons);
const solidNames = Object.keys(solidIcons);

const aliases = {
  // Navigation & Chevrons
  "chevron-down": "nav-arrow-down",
  "chevron-up": "nav-arrow-up",
  "chevron-left": "nav-arrow-left",
  "chevron-right": "nav-arrow-right",
  "chevrons-up-down": "arrow-separate-vertical",
  "chevrons-left-right": "arrow-separate",
  "caret-down": "nav-arrow-down",
  "caret-up": "nav-arrow-up",
  "caret-left": "nav-arrow-left",
  "caret-right": "nav-arrow-right",
  
  // Theme & Celestial
  sun: "sun-light",
  moon: "half-moon",
  "moon-star": "moon-sat",
  sparkles: "sparks",
  sparkle: "spark",
  star: "star",
  
  // System / UI
  x: "xmark",
  close: "xmark",
  "check-mark": "check",
  "trash-2": "trash",
  delete: "trash",
  ellipsis: "more-horiz",
  more: "more-horiz",
  "more-vertical": "more-vert",
  settings: "settings",
  "settings-2": "settings",
  "panel-left": "sidebar-collapse",
  "panel-right": "sidebar-expand",
  layers: "view-grid",
  frame: "view-grid",
  "square-terminal": "terminal-tag",
  terminal: "terminal",
  bot: "cpu",
  robot: "cpu",
  chip: "electronics-chip",
  "electronics-chip": "electronics-chip",
  card: "credit-card",
  "credit-card": "credit-card",
  "chart-pie": "stats-report",
  "pie-chart": "stats-report",
  "life-buoy": "lifebelt",
  orbit: "planet-sat",
  zap: "flash",
  lightning: "flash",
  file: "page",
  "file-text": "page-edit",
  "book-open": "open-book",
  share: "share-ios",
  signal: "antenna-signal",
  triangle: "triangle-flag",
  magnifying: "search",
  magnifier: "search",
  person: "user",
  account: "user",
};

function categorizeIcon(name) {
  if (name.includes("arrow") || name.includes("nav-") || name.includes("collapse") || name.includes("expand") || name.includes("sort") || name.includes("direction") || name.includes("route") || name.includes("corner") || name.includes("u-turn")) {
    return "arrows";
  }
  if (name.includes("code") || name.includes("git") || name.includes("database") || name.includes("terminal") || name.includes("cpu") || name.includes("server") || name.includes("chip") || name.includes("component") || name.includes("data") || name.includes("wifi") || name.includes("network") || name.includes("api") || name.includes("webhook") || name.includes("usb") || name.includes("bluetooth") || name.includes("antenna") || name.includes("binary") || name.includes("bug")) {
    return "development";
  }
  if (name.includes("design") || name.includes("palette") || name.includes("color") || name.includes("crop") || name.includes("brush") || name.includes("align") || name.includes("grid") || name.includes("layout") || name.includes("layer") || name.includes("bezier") || name.includes("ruler") || name.includes("magic-wand") || name.includes("transform") || name.includes("mask") || name.includes("vector") || name.includes("text") || name.includes("font") || name.includes("view-") || name.includes("adobe-") || name.includes("figma")) {
    return "design";
  }
  if (name.includes("media") || name.includes("music") || name.includes("video") || name.includes("play") || name.includes("pause") || name.includes("camera") || name.includes("mic") || name.includes("speaker") || name.includes("sound") || name.includes("volume") || name.includes("headphone") || name.includes("podcast") || name.includes("record") || name.includes("film") || name.includes("album") || name.includes("radio") || name.includes("disc") || name.includes("airplay") || name.includes("cast")) {
    return "media";
  }
  if (name.includes("chat") || name.includes("mail") || name.includes("message") || name.includes("send") || name.includes("share") || name.includes("phone") || name.includes("call") || name.includes("inbox") || name.includes("user") || name.includes("group") || name.includes("community") || name.includes("at-sign") || name.includes("envelope") || name.includes("telegram") || name.includes("twitter") || name.includes("github") || name.includes("linkedin") || name.includes("discord") || name.includes("instagram") || name.includes("facebook") || name.includes("whatsapp") || name.includes("threads") || name.includes("tiktok") || name.includes("youtube")) {
    return "communication";
  }
  if (name.includes("lock") || name.includes("shield") || name.includes("key") || name.includes("badge") || name.includes("security") || name.includes("fingerprint") || name.includes("face-id") || name.includes("check") || name.includes("verified") || name.includes("protect") || name.includes("privacy") || name.includes("safe") || name.includes("password") || name.includes("scan") || name.includes("incognito") || name.includes("copyright")) {
    return "security";
  }
  if (name.includes("card") || name.includes("wallet") || name.includes("shopping") || name.includes("cart") || name.includes("bag") || name.includes("coin") || name.includes("dollar") || name.includes("euro") || name.includes("pound") || name.includes("yen") || name.includes("cash") || name.includes("bank") || name.includes("receipt") || name.includes("invoice") || name.includes("discount") || name.includes("tag") || name.includes("price") || name.includes("crypto") || name.includes("bitcoin") || name.includes("eth") || name.includes("stripe") || name.includes("mastercard") || name.includes("visa")) {
    return "finance";
  }
  if (name.includes("sun") || name.includes("moon") || name.includes("cloud") || name.includes("rain") || name.includes("wind") || name.includes("snow") || name.includes("drop") || name.includes("fire") || name.includes("leaf") || name.includes("tree") || name.includes("flower") || name.includes("planet") || name.includes("spark") || name.includes("flash") || name.includes("earth") || name.includes("globe") || name.includes("sea") || name.includes("temperature") || name.includes("eco") || name.includes("ecology")) {
    return "weather";
  }
  if (name.includes("laptop") || name.includes("phone") || name.includes("tablet") || name.includes("monitor") || name.includes("tv") || name.includes("watch") || name.includes("printer") || name.includes("keyboard") || name.includes("mouse") || name.includes("battery") || name.includes("plug") || name.includes("socket") || name.includes("drone") || name.includes("gamepad") || name.includes("hard-drive") || name.includes("server") || name.includes("modem") || name.includes("router") || name.includes("scanner") || name.includes("vr-symbol") || name.includes("glasses")) {
    return "devices";
  }
  if (name.includes("menu") || name.includes("search") || name.includes("settings") || name.includes("filter") || name.includes("sliders") || name.includes("more-") || name.includes("dots") || name.includes("folder") || name.includes("page") || name.includes("doc") || name.includes("file") || name.includes("home") || name.includes("trash") || name.includes("bookmark") || name.includes("calendar") || name.includes("clock") || name.includes("timer") || name.includes("pin") || name.includes("map") || name.includes("compass") || name.includes("bell") || name.includes("alert") || name.includes("warning") || name.includes("info") || name.includes("question") || name.includes("help") || name.includes("refresh") || name.includes("restart") || name.includes("power") || name.includes("toggle") || name.includes("switch") || name.includes("tab") || name.includes("window") || name.includes("eye") || name.includes("download") || name.includes("upload") || name.includes("link") || name.includes("copy") || name.includes("cut") || name.includes("paste") || name.includes("plus") || name.includes("minus") || name.includes("xmark")) {
    return "system";
  }
  return "general";
}

const categories = {
  all: { label: "All Icons", description: "Complete Iconoir library (1671 total)", icons: regularNames },
  arrows: { label: "Arrows & Nav", description: "Navigation, directional & motion glyphs", icons: [] },
  system: { label: "System & UI", description: "Core UI controls, actions & containers", icons: [] },
  development: { label: "Dev & Tech", description: "Code, databases, servers & electronics", icons: [] },
  design: { label: "Design & Tools", description: "Vector, alignment, palette & creative tools", icons: [] },
  media: { label: "Media & Audio", description: "Player, camera, sound & playback controls", icons: [] },
  communication: { label: "Communication", description: "Chat, messaging, mail & social platforms", icons: [] },
  security: { label: "Security & Auth", description: "Shields, locks, keys & verification badges", icons: [] },
  finance: { label: "Commerce & Pay", description: "Cards, payments, coins, receipts & orders", icons: [] },
  devices: { label: "Devices & Hardware", description: "Screens, hardware, peripherals & power", icons: [] },
  weather: { label: "Nature & Space", description: "Celestial, weather, earth & organic glyphs", icons: [] },
  solid: { label: "Solid Variant", description: "Filled high-contrast icon variants", icons: solidNames },
};

for (const name of regularNames) {
  const cat = categorizeIcon(name);
  if (categories[cat]) {
    categories[cat].icons.push(name);
  } else {
    categories.system.icons.push(name);
  }
}

const typesCode = [
  "/* AUTOGENERATED BY scripts/generate-icons.mjs - DO NOT EDIT DIRECTLY */",
  "/* Iconoir - 1600+ unique SVG icons on a 24x24 grid (https://iconoir.com) */",
  "",
  "export type IconoirRegularName =",
  regularNames.map((n) => "  | '" + n + "'").join("\n") + ";",
  "",
  "export type IconoirSolidName =",
  solidNames.map((n) => "  | '" + n + "'").join("\n") + ";",
  "",
  "export type IconoirAlias =",
  Object.keys(aliases).map((a) => "  | '" + a + "'").join("\n") + ";",
  "",
  "export type IconName =",
  "  | IconoirRegularName",
  "  | IconoirSolidName",
  "  | IconoirAlias",
  "  | (string & {});",
  "",
  "export interface IconProps {",
  "  name: IconName;",
  "  size?: number | string;",
  "  strokeWidth?: number;",
  "  solid?: boolean;",
  "  class?: string;",
  "  title?: string;",
  "  ariaLabel?: string;",
  "  ariaHidden?: boolean;",
  "  role?: string;",
  "}",
  "",
  "export type IconCategoryKey =",
  Object.keys(categories).map((c) => "  | '" + c + "'").join("\n") + ";",
  ""
].join("\n");

writeFileSync(join(outDir, "types.ts"), typesCode, "utf8");

const registryCode = [
  "/* AUTOGENERATED BY scripts/generate-icons.mjs - DO NOT EDIT DIRECTLY */",
  "/* Iconoir - 1600+ unique SVG icons on a 24x24 grid (https://iconoir.com) */",
  "",
  "import type { IconoirRegularName, IconoirSolidName, IconoirAlias, IconCategoryKey } from './types';",
  "",
  "export const iconoirRegularCount = " + regularNames.length + ";",
  "export const iconoirSolidCount = " + solidNames.length + ";",
  "export const iconoirTotalCount = " + (regularNames.length + solidNames.length) + ";",
  "",
  "export const iconoirAliases: Record<string, string> = " + JSON.stringify(aliases, null, 2) + ";",
  "",
  "export const iconoirRegularNames: IconoirRegularName[] = " + JSON.stringify(regularNames, null, 2) + ";",
  "",
  "export const iconoirSolidNames: IconoirSolidName[] = " + JSON.stringify(solidNames, null, 2) + ";",
  "",
  "export const iconoirCategories: Record<",
  "  IconCategoryKey,",
  "  { label: string; description: string; icons: string[] }",
  "> = " + JSON.stringify(categories, null, 2) + ";",
  "",
  "export const iconoirRegular: Record<string, string> = " + JSON.stringify(regularIcons, null, 2) + ";",
  "",
  "export const iconoirSolid: Record<string, string> = " + JSON.stringify(solidIcons, null, 2) + ";",
  "",
  "/**",
  " * Resolves an icon name or alias to its canonical Iconoir name.",
  " */",
  "export function resolveIconName(name: string): string {",
  "  if (!name) return '';",
  "  const trimmed = name.trim().toLowerCase();",
  "  if (iconoirAliases[trimmed]) {",
  "    return iconoirAliases[trimmed];",
  "  }",
  "  return trimmed;",
  "}",
  "",
  "/**",
  " * Retrieves the inner SVG path definition for a given icon name.",
  " */",
  "export function getIconoirSvg(name: string, solid: boolean = false): string | null {",
  "  const resolved = resolveIconName(name);",
  "  if (solid && iconoirSolid[resolved]) {",
  "    return iconoirSolid[resolved];",
  "  }",
  "  if (iconoirRegular[resolved]) {",
  "    return iconoirRegular[resolved];",
  "  }",
  "  if (iconoirSolid[resolved]) {",
  "    return iconoirSolid[resolved];",
  "  }",
  "  return null;",
  "}",
  "",
  "/**",
  " * Checks if an icon exists in the Iconoir library.",
  " */",
  "export function hasIconoirIcon(name: string, solid: boolean = false): boolean {",
  "  const resolved = resolveIconName(name);",
  "  if (solid && iconoirSolid[resolved]) return true;",
  "  return Boolean(iconoirRegular[resolved] || iconoirSolid[resolved]);",
  "}",
  ""
].join("\n");

writeFileSync(join(outDir, "registry.ts"), registryCode, "utf8");

const indexCode = [
  "/* Iconoir Icon System */",
  "export * from './types';",
  "export * from './registry';",
  ""
].join("\n");

writeFileSync(join(outDir, "index.ts"), indexCode, "utf8");

console.log("Generated Iconoir icons registry & types successfully!");
console.log("- Regular Icons: " + regularNames.length);
console.log("- Solid Icons: " + solidNames.length);
console.log("- Total: " + (regularNames.length + solidNames.length));
