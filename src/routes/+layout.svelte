<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Toaster } from "svelte-french-toast";
  import { persisted, pinned_list } from "$lib/stores.svelte";
   import { theme } from "$lib/stores.svelte.ts";
let theme_style: string;
theme.subscribe((value: string) => {
  theme_style = value === "dark"
    ? "text-white absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"
    : "text-black absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]";
});

  onMount(() => {
    if ($page.url.pathname === "/") {
      goto(`/${pinned_list.value}`);
    }
  });
</script>

<div class={`${theme_style} font-apfel flex flex-col w-full h-full min-w-screen min-h-screen p-8 overflow-auto`}>
  <section class="p-4 w-full min-h-screen">
    <!-- Page content -->
    <slot />
  </section>
  <Toaster />
</div>
