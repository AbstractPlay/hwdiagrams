<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import {
        render as APRender,
        type APRenderRep,
    } from "@abstractplay/renderer";
    import type { IRenderOptions } from "@abstractplay/renderer";
    import { wng } from "@/lib/namegenerator";
    import type { System } from "@/schemas/homeworlds";
    import { onMount } from "svelte";
    import { universe } from "@/stores/writeUniverse";
    import { customAlphabet } from "nanoid";
    const nanoid = customAlphabet(
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        5,
    );
    import Piece from "./Piece.svelte";
    import Modal from "../Modal.svelte";

    export let inSystem: System | undefined;
    export let numPlayers: "2" | "3" | "4";
    export let closeHandler: () => void;

    let ownersOrdered: ("N" | "E" | "S" | "W")[] = ["N", "S", "E", "W"];
    const seatToName = new Map<string, string>([
        ["N", "North"],
        ["S", "South"],
        ["E", "East"],
        ["W", "West"],
    ]);
    let system: Writable<System>;
    let fixedSystem = false;
    onMount(() => {
        if (inSystem !== undefined) {
            fixedSystem = true;
            system = writable(JSON.parse(JSON.stringify(inSystem)) as System);
            owner = $system.owner || "periphery";
        } else {
            system = writable({
                name: wng(),
                stars: [],
                ships: [],
            } as System);
        }
        refreshRender();
        system.subscribe(refreshEconomy);
        system.subscribe(refreshRender);
        system.subscribe(validateSystem);
    });

    let sysPreview: HTMLDivElement;
    let showSelect = false;
    let selectTitle: string | undefined;
    let selectOwner: "N" | "E" | "S" | "W" | undefined;
    const handleSelectClick = (pc: string) => {
        // star
        if (selectOwner === undefined) {
            $system.stars = [...$system.stars, pc].slice(-2) as
                | [string]
                | [string, string];
        }
        // ship
        else {
            $system.ships = [...$system.ships, [pc, selectOwner].join("")];
        }
        $system = $system;
        showSelect = false;
    };

    // After every update, update the economy
    type AvailablePiece = {
        size: "1" | "2" | "3";
        colour: "R" | "G" | "B" | "Y";
    };
    let economy: AvailablePiece[] = [];
    const refreshEconomy = () => {
        const stash: string[] = [];
        // initialize with everything
        for (const colour of ["R", "G", "B", "Y"] as const) {
            for (const size of ["1", "2", "3"] as const) {
                for (let i = 0; i <= parseInt(numPlayers, 10); i++) {
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
        // remove any in the current system
        if (system !== undefined) {
            for (const star of $system.stars) {
                const idx = stash.findIndex((p) => p === star);
                if (idx !== -1) {
                    stash.splice(idx, 1);
                }
            }
            for (const ship of $system.ships) {
                const pc = ship.substring(0, 2);
                const idx = stash.findIndex((p) => p === pc);
                if (idx !== -1) {
                    stash.splice(idx, 1);
                }
            }
        }
        const unique = new Set(stash);
        economy = [];
        for (const pc of unique) {
            const [colour, size] = pc.split("");
            economy.push({
                colour: colour as "R" | "G" | "B" | "Y",
                size: size as "1" | "2" | "3",
            });
        }
    };
    universe.subscribe(refreshEconomy);

    // after every update, redraw the system
    const refreshRender = () => {
        if (sysPreview === undefined) {
            return;
        }
        const buffer = 5;
        const svgid = nanoid(10);
        const opts: IRenderOptions = {
            divelem: sysPreview,
            svgid,
            boardClick: handleSystemClick,
        };
        const renderrep: APRenderRep = JSON.parse(
            `{"options":["hw-system-only"],"renderer":"homeworlds","legend":{"R1":{"name":"pyramid-up-small-upscaled","colour":1},"R2":{"name":"pyramid-up-medium-upscaled","colour":1},"R3":{"name":"pyramid-up-large-upscaled","colour":1},"B1":{"name":"pyramid-up-small-upscaled","colour":2},"B2":{"name":"pyramid-up-medium-upscaled","colour":2},"B3":{"name":"pyramid-up-large-upscaled","colour":2},"G1":{"name":"pyramid-up-small-upscaled","colour":3},"G2":{"name":"pyramid-up-medium-upscaled","colour":3},"G3":{"name":"pyramid-up-large-upscaled","colour":3},"Y1":{"name":"pyramid-up-small-upscaled","colour":4},"Y2":{"name":"pyramid-up-medium-upscaled","colour":4},"Y3":{"name":"pyramid-up-large-upscaled","colour":4},"pR1N":{"name":"pyramid-flat-small","colour":1,"rotate":180},"pR2N":{"name":"pyramid-flat-medium","colour":1,"rotate":180},"pR3N":{"name":"pyramid-flat-large","colour":1,"rotate":180},"pB1N":{"name":"pyramid-flat-small","colour":2,"rotate":180},"pB2N":{"name":"pyramid-flat-medium","colour":2,"rotate":180},"pB3N":{"name":"pyramid-flat-large","colour":2,"rotate":180},"pG1N":{"name":"pyramid-flat-small","colour":3,"rotate":180},"pG2N":{"name":"pyramid-flat-medium","colour":3,"rotate":180},"pG3N":{"name":"pyramid-flat-large","colour":3,"rotate":180},"pY1N":{"name":"pyramid-flat-small","colour":4,"rotate":180},"pY2N":{"name":"pyramid-flat-medium","colour":4,"rotate":180},"pY3N":{"name":"pyramid-flat-large","colour":4,"rotate":180},"pR1S":{"name":"pyramid-flat-small","colour":1},"pR2S":{"name":"pyramid-flat-medium","colour":1},"pR3S":{"name":"pyramid-flat-large","colour":1},"pB1S":{"name":"pyramid-flat-small","colour":2},"pB2S":{"name":"pyramid-flat-medium","colour":2},"pB3S":{"name":"pyramid-flat-large","colour":2},"pG1S":{"name":"pyramid-flat-small","colour":3},"pG2S":{"name":"pyramid-flat-medium","colour":3},"pG3S":{"name":"pyramid-flat-large","colour":3},"pY1S":{"name":"pyramid-flat-small","colour":4},"pY2S":{"name":"pyramid-flat-medium","colour":4},"pY3S":{"name":"pyramid-flat-large","colour":4},"pR1E":{"name":"pyramid-flat-small","colour":1,"rotate":270},"pR2E":{"name":"pyramid-flat-medium","colour":1,"rotate":270},"pR3E":{"name":"pyramid-flat-large","colour":1,"rotate":270},"pB1E":{"name":"pyramid-flat-small","colour":2,"rotate":270},"pB2E":{"name":"pyramid-flat-medium","colour":2,"rotate":270},"pB3E":{"name":"pyramid-flat-large","colour":2,"rotate":270},"pG1E":{"name":"pyramid-flat-small","colour":3,"rotate":270},"pG2E":{"name":"pyramid-flat-medium","colour":3,"rotate":270},"pG3E":{"name":"pyramid-flat-large","colour":3,"rotate":270},"pY1E":{"name":"pyramid-flat-small","colour":4,"rotate":270},"pY2E":{"name":"pyramid-flat-medium","colour":4,"rotate":270},"pY3E":{"name":"pyramid-flat-large","colour":4,"rotate":270},"pR1W":{"name":"pyramid-flat-small","colour":1,"rotate":90},"pR2W":{"name":"pyramid-flat-medium","colour":1,"rotate":90},"pR3W":{"name":"pyramid-flat-large","colour":1,"rotate":90},"pB1W":{"name":"pyramid-flat-small","colour":2,"rotate":90},"pB2W":{"name":"pyramid-flat-medium","colour":2,"rotate":90},"pB3W":{"name":"pyramid-flat-large","colour":2,"rotate":90},"pG1W":{"name":"pyramid-flat-small","colour":3,"rotate":90},"pG2W":{"name":"pyramid-flat-medium","colour":3,"rotate":90},"pG3W":{"name":"pyramid-flat-large","colour":3,"rotate":90},"pY1W":{"name":"pyramid-flat-small","colour":4,"rotate":90},"pY2W":{"name":"pyramid-flat-medium","colour":4,"rotate":90},"pY3W":{"name":"pyramid-flat-large","colour":4,"rotate":90}},"board":[],"pieces":[]}`,
        );
        renderrep.board = [
            {
                name: $system.name || "",
                seat: $system.owner,
                // @ts-ignore
                stars: $system.stars !== undefined ? [...$system.stars] : [],
            },
        ];
        renderrep.pieces =
            $system.ships !== undefined
                ? [$system.ships.map((s) => `p${s}`)]
                : [];
        try {
            sysPreview.innerHTML = "";
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
            sysPreview.innerHTML = `<p>Unable to render the system with the current parameters.</p>`;
        }
    };
    $: if (sysPreview !== undefined) {
        refreshRender();
    }

    let validationResults: { errors: string[]; warnings: string[] } = {
        errors: [],
        warnings: [],
    };
    const validateSystem = () => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // stars
        if ($system.stars.length === 0) {
            errors.push("Every system needs at least one star.");
        } else {
            if ($system.stars.length === 1 && $system.owner !== undefined) {
                warnings.push(
                    "Home systems typically have two stars. But you can proceed with just one.",
                );
            }
            if (
                ($system.stars.length > 1 && $system.owner === undefined) ||
                $system.stars.length > 2
            ) {
                errors.push("Too many stars. Click to delete one.");
            }
        }

        // ships
        if ($system.ships.length === 0) {
            errors.push("Every system needs at least one ship.");
        } else {
            if ($system.owner !== undefined) {
                const owned = $system.ships.filter((s) =>
                    s.endsWith($system.owner!),
                );
                if (owned.length === 0) {
                    warnings.push(
                        "This home system has no ships belonging to its owner. This is usually not intended.",
                    );
                }
            }
        }

        // system names
        const idx = $universe.universe.findIndex(
            (s) => s.name === $system.name,
        );
        if (idx > -1 && fixedSystem) {
            warnings.push(
                "A system with this name already exists. Saving this system will replace the existing one.",
            );
        } else if (idx > -1 && !fixedSystem) {
            errors.push(
                "A system with this name already exists. To edit an existing system, click on it in the preview.",
            );
        }

        // system owners
        if ($system.owner !== undefined) {
            const seatIdx = $universe.universe.findIndex(
                (s) => s.owner === $system.owner,
            );
            if (idx > -1 && !fixedSystem) {
                errors.push(
                    "A system already exists with this owner. To edit an existing system, click on it in the preview.",
                );
            }
        }

        validationResults = {
            errors,
            warnings,
        };
    };

    let owner: "N" | "E" | "S" | "W" | "periphery";
    const handleOwnerChange = () => {
        if (owner === "periphery") {
            delete $system.owner;
        } else {
            $system.owner = owner;
        }
        $system = $system;
    };

    const handleSystemClick = (row: number, col: number, piece: string) => {
        const [, id] = piece.split("|");
        if (id.startsWith("p")) {
            const pc = id.substring(1);
            const idx = $system.ships.findIndex((s) => s === pc);
            if (idx !== -1) {
                $system.ships.splice(idx, 1);
            } else {
                console.log(`Could not find ship ${pc} to delete.`);
            }
        } else {
            const idx = $system.stars.findIndex((s) => s === id);
            if (idx !== -1) {
                $system.stars.splice(idx, 1);
            } else {
                console.log(`Could not find star ${id} to delete.`);
            }
        }
        $system = $system;
    };

    const addSystem = () => {
        if (validationResults.errors.length === 0) {
            const idx = $universe.universe.findIndex(
                (s) => s.name === $system.name,
            );
            if (idx === -1) {
                $universe.universe.push($system);
            } else {
                $universe.universe.splice(idx, 1, { ...$system });
            }
            $universe = $universe;
            closeHandler();
        }
    };

    const delSystem = () => {
        $universe.universe = $universe.universe.filter(
            (s) => s.name !== $system.name,
        );
        $universe = $universe;
        closeHandler();
    };
</script>

{#if system !== undefined}
    <section>
        {#if validationResults.errors.length > 0 || validationResults.warnings.length > 0}
            <div id="validationResults">
                {#each validationResults.errors as error}
                    <p class="help is-danger">{error}</p>
                {/each}
                {#each validationResults.warnings as warning}
                    <p class="help is-warning">{warning}</p>
                {/each}
            </div>
        {:else if validationResults.errors.length === 0 || validationResults.warnings.length === 0}
            <div id="validationResults">
                <p class="help is-success">System valid.</p>
            </div>
        {/if}
        <div class="columns">
            <div class="column is-narrow">
                <div class="field">
                    <label class="label" for="sysName"
                        >Give the system a name</label
                    >
                    <div class="control">
                        <input
                            class="input"
                            type="text"
                            name="sysName"
                            bind:value="{$system.name}"
                            readonly="{fixedSystem}"
                        />
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="sysOwner"
                        >Who owns this system?</label
                    >
                    <div class="control">
                        <div class="select">
                            <select
                                name="sysOwner"
                                bind:value="{owner}"
                                on:change="{handleOwnerChange}"
                                disabled="{fixedSystem}"
                            >
                                <option value="periphery">Nobody</option>
                                {#each ownersOrdered
                                    .slice(0, parseInt(numPlayers, 10))
                                    .filter( (st) => (fixedSystem ? st === $system.owner : $universe.universe.find((sys) => sys.owner === st) === undefined), ) as seat}
                                    <option value="{seat}">{seat}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="control">
                    <button
                        class="button is-small apButton"
                        on:click="{() => {
                            selectOwner = undefined;
                            selectTitle = 'star';
                            showSelect = true;
                        }}">Add star</button
                    >
                </div>
                {#each ownersOrdered.slice(0, parseInt(numPlayers, 10)) as seat}
                    <div class="control">
                        <button
                            class="button is-small apButton"
                            on:click="{() => {
                                selectOwner = seat;
                                selectTitle = `ship for ${seatToName.get(seat)}`;
                                showSelect = true;
                            }}">{seatToName.get(seat)}: Add ship</button
                        >
                    </div>
                {/each}
            </div>
            <div class="column">
                <div id="sysPreview" bind:this="{sysPreview}"></div>
            </div>
        </div>
        <div class="field is-grouped">
            <div class="control">
                <button
                    class="button is-small apButton"
                    disabled="{validationResults.errors.length > 0}"
                    on:click="{addSystem}"
                    >{$universe.universe.find(
                        (s) => s.name === $system.name,
                    ) !== undefined
                        ? "Update"
                        : "Add"} system</button
                >
            </div>
            {#if fixedSystem}
                <div class="control">
                    <button
                        class="button is-small apButton"
                        on:click="{delSystem}">Delete system</button
                    >
                </div>
            {/if}
            <div class="control">
                <button
                    class="button is-small apButton"
                    on:click="{closeHandler}">Cancel</button
                >
            </div>
        </div>
    </section>
    {#key selectOwner}
        <Modal
            show="{showSelect}"
            title="{`Select ${selectTitle}`}"
            buttons="{[
                {
                    label: 'Cancel',
                    action: () => (showSelect = false),
                },
            ]}"
        >
            <div class="columns is-multiline">
                {#each economy as piece}
                    <div class="column">
                        <Piece
                            colour="{piece.colour}"
                            size="{piece.size}"
                            owner="{selectOwner}"
                            clickHandler="{handleSelectClick}"
                        />
                    </div>
                {/each}
            </div>
        </Modal>
    {/key}
{/if}

<style>
    section {
        padding: 1.5em;
        border: 1px solid #ccc;
    }
    div#validationResults {
        padding-bottom: 1em;
        margin-top: -1em;
    }
    div#sysPreview {
        min-width: 5em;
    }
</style>
