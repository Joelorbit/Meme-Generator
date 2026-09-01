<script module lang="ts">
  import type { IconName, IconProps } from "../../icons";
  export type { IconName, IconProps };
</script>

<script lang="ts">
  /**
   * Iconoir Icon Component
   * Authenticated 24x24 grid, 1.5 default stroke weight.
   * Free & Open Source Icon Library (https://iconoir.com)
   */
  import { getIconoirSvg } from "../../icons";

  let {
    name,
    size = 20,
    strokeWidth = 1.5,
    solid = false,
    class: className = "",
    title,
    ariaLabel,
    ariaHidden = !title && !ariaLabel,
    role = title || ariaLabel ? "img" : undefined,
    strokeLinecap = "round",
    strokeLinejoin = "round",
  }: {
    name: IconName;
    size?: number | string;
    strokeWidth?: number;
    solid?: boolean;
    class?: string;
    title?: string;
    ariaLabel?: string;
    ariaHidden?: boolean;
    role?: string;
    strokeLinecap?: "round" | "square" | "inherit";
    strokeLinejoin?: "round" | "miter" | "inherit";
  } = $props();

  let innerSvg = $derived(getIconoirSvg(name, solid) || "");
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill={solid ? "currentColor" : "none"}
  stroke={solid ? "none" : "currentColor"}
  stroke-width={solid ? undefined : strokeWidth}
  stroke-linecap={solid ? undefined : strokeLinecap}
  stroke-linejoin={solid ? undefined : strokeLinejoin}
  aria-hidden={ariaHidden ? "true" : undefined}
  aria-label={ariaLabel}
  role={role}
  focusable="false"
  class={className}
>
  {#if title}
    <title>{title}</title>
  {/if}
  {@html innerSvg}
</svg>
