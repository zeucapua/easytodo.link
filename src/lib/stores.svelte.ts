// Browser + Local Storage
const browser_exists = (typeof window !== "undefined") && (typeof (document) !== "undefined");
const storage = browser_exists ? localStorage : null;

// Color Theme (from DaisyUI)
const initial_theme : string = getInitialTheme();

function getInitialTheme() {
  const initial_local = storage?.getItem("local_theme");
  if (initial_local) { 
    console.log("getInitial", initial_local);
    return initial_local 
  }
  return "default";
}

function localTheme() {
  let theme : string = $state(initial_theme);

  function updateTheme(new_theme : string) {
    if (browser_exists) {
      theme = new_theme;
      storage?.setItem("local_theme", theme);
    }
  }

  return {
    get theme() { return theme; },
    updateTheme
  }
}

export const color_theme = localTheme();

// Task + Todo List
export type Task = {
  id: string;
  description: string;
  is_completed: boolean;
}

const initial_list : Task[] = getInitialList();

function getInitialList() {
  const initial_local = storage?.getItem("local_todo_list");
  if (initial_local) { return JSON.parse(initial_local) as Task[]; }
  return [];
}

function localTodoList() {
  let tasks : Task[] = $state(initial_list);

  function addTask(new_task : Task) {
    tasks.push(new_task);
  }

  function removeTask(id : string) {
    tasks = tasks.filter((t) => t.id !== id);
  }

  function update() {
    if (browser_exists) {
      storage?.setItem("local_todo_list", JSON.stringify(tasks));
    }
  }

  return {
    get tasks() { return tasks; },
    addTask,
    removeTask,
    update
  }
}

export const todo_list = localTodoList();
