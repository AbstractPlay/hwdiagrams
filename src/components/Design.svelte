<script lang="ts">
    import { universe } from "@/stores/writeUniverse";
    import type { System } from "@/schemas/homeworlds";
    import ButtonBar from "./Design/ButtonBar.svelte";
    import EditSystem from "./Design/System.svelte";
    import View from "./View.svelte";
    import { onMount } from "svelte";

    let numPlayers: "2" | "3" | "4" = "2";
    let showSystem = false;
    let inSystem: System | undefined = undefined;

    onMount(() => {
        universe.subscribe(refreshUniverse);
    });

    const refreshUniverse = () => {
        numPlayers = $universe.numPlayers.toString() as "2" | "3" | "4";
    };

    const handleCloseSystem = () => {
        showSystem = false;
        inSystem = undefined;
    };

    let updateSystem = 0;
    const handlePreviewClick = (row: number, col: number, piece: string) => {
        if (row === 0 && col == 0) {
            showSystem = false;
            inSystem = undefined;
            const [sys] = piece.split("|");
            const system = $universe.universe.find((s) => s.name === sys);
            if (system !== undefined) {
                inSystem = { ...system };
                showSystem = true;
                updateSystem++;
            }
        }
    };
</script>

<ButtonBar />

<div class="columns">
    <div class="column is-one-half">
        <div class="field">
            <label class="label" for="numPlayers"
                >Number of players in this game</label
            >
            <div class="select">
                <select
                    name="numPlayers"
                    bind:value="{numPlayers}"
                    on:change="{() =>
                        ($universe.numPlayers = parseInt(numPlayers, 10))}"
                >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
        </div>
        <div class="control">
            <button
                class="button is-small apButton"
                disabled="{showSystem}"
                on:click="{() => (showSystem = true)}">Add system</button
            >
            <p class="help">To edit a system, click on it in the preview.</p>
        </div>
        {#key updateSystem}
            {#if showSystem}
                <EditSystem
                    inSystem="{inSystem}"
                    numPlayers="{numPlayers}"
                    closeHandler="{handleCloseSystem}"
                />
            {/if}
        {/key}
    </div>
    <div class="column">
        <View handleClick="{handlePreviewClick}" />
    </div>
</div>
