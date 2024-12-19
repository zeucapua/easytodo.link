<script lang="ts">
  import { page } from "$app/state";
  import { local_lists, pinned_list, generateId, type List } from "$lib/stores.svelte";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";

  let is_menu_open = $state(false);
  let list : List | undefined = $state(local_lists.value!.find((l) => l.id === page.params.id));
  let task_input = $state("");
  let user_lists = $derived(local_lists.value) as List[];

  // since list points to something inside local_lists,
  // it will run when list state changes
  $effect(() => local_lists.update());

  function addTask() {
    if (task_input.length === 0) {
      toast.error("Enter a task to add");
      return;
    }

    list?.tasks.push({
      id: generateId(),
      description: task_input,
      is_completed: false
    });

    task_input = "";
  }

  function deleteTask(id: string) {
    if (list) {
      list.tasks = list.tasks.filter((t) => t.id !== id);
    }
  }

  function createList() {
    const new_list = {
      id: generateId(),
      title: "",
      tasks: []
    };

    local_lists.value!.push(new_list);
    list = local_lists.value!.find((l) => l.id === new_list.id);
    goto(`/${list!.id}`);
  }

  function switchToList(id: string) {
    list = local_lists.value!.find((l) => l.id === id);
    goto(`/${list!.id}`);
  }

  function pinList(id: string) {
    pinned_list.value = id;
  }

  function deleteList() {
    if (pinned_list.value === page.params.id) {
      toast.error("Cannot delete pinned list");
      return;
    }

    local_lists.value = local_lists.value!.filter((l) => l.id !== page.params.id);
    list = local_lists.value.find((l) => l.id === pinned_list.value);
    goto(`/${list!.id}`);
  }
</script>

<main class="flex flex-col w-full px-2 pt-8 pb-28 lg:px-4 lg:pt-4  gap-8 text-xl lg:text-3xl">
  {#if list}
    <section class="relative flex gap-4 w-full">
      <div class="flex gap-4 border-black border w-fit h-fit p-2 bg-white rounded-xl">
        <button onclick={() => is_menu_open = !is_menu_open}>
          <img
            src="/list-box-line.svg"
            alt="Lists button"
            class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
          />
        </button>
        <button onclick={() => pinList(list!.id)}>
          <img
            src={pinned_list.value === list.id ? "/pin.svg" : "/pin-line.svg"}
            alt="Pin list button"
            class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
          />
        </button>
        <button onclick={deleteList}>
          <img
            src="/trash-line.svg"
            alt="Delete list button"
            class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
          />
        </button>
      </div>

      {#if is_menu_open}
        <menu class="absolute flex flex-col gap-2 w-fit h-fit top-20 p-2 bg-white border border-black rounded-lg !text-black !text-lg">
          {#each user_lists as user_list : List (user_list.id)}
            <button
              onclick={() => {
                switchToList(user_list.id)
                is_menu_open = false;
              }}
              class="flex gap-2 justify-between text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
            >
              {user_list.title.length > 0 ? user_list.title : "Untitled"}
              {#if user_list.id === list.id}
                <img src="/check-line.svg" alt="Item 1" class="w-8 h-8" />
              {/if}
            </button>
          {/each}
          <button
            onclick={() => {
              createList();
              is_menu_open = false;
            }}
            class="flex gap-2 justify-between text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            Create new list
          </button>
        </menu>
      {/if}
    </section>
        <input 
          type="text" 
          bind:value={list.title} 
          placeholder="Untitled"
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
              class={`w-full hover:underline text-ellipsis overflow-hidden bg-transparent ${task.is_completed && "text-white/50"}`}
            />
          </div>

          <div class="flex gap-4 w-fit">
            <button 
              onclick={() => deleteTask(task.id)}
              class="px-4 py-2 bg-red-500 rounded-xl text-white"
            >
              -
            </button>
          </div>
        </li>
      {/each}
      <li class="flex gap-4 w-full">
        <input type="text" bind:value={task_input} class="bg-transparent pr-4 py-2 border-b w-full"/>
        <button onclick={addTask} class="px-5 rounded-full bg-white text-black">
          +
        </button>
      </li>
    </ul>

  {:else}
    <p>Loading...</p>
  {/if}
</main>
