<script lang="ts">
    import { toast } from "@zerodevx/svelte-toast";
    import Modal from "@/components/Modal.svelte";
    import { blankUniverse, universe } from "@/stores/writeUniverse";
    import { savedUniverses } from "@/stores/writeSaved";
    import type { HomeworldsDiagramGeneratorInput } from "@/schemas/homeworlds";

    let showModalImport = false;
    let universeJSON: string | undefined;
    let fileInput: HTMLInputElement | undefined;

    let selectedSave = "";
    let saveName = "";

    const loadUniverseFromString = () => {
        if (universeJSON !== undefined) {
            try {
                const parsed = JSON.parse(
                    universeJSON,
                ) as HomeworldsDiagramGeneratorInput;
                universe.set(parsed);
            } catch (err) {
                toast.push(
                    `An error occured while trying to load the universe. See the console for details.`,
                );
                console.log("JSON input", universeJSON);
                console.log("Import error", err);
            } finally {
                showModalImport = false;
            }
        }
    };

    const readUniverseJSON = (e: Event) => {
        if (
            (e.target as HTMLInputElement).files !== null &&
            (e.target as HTMLInputElement).files!.length > 0
        ) {
            let file = (e.target as HTMLInputElement).files![0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                try {
                    const str = reader.result!.toString();
                    JSON.parse(str) as HomeworldsDiagramGeneratorInput;
                    universeJSON = str;
                } catch (err) {
                    toast.push(
                        `An error occured while trying to load the universe. See the console for details.`,
                    );
                    console.log("JSON input", reader.result!.toString());
                    console.log("Import error", err);
                } finally {
                    fileInput = undefined;
                }
            };
            reader.onerror = (e) => {
                toast.push("Error loading provided file (Not JSON?)");
                console.log(e);
            };
        }
    };

    const closeImportModal = () => {
        showModalImport = false;
        fileInput = undefined;
        universeJSON = undefined;
    };

    const loadSavedUniverse = () => {
        if (selectedSave !== "") {
            const saved = $savedUniverses.get(selectedSave);
            if (saved !== undefined) {
                universe.set(saved);
            } else {
                toast.push(
                    `Could not find the requested saved universe (${selectedSave}).`,
                );
            }
        }
    };

    const saveUniverse = () => {
        if (saveName !== "" && !/^\s+$/.test(saveName)) {
            $savedUniverses.set(saveName, $universe);
            $savedUniverses = $savedUniverses;
        }
    };
</script>

<div class="level">
    <div class="level-item">
        <div class="control">
            <button
                class="button is-small apButton"
                on:click="{() => (showModalImport = true)}"
                >Import universe</button
            >
        </div>
    </div>
    <div class="level-item">
        <div class="control">
            <div class="select is-small">
                <select
                    class="is-small"
                    name="savedList"
                    bind:value="{selectedSave}"
                >
                    <option value=""></option>
                    {#each $savedUniverses as u}
                        <option value="{u[0]}">{u[0]}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="control">
            <button
                class="button is-small apButton"
                on:click="{loadSavedUniverse}">Load saved universe</button
            >
        </div>
    </div>
    <div class="level-item">
        <div class="control">
            <input class="input is-small" type="text" bind:value="{saveName}" />
        </div>
        <div class="control">
            <button
                class="button is-small apButton"
                on:click="{saveUniverse}"
                disabled="{saveName === '' || /^\s+$/.test(saveName)}"
                >Save universe</button
            >
        </div>
    </div>
    <div class="level-item">
        <div class="control">
            <button
                class="button is-small apButton"
                on:click="{() => universe.set(blankUniverse)}"
                >Clear universe</button
            >
        </div>
    </div>
</div>

<Modal
    show="{showModalImport}"
    title="Import Universe"
    buttons="{[
        {
            label: 'Load JSON',
            action: loadUniverseFromString,
        },
        {
            label: 'Close',
            action: closeImportModal,
        },
    ]}"
>
    <div class="field">
        <div class="control">
            <textarea
                class="textarea"
                id="guessTxt"
                placeholder="Paste JSONhere"
                bind:value="{universeJSON}"
            ></textarea>
        </div>
        <p>Select JSON File</p>
        <div class="control">
            <input
                type="file"
                accept="application/json"
                class="input"
                placeholder="Select JSON Ship Config File"
                bind:this="{fileInput}"
                on:change="{readUniverseJSON}"
                on:click="{() => {
                    fileInput = undefined;
                }}"
            />
        </div>
    </div>
</Modal>
