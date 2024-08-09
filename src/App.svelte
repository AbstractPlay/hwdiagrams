<script lang="ts">
    import { SvelteToast } from "@zerodevx/svelte-toast";

    import logo from "./assets/AbstractPlayLogo.svg";
    import Design from "./components/Design.svelte";
    import View from "./components/View.svelte";

    const optionsToast = {};

    let activeTab: "start" | "view" = "start";
</script>

<main class="container p-6">
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <a href="https://play.abstractplay.com">
                    <img
                        src="{logo}"
                        class="logo svelte"
                        alt="Abstract Play Logo"
                    />
                </a>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <div>
                    <p class="title">Homeworlds Diagram Generator</p>
                    <div>
                        <!-- svelte-ignore missing-declaration -->
                        <p class="subtitle">Version: {__APP_VERSION__}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="content">
        <p>
            This tool lets you quickly generate <a
                href="https://play.abstractplay.com/games/homeworlds"
                >Homeworlds</a
            >
            diagrams for illustration and discussion. This tool leverages the
            <a href="https://play.abstractplay.com">Abstract Play</a> rendering engine.
            All are invited to come play Homeworlds with us! To report issues or suggest improvements, come <a href="https://discord.abstractplay.com">join us on Discord.</a>
        </p>
    </div>

    <div class="tabs is-boxed">
        <ul>
            <li class="{activeTab === 'start' ? 'is-active' : ''}">
                <a on:click="{() => (activeTab = 'start')}">
                    Define Universe
                </a>
            </li>
            <li class="{activeTab === 'view' ? 'is-active' : ''}">
                <a on:click="{() => (activeTab = 'view')}"> View Results </a>
            </li>
        </ul>
    </div>

    <div>
        {#if activeTab === "start"}
            <Design />
        {:else}
            <View />
        {/if}
    </div>
</main>

<SvelteToast options="{optionsToast}" />

<style>
    .logo {
        height: 8em;
        padding: 1.5em;
    }
</style>
