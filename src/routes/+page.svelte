<script lang="ts">
  import { type Task, local_lists } from "$lib/stores.svelte";

  // TODO: get better ID management
  let description = $state("");

  let current_list = $state(local_lists.value[0]);

  function addTask() {
    current_list.tasks.push({
      id: crypto.randomUUID(),
      description,
      is_completed: false,
      list_id: current_list.id
    });
  }

  function removeTask(id: string) {
    current_list.tasks = current_list.tasks.filter(t => t.id !== id);
  }

  function createList() {
    current_list = { id: crypto.randomUUID(), title: "", tasks: [] };
    local_lists.value.push(current_list);
  }

  function removeList(id: string) {
    local_lists.value = local_lists.value.filter(l => l.id !== id);
    if (local_lists.value.length === 0) {
      createList();
    }
    current_list = local_lists.value[0];
  }

  $effect(() => {
    local_lists.update();
  });
</script>

<ul class="flex flex-col gap-8 overflow-y-scroll h-full max-h-[48rem] p-2">
  {#each current_list.tasks as task : Task}
    <li class="group flex gap-4 items-center">
      <input 
        type="checkbox" 
        bind:checked={task.is_completed} 
        class="checkbox lg:checkbox-lg"
      />
      <input 
        type="text" 
        bind:value={task.description} 
        class={`text-lg lg:text-xl input lg:input-lg w-full max-w-lg ${task.is_completed && "line-through"}`}
      />
      <button
        onclick={() => removeTask(task.id)}
        class="lg:invisible lg:group-hover:visible btn btn-error"
      >
        <img 
          src="/block-2.svg" 
          alt="Flex Solid 'Block 2' by StreamlineHQ" 
          class="w-4 lg:w-6" 
        />    
      </button>
    </li>
  {/each}
 
</ul>

<section class="flex gap-4">
  <input 
    type="text" 
    bind:value={description} 
    class="text-lg lg:text-xl input input-bordered lg:input-lg w-full max-w-lg"
  />
  <button onclick={addTask} class="btn lg:btn-lg btn-primary">Add</button>
</section>

<section class="flex gap-4 justify-evenly">
  <details class="dropdown dropdown-top">
    <summary class="btn btn-secondary">
      <img 
        src="/cog.svg" 
        alt="Flex Solid 'Cog' by StreamlineHQ" 
        class="w-6" 
      />    
    </summary>
    <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
      {#each local_lists.value as list : List}
        <li>
          <input
            type="radio" 
            aria-label={list.title.length === 0 ? "Untitled" : list.title}
            bind:group={current_list} 
            value={list}
            class="btn btn-sm btn-block btn-ghost justify-start"
          />
        </li>
      {/each}
      <li>
        <button class="" onclick={createList}> 
          + New list
        </button>
      </li>
    </ul>
  </details>

  <input
    type="text"
    bind:value={current_list.title}
    class="text-center w-fit input"
    placeholder="Untitled List"
  />
  <button
    onclick={() => removeList(current_list.id)}
    class="btn btn-error"
  >
    <img 
      src="/block-2.svg" 
      alt="Flex Solid 'Block 2' by StreamlineHQ" 
      class="w-4 lg:w-6" 
    />    
  </button>
</section>
