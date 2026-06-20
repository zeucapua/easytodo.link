<script lang="ts">
  import ListItem from "$lib/ListItem.svelte";
  import { createList } from "$lib/utils";
  import { user_preferences, local_lists, archived_lists } from "$lib/stores.svelte";
  import { goto } from "$app/navigation";

  let show_archived = $state(user_preferences.current.showArchiveAtHomeDefault);
</script>

<main class="flex flex-col w-full px-2 pt-8 pb-28 lg:px-4 lg:pt-4  gap-8 text-xl lg:text-3xl">
  <section class="flex flex-col gap-4">
    <h2 class="font-bold">Your Lists</h2>
    <menu>
      <label for="showArchived" class="text-sm">
        <input id="showArchived" type="checkbox" bind:checked={show_archived} />
        Show Archived
      </label>
    </menu>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {#each local_lists.current as list (list.id)}
        {@const is_archived = !!archived_lists.current.find(a => a === list.id)}
        {#if is_archived}
          {#if show_archived}
            <ListItem {list} /> 
          {/if}
        {:else}
          <ListItem {list} /> 
        {/if}
      {/each}
      <button onclick={() => { const { id } = createList(); goto(`/${id}`); }} aria-label="Create New List" class="flex justify-center items-center border bg-white">
        <img src="/basil--plus-solid.svg" alt="Plus" class="size-8 text-white" />
      </button>
    </div>
  </section>
  <hr />
  <section class="flex flex-col gap-4">
    <h2 class="font-bold">Settings</h2>
    <label for="openPinOnLoad" class="flex gap-2 text-base">
      <input id="openPinOnLoad" type="checkbox" bind:checked={user_preferences.current.openPinOnLoad} />
      Open pinned list on load
    </label>
    <label for="showArchiveAtHomeDefault" class="flex gap-2 text-base">
      <input id="showArchiveAtHomeDefault" type="checkbox" bind:checked={user_preferences.current.showArchiveAtHomeDefault} />
      Show Archived at Home (Default)
    </label>
  </section>
</main>
