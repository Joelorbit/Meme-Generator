<script lang="ts">
  import { onMount } from 'svelte';
  import MemeEditor from './MemeEditor.svelte';
  import MemeLogo from './lib/components/primitives/MemeLogo.svelte';
  import { type ThemeMode, readStoredMode, applyTheme, toggleColorMode } from './lib/theme';
  import {
    Sun,
    Moon,
    Zap,
    Columns,
    ShieldCheck,
    Dices,
    ArrowRight,
    Sparkles
  } from '@lucide/svelte';
  import {
    allImageTemplates,
    type MemeTemplate
  } from './lib/templatesData';

  let mounted = $state(false);
  let activeMode = $state<ThemeMode>('dark');
  let currentRoute = $state<'/' | '/meme'>('/');
  let selectedTemplate = $state<MemeTemplate | null>(null);
  let isSurpriseRolling = $state(false);

  // Templates cache for instant 1-click surprise
  let allTemplatesCache = $state<MemeTemplate[]>([...allImageTemplates]);

  function syncRoute() {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash.includes('meme') || path === '/meme') {
      currentRoute = '/meme';
    } else {
      currentRoute = '/';
    }
  }

  onMount(async () => {
    activeMode = readStoredMode('dark');
    applyTheme('default', false, activeMode);
    mounted = true;

    syncRoute();
    window.addEventListener('hashchange', syncRoute);

    // Templates are immediately ready
    allTemplatesCache = [...allImageTemplates];
  });

  function handleThemeToggle() {
    activeMode = toggleColorMode(activeMode);
    applyTheme('default', true, activeMode);
  }

  function navigateTo(route: '/' | '/meme') {
    currentRoute = route;
    if (route === '/meme') {
      window.location.hash = '#/meme';
    } else {
      window.location.hash = '#/';
    }
  }

  function handleSurpriseMe() {
    isSurpriseRolling = true;
    if (allTemplatesCache.length === 0) {
      navigateTo('/meme');
      return;
    }
    const rand = allTemplatesCache[Math.floor(Math.random() * allTemplatesCache.length)];
    setTimeout(() => {
      isSurpriseRolling = false;
      selectedTemplate = rand;
      navigateTo('/meme');
    }, 250);
  }
</script>

<div class="app-shell" class:is-landing={currentRoute === '/'}>
  <!-- Shared Clean Navbar (No glow) -->
  <header class="app-nav">
    <div class="nav-inner">
      <button class="nav-brand" onclick={() => navigateTo('/')} title="MemeStudio Home">
        <div class="brand-icon">
          <MemeLogo size={20} class="brand-logo" />
        </div>
        <span class="brand-name">MemeStudio</span>
      </button>

      <div class="nav-actions">
        {#if currentRoute === '/'}
          <button class="nav-cta-btn" onclick={() => navigateTo('/meme')}>
            <span>Start Cooking</span>
            <ArrowRight size={14} />
          </button>
        {:else}
          <button class="nav-home-btn" onclick={() => navigateTo('/')}>
            <span>Home</span>
          </button>
        {/if}

        <a
          href="https://github.com/Joelorbit/Meme-Generator"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-icon-btn"
          title="GitHub Repository"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            ></path>
          </svg>
        </a>

        <button
          class="nav-icon-btn"
          onclick={handleThemeToggle}
          aria-label="Toggle Theme"
          title="Toggle Light/Dark Theme"
        >
          {#if mounted && activeMode === 'dark'}
            <Sun size={15} strokeWidth={2} />
          {:else}
            <Moon size={15} strokeWidth={2} />
          {/if}
        </button>
      </div>
    </div>
  </header>

  <!-- ROUTE 1: SINGLE-PAGE NON-SCROLLABLE LANDING -->
  {#if currentRoute === '/'}
    <main class="landing-viewport">
      <div class="landing-content">
        <!-- Flat Trollface Icon (No Glow) -->
        <div class="flat-logo-box">
          <MemeLogo size={48} class="flat-troll-svg" />
        </div>

        <!-- Clean Pill Badge -->
        <div class="flat-badge">
          <Zap size={13} class="icon-accent" />
          <span>high-velocity meme forge</span>
        </div>

        <!-- Headline & Tagline -->
        <h1 class="landing-title">
          welcome to my meme shit.
        </h1>

        <p class="landing-desc">
          the fastest way to slap text on cursed images, cook dual-panel brainrot, and farm internet points. 100% free, zero signups, no watermarks, no corporate nonsense.
        </p>

        <!-- Action CTAs -->
        <div class="landing-btns">
          <button class="btn-primary" onclick={() => navigateTo('/meme')}>
            <span>Start Cooking</span>
            <ArrowRight size={15} />
          </button>

          <button class="btn-secondary" onclick={() => navigateTo('/meme')} title="Browse 1,300+ Real Meme Canvases">
            <Sparkles size={15} class="icon-accent" />
            <span>1,300+ Templates</span>
          </button>

          <button class="btn-secondary" onclick={handleSurpriseMe} title="Surprise Me with a Random Meme">
            <Dices size={15} class={isSurpriseRolling ? 'spin' : ''} />
            <span>1-Click Surprise Me</span>
          </button>
        </div>

        <!-- Feature Chips (No Emojis, Real System Icons, Flat) -->
        <div class="pills-row">
          <div class="pill-item">
            <Zap size={13} class="icon-accent" />
            <span>0ms Lag Canvas</span>
          </div>
          <span class="pill-sep">•</span>
          <div class="pill-item">
            <Columns size={13} class="icon-accent" />
            <span>2 Pictures in 1 Canvas</span>
          </div>
          <span class="pill-sep">•</span>
          <div class="pill-item">
            <ShieldCheck size={13} class="icon-accent" />
            <span>We Don't Spy On Your Memes</span>
          </div>
          <span class="pill-sep">•</span>
          <div class="pill-item">
            <Dices size={13} class="icon-accent" />
            <span>1-Click Surprise Me</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Simple Clean Footer (Landing only) -->
    <footer class="app-foot">
      <div class="foot-inner">
        <span>Crafted with ❤️ • <a href="https://github.com/Joelorbit/Meme-Generator" target="_blank" rel="noopener noreferrer" class="foot-author">GitHub Repository</a></span>
      </div>
    </footer>

  <!-- ROUTE 2: THE MEME GENERATING & CANVAS EDITING PAGE -->
  {:else}
    <main class="meme-studio-view">
      <MemeEditor currentMode={activeMode} initialTemplate={selectedTemplate} />
    </main>
  {/if}
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background-color: var(--bg);
    font-family: var(--font-sans);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* Root Container - 100% compact single-page */
  .app-shell {
    height: 100vh;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    overflow: hidden;
  }

  /* Non-scrollable single-page viewport when on landing page */
  .app-shell.is-landing {
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  /* Header Navbar */
  .app-nav {
    flex-shrink: 0;
    height: 44px;
    border-bottom: 1px solid var(--line);
    background: var(--surface);
    display: flex;
    align-items: center;
  }

  .nav-inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: inherit;
    font: inherit;
  }

  .brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--radius-xs);
    background: var(--surface-elevated);
    border: 1px solid var(--line);
    color: var(--primary);
  }

  :global(.brand-logo) {
    color: var(--primary);
  }

  .brand-name {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--ink);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    height: 32px;
    padding: 0 0.8rem;
    border-radius: var(--radius-xs);
    background: var(--primary);
    border: 1px solid var(--primary);
    color: #ffffff;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .nav-cta-btn:hover {
    background: var(--primary-hover);
  }

  .nav-home-btn {
    display: inline-flex;
    align-items: center;
    height: 32px;
    padding: 0 0.75rem;
    border-radius: var(--radius-xs);
    background: var(--surface-elevated);
    border: 1px solid var(--line);
    color: var(--ink);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .nav-home-btn:hover {
    background: var(--surface-hover);
  }

  .nav-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text-secondary);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .nav-icon-btn:hover {
    background: var(--surface-hover);
    color: var(--ink);
  }

  /* Single Page Non-Scrollable Landing Viewport */
  .landing-viewport {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1.5rem;
    box-sizing: border-box;
    overflow: hidden;
  }

  .landing-content {
    max-width: 680px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.15rem;
  }

  /* Flat Trollface Box (No Glow) */
  .flat-logo-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 68px;
    border-radius: var(--radius-md);
    background: var(--surface);
    border: 1px solid var(--line-strong);
    color: var(--primary);
  }

  :global(.flat-troll-svg) {
    color: var(--primary);
  }

  .flat-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: var(--surface);
    border: 1px solid var(--line);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
  }

  :global(.icon-accent) {
    color: var(--primary);
  }

  .landing-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5.5vw, 3.4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.035em;
    margin: 0;
    color: var(--ink);
    text-wrap: balance;
  }

  .landing-desc {
    font-size: clamp(0.92rem, 1.8vw, 1.05rem);
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0;
    max-width: 580px;
  }

  .landing-btns {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.35rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.7rem 1.4rem;
    border-radius: var(--radius-sm);
    background: var(--primary);
    border: 1px solid var(--primary);
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background-color 0.15s ease;
  }

  .btn-primary:hover {
    background: var(--primary-hover);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.7rem 1.3rem;
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--line-strong);
    color: var(--ink);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background-color 0.15s ease;
  }

  .btn-secondary:hover {
    background: var(--surface-hover);
  }

  /* Feature Pills */
  .pills-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.85rem;
    font-size: 0.78rem;
    color: var(--text-muted);
    flex-wrap: wrap;
    justify-content: center;
  }

  .pill-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .pill-sep {
    opacity: 0.4;
  }

  /* Meme Studio View */
  .meme-studio-view {
    flex: 1;
    min-height: 0;
    height: calc(100vh - 44px);
    max-height: calc(100vh - 44px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Responsive Mobile Layout (Phones & Tablets) */
  @media (max-width: 900px) {
    .app-shell {
      height: auto;
      min-height: 100vh;
      max-height: none;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .app-shell.is-landing {
      height: auto;
      min-height: 100vh;
      max-height: none;
      overflow-y: auto;
    }

    .nav-inner {
      padding: 0 0.75rem;
    }

    .meme-studio-view {
      height: auto;
      min-height: calc(100vh - 44px);
      max-height: none;
      overflow: visible;
    }

    .landing-viewport {
      height: auto;
      min-height: calc(100vh - 44px - 48px);
      padding: 1.5rem 1rem;
      overflow-y: visible;
    }

    .landing-title {
      font-size: clamp(2rem, 9vw, 3rem);
    }

    .landing-btns {
      flex-direction: column;
      width: 100%;
      max-width: 320px;
    }

    .btn-primary, .btn-secondary {
      width: 100%;
      justify-content: center;
    }
  }

  /* Footer (Simple & Centered) */
  .app-foot {
    flex-shrink: 0;
    height: 48px;
    border-top: 1px solid var(--line);
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .foot-inner {
    font-size: 0.82rem;
    color: var(--text-muted);
  }

  .foot-author {
    color: var(--ink);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .foot-author:hover {
    color: var(--primary);
  }

  :global(.spin) {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
