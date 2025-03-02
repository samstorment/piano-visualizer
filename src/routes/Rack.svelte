<script lang="ts">
	import type { Rack } from "$lib/rack.svelte";
	import { flip } from "svelte/animate";
	import Keys from "./Keys.svelte";
	import Sidebar from "./Sidebar.svelte";
	import Footer from "./Footer.svelte";

    interface Props {
        rack: Rack
    }

    let sidebar_open = $state(true);

    let { 
        rack = $bindable() 
    }: Props = $props();
</script>

<div class="flex flex-col h-full">
    <div class="flex flex-1 min-h-0">
        <Sidebar bind:piano={rack.selected_piano} bind:sidebar_open />
        <div class="flex-1 overflow-auto">
            <div class={{ "max-w-fit": true, "mx-auto": rack.alignment === "center", "ml-auto": rack.alignment === "right" }}>
                <ul 
                    class={{
                        "grid gap-4 p-4": true,
                        "grid-cols-1": rack.columns === 1 || rack.pianos.length === 1,
                        "grid-cols-2": rack.columns === 2 && rack.pianos.length > 1,
                        "grid-cols-3": rack.columns === 3 && rack.pianos.length > 1,
                        "grid-cols-4": rack.columns === 4 && rack.pianos.length > 1,
                    }}
                >
                    {#each rack.pianos as p, i (p)}
                        <li animate:flip={{ duration: 200 }}>
                            <Keys bind:piano={rack.pianos[i]} bind:rack />
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    <Footer bind:rack bind:sidebar_open />
</div>