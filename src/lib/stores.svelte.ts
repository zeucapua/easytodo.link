// Browser + Local Storage
const browser_exists = (typeof window !== "undefined") && (typeof (document) !== "undefined");
const storage = browser_exists ? localStorage : null;

// Generalized Local Storage
function persisted<T>(key: string, default_value: T) {
  let value : T = $state(default_value);

  const initial_local = storage?.getItem(key);
  if (initial_local) {
    try {
      value = JSON.parse(initial_local).value as T;
      if (!value) { update(default_value); }
    } 
    catch (e) {
      update(default_value);
    }
  }

  function update(new_value : T) {
    if (browser_exists) {
      value = new_value;
      storage?.setItem(key, JSON.stringify({ value }));
    }
  }

  return {
    get value() { return value; },
    update
  }
}

// Color Theme (from DaisyUI)
export const color_theme = persisted<string>("local_theme", "default");

// Task + Todo List
export type Task = {
  id: string;
  description: string;
  is_completed: boolean;
}

export type List = {
  id: string;
  title: string;
  tasks: Task[]
}

export const todo_list = persisted<Task[]>("local_todo_list", []);
