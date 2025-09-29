import { atclient } from "$lib/atproto";
import { json } from "@sveltejs/kit";

export async function GET() { 
  return json(atclient.clientMetadata);
}
