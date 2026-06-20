import toast from "svelte-french-toast";
import { archived_lists, local_lists, pinned_list } from "./stores.svelte";
import { alphabet, generateRandomString } from "oslo/crypto";

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

export function createList() {
  const new_list = {
    id: generateId(),
    title: "",
    tasks: []
  };

  local_lists.current!.push(new_list);
  return { id: new_list.id };
}

export function deleteList(id: string) {
  if (pinned_list.current === id) {
    toast.error("Cannot delete pinned list");
    return;
  }

  local_lists.current = local_lists.current.filter((l) => l.id !== id);
}

export function pinList(id: string) {
  pinned_list.current = id;
}

export function toggleArchiveList(id: string) {
  if (pinned_list.current === id) {
    toast.error("Cannot archive pinned list");
    return;
  }

  const archived = archived_lists.current;
  if (archived.find(a => a === id)) {
    archived_lists.current = archived.filter(a => a !== id);
  }
  else {
    archived_lists.current!.push(id);
  }
}
