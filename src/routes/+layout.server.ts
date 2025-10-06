import type { LayoutServerLoadEvent } from "./$types";

export async function load({ locals }: LayoutServerLoadEvent) {
  // have user available throughout the app via LayoutData
  return !locals.user ? undefined : { user: {
    did: locals.user.did,
    handle: locals.user.handle,
    avatar: locals.user.avatar
  }};
}
