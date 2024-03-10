<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import toast, { Toaster } from "svelte-french-toast";
  import { persisted, pinned_list } from "$lib/stores.svelte";

  const theme = persisted<string>("theme", "light");
  let is_menu_open = $state(false);
  let theme_style = $derived(theme.value === "light"
    ? "text-black absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    : "text-white absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"
  );

  function comingSoon() {
    toast("Coming soon!", { icon: "🙈", position: "bottom-end" });
  }

  onMount(() => {
    if ($page.url.pathname === "/") {
      goto(`/${pinned_list.value}`);
    }
  });
</script>

<div class={`${theme_style} font-apfel flex flex-col w-full h-full min-w-screen min-h-screen p-8`}>
  <main class="p-4 w-full h-full">
    <slot />
  </main>

  <aside class="z-50 absolute inset-x-0 bottom-0 !text-black flex w-full h-fit items-end justify-between p-8">
    <div class="flex flex-col justify-start gap-4">
      {#if is_menu_open}
        <menu 
          transition:fade={{ duration: 150 }}
          class={`${theme.value === "light" ? "border-black" : "border-[#00091d]"} w-fit border z-50 flex flex-col items-start gap-2 h-fit p-2 rounded-xl bg-white`}
        >
          <button 
            onclick={comingSoon}
            class="flex gap-2 text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            <img src="/shooting-star.svg" alt="Item 1" class="w-8 h-8" />
            Try a new list
          </button>
          <button 
            onclick={comingSoon}
            class="flex gap-2 text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            <img src="/sparkles-line.svg" alt="Item 2" class="w-8 h-8" />
            AI Suggestions 
          </button>
        </menu>
      {/if}

      <nav class={`${theme.value === "light" ? "border-black" : "border-[#00091d]"} border z-50 flex self-center items-center gap-4 mx-auto w-fit h-fit p-2 rounded-xl bg-white`}>
        <button 
          onclick={() => is_menu_open = !is_menu_open} 
          class="w-full h-fit hover:bg-slate-500/10 rounded-full"
        >
          <img src="/menu-line.svg" alt="Menu" class="w-12 h-12" />
        </button>

        <!-- TODO: change to <a href='/explore'> -->
        <button 
          onclick={comingSoon}
          class="items-center h-fit w-full hover:bg-slate-500/10 rounded-full"
        >
          <img src="/planet-rocket.svg" alt="Explore Page" class="w-12 h-12"/>
        </button>

        <!-- TODO: change to <a href='/login'> -->
        <button 
          onclick={comingSoon}
          class="items-center h-fit w-full hover:bg-slate-500/10 rounded-full"
        >
          <img src="/login-line.svg" alt="Login" class="w-12 h-12"/>
        </button>
      </nav>
    </div>


    <button 
      onclick={() => { theme.value = theme.value === "light" ? "dark" : "light" }}
      class={`${theme.value === "light" ? "border-black" : "border-[#00091d]"} border w-fit h-fit p-2 bg-white rounded-xl`}
    >
      <img
        src="/light-bulb.svg"
        alt="Theme toggle button"
        class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
      />
    </button>
  </aside>
  <Toaster />
</div>
