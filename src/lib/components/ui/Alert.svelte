<script lang="ts">
  import Icon from '../primitives/Icon.svelte';
  import type { Snippet } from 'svelte';

  let {
    type = 'info',
    title,
    children,
    dismissable = false,
    ondismiss,
  }: {
    type?: 'info' | 'success' | 'warning' | 'danger';
    title?: string;
    children: Snippet;
    dismissable?: boolean;
    ondismiss?: () => void;
  } = $props();

  const iconName = $derived(
    type === 'success' ? 'badge-check' :
    type === 'warning' ? 'warning-triangle' :
    type === 'danger' ? 'xmark-circle' :
    'info-circle'
  );
</script>

<div class="alert alert--{type}" role={type === 'info' || type === 'success' ? 'status' : 'alert'} aria-live={type === 'danger' || type === 'warning' ? 'assertive' : 'polite'}>
  <div class="alert-icon">
    <Icon name={iconName} size={20} />
  </div>
  
  <div class="alert-content">
    {#if title}
      <h4 class="alert-title heading heading-sm">{title}</h4>
    {/if}
    <div class="alert-body body-sm">
      {@render children()}
    </div>
  </div>

  {#if dismissable}
    <button type="button" class="alert-close" onclick={ondismiss} aria-label="Dismiss alert">
      <Icon name="x" size={16} />
    </button>
  {/if}
</div>

<style>
  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    border-left: 3px solid transparent;
  }

  .alert--info { background: var(--status-info-container); border-left-color: var(--status-info); color: var(--status-info); }
  .alert--success { background: var(--status-success-container); border-left-color: var(--status-success); color: var(--status-success); }
  .alert--warning { background: var(--status-warning-container); border-left-color: var(--status-warning); color: var(--status-warning); }
  .alert--danger { background: var(--status-danger-container); border-left-color: var(--status-danger); color: var(--status-danger); }

  .alert-icon {
    flex-shrink: 0;
  }

  .alert-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    color: var(--text-primary);
  }

  .alert-title {
    margin: 0;
    color: inherit;
  }

  .alert-body {
    color: var(--text-secondary);
  }

  .alert-close {
    flex-shrink: 0;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    width: var(--control-md);
    height: var(--control-md);
    padding: 0;
    border-radius: var(--radius-sm);
    transition: color var(--dur-2) var(--ease-standard), background var(--dur-2) var(--ease-standard);
  }

  .alert-close:hover {
    background: var(--surface-hover-role);
    color: var(--text-primary);
  }

  .alert-close:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
</style>
