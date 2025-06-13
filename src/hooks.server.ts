import { atclient } from "./lib/atproto.ts";
import { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const sessionDid = event.cookies.get("sessionDid");
	if (sessionDid) {
		const oauthSession = await atclient.restore(sessionDid);
	}
	return resolve(event);
}
