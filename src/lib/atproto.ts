import { eq } from "drizzle-orm";
import * as schema from "./schema.ts";
import { dev } from "$app/environment";
import { db as database } from "./db.ts";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import type { NodeSavedSession, NodeSavedSessionStore, NodeSavedState, NodeSavedStateStore } from "@atproto/oauth-client-node";


const publicUrl = "https://atproto-oauth-demo.zeu.dev"
// localhost resolves to either 127.0.0.1 or [::1] (if ipv6)
const url = dev ? "http://[::1]:5173" : publicUrl;


// can be implemented with your preferred DB and ORM
// both stores are the same, only different is 'state' and 'session'

class AuthStateStore implements NodeSavedStateStore {
  constructor(private db: typeof database) {}

  async get(key: string): Promise<NodeSavedState | undefined> {
    const result = await this.db.query.AuthState.findFirst({
      where: eq(schema.AuthState.key, key)
    });

    if (!result) return;

    return result.state as NodeSavedState;
  }

  async set(key: string, val: NodeSavedState) {
    await this.db.insert(schema.AuthState)
      .values({ key, state: val })
      .onConflictDoUpdate({
        target: schema.AuthState.key,
        set: { state: val }
      });
  }

  async del(key: string) {
    await this.db.delete(schema.AuthState)
      .where(eq(schema.AuthState.key, key));
  }
}

class AuthSessionStore implements NodeSavedSessionStore {
  constructor(private db: typeof database) {}

  async get(key: string): Promise<NodeSavedSession | undefined> {
    const result = await this.db.query.AuthSession.findFirst({
      where: eq(schema.AuthSession.key, key)
    });

    if (!result) return;
    return result.session as NodeSavedSession;
  }

  async set(key: string, val: NodeSavedSession) {
    await this.db.insert(schema.AuthSession)
      .values({ key, session: val })
      .onConflictDoUpdate({
        target: schema.AuthSession.key,
        set: { session: val }
      });
  }

  async del(key: string) {
    await this.db.delete(schema.AuthSession)
      .where(eq(schema.AuthSession.key, key));
  }
}

export const atclient = new NodeOAuthClient({
  stateStore: new AuthStateStore(database),
  sessionStore: new AuthSessionStore(database),
  clientMetadata: {
    client_name: "oauth-demo",
    client_id: !dev ? `${publicUrl}/client-metadata.json`
      : `http://localhost?redirect_uri=${
          encodeURIComponent(`${url}/oauth/callback`)
        }&scope=${
          encodeURIComponent(`atproto transition:generic`)
        }`,
    client_uri: url,
    redirect_uris: [`${url}/oauth/callback`],
    scope: "atproto transition:generic",
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "web",
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true
  }
});
