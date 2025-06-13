import { PersistedState } from "runed";
import { alphabet, generateRandomString } from "oslo/crypto";

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

export const local_lists = new PersistedState<List[]>(
	"local_lists",
	[{
			id: generateId(),
			title: "Take a Break",
			tasks: [
				{ id: generateId(), description: "Drink water", is_completed: false },
				{ id: generateId(), description: "Stand up and stretch", is_completed: false },
				{ id: generateId(), description: "Go outside for 10 seconds", is_completed: false }, ]
	}],
);

export const pinned_list = new PersistedState<string>("pinned_list", "");

export function generateId() {
  return generateRandomString(10, alphabet("a-z", "0-9"));
}

export function formatSecondsToDuration(seconds: number = 0) {
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);

    // string ver.
    let hrs, mins, secs;

    if (hours   < 10) { hrs = "0" + hours; } else { hrs = hours; }
    if (minutes < 10) { mins = "0" + minutes; } else { mins = minutes; }
    if (seconds < 10) { secs = "0" + seconds; } else { secs = seconds; }

    return hrs + ':' + mins + ':' + secs ;
}
