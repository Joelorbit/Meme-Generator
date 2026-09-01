<script lang="ts">
  import Badge from "../ui/Badge.svelte";
  import Button from "../ui/Button.svelte";
  import Input from "../ui/Input.svelte";
  import Icon from "../primitives/Icon.svelte";
  import {
    iconoirRegularNames,
    iconoirSolidNames,
    iconoirCategories,
    iconoirTotalCount,
    iconoirRegularCount,
    iconoirSolidCount,
    getIconoirSvg,
    resolveIconName,
    type IconCategoryKey,
    type IconName,
  } from "../../icons";

  let searchQuery = $state<string>("");
  let selectedCategory = $state<IconCategoryKey>("all");
  let iconSize = $state<number>(24);
  let strokeWidth = $state<number>(1.5);
  let isSolid = $state<boolean>(false);
  let selectedIcon = $state<string>("spark");
  let copiedStatus = $state<string>("");

  // Pagination / Chunking for 60fps rendering of 1600+ icons
  let currentPage = $state<number>(1);
  const pageSize = 96;

  // Change category handler
  function setCategory(cat: IconCategoryKey) {
    selectedCategory = cat;
    currentPage = 1;
    if (cat === "solid") {
      isSolid = true;
    }
  }

  // Active icon list based on category & search
  let baseIcons = $derived.by(() => {
    if (selectedCategory === "solid" || isSolid) {
      return iconoirSolidNames;
    }
    if (selectedCategory === "all") {
      return iconoirRegularNames;
    }
    return iconoirCategories[selectedCategory]?.icons || iconoirRegularNames;
  });

  let filteredIcons = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return baseIcons;
    return baseIcons.filter((name) => name.toLowerCase().includes(q));
  });

  let totalPages = $derived(Math.max(1, Math.ceil(filteredIcons.length / pageSize)));

  let paginatedIcons = $derived.by(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIcons.slice(start, start + pageSize);
  });

  function copyText(text: string, type: string) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    copiedStatus = type;
    setTimeout(() => {
      copiedStatus = "";
    }, 2000);
  }

  function getSvelteSnippet(name: string, solid: boolean) {
    if (solid) {
      return `<Icon name="${name}" size={${iconSize}} solid />`;
    }
    return `<Icon name="${name}" size={${iconSize}} strokeWidth={${strokeWidth}} />`;
  }

  function getRawSvg(name: string, solid: boolean) {
    const inner = getIconoirSvg(name, solid) || "";
    if (solid) {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    }
    return `<svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }

  const categoryEntries = (Object.keys(iconoirCategories) as IconCategoryKey[]).map((key) => ({
    key,
    ...iconoirCategories[key],
    count: key === "all" ? iconoirTotalCount : iconoirCategories[key].icons.length,
  }));
</script>

<section id="icons" class="styleguide shell">
  <div class="styleguide__header">
    <div class="styleguide__badge-row">
      <Badge tone="accent">Iconoir Open-Source Library</Badge>
      <span class="mono-xs badge-count">{iconoirTotalCount} Glyphs ({iconoirRegularCount} Regular + {iconoirSolidCount} Solid)</span>
      <a
        href="https://iconoir.com"
        target="_blank"
        rel="noreferrer"
        class="mono-xs iconoir-link"
      >
        iconoir.com →
      </a>
    </div>
    <h2 class="heading heading-lg">Official Iconoir Icon System</h2>
    <p class="body-lg styleguide__desc">
      Iconoir is an open-source library with 1600+ unique SVG icons, designed on a precision 24×24 pixels grid. Fully typed, zero-runtime overhead, and available via the <code>iconoir</code> npm package.
    </p>
  </div>

  <!-- Category Filter Pills -->
  <div class="category-scroll">
    <div class="category-pills">
      {#each categoryEntries as cat}
        <button
          type="button"
          class="category-pill"
          class:active={selectedCategory === cat.key}
          onclick={() => setCategory(cat.key)}
        >
          <span>{cat.label}</span>
          <span class="pill-count">{cat.count}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Studio Controls -->
  <div class="controls-card">
    <div class="controls-grid">
      <div class="search-box">
        <Input
          placeholder="Search 1600+ Iconoir icons (e.g. arrow, settings, mail, user, check)..."
          id="icon-search"
          bind:value={searchQuery}
          oninput={() => (currentPage = 1)}
        />
      </div>

      <div class="sliders-row">
        <div class="slider-item">
          <div class="slider-label">
            <span class="caption">Size: {iconSize}px</span>
          </div>
          <input type="range" min="16" max="48" step="2" bind:value={iconSize} class="range-input" />
        </div>

        <div class="slider-item">
          <div class="slider-label">
            <span class="caption">Stroke: {strokeWidth}px</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.25"
            bind:value={strokeWidth}
            disabled={isSolid}
            class="range-input"
          />
        </div>

        <button
          type="button"
          class="variant-toggle"
          class:active={isSolid}
          onclick={() => {
            isSolid = !isSolid;
            currentPage = 1;
          }}
        >
          <span class="mono-xs">{isSolid ? "Solid" : "Regular"}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Active Selected Preview Bar -->
  {#if selectedIcon}
    <div class="inspector-bar">
      <div class="inspector-preview">
        <div class="inspector-icon-wrap" class:solid-wrap={isSolid}>
          <Icon name={selectedIcon} size={36} strokeWidth={strokeWidth} solid={isSolid} />
        </div>
        <div class="inspector-info">
          <span class="heading-sm mono">{selectedIcon}</span>
          <span class="mono-xs" style="color:var(--text-muted)">
            24×24 Grid · {isSolid ? "Solid Variant" : strokeWidth + "px Stroke"} · <code>npm i iconoir</code>
          </span>
        </div>
      </div>

      <div class="inspector-actions">
        <Button
          variant="secondary"
          size="sm"
          onclick={() => copyText(getSvelteSnippet(selectedIcon, isSolid), "Svelte Code Copied!")}
        >
          <Icon name="code" size={14} />
          {copiedStatus === "Svelte Code Copied!" ? "Copied Svelte!" : "Copy <Icon />"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onclick={() => copyText(getRawSvg(selectedIcon, isSolid), "Raw SVG Copied!")}
        >
          <Icon name="page" size={14} />
          {copiedStatus === "Raw SVG Copied!" ? "Copied SVG!" : "Copy SVG"}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onclick={() => copyText(selectedIcon, "Icon Name Copied!")}
        >
          <Icon name="copy" size={14} />
          {copiedStatus === "Icon Name Copied!" ? "Copied Name!" : "Copy Name"}
        </Button>
      </div>
    </div>
  {/if}

  <!-- Stats & Result Counter -->
  <div class="results-bar">
    <span class="mono-xs" style="color:var(--text-muted)">
      Showing {paginatedIcons.length} of {filteredIcons.length} icons
      {#if searchQuery} for "{searchQuery}"{/if}
    </span>
    {#if totalPages > 1}
      <div class="pagination-controls">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onclick={() => (currentPage = Math.max(1, currentPage - 1))}
        >
          <Icon name="nav-arrow-left" size={14} /> Prev
        </Button>
        <span class="mono-xs page-indicator">{currentPage} / {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
        >
          Next <Icon name="nav-arrow-right" size={14} />
        </Button>
      </div>
    {/if}
  </div>

  <!-- Icon Grid -->
  <div class="icon-grid">
    {#each paginatedIcons as name}
      <button
        class="icon-card"
        class:selected={selectedIcon === name}
        onclick={() => (selectedIcon = name)}
        title={name}
      >
        <div class="icon-frame">
          <Icon name={name} size={iconSize} strokeWidth={strokeWidth} solid={isSolid} />
        </div>
        <span class="mono-xs icon-name">{name}</span>
      </button>
    {/each}
  </div>

  {#if filteredIcons.length === 0}
    <div class="empty-icons">
      <Icon name="search" size={32} />
      <p class="body-md">No icons matching "{searchQuery}" in {iconoirCategories[selectedCategory]?.label || "selected category"}</p>
      <Button variant="secondary" size="sm" onclick={() => { searchQuery = ""; selectedCategory = "all"; }}>
        Reset Filters
      </Button>
    </div>
  {/if}

  <!-- Bottom Pagination if multi-page -->
  {#if totalPages > 1 && paginatedIcons.length > 0}
    <div class="bottom-pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onclick={() => {
          currentPage = Math.max(1, currentPage - 1);
          document.getElementById("icons")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <Icon name="nav-arrow-left" size={14} /> Previous 96 icons
      </Button>
      <span class="mono-xs">Page {currentPage} of {totalPages}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onclick={() => {
          currentPage = Math.min(totalPages, currentPage + 1);
          document.getElementById("icons")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Next 96 icons <Icon name="nav-arrow-right" size={14} />
      </Button>
    </div>
  {/if}
</section>

<style>
  .styleguide {
    padding-block: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .styleguide__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .styleguide__badge-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .badge-count {
    color: var(--text-muted);
    background: var(--surface-elevated);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line-soft);
  }

  .iconoir-link {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }
  .iconoir-link:hover {
    text-decoration: underline;
  }

  .styleguide__desc {
    color: var(--text-secondary);
    max-width: 68ch;
  }

  .styleguide__desc code {
    font-family: var(--font-mono, monospace);
    background: var(--surface-elevated);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line-soft);
    color: var(--accent);
  }

  .category-scroll {
    overflow-x: auto;
    padding-bottom: var(--space-2);
  }

  .category-pills {
    display: flex;
    gap: var(--space-2);
    min-width: max-content;
  }

  .category-pill {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 6px 12px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line-soft);
    background: var(--surface);
    color: var(--text-muted);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all var(--dur-2) var(--ease-standard);
  }

  .category-pill:hover {
    border-color: var(--line-strong);
    color: var(--text-primary);
  }

  .category-pill.active {
    background: var(--surface-elevated);
    border-color: var(--accent);
    color: var(--accent);
    font-weight: 600;
  }

  .pill-count {
    font-size: 0.7rem;
    opacity: 0.7;
    background: var(--surface-pressed);
    padding: 1px 6px;
    border-radius: var(--radius-pill);
  }

  .controls-card {
    background: var(--surface);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .controls-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-5);
    align-items: center;
  }

  @media (max-width: 860px) {
    .controls-grid {
      grid-template-columns: 1fr;
    }
  }

  .sliders-row {
    display: flex;
    gap: var(--space-5);
    align-items: center;
    flex-wrap: wrap;
  }

  .slider-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 120px;
  }

  .slider-label {
    display: flex;
    justify-content: space-between;
    color: var(--text-muted);
  }

  .range-input {
    accent-color: var(--accent);
    cursor: pointer;
  }

  .variant-toggle {
    display: grid;
    place-items: center;
    padding: 6px 14px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--line-strong);
    background: var(--surface-elevated);
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--dur-2) var(--ease-standard);
  }

  .variant-toggle:hover {
    border-color: var(--accent);
    color: var(--text-primary);
  }

  .variant-toggle.active {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--surface);
    font-weight: 600;
  }

  .inspector-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-6);
    background: var(--surface-elevated);
    border: 1px solid var(--accent);
    border-radius: var(--radius-lg);
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .inspector-preview {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .inspector-icon-wrap {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    background: var(--surface);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    color: var(--accent);
  }

  .solid-wrap {
    background: var(--surface-pressed);
  }

  .inspector-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .inspector-actions {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .results-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: var(--space-1);
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .page-indicator {
    color: var(--text-muted);
    padding-inline: var(--space-2);
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
    gap: var(--space-3);
  }

  .icon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-2);
    border: 1px solid var(--line-soft);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--text-primary);
    cursor: pointer;
    transition: color var(--dur-2) var(--ease-standard), border-color var(--dur-2) var(--ease-standard), transform var(--dur-1) var(--ease-standard);
  }

  .icon-card:hover {
    color: var(--accent);
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .icon-card.selected {
    border-color: var(--accent);
    background: var(--surface-elevated);
    color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .icon-frame {
    display: grid;
    place-items: center;
    min-height: 48px;
  }

  .icon-name {
    color: var(--text-muted);
    text-align: center;
    word-break: break-all;
    font-size: 0.72rem;
    max-width: 100%;
    padding-inline: 4px;
  }

  .empty-icons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-10);
    color: var(--text-muted);
    gap: var(--space-3);
  }

  .bottom-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-4);
    padding-block: var(--space-4);
  }
</style>
