<script lang="ts">
  import "../app.css";
  import { theme } from "$lib/stores.svelte";

  let theme_style = $derived(theme.value === "light"
    ? "text-black absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    : "text-white absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"
  );

  function getTheme(if_light: any, if_dark: any) {
    return theme.value === "light" ? if_light : if_dark;
  }
</script>

<div class={theme_style}>
  <slot />
  <button onclick={() => { theme.value = getTheme("dark", "light") }}>
    <img
      src={getTheme("/moon.svg", "/light-bulb.svg")} 
      alt="Theme toggle button"
    />
  </button>
</div>
