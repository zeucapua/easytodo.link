<script lang="ts">
  import { todo_list, type Task } from "$lib/stores.svelte";

  let id = 0;
  let description = $state("");

  function randomizeId() {
    let random_id = id;
    while (todo_list.tasks.find(t => t.id === `${random_id}`)) {
      random_id = Math.floor(Math.random() * 100);
    }
    id = random_id;
  }

  function addTask() {
    randomizeId();
    todo_list.addTask({
      id: `${id}`, 
      description, 
      is_completed: false
    });
    description = "";
  }

  $effect(() => todo_list.update());
</script>

<ul class="flex flex-col gap-8 overflow-y-scroll h-full max-h-[48rem] p-2">
  {#each todo_list.tasks as task : Task}
    <li class="group flex gap-4 items-center">
      <input 
        type="checkbox" 
        bind:checked={task.is_completed} 
        class="checkbox checkbox-lg"
      />
      <input 
        type="text" 
        bind:value={task.description} 
        class={`text-xl input input-lg w-full max-w-lg ${task.is_completed && "line-through"}`}
      />
      <button
        onclick={() => todo_list.removeTask(task.id)}
        class="lg:invisible lg:group-hover:visible btn btn-error"
      >
        <img 
          src="/block-2.svg" 
          alt="Flex Solid 'Block 2' by StreamlineHQ" 
          class="w-6" 
        />    
      </button>
    </li>
  {/each}
 
</ul>

<form onsubmit={addTask} class="flex gap-4">
  <input 
    type="text" 
    bind:value={description} 
    class="text-xl input input-bordered input-lg w-full max-w-lg"
  />
  <button class="btn btn-lg btn-primary">Add</button>
</form>

