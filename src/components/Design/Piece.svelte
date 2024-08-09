<script lang="ts">
    import {
        render as APRender,
        type APRenderRep,
    } from "@abstractplay/renderer";
    import type { IRenderOptions } from "@abstractplay/renderer";
    import { onMount } from "svelte";
    import { customAlphabet } from "nanoid";
    const nanoid = customAlphabet(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        5,
    );
    const coloursOrdered = ["R", "B", "G", "Y"];
    const owner2rotation = new Map<"N" | "E" | "S" | "W", number>([
        ["N", 180],
        ["E", 270],
        ["S", 0],
        ["W", 90],
    ]);

    export let colour: "R" | "G" | "B" | "Y";
    export let size: "1" | "2" | "3";
    export let owner: "N" | "E" | "S" | "W" | undefined = undefined;
    export let clickHandler: ((pc: string) => void) | undefined = undefined;

    let options: IRenderOptions = {};
    let previewDiv: HTMLDivElement;
    onMount(() => {
        const buffer = 5;
        const svgid = nanoid(10);
        const opts: IRenderOptions = { ...options, divelem: previewDiv, svgid };
        const newkey = nanoid(5);
        let pcname: string;
        if (owner === undefined) {
            pcname =
                size === "1"
                    ? "pyramid-up-small-upscaled"
                    : size === "2"
                      ? "pyramid-up-medium-upscaled"
                      : "pyramid-up-large-upscaled";
        } else {
            pcname =
                size === "1"
                    ? "pyramid-flat-small"
                    : size === "2"
                      ? "pyramid-flat-medium"
                      : "pyramid-flat-large";
        }
        const renderrep: APRenderRep = {
            board: null,
            legend: {
                [newkey]: {
                    name: pcname,
                    colour: coloursOrdered.findIndex((c) => c === colour) + 1,
                    rotate: owner !== undefined ? owner2rotation.get(owner) : 0,
                },
            },
            pieces: `${newkey}`,
        };
        try {
            previewDiv.innerHTML = "";
            APRender(renderrep, opts);
            const svg = document.getElementById(svgid);
            if (svg !== null) {
                const vb = svg.getAttribute("viewBox");
                if (vb !== null) {
                    const [x, y, width, height] = vb
                        .split(" ")
                        .map((n) => parseInt(n, 10));
                    svg.setAttribute(
                        "viewBox",
                        `${x - buffer} ${y - buffer} ${width + buffer * 2} ${
                            height + buffer * 2
                        }`,
                    );
                } else {
                    console.log(
                        `Could not find the viewbox for svgid ${svgid}`,
                    );
                }
            } else {
                console.log(`Could not find svgid ${svgid}`);
            }
        } catch (err) {
            console.log(err);
            previewDiv.innerHTML = `<p>Unable to render the piece with the current parameters.</p>`;
        }
    });
</script>

<div
    class="piece"
    bind:this="{previewDiv}"
    on:click="{() =>
        clickHandler !== undefined
            ? clickHandler([colour, size].join(''))
            : null}"
></div>

<style>
    .piece {
        width: 4em;
        height: 4em;
    }
</style>
