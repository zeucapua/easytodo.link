<script lang="ts">
  import { todo_list, type Task } from "$lib/stores.svelte";

  $effect(() => console.log(todo_list));

  // TODO: get better ID management
  let id = $state(0);
  let description = $state("");

  function randomizeId() {
    let random_id = id;
    while (todo_list.value.find(t => t.id === `${random_id}`)) {
      random_id = Math.floor(Math.random() * 100);
    }
    id = random_id;
  }

  function addTask() {
    randomizeId();
    todo_list.update(
      [...todo_list.value, {
        id: `${id}`,
        description,
        is_completed: false
      }]
    );
    description = "";
  }

  function removeTask(id: string) {
    todo_list.update(
      todo_list.value.filter((t) => t.id !== id)
    );
  }

  // update when tasks change (description, is_completed)
  $effect(() => todo_list.update(todo_list.value));
</script>

<ul class="flex flex-col gap-8 overflow-y-scroll h-full max-h-[48rem] p-2">
  {#each todo_list.value as task : Task}
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

