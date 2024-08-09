import { writable } from "svelte/store";

export interface IPreferences {
    rotation: number;
    mode: "light" | "dark";
    stars: boolean;
}

let initialState: IPreferences = {
    rotation: 0,
    mode: "dark",
    stars: true,
};
if (localStorage.getItem("preferences") !== null) {
    initialState = JSON.parse(localStorage.getItem("preferences")!);
}

export const preferences = writable(initialState);

preferences.subscribe((val) =>
    localStorage.setItem("preferences", JSON.stringify(val)),
);
