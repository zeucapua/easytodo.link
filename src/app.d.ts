// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Agent } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}

    // set on `hooks.server.ts`, available on server functions
		interface Locals {
      authedAgent: Agent | undefined; 
      user: ProfileViewDetailed | undefined;
    }

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
