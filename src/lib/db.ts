import { Client } from "pg";
import * as schema from "./schema.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "$env/static/private";

const client = new Client({ connectionString: DATABASE_URL });
await client.connect();
export const db = drizzle(client, { schema });
