// Browser + Local Storage
const browser_exists = (typeof window !== "undefined") && (typeof (document) !== "undefined");
const storage = browser_exists ? localStorage : null;

// Generalized Local Storage
function persisted<T>(key: string, initial_value: T) {
  let value : T = $state(initial_value);

  const initial_local = storage?.getItem(key);
  if (initial_local) {
    value = JSON.parse(initial_local).value as T;
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

export const todo_list = persisted<Task[]>("local_todo_list", []);
