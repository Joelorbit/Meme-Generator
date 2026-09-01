<script lang="ts">
  import Icon from '../primitives/Icon.svelte';
  import { iconRow } from '../../data/landing';
</script>

<section id="system" class="bento shell">
  <p class="caption bento__label">The system</p>
  <h2 class="heading heading-lg bento__head">Four pillars.</h2>

  <div class="bento__grid">
    <article class="tile tile--tokens">
      <span class="tile__idx mono-xs">01</span>
      <span class="tile__icon"><Icon name="folder" size={20} strokeWidth={1.5} /></span>
      <h3 class="heading heading-sm tile__title">The contract</h3>
      <p class="body-sm tile__copy">
        Every value resolves in one file. No hex, no drift — grep-verified.
      </p>
      <div class="tile__foot mono-xs">tokens.css</div>
    </article>

    <article class="tile tile--type">
      <span class="tile__idx mono-xs">02</span>
      <span class="tile__icon"><Icon name="book-open" size={20} strokeWidth={1.5} /></span>
      <h3 class="heading heading-sm tile__title">Engineered type</h3>
      <p class="body-sm tile__copy">
        Outfit display, Lexend body. 1.333x modular scale. Rhythm from type, not margins.
      </p>
      <div class="tile__foot mono-xs">display → caption</div>
    </article>

    <article class="tile tile--motion">
      <span class="tile__idx mono-xs">03</span>
      <span class="tile__icon tile__icon--spin"><Icon name="chevrons-up-down" size={20} strokeWidth={1.5} /></span>
      <h3 class="heading heading-sm tile__title">Fast motion</h3>
      <p class="body-sm tile__copy">
        100 / 160 / 240ms. Springs, not tween. Motion reports state, never decorates.
      </p>
      <div class="tile__foot mono-xs">cubic-bezier · 0.16, 1, 0.3, 1</div>
    </article>

    <article id="icons" class="tile tile--icons">
      <div class="tile__head">
        <span class="tile__idx mono-xs">04</span>
        <span class="mono-xs tile__count">1671 glyphs</span>
      </div>
      <h3 class="heading heading-sm tile__title">Iconoir System</h3>
      <p class="body-sm tile__copy">
        1600+ open-source SVG icons on a 24x24 grid with 1.5px stroke weight. A single typed primitive.
      </p>
      <div class="tile__glyphs">
        {#each iconRow as name, i}
          <span class="tile__glyph" style={`--i:${i}`}>
            <Icon name={name} size={22} strokeWidth={1.5} />
          </span>
        {/each}
      </div>
    </article>

    <article id="tokens" class="tile tile--wall">
      <span class="tile__idx mono-xs">05</span>
      <span class="tile__icon"><Icon name="frame" size={20} strokeWidth={1.5} /></span>
      <h3 class="heading heading-sm tile__title">Film grain texture</h3>
      <p class="body-sm tile__copy">
        Skit-inspired turbulence grain. The page breathes, not shouts.
      </p>
      <div class="tile__patterns">
        <span class="tile__pattern pattern-dots"></span>
        <span class="tile__pattern pattern-plus"></span>
        <span class="tile__pattern pattern-grid"></span>
      </div>
      <div class="tile__foot mono-xs">.. ++ ## · noise 2.5%</div>
    </article>
  </div>
</section>

<style>
  .bento {
    padding-block: var(--space-11);
  }

  .bento__label {
    color: var(--accent);
  }

  .bento__head {
    margin: var(--space-3) 0 var(--space-8);
    color: var(--text-primary);
  }

  .bento__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'tokens type motion'
      'icons icons wall';
    gap: var(--space-4);
  }

  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 280px;
    padding: var(--space-6);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-1);
    overflow: hidden;
    transition:
      border-color var(--dur-3) var(--ease-standard),
      transform var(--dur-3) var(--ease-standard),
      box-shadow var(--dur-3) var(--ease-standard);
  }

  .tile:hover {
    border-color: var(--line-strong);
    transform: translateY(-3px);
    box-shadow: var(--shadow-2);
  }

  .tile--tokens { grid-area: tokens; }
  .tile--type { grid-area: type; }
  .tile--motion { grid-area: motion; }
  .tile--icons { grid-area: icons; min-height: 320px; }
  .tile--wall { grid-area: wall; }

  .tile__patterns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
    margin-top: var(--space-5);
  }

  .tile__pattern {
    height: 52px;
    background-color: var(--surface-pressed);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    transition: transform var(--dur-3) var(--ease-standard), border-color var(--dur-3) var(--ease-standard);
  }

  .tile__pattern:hover {
    transform: translateY(-2px);
    border-color: var(--line-strong);
  }

  .tile__idx { color: var(--text-faint); }

  .tile__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tile__count { color: var(--text-faint); }

  .tile__icon {
    display: grid;
    width: 40px;
    height: 40px;
    margin-top: var(--space-6);
    place-items: center;
    border-radius: var(--radius-md);
    background: var(--accent-soft);
    color: var(--accent);
  }

  .tile__icon--spin :global(svg) {
    animation: pulse 2.4s var(--ease-emphasis) infinite;
  }

  .tile__title {
    margin: var(--space-4) 0 0;
    color: var(--text-primary);
  }

  .tile__copy {
    margin: var(--space-2) 0 0;
    max-width: 34ch;
    color: var(--text-muted);
  }

  .tile__foot {
    margin-top: auto;
    padding-top: var(--space-5);
    color: var(--text-faint);
  }

  .tile__glyphs {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: var(--space-2);
    margin-top: var(--space-5);
  }

  .tile__glyph {
    display: grid;
    place-items: center;
    height: 52px;
    border: 1px solid var(--line-soft);
    border-radius: var(--radius-md);
    color: var(--text-muted);
    animation: float 5s var(--ease-emphasis) infinite;
    animation-delay: calc(var(--i) * 0.35s);
    transition: color var(--dur-2) var(--ease-standard);
  }

  .tile__glyph:hover {
    color: var(--accent);
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      box-shadow: 0 0 0 0 var(--accent-soft);
    }
    50% {
      opacity: 0.5;
      box-shadow: 0 0 0 6px transparent;
    }
  }

  @media (max-width: 1000px) {
    .bento__grid {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'tokens type'
        'motion motion'
        'icons icons'
        'wall wall';
    }
  }

  @media (max-width: 600px) {
    .bento__grid {
      grid-template-columns: 1fr;
      grid-template-areas:
        'tokens' 'type' 'motion' 'icons' 'wall';
    }
    .tile__glyphs { grid-template-columns: repeat(4, 1fr); }
  }
</style>
