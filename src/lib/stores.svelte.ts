// Browser + Local Storage
const browser_exists = (typeof window !== "undefined") && (typeof (document) !== "undefined");
const storage = browser_exists ? localStorage : null;

// Generalized Local Storage
export function persisted<T>(key: string, default_value: T) {
  let value : T = $state(default_value);

  const initial_local = storage?.getItem(key);
  if (initial_local) {
      value = JSON.parse(initial_local).value as T;
      if (!value) { update(); }
  }
  else {
    storage?.setItem(key, JSON.stringify(default_value));
  }

  function update() {
    if (browser_exists) {
      storage?.setItem(key, JSON.stringify({ value }));
    }
  }

  return {
    get value() { return value; },
    set value(new_value) { value = new_value; update(); },
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
  list_id: string;
}

export type List = {
  id: string;
  title: string;
  tasks: Task[];
}

export const local_lists = persisted<List[]>("local_lists", [{ id: crypto.randomUUID(), title: "", tasks: [] }]);
