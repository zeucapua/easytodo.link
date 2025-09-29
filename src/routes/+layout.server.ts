import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ locals }: ServerLoadEvent) {
  // have user available throughout the app via LayoutData
  return { user: locals.user };
}
