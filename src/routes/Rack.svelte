<script lang="ts">
	import type { Rack } from "$lib/rack.svelte";
	import { flip } from "svelte/animate";
	import Keys from "./Keys.svelte";

    interface Props {
        rack: Rack
    }

    let { 
        rack = $bindable() 
    }: Props = $props();
</script>

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
 