<script lang="ts">
    import { onMount } from "svelte";

    /**
     * The last button passed must be the close button.
     */
    interface IModalButton {
        label: string;
        action: () => void;
    }
    export let title: string;
    export let show = false;
    export let buttons: IModalButton[];
    let closeAction: () => void;
    onMount(() => {
        closeAction = buttons[buttons.length - 1].action;
    });
</script>

<div class="modal{show ? ' is-active' : ''}" id="loadJSON">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{title}</p>
        </header>
        <section class="modal-card-body">
            <slot />
        </section>
        <footer class="modal-card-foot">
            <div class="field is-grouped">
                {#each buttons as btn, i}
                    <div class="control">
                        <button
                            class="{`button${
                                i !== buttons.length - 1
                                    ? ' apButton'
                                    : ' apButtonNeutral'
                            }`}"
                            on:click="{btn.action}"
                        >
                            {btn.label}
                        </button>
                    </div>
                {/each}
            </div>
        </footer>
    </div>
</div>

<style>
</style>
