import { atclient } from "$lib/atproto";
import { encryptString } from "$lib/server/encryption";
import { decodeBase64, encodeBase64urlNoPadding } from "@oslojs/encoding";

import { error, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { ENCRYPTION_PASSWORD } from "$env/static/private";

// called on after authorizing OAuth
export async function GET({ request, cookies }: RequestEvent) {
  // get parameters set by the callback
  const params = new URLSearchParams(request.url.split("?")[1]);

  try {
    const { session } = await atclient.callback(params);
    const key = decodeBase64(ENCRYPTION_PASSWORD);

    // encrypt the user DID
    const encrypted = await encryptString(key, session.did);
    const encoded = encodeBase64urlNoPadding(encrypted);

    // set encoded session DID as cookies for auth
    cookies.set("sid", encoded, {
      path: "/",
      maxAge: 60 * 60,
      httpOnly: true,
      sameSite: "lax"
    });
  } catch (err) {
    error(500, { message: (err as Error).message });
  }

  redirect(301, "/");
}
