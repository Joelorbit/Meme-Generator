<script lang="ts">
  import Icon from '../primitives/Icon.svelte';
  import Button from '../ui/Button.svelte';
  import { iconRow, ramp } from '../../data/landing';
</script>

<section class="hero shell">
  <div class="hero__body">
    <p class="caption hero__eyebrow">EyuTaste — Design System</p>
    <h1 class="display hero__title">
      Taste,<br />
      <em class="display--emphasis">tuned.</em>
    </h1>
    <p class="body-lg hero__sub">
      Tactile painted-wall canvas, fine digital noise grain, official Iconoir 1600+ SVG icon system, engineered type.
    </p>
    <div class="hero__cta">
      <Button href="#components" size="lg">Explore Components</Button>
      <Button href="https://github.com/Joelorbit/Mytheme" target="_blank" external variant="secondary" size="lg">GitHub</Button>
    </div>
    <p class="mono-xs hero__meta">Eyu palette · Iconoir 1600+ glyph pack · 24px grid · 1.5 stroke</p>
  </div>

  <div class="specimen" aria-hidden="true">
    <div class="specimen__panel specimen__panel--type">
      <div class="specimen__row">
        <span class="mono-xs">type — outfit + lexend</span>
        <span class="specimen__pulse"></span>
      </div>
      <div class="specimen__aa">Aa</div>
      <div class="specimen__scale">
        <span class="mono-xs">display 7.5</span>
        <span class="mono-xs">heading 2.4</span>
        <span class="mono-xs">body 1.0</span>
      </div>
    </div>
    <div class="specimen__panel specimen__panel--tokens">
      <div class="specimen__row">
        <span class="mono-xs">neutral ramp + energy</span>
        <span class="mono-xs">green-grey · cream · emerald</span>
      </div>
      <div class="specimen__ramp">
        {#each ramp as c}
          <span class="specimen__swatch" style="background:{c}"></span>
        {/each}
        <span class="specimen__swatch specimen__swatch--accent"></span>
        <span class="specimen__swatch specimen__swatch--complement"></span>
      </div>
    </div>
    <div class="specimen__panel specimen__panel--icons">
      <div class="specimen__row">
        <span class="mono-xs">Iconoir — stroke 1.5</span>
        <span class="mono-xs">24px grid</span>
      </div>
      <div class="specimen__icons">
        {#each iconRow as name}
          <span class="specimen__icon">
            <Icon name={name} size={18} strokeWidth={1.5} />
          </span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: var(--space-9);
    align-items: center;
    padding-block: clamp(3rem, 8vw, 6rem);
  }

  .hero__eyebrow {
    color: var(--accent);
  }

  .hero__title {
    margin: var(--space-5) 0 0;
    font-size: clamp(3.4rem, 9vw, var(--display-lg));
    line-height: 0.96;
  }

  .hero__sub {
    max-width: 46ch;
    margin: var(--space-5) 0 0;
    color: var(--text-muted);
  }

  .hero__cta {
    display: flex;
    gap: var(--space-4);
    margin: var(--space-7) 0 0;
  }

  .hero__meta {
    margin: var(--space-4) 0 0;
    color: var(--text-faint);
  }

  .specimen {
    display: grid;
    gap: var(--space-4);
  }

  .specimen__panel {
    border: 1px solid var(--card-border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    padding: var(--space-5);
    box-shadow: var(--shadow-1);
    animation: float 7s var(--ease-emphasis) infinite;
  }

  .specimen__panel--tokens {
    animation-delay: -2.4s;
  }

  .specimen__panel--icons {
    animation-delay: -4.8s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  .specimen__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    color: var(--text-faint);
  }

  .specimen__pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2.4s var(--ease-emphasis) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      box-shadow: 0 0 0 0 var(--accent-soft);
    }
    50% {
      opacity: 0.5;
      box-shadow: 0 0 0 6px transparent;
    }
  }

  .specimen__aa {
    margin-top: var(--space-4);
    font-family: var(--font-display);
    font-size: clamp(4rem, 8vw, 6.5rem);
    line-height: 0.9;
    color: var(--text-primary);
  }

  .specimen__scale {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
    margin-top: var(--space-4);
    color: var(--text-muted);
  }

  .specimen__ramp {
    display: flex;
    gap: 6px;
    margin-top: var(--space-4);
  }

  .specimen__swatch {
    flex: 1;
    height: 44px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line-soft);
  }

  .specimen__swatch--accent {
    background: var(--accent);
    border-color: transparent;
  }

  .specimen__swatch--complement {
    background: var(--complement);
    border-color: transparent;
  }

  .specimen__icons {
    display: flex;
    gap: var(--space-4);
    margin-top: var(--space-4);
  }

  .specimen__icon {
    color: var(--text-muted);
    transition: color var(--dur-2) var(--ease-standard);
  }

  .specimen__icon:hover {
    color: var(--accent);
  }

  @media (max-width: 1000px) {
    .hero {
      grid-template-columns: 1fr;
      gap: var(--space-7);
    }
  }
</style>
