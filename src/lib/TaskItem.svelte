<script module>
  let selectedTab = $state("set");
</script>

<script lang="ts">
  import { useInterval } from "runed";
  import type { Task } from "./stores.svelte";
  import { formatSecondsToDuration } from "./utils";

  let { task = $bindable(), onDelete }: { task: Task, onDelete: (taskId: string) => void } = $props();

  const interval = useInterval(1000, {
    immediate: false,
    callback: () => {
      task.duration++;
    }
  });

  function toggleInterval() {
    if (interval.isActive) {
      interval.pause();
    }
    else {
      interval.resume();
    }
  }

  function handleOpenTimer() {

  }

  let hourInput = $state(0);
  let minuteInput = $state(0);
  let secondsInput = $state(0);
</script>

<dialog id={`timer_${task.id}`} class="fixed inset-0 m-auto w-1/2 p-8">
  <form method="dialog" class="w-fit">
    <div class="flex gap-8 items-center text-lg">
      <button type="button" onclick={() => selectedTab = "set"} class={[selectedTab === "set" && "border border-red-500"]}>
        Set
      </button>
      <button type="button" onclick={() => selectedTab = "add"} class={[selectedTab === "add" && "border border-red-500"]}>
        Add
      </button>
    </div>

    <div class="flex w-fit items-center justify-center">
      <input type="number" min="0" bind:value={hourInput} class="w-12" /> 
      <p class="mr-4">:</p>
      <input type="number" min="0" max="59" bind:value={minuteInput} class="w-12" /> 
      <p class="mr-4">:</p>
      <input type="number" min="0" max="59" bind:value={secondsInput} class="w-12" /> 
    </div>
  </form>
</dialog>

<li class="group flex justify-between h-fit items-center gap-4">
  <div class="flex w-full gap-4 items-center pr-4 py-2">
    <input 
      type="checkbox" 
      bind:checked={task.completed} 
      class="w-6 h-6 bg-transparent"
    />
    <input 
      type="text" 
      bind:value={task.description}
      class={`w-full hover:underline text-ellipsis overflow-hidden bg-transparent ${task.completed && "text-white/50"}`}
    />
  </div>

  <div class="flex gap-4 w-fit h-fit items-center">
    <button
      command="show-modal"
      commandfor={`timer_${task.id}`}
      onclick={handleOpenTimer} 
      class="w-fit h-fit tabular-nums text-lg"
    >
      {formatSecondsToDuration(task.duration!)}
    </button>
    <button
      onclick={toggleInterval}
      class="w-full h-fit bg-white hover:bg-gray-200 border rounded-full p-2"
    >
      {#if interval.isActive}
        <img src="/basil--pause-solid.svg" alt="Pause" class="w-8" />
      {:else}
        <img src="/basil--play-solid.svg" alt="Play" class="w-8" />
      {/if}
    </button>
    <button 
      onclick={() => onDelete(task.id)}
      class="p-2 bg-red-500 rounded-xl text-white w-full h-fit"
    >
      <img src="/basil--trash-solid.svg" alt="Trash" class="w-24" />
    </button>
  </div>
</li>
