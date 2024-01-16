<script lang="ts">
  import "../app.css";
  import { dev } from "$app/environment";
  import { color_theme } from "$lib/stores.svelte";
  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  inject({ mode: dev ? "development" : "production" });
  injectSpeedInsights();

  const daisyui_themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  let theme_input = $state(color_theme.theme);
  $effect(() => color_theme.updateTheme(theme_input));
</script>

<svelte:head>
  <title>easytodo.link - by @zeu_dev</title>
</svelte:head>

<main class="relative flex flex-col gap-8 w-full h-full min-w-screen min-h-screen p-8 items-center justify-center">
  <slot />

  <footer class="absolute inset-x-0 bottom-0 flex justify-between px-8 py-4 items-center">
    <section class="flex gap-4 items-center">
      <details class="dropdown dropdown-top">
        <summary class="btn btn-primary">
          <img 
            src="/cog.svg" 
            alt="Flex Solid 'Cog' by StreamlineHQ" 
            class="w-6" 
          />    
        </summary>
        <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          <li>
            <details class="dropdown dropdown-top">
              <summary>Color Theme</summary>
              <ul class="max-h-32 overflow-y-scroll p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                {#each daisyui_themes as theme}
                  <li>
                    <input
                      type="radio" 
                      aria-label={theme}
                      bind:group={theme_input} 
                      value={theme} 
                      class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    />
                  </li>
                {/each}
              </ul>
            </details>
          </li>
        </ul>
      </details>
      <p class="hidden lg:block">easytodo.link - local first todo list</p>
    </section>

    
    <section>
      <p>
        <a
          href="https://github.com/zeucapua/easytodo.link"
          target="_blank"
          class="link link-hover link-secondary"
        >
          {"Made with <3"} 
        </a>
        by 
        <a 
          href="https://twitter.com/zeu_dev" 
          target="_blank" 
          class="link link-hover link-accent"
        >
          @zeu_dev
        </a>
      </p>
    </section>
  </footer>
</main>
