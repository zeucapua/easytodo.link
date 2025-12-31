<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import type { LayoutProps } from "./$types";
  import toast, { Toaster } from "svelte-french-toast";
  import { persisted, pinned_list } from "$lib/stores.svelte";

  let { data, children }: LayoutProps = $props();
  let { user } = $derived(data);

  let theme = persisted<string>("theme", "dark");
  let is_menu_open = $state(false);
  let loginDialog = $state<HTMLDialogElement>();
  let accountDialog = $state<HTMLDialogElement>();
  let theme_style = $derived(theme.value === "dark"
    ? "text-white absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-size-[20px_20px]"
    : "text-black absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
  );

  function comingSoon() {
    toast("Coming soon!", { icon: "🙈", position: "top-center" });
  }

  onMount(() => {
    if (page.url.pathname === "/") {
      goto(`/${pinned_list.value}`);
    }
  });
</script>

<div class={`${theme_style} font-apfel flex flex-col w-full h-full min-w-screen min-h-screen p-8 overflow-auto`}>
  <section class="p-4 w-full h-full">
    {@render children()}
  </section>

  <dialog bind:this={loginDialog} class="flex flex-col w-lg gap-4 bg-white top-1/2 left-1/2 -translate-1/2 p-4 rounded">
    <span class="flex items-center gap-4 self-end w-full justify-between">
      <h1 class="text-xl font-bold">Log into the Atmosphere</h1>
      <button onclick={() => loginDialog?.close()} class="bg-gray-100 px-3 py-2 rounded self-end">Close</button>
    </span>
    <form method="POST" action="/?/login" class="flex flex-col gap-4">
      <input name="handle" type="text" placeholder="zeu.dev" class="border rounded px-4 py-2" />
      <button type="submit" class="border px-3 py-2 rounded">Login</button>
    </form>
    <details class="border border-gray-300 px-3 py-2 rounded">
      <summary class="marker:hidden font-semibold cursor-pointer">
        <span class="text-blue-500">@</span> Enter your internet handle
      </summary>
      <span class="flex flex-col gap-2 text-sm pt-1">
        <p>
          This would be a domain you control, most likely first created with Bluesky, Tangled, Gander, 
          or other Atmosphere applications.
        </p>
        <a href="" class="text-blue-500 underline">
          Learn more about ATproto and controlling your social media data
        </a>
      </span>
    </details>
  </dialog>

  <dialog bind:this={accountDialog} class="bg-white p-6 shadow top-1/2 left-1/2 -translate-1/2">
    <h1>Account</h1>
    <button onclick={() => accountDialog?.close()}>Close</button>
    <form method="POST" action="/?/logout">
      <button type="submit">Logout</button>
    </form>
  </dialog>

  <aside class="z-50 fixed inset-x-0 bottom-0 text-black! flex w-full h-fit items-end justify-between p-8 pointer-events-none">
    <div class="flex flex-col justify-start gap-4 pointer-events-auto">
      {#if is_menu_open}
        <menu
          transition:fade={{ duration: 150 }}
          class={`${theme.value === "light" ? "border-black" : "border-[#00091d]"} w-fit border z-50 flex flex-col items-start gap-2 h-fit p-2 rounded-xl bg-white`}
        >
          <button
            onclick={() => {
              comingSoon();
              is_menu_open = false;
            }}
            class="flex gap-2 text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            <img src="/shooting-star-line.svg" alt="Item 1" class="w-8 h-8" />
            Try a new list
          </button>
          <button
            onclick={() => {
              comingSoon();
              is_menu_open = false;
            }}
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
        {#if !user}
          <button
            onclick={() => loginDialog?.showModal()}
            class="items-center h-fit w-full hover:bg-slate-500/10 rounded-full"
          >
            <img src="/login-line.svg" alt="Login" class="w-12 h-12"/>
          </button>
        {:else}
          <button
            onclick={() => accountDialog?.showModal()}
            class="items-center h-fit w-full rounded-full"
          >
            <img src={user.avatar || "/user-line.svg"} alt="Login" class="w-10 h-10 rounded-full" />
          </button>
        {/if}
      </nav>
    </div>


    <button
      onclick={() => { theme.value = theme.value === "light" ? "dark" : "light" }}
      class={`${theme.value === "light" ? "border-black" : "border-[#00091d]"} border w-fit h-fit p-2 bg-white rounded-xl pointer-events-auto`}
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
