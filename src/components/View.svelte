<script lang="ts">
    import { onMount } from "svelte";
    import { universe } from "@/stores/writeUniverse";
    import type {
        AreaHWStash,
        APRenderRep,
        PiecesHomeworlds,
    } from "@abstractplay/renderer/build/schemas/schema";
    import {
        type IRenderOptions,
        render as APRender,
    } from "@abstractplay/renderer";
    import { customAlphabet } from "nanoid";
    const nanoid = customAlphabet(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        5,
    );

    export let handleClick:
        | ((row: number, col: number, piece: string) => void)
        | undefined = undefined;

    let jsonDataStr: string;
    onMount(() => {
        universe.subscribe(refreshRender);
        universe.subscribe(
            () =>
                (jsonDataStr =
                    "data:text/json;charset=utf-8," +
                    encodeURIComponent(JSON.stringify($universe))),
        );
    });

    let sysRender: HTMLDivElement;
    const getStash = (): AreaHWStash => {
        const stash: string[] = [];
        // initialize with everything
        for (const colour of ["R", "G", "B", "Y"] as const) {
            for (const size of ["1", "2", "3"] as const) {
                for (let i = 0; i <= $universe.numPlayers; i++) {
                    stash.push([colour, size].join(""));
                }
            }
        }
        // remove any in the existing universe
        for (const sys of $universe.universe) {
            if ("stars" in sys && Array.isArray(sys.stars)) {
                for (const star of sys.stars) {
                    const idx = stash.findIndex((p) => p === star);
                    if (idx !== -1) {
                        stash.splice(idx, 1);
                    }
                }
            }
            if ("ships" in sys && Array.isArray(sys.ships)) {
                for (const ship of sys.ships) {
                    const pc = ship.substring(0, 2);
                    const idx = stash.findIndex((p) => p === pc);
                    if (idx !== -1) {
                        stash.splice(idx, 1);
                    }
                }
            }
        }
        // generate final stash result
        const area: AreaHWStash = {
            type: "globalStash",
            R: "",
            B: "",
            G: "",
            Y: "",
        };
        for (const colour of ["R", "G", "B", "Y"] as const) {
            for (const size of ["1", "2", "3"] as const) {
                const count = stash.filter(
                    (p) => p === [colour, size].join(""),
                ).length;
                for (let i = 0; i < count; i++) {
                    area[colour] += size;
                }
            }
        }
        return area;
    };

    let mode: "light" | "dark" = "dark";
    const refreshRender = () => {
        if (sysRender === undefined || sysRender === null) {
            return;
        }
        const buffer = 5;
        const svgid = nanoid(10);
        const opts: IRenderOptions = {
            divelem: sysRender,
            svgid,
            boardClick: handleClick !== undefined ? handleClick : undefined,
        };
        const renderrep: APRenderRep = JSON.parse(
            `{"options": ["hw-no-buttons"],"renderer":"homeworlds","board":[],"pieces":[],"areas":[{"type":"globalStash","R":"111112222233333","G":"111112222233333","B":"111112222233333","Y":"111112222233333"}],"legend":{"R1":{"name":"pyramid-up-small-upscaled","colour":1},"R2":{"name":"pyramid-up-medium-upscaled","colour":1},"R3":{"name":"pyramid-up-large-upscaled","colour":1},"B1":{"name":"pyramid-up-small-upscaled","colour":2},"B2":{"name":"pyramid-up-medium-upscaled","colour":2},"B3":{"name":"pyramid-up-large-upscaled","colour":2},"G1":{"name":"pyramid-up-small-upscaled","colour":3},"G2":{"name":"pyramid-up-medium-upscaled","colour":3},"G3":{"name":"pyramid-up-large-upscaled","colour":3},"Y1":{"name":"pyramid-up-small-upscaled","colour":4},"Y2":{"name":"pyramid-up-medium-upscaled","colour":4},"Y3":{"name":"pyramid-up-large-upscaled","colour":4},"pR1N":{"name":"pyramid-flat-small","colour":1,"rotate":180},"pR2N":{"name":"pyramid-flat-medium","colour":1,"rotate":180},"pR3N":{"name":"pyramid-flat-large","colour":1,"rotate":180},"pB1N":{"name":"pyramid-flat-small","colour":2,"rotate":180},"pB2N":{"name":"pyramid-flat-medium","colour":2,"rotate":180},"pB3N":{"name":"pyramid-flat-large","colour":2,"rotate":180},"pG1N":{"name":"pyramid-flat-small","colour":3,"rotate":180},"pG2N":{"name":"pyramid-flat-medium","colour":3,"rotate":180},"pG3N":{"name":"pyramid-flat-large","colour":3,"rotate":180},"pY1N":{"name":"pyramid-flat-small","colour":4,"rotate":180},"pY2N":{"name":"pyramid-flat-medium","colour":4,"rotate":180},"pY3N":{"name":"pyramid-flat-large","colour":4,"rotate":180},"pR1S":{"name":"pyramid-flat-small","colour":1},"pR2S":{"name":"pyramid-flat-medium","colour":1},"pR3S":{"name":"pyramid-flat-large","colour":1},"pB1S":{"name":"pyramid-flat-small","colour":2},"pB2S":{"name":"pyramid-flat-medium","colour":2},"pB3S":{"name":"pyramid-flat-large","colour":2},"pG1S":{"name":"pyramid-flat-small","colour":3},"pG2S":{"name":"pyramid-flat-medium","colour":3},"pG3S":{"name":"pyramid-flat-large","colour":3},"pY1S":{"name":"pyramid-flat-small","colour":4},"pY2S":{"name":"pyramid-flat-medium","colour":4},"pY3S":{"name":"pyramid-flat-large","colour":4},"pR1E":{"name":"pyramid-flat-small","colour":1,"rotate":270},"pR2E":{"name":"pyramid-flat-medium","colour":1,"rotate":270},"pR3E":{"name":"pyramid-flat-large","colour":1,"rotate":270},"pB1E":{"name":"pyramid-flat-small","colour":2,"rotate":270},"pB2E":{"name":"pyramid-flat-medium","colour":2,"rotate":270},"pB3E":{"name":"pyramid-flat-large","colour":2,"rotate":270},"pG1E":{"name":"pyramid-flat-small","colour":3,"rotate":270},"pG2E":{"name":"pyramid-flat-medium","colour":3,"rotate":270},"pG3E":{"name":"pyramid-flat-large","colour":3,"rotate":270},"pY1E":{"name":"pyramid-flat-small","colour":4,"rotate":270},"pY2E":{"name":"pyramid-flat-medium","colour":4,"rotate":270},"pY3E":{"name":"pyramid-flat-large","colour":4,"rotate":270},"pR1W":{"name":"pyramid-flat-small","colour":1,"rotate":90},"pR2W":{"name":"pyramid-flat-medium","colour":1,"rotate":90},"pR3W":{"name":"pyramid-flat-large","colour":1,"rotate":90},"pB1W":{"name":"pyramid-flat-small","colour":2,"rotate":90},"pB2W":{"name":"pyramid-flat-medium","colour":2,"rotate":90},"pB3W":{"name":"pyramid-flat-large","colour":2,"rotate":90},"pG1W":{"name":"pyramid-flat-small","colour":3,"rotate":90},"pG2W":{"name":"pyramid-flat-medium","colour":3,"rotate":90},"pG3W":{"name":"pyramid-flat-large","colour":3,"rotate":90},"pY1W":{"name":"pyramid-flat-small","colour":4,"rotate":90},"pY2W":{"name":"pyramid-flat-medium","colour":4,"rotate":90},"pY3W":{"name":"pyramid-flat-large","colour":4,"rotate":90}}}`,
        );
        if (mode === "light") {
            renderrep.options!.push("hw-light");
        }
        renderrep.areas = [getStash()];
        renderrep.board = [];
        renderrep.pieces = [] as PiecesHomeworlds;
        for (const system of $universe.universe) {
            renderrep.board.push({
                name: system.name || "",
                seat: system.owner,
                stars: system.stars !== undefined ? [...system.stars] : [],
            });
            renderrep.pieces.push([...system.ships.map((s) => `p${s}`)]);
        }
        try {
            sysRender.innerHTML = "";
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
            console.log(renderrep);
            console.log(err);
            sysRender.innerHTML = `<p>Unable to render the universe with the current parameters.</p>`;
        }
    };
    $: if (sysRender !== undefined) {
        refreshRender();
    }

    let copied = false;
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify($universe));
            copied = true;
        } catch (err) {
            alert(`Failed to copy: ${err}`);
        }
    };
</script>

{#if handleClick === undefined}
    <div class="level">
        <div class="level-item">
            <div class="field">
                <div class="control">
                    <label class="radio" on:change="{refreshRender}">
                        <input
                            type="radio"
                            name="mode"
                            checked="{mode === 'dark'}"
                            on:click="{() => (mode = 'dark')}"
                        />
                        Dark
                    </label>
                    <label class="radio" on:change="{refreshRender}">
                        <input
                            type="radio"
                            name="mode"
                            checked="{mode === 'light'}"
                            on:click="{() => (mode = 'light')}"
                        />
                        Light
                    </label>
                </div>
            </div>
        </div>
        <div class="level-item">
            <div class="control">
                <button
                    class="button is-small apButton"
                    on:click="{copyToClipboard}"
                    >{copied ? "Copied!" : "Copy universe"}</button
                >
            </div>
        </div>
        <div class="level-item">
            <div class="control">
                <a
                    href="{jsonDataStr}"
                    download="{`universe-${new Date().toISOString()}.json`}"
                >
                    <button class="button is-small apButton"
                        >Download universe</button
                    >
                </a>
            </div>
        </div>
    </div>
{/if}

<div
    id="sysRender"
    class="{handleClick === undefined ? 'full' : 'preview'} has-text-left"
    bind:this="{sysRender}"
></div>

<style>
    div#sysRender.full {
        width: auto;
        height: 95vh;
    }
    div#sysRender.preview {
        width: auto;
        height: auto;
    }
</style>
