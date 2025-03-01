<script lang="ts">
    import { create_rack, type Rack } from "$lib/rack.svelte";
	import Sidebar from "./Sidebar.svelte";
	import Footer from "./Footer.svelte";
	import RackComponent from "./Rack.svelte";
	import { onMount } from "svelte";
	import { create_piano } from "$lib/piano.svelte";
	import { browser } from "$app/environment";

    let rack = $state(create_rack());
    let initialized = $state(false);

    // load rack saved in local storage
    // don't really like that this causes a load but its a useful feature
    onMount(() => {
        if (!browser) {
            initialized = true;
            return;
        }

        const stored_json = localStorage.getItem('rack');

        if (!stored_json) {
            initialized = true;
            return;
        }

        const stored = JSON.parse(stored_json) as Rack;

        rack = create_rack({ 
            ...stored, 
            pianos: stored.pianos.map(create_piano)
        });

        rack.selected_id = stored.selected_id;

        initialized = true;
    });

    $effect(() => {
        if (!browser) return;
        localStorage.setItem('rack', JSON.stringify($state.snapshot(rack)));
    });
</script>

<div class="flex">
    <Sidebar bind:piano={rack.selected_piano} />

    <main class="flex flex-col flex-1 min-w-0 min-h-dvh">
        {#if initialized}
            <RackComponent bind:rack />
        {:else}
            <div class="p-4 text-center">
                Loading Your Keys
            </div>
        {/if}
        <Footer bind:rack />
    </main>
</div>