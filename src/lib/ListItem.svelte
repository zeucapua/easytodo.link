<script lang="ts">
  import { pinned_list, type List } from "$lib/stores.svelte";

  const { list = $bindable() }: { list: List } = $props();

  let completed = $derived(list.tasks.filter((t) => t.completed).length);

  function pinList() {
    pinned_list.current = list.id;
  }
</script>

<div class="border p-4 flex justify-between">
  <div class="flex flex-col">
    <a href={`/${list.id}`} class="text-xl hover:underline">{list.title}</a>
    <p class="text-base">{completed}/{list.tasks.length}</p>
  </div>

  
  <button onclick={pinList} class="bg-white rounded-xl">
    <img
      src={pinned_list.current === list.id ? "/pin.svg" : "/pin-line.svg"}
      alt="Pin list button"
      class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
    />
  </button>
</div>
