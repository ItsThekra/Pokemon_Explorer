import { serve } from "bun";
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/";

serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/pokemon") {
      const offset = Number(url.searchParams.get("offset") ?? 0);
      const limit = Number(url.searchParams.get("limit") ?? 20);
      return fetch(`${POKEAPI_BASE_URL}pokemon?limit=${limit}&offset=${offset}`);
    }
    if (url.pathname.startsWith("/api/pokemon/")) {
      const id = url.pathname.split("/").pop();
      return fetch(`${POKEAPI_BASE_URL}pokemon/${id}`);
    }
    return new Response("Not found", { status: 404 });
  },
  port: 3001,
});