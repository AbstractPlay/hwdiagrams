import type { HomeworldsDiagramGeneratorInput } from "@/schemas/homeworlds";
import { writable } from "svelte/store";

export const blankUniverse: HomeworldsDiagramGeneratorInput = {
    numPlayers: 2,
    universe: [],
};

let storedUniverse: HomeworldsDiagramGeneratorInput = { ...blankUniverse };
if (localStorage.getItem("universe") !== null) {
    storedUniverse = JSON.parse(localStorage.getItem("universe")!);
}

export const universe = writable(storedUniverse);

universe.subscribe((val) =>
    localStorage.setItem("universe", JSON.stringify(val)),
);
