import { atclient } from "$lib/atproto";
import { isValidHandle } from "@atproto/syntax";
import { error, redirect, type Actions } from "@sveltejs/kit";

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
      scope: "atproto transition:generic"
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
  }
};
