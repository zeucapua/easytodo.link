<script lang="ts">
  import { deleteList, pinList, toggleArchiveList } from "./utils";
  import { archived_lists, pinned_list, type List } from "./stores.svelte";

  const { list = $bindable() }: { list: List } = $props();

  const completed = $derived(list.tasks.filter((t) => t.completed).length);
  const archived = $derived(!!archived_lists.current.find(a => list.id === a));
</script>

<div class={[archived && "border-slate-500", "border p-4 flex flex-col justify-between gap-4"]}>
  <div class="flex flex-col">
    <a href={`/${list.id}`} class="text-xl hover:underline">{list.title}</a>
    <p class="text-base">{completed}/{list.tasks.length}</p>
  </div>

  <div class="grid grid-cols-3 gap-1 justify-self-end h-8">
    <button onclick={() => pinList(list.id)} class="bg-white flex items-center justify-center w-full">
      <img
        src={pinned_list.current === list.id ? "/pin.svg" : "/pin-line.svg"}
        alt="Pin list button"
        class="size-8"
      />
    </button>

    <button onclick={() => toggleArchiveList(list.id)} class="bg-white flex items-center justify-center w-full">
      <img
        src={archived ? "/tabler--archive-filled.svg" : "/tabler--archive.svg"}
        alt="Archive list button"
        class="size-4"
      />
    </button>

    <button 
      onclick={() => deleteList(list.id)}
      class="flex justify-center items-ceneter bg-red-500 text-white w-full hover:bg-red-700"
    >
      <img
        src="/trash-line.svg"
        alt="Delete list button"
        class="size-8"
      />
    </button>
  </div>
</div>
