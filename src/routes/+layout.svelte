<script lang="ts">
  import "../app.css";
  import { onMount, type Snippet } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import toast, { Toaster } from "svelte-french-toast";
  import { pinned_list, user_preferences } from "$lib/stores.svelte";

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props();

  let is_menu_open = $state(false);
  let theme_style = $derived(user_preferences.current.theme === "dark"
    ? "text-white absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-size-[20px_20px]"
    : "text-black absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
  );

  function comingSoon() {
    toast("Coming soon!", { icon: "🙈", position: "top-center" });
  }

  onMount(() => {
    if (user_preferences.current.openPinOnLoad && page.url.pathname === "/") {
      goto(`/${pinned_list.current}`);
    }
  });
</script>

<div class={`${theme_style} font-apfel flex flex-col items-center justify-center w-full h-full min-w-screen min-h-screen p-8 overflow-auto`}>
  <section class="relative w-full h-full">
    {@render children()}
  </section>

  <aside class="z-50 fixed inset-x-0 bottom-0 text-black! flex w-full h-fit items-end justify-between p-8 pointer-events-none">
    <div class="flex flex-col justify-items-start items-start gap-4 pointer-events-auto w-fit">
      {#if is_menu_open}
        <menu
          transition:fade={{ duration: 150 }}
          class={`${user_preferences.current.theme === "light" ? "border-black" : "border-[#00091d]"} w-fit border z-50 flex flex-col items-start gap-2 h-fit p-2 rounded-xl bg-white`}
        >
          <button
            onclick={() => {
              comingSoon();
              is_menu_open = false;
            }}
            class="flex gap-2 text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            <img src="/shooting-star-line.svg" alt="Item 1" class="w-8 h-8" />
            Try random list
          </button>
          <button
            onclick={() => {
              comingSoon();
              is_menu_open = false;
            }}
            class="flex gap-2 text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            <img src="/planet-rocket.svg" alt="Explore Page" class="w-8 h-8"/>
            Explore lists
          </button>
        </menu>
      {/if}

      <nav class={`${user_preferences.current.theme === "light" ? "border-black" : "border-[#00091d]"} border z-50 flex self-left items-center gap-4 mx-0 w-fit h-fit p-2 rounded-xl bg-white`}>
        <button
          onclick={() => is_menu_open = !is_menu_open}
          class="w-full h-fit hover:bg-slate-500/10 rounded-full"
        >
          <img src="/menu-line.svg" alt="Menu" class="w-12 h-12" />
        </button>

        <!-- TODO: change to <a href='/explore'> -->
        <a
          href="/"
          class="w-full h-full items-center hover:bg-slate-500/10 rounded-full"
        >
          <img src="/home-statistics.svg" alt="Home" class="w-8 py-4 pl-3"/>
        </a>

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
      onclick={() => { user_preferences.current.theme = user_preferences.current.theme === "light" ? "dark" : "light" }}
      class={`${user_preferences.current.theme === "light" ? "border-black" : "border-[#00091d]"} border w-fit h-fit p-2 bg-white rounded-xl pointer-events-auto`}
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

<style lang="postcss">
	@reference "tailwindcss";
</style>
