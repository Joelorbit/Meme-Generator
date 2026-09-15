<script lang="ts">
  import Icon from '../primitives/Icon.svelte';
  import type { Snippet } from 'svelte';

  type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  type Size = 'sm' | 'md' | 'lg' | 'icon';

  const arrowSize: Record<Size, number> = { sm: 14, md: 15, lg: 16, icon: 16 };

  let {
    variant = 'primary',
    size = 'md',
    class: className = '',
    href,
    target,
    external = false,
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    onclick,
    children,
    ...rest
  }: {
    variant?: Variant;
    size?: Size;
    class?: string;
    href?: string;
    target?: string;
    external?: boolean;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit';
    onClick?: (event: MouseEvent) => void;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    [key: string]: any;
  } = $props();

  const busy = $derived(loading || disabled);
  const cls = $derived(`btn btn--${variant} btn--${size} ${className}`);
</script>

{#if href}
  <a
    {target}
    rel={external ? 'noreferrer' : undefined}
    class={cls}
    aria-disabled={busy}
    tabindex={busy ? -1 : undefined}
    href={busy ? undefined : href}
    {...rest}
  >
    {#if loading}<span class="btn__spinner" aria-hidden="true"></span>{/if}
    <span class="btn__label">{@render children?.()}</span>
    {#if external}<Icon name="arrow-up-right" size={arrowSize[size]} strokeWidth={1.8} />{/if}
  </a>
{:else}
  <button
    {type}
    class={cls}
    disabled={busy}
    onclick={onclick ?? onClick}
    aria-busy={loading}
    {...rest}
  >
    {#if loading}<span class="btn__spinner" aria-hidden="true"></span>{/if}
    <span class="btn__label">{@render children?.()}</span>
  </button>
{/if}

<style>
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-family: var(--font-sans);
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn:disabled {
    cursor: default;
  }

  .btn__label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Primary Button */
  .btn--primary {
    background: var(--primary);
    color: #ffffff;
  }

  .btn--primary:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn--primary:active:not(:disabled) {
    background: var(--primary);
    transform: translateY(1px);
  }

  /* Secondary Button */
  .btn--secondary {
    background: var(--surface);
    border-color: var(--line-strong);
    color: var(--ink);
  }

  .btn--secondary:hover:not(:disabled) {
    background: var(--surface-hover);
    transform: translateY(-1px);
  }

  .btn--secondary:active:not(:disabled) {
    background: var(--surface);
    transform: translateY(1px);
  }

  /* Outline Button */
  .btn--outline {
    border-color: var(--line-strong);
    background: transparent;
    color: var(--ink);
  }

  .btn--outline:hover:not(:disabled) {
    border-color: var(--primary);
    background: var(--surface-hover);
    color: var(--primary);
  }

  /* Ghost Button */
  .btn--ghost {
    background: transparent;
    color: var(--text-secondary);
  }

  .btn--ghost:hover:not(:disabled) {
    background: var(--surface-hover);
    color: var(--ink);
  }

  /* Danger Button */
  .btn--danger {
    background: transparent;
    border-color: var(--color-destructive);
    color: var(--color-destructive);
  }

  .btn--danger:hover:not(:disabled) {
    background: var(--color-destructive);
    color: var(--color-destructive-foreground);
  }

  /* States */
  .btn:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }

  .btn:disabled {
    background: var(--disabled-bg);
    border-color: transparent;
    color: var(--text-disabled);
    box-shadow: none;
    transform: none;
  }

  /* Sizes */
  .btn--sm {
    min-height: 32px;
    padding-inline: 0.75rem;
    font-size: 0.85rem;
    border-radius: var(--radius-sm);
  }

  .btn--md {
    min-height: 40px;
    padding-inline: 1.25rem;
  }

  .btn--lg {
    min-height: 48px;
    padding-inline: 1.5rem;
    font-size: 1.05rem;
    border-radius: var(--radius-lg);
  }

  .btn--icon {
    width: 40px;
    height: 40px;
    padding: 0;
  }

  .btn__spinner {
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 550ms linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
