import { replacer, reviver } from "@/lib/serialization";
import type { HomeworldsDiagramGeneratorInput } from "@/schemas/homeworlds";
import { writable } from "svelte/store";

let storedSaves: Map<string, HomeworldsDiagramGeneratorInput> = new Map();
if (localStorage.getItem("saved") !== null) {
    storedSaves = JSON.parse(localStorage.getItem("saved")!, reviver);
}

export const savedUniverses = writable(storedSaves);

savedUniverses.subscribe((val) =>
    localStorage.setItem("saved", JSON.stringify(val, replacer)),
);
