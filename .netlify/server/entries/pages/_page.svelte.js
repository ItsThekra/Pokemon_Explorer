import { z as ensure_array_like, y as escape_html, F as attr_class, G as bind_props, w as pop, u as push, J as attr, K as maybe_selected } from "../../chunks/index.js";
function Card($$payload, $$props) {
  push();
  let poke = $$props["poke"];
  function typeColor(type) {
    switch (type.toLowerCase()) {
      case "fire":
        return "bg-red-600";
      case "water":
        return "bg-blue-600";
      case "grass":
        return "bg-green-600";
      case "electric":
        return "bg-yellow-400 text-black";
      case "poison":
        return "bg-purple-700";
      case "flying":
        return "bg-indigo-500";
      case "normal":
        return "bg-zinc-700";
      case "ground":
        return "bg-amber-700";
      case "psychic":
        return "bg-pink-500";
      case "ice":
        return "bg-cyan-300 text-black";
      default:
        return "bg-zinc-600";
    }
  }
  const each_array = ensure_array_like(poke.types);
  $$payload.out.push(`<button type="button" class="flex w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-800 px-4 py-5 text-left hover:bg-zinc-800"><div><h2 class="font-medium text-white capitalize">${escape_html(poke.name)}</h2> <p class="text-xs text-zinc-400">#${escape_html(poke.id)}</p></div> <div class="flex flex-wrap justify-end gap-2"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let t = each_array[$$index];
    $$payload.out.push(`<span${attr_class(`rounded-full px-2 py-1 text-xs capitalize ${typeColor(t)}`)}>${escape_html(t)}</span>`);
  }
  $$payload.out.push(`<!--]--></div></button>`);
  bind_props($$props, { poke });
  pop();
}
function SearchBar($$payload, $$props) {
  push();
  let search = "";
  $$payload.out.push(`<input type="text" placeholder="Search Pokémon..."${attr("value", search)} class="w-full sm:w-90 px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring focus:ring-purple-500"/>`);
  pop();
}
function _page($$payload, $$props) {
  push();
  let filteredPokemons;
  let pokemons = [];
  let searchTerm = "";
  let selectedType = "";
  let types = [];
  filteredPokemons = pokemons.filter((p) => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) && selectedType === "";
  });
  const each_array = ensure_array_like(types);
  const each_array_1 = ensure_array_like(filteredPokemons);
  $$payload.out.push(`<div class="flex h-screen flex-col overflow-hidden bg-black text-white md:flex-row"><aside class="w-full border-b border-zinc-800 bg-zinc-900 p-4 md:w-64 md:border-r md:border-b-0"><h1 class="mt-3 mb-15 text-xl font-bold">Pokémon Explorer</h1> <h3 class="mt-6 mb-5 text-white">Filter by Type</h3> <select class="w-full rounded-md bg-zinc-800 p-2 text-white">`);
  $$payload.select_value = selectedType;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>All Types</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let type = each_array[$$index];
    $$payload.out.push(`<option${attr("value", type)}${maybe_selected($$payload, type)}>${escape_html(type)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></aside> <main class="w-full overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4 md:w-[400px]">`);
  SearchBar($$payload);
  $$payload.out.push(`<!----> <div class="mt-4 h-[calc(100vh-120px)] space-y-2 overflow-y-auto pr-2"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let poke = each_array_1[$$index_1];
    Card($$payload, { poke });
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (filteredPokemons.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-6 text-center text-zinc-400">No Pokémon found.</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></main> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-30 ml-100 hidden text-center text-white md:block">Click on the Pokémon to explore features !</p>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
