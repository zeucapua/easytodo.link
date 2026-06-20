<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import { createList, deleteList, generateId, pinList, toggleArchiveList } from "$lib/utils";
  import { archived_lists, local_lists, pinned_list, type List } from "$lib/stores.svelte";
  import TaskItem from "$lib/TaskItem.svelte";

  let is_menu_open = $state(false);
  let list : List | undefined = $derived(local_lists.current!.find((l) => l.id === page.params.id));
  let task_input = $state("");
  let is_archived = $derived(!!archived_lists.current.find(a => a === list?.id))

  function addTask() {
    if (task_input.length === 0) {
      toast.error("Enter a task to add");
      return;
    }

    list?.tasks.push({
      id: generateId(),
      description: task_input,
      completed: false,
      duration: 0
    });

    task_input = "";
  }

  function deleteTask(id: string) {
    if (list) {
      list.tasks = list.tasks.filter((t) => t.id !== id);
    }
  }

  function handleDeleteList() {
    deleteList(page.params.id!);
    goto(`/${pinned_list.current}`)
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
            src={pinned_list.current === list.id ? "/pin.svg" : "/pin-line.svg"}
            alt="Pin list button"
            class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
          />
        </button>
        <button onclick={() => toggleArchiveList(list!.id)}>
          <img
            src={is_archived ? "/tabler--archive-filled.svg" : "/tabler--archive.svg"}
            alt="Archive list button"
            class="w-12 h-12 p-3 hover:bg-slate-500/10 rounded-full"
          />
        </button>
        <button onclick={handleDeleteList}>
          <img
            src="/trash-line.svg"
            alt="Delete list button"
            class="w-12 h-12 hover:bg-slate-500/10 rounded-full"
          />
        </button>
      </div>

      {#if is_menu_open}
        {@const archived_items = local_lists.current.filter(l => archived_lists.current.includes(l.id))}
        {@const active_items = local_lists.current.filter(l => !archived_lists.current.includes(l.id))}
        <menu class="absolute flex flex-col gap-2 w-fit h-fit top-20 p-2 bg-white border border-black rounded-lg text-black! text-lg!">
          <button
            onclick={() => {
              const { id } = createList();
              is_menu_open = false;
              goto(`/${id}`);
            }}
            class="flex gap-2 justify-start text-start w-full h-full rounded-xl pl-2 pr-5 py-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
          >
            <img src="/basil--plus-solid.svg" alt="Plus" class="size-4" />
            Create new list
          </button>
          <details class="hover:cursor-pointer flex flex-col gap-2 pt-2 pb-0.5 hover:bg-slate-500/10 rounded-xl transition-all duration-150 w-full">
            <summary class="w-full px-3">Lists</summary>
            <div class="px-2">
              {#each active_items as user_list : List (user_list.id)}
                <button
                  onclick={() => {
                    goto(`/${user_list.id}`);
                    is_menu_open = false;
                  }}
                  class="flex gap-2 justify-start text-start w-full h-full rounded-xl px-2 py-2 mb-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
                >
                  {#if user_list.id === list.id}
                    <img src="/check-line.svg" alt="Item 1" class="size-6" />
                  {/if}
                  {user_list.title.length > 0 ? user_list.title : "Untitled"}
                </button>
              {/each}
            </div>
          </details>
          <details class="hover:cursor-pointer flex flex-col gap-2 pt-2 pb-0.5 hover:bg-slate-500/10 rounded-xl transition-all duration-150 w-full">
            <summary class="w-full px-3">Archived</summary>
            <div class="px-2">
              {#each archived_items as inactive_list  : List (inactive_list.id)}
                <button
                  onclick={() => {
                    goto(`/${inactive_list.id}`);
                    is_menu_open = false;
                  }}
                  class="flex gap-2 justify-start text-start w-full h-full rounded-xl px-2 py-2 mb-2 hover:bg-slate-500/10 transition-all duration-150 items-center"
                >
                  {#if inactive_list.id === list.id}
                    <img src="/check-line.svg" alt="Item 1" class="size-6" />
                  {/if}
                  {inactive_list.title.length > 0 ? inactive_list.title : "Untitled"}
                </button>
              {/each}
            </div>
          </details>
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
      {#each list.tasks as task, i (task.id)}
        <TaskItem bind:task={list.tasks[i]} onDelete={deleteTask} />
      {/each}
      <li class="flex gap-4 w-full">
        <input type="text" bind:value={task_input} class="bg-transparent pr-4 py-2 border-b w-full"/>
        <button onclick={addTask} class="p-2 rounded-full bg-white hover:bg-gray-200 border text-black">
          <img src="/basil--plus-solid.svg" alt="Add" class="w-8"/>
        </button>
      </li>
    </ul>

  {:else}
    <p>Loading...</p>
  {/if}
</main>
