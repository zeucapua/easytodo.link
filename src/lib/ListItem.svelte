<script lang="ts">
  import { deleteList, pinList } from "./utils";
  import { pinned_list, type List } from "./stores.svelte";

  const { list = $bindable() }: { list: List } = $props();

  let completed = $derived(list.tasks.filter((t) => t.completed).length);
</script>

<div class="border p-4 flex justify-between">
  <div class="flex flex-col">
    <a href={`/${list.id}`} class="text-xl hover:underline">{list.title}</a>
    <p class="text-base">{completed}/{list.tasks.length}</p>
  </div>

  <div class="grid grid-cols-2 gap-1">
    <button onclick={() => pinList(list.id)} class="bg-white rounded-xl flex items-center justify-center">
      <img
        src={pinned_list.current === list.id ? "/pin.svg" : "/pin-line.svg"}
        alt="Pin list button"
        class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
      />
    </button>

    <button 
      onclick={() => deleteList(list.id)}
      class="p-2 bg-red-500 rounded-xl text-white w-fit h-full"
    >
      <img
        src="/trash-line.svg"
        alt="Delete list button"
        class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
      />
    </button>
  </div>
</div>
