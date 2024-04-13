import { alphabet, generateRandomString } from "oslo/crypto";
import { writable } from 'svelte/store';

// Create a writable store with 'dark' as the default value
export const theme = writable<string>('dark');
// Browser + Local Storage
const browser_exists = (typeof window !== "undefined") && (typeof (document) !== "undefined");
const storage = browser_exists ? localStorage : null;

// Generalized Local Storage
export function persisted<T>(key: string, default_value: T) {
  let value : T | undefined = $state();

  const initial_local = storage?.getItem(key);
  if (initial_local) {
      value = JSON.parse(initial_local).value as T;
      if (!value) { update(); }
  }
  else {
    value = default_value;
    update();
  }

  function update() {
    if (browser_exists) {
      storage?.setItem(key, JSON.stringify({ value: value }));
    }
  }

  return {
    get value() { return value; },
    set value(new_value) { value = new_value; update(); },
    update
  }
}

export type Task = {
  id: string;
  description: string;
  is_completed: boolean;
}

export type List = {
  id: string;
  title: string;
  tasks: Task[];
}

export const local_lists = persisted<List[]>("local_lists", [
  {
    id: generateId(),
    title: "Take a Break",
    tasks: [
      { id: generateId(), description: "Drink water", is_completed: false },
      { id: generateId(), description: "Stand up and stretch", is_completed: false },
      { id: generateId(), description: "Go outside for 10 seconds", is_completed: false }, ]
  }
]);

export const pinned_list = persisted<string>("pinned_list", local_lists.value![0].id);

export function generateId() {
  return generateRandomString(10, alphabet("a-z", "0-9"));
}
