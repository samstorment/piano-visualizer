<script lang="ts">
	import { fly } from "svelte/transition";
	import Header from "./Header.svelte";
	import Keys from "./Keys.svelte";
	import type { Rack } from "$lib/stores/rack.svelte";
	import type { Piano } from "$lib/stores/piano.svelte";

    
    interface Props {
        rack: Rack,
        piano: Piano,
    }

    let { 
        piano = $bindable(), 
        rack = $bindable() 
    }: Props = $props();

    let selected = $derived(rack.selected_id === piano.id);
</script>

<div in:fly={{ y: 200 }}>
    <Header bind:piano bind:rack {selected} />
    <Keys bind:piano bind:rack {selected} />
</div>