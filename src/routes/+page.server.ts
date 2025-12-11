import { atclient } from "$lib/atproto";
import type { Task } from "$lib/stores.svelte";
import type { $Typed } from "@atproto/api";
import type { Create, CreateResult } from "@atproto/api/dist/client/types/com/atproto/repo/applyWrites";
import { isValidHandle } from "@atproto/syntax";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  login: async ({ request }) => {
    // get handle from form
    const formData = await request.formData();
    const handle = formData.get("handle") as string;

    // validate handle using ATProto SDK
    if (!isValidHandle(handle)) {
      error(400, { message: "Invalid handle" });
    }

    // get oauth authorizing url to redirect to
    const redirectUrl = await atclient.authorize(handle, {
      scope: "atproto repo:link.easytodo.tasks.list repo:link.easytodo.tasks.task"
    });

    if (!redirectUrl) { 
      error(500, { message: "Unable to authorize" }); 
    }

    // redirect for user to authorize
    redirect(301, redirectUrl.toString());
  },
  logout: async ({ cookies }) => {
    cookies.delete("sid", { path: "/" });
    redirect(301, "/");
  },
  

  // ATProto CRUD
  saveListRecord: async ({ request, locals }) => {
    const user = locals.user;
    const agent = locals.authedAgent;
    if (!user || !agent) { return fail(401); }

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const tasks = JSON.parse(formData.get("tasks") as string) as Task[];
    
    const task_records = tasks.map((t) => {
      const { stopwatchInterval, ...rest } = t;
      return {
        $type: "link.easytodo.tasks.task",
        ...rest
      }
    });

    const response = await agent.com.atproto.repo.applyWrites({
      repo: user.did,
      writes: task_records.map((r) => {
        return { 
          $type: 'com.atproto.repo.applyWrites#create',
          collection: "link.easytodo.tasks.task", 
          value: r 
        } 
      })
    });

    if (response.success) {
      console.log(response.data.results);
      const list_record = {
        $type: "link.easytodo.tasks.list",
        createdAt: new Date().toISOString(),
        id,
        title,
        tasks: response.data.results?.map((t) => { 
          // @ts-ignore
          return { cid: t.cid, uri: t.uri }
        })
      };
      const { success, data } = await agent.com.atproto.repo.createRecord({
        repo: user.did,
        collection: "link.easytodo.tasks.list",
        record: list_record
      });

      return { saveListRecordResult: { success, uri: data.uri }};
    }
  }
};
