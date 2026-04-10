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
</script>

<li class="group flex justify-between items-center gap-4">
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

  <div class="flex gap-4 w-fit items-center">
    <button
      onclick={toggleInterval} 
      class="w-fit h-fit tabular-nums text-lg"
    >
      {formatSecondsToDuration(task.duration!)}
    </button>
    <button 
      onclick={() => onDelete(task.id)}
      class="px-4 py-2 bg-red-500 rounded-xl text-white"
    >
      -
    </button>
  </div>
</li>
