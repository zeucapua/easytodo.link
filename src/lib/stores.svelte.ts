import { alphabet, generateRandomString } from "oslo/crypto";

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
  // optional
  duration?: number;
  stopwatchInterval?: number;
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

export function formatSecondsToDuration(seconds: number = 0) {
    let hours   = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);

    // string ver.
    let hrs, mins, secs;

    if (hours   < 10) { hrs = "0" + hours; } else { hrs = hours; }
    if (minutes < 10) { mins = "0" + minutes; } else { mins = minutes; }
    if (seconds < 10) { secs = "0" + seconds; } else { secs = seconds; }

    return hrs + ':' + mins + ':' + secs ;
}
