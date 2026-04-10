import { generateId } from "./utils";
import { PersistedState } from "runed";

export type Task = {
  id: string;
  description: string;
  completed: boolean;
  duration: number;
}

export type List = {
  id: string;
  title: string;
  tasks: Task[];
}

export const local_lists = new PersistedState<List[]>("local_lists", [
  {
    id: generateId(),
    title: "Take a Break",
    tasks: [
      { id: generateId(), description: "Drink water", completed: false, duration: 0 },
      { id: generateId(), description: "Stand up and stretch", completed: false, duration: 0 },
      { id: generateId(), description: "Go outside for 10 seconds", completed: false, duration: 0 }, ]
  }
]);

export const pinned_list = new PersistedState<string>("pinned_list", local_lists.current[0].id);
