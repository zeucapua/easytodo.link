import { Agent } from "@atproto/api";
import { atclient } from "$lib/atproto";

import { decryptToString } from "$lib/server/encryption";
import { decodeBase64, decodeBase64urlIgnorePadding } from "@oslojs/encoding";

import type { Handle } from "@sveltejs/kit";
import { ENCRYPTION_PASSWORD } from "$env/static/private";

// runs everytime there's a new request
export const handle: Handle = async ({ event, resolve }) => {
  const sid = event.cookies.get("sid");

  // if there is a session cookie
  if (sid) {
    // if a user is already authed, skip reauthing
    if (event.locals.user) { return resolve(event); }

    // decrypt session cookie
    const decoded = decodeBase64urlIgnorePadding(sid);
    const key = decodeBase64(ENCRYPTION_PASSWORD);
    const decrypted = await decryptToString(key, decoded);

    // get oauth session from client using decrypted cookie
    const oauthSession = await atclient.restore(decrypted);

    // set the authed agent
    const authedAgent = new Agent(oauthSession);
    if (!event.locals.authedAgent) {
      event.locals.authedAgent = authedAgent;
    }

    // set the authed user with decrypted session DID
    const user = await authedAgent.getProfile({ actor: decrypted });
    event.locals.user = user.data;
  }

  return resolve(event);
}


