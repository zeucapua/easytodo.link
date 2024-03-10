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

<main class="flex flex-col p-4 gap-8">
  {#if list}
    <p>{list.title}</p>
    <ul>
      {#each list.tasks as task (task.id)}
        <li class="flex gap-4">
          <input type="checkbox" bind:checked={task.is_completed} />
          <input type="text" bind:value={task.description} />
        </li>
      {/each}
    </ul>
  {:else}
    <p>Loading...</p>
  {/if}
</main>
