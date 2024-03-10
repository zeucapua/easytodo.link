<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { local_lists, pinned_list, type List } from "$lib/stores.svelte";

  let list : List | undefined = $state(); 

  onMount(() => {
    list = local_lists.value!.find((l) => l.id === $page.params.id); 
  });

  $effect(() => local_lists.update());
</script>

<main class="flex flex-col w-full p-2 lg:p-4 gap-8 text-xl lg:text-3xl">
  {#if list}
    <input 
      type="text" 
      bind:value={list.title} 
      class="text-5xl font-bold bg-transparent"
    />
    <ul class="flex flex-col gap-4">
      {#each list.tasks as task (task.id)}
        <li class="group flex justify-between items-center gap-4">
          <div class="flex w-full gap-4 items-center pr-4 py-2">
            <input 
              type="checkbox" 
              bind:checked={task.is_completed} 
              class="w-6 h-6 bg-transparent"
            />
            <input 
              type="text" 
              bind:value={task.description}
              class="w-full hover:underline text-ellipsis overflow-hidden bg-transparent"
            />
          </div>

          <div class="flex lg:hidden group-hover:flex gap-4 w-fit">
            <button class="hidden lg:flex px-4 py-2 text-xl bg-red-500 rounded-xl text-white">
              Delete
            </button>
          </div>
        </li>
      {/each}
    </ul>

  {:else}
    <p>Loading...</p>
  {/if}
</main>
