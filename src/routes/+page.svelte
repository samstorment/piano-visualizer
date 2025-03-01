<script lang="ts">
    import { create_rack } from "$lib/rack.svelte";
	import Sidebar from "./Sidebar.svelte";
	import Footer from "./Footer.svelte";
	import Rack from "./Rack.svelte";

    let rack = $state(create_rack());
    let initialized = $state(true);

    // load rack saved in local storage
    // don't really like that this causes a load but its a useful feature
    // onMount(() => {
    //     if (!browser) {
    //         initialized = true;
    //         return;
    //     }

    //     const stored_json = localStorage.getItem('rack');

    //     if (!stored_json) {
    //         initialized = true;
    //         return;
    //     }

    //     const stored = JSON.parse(stored_json) as Rack;

    //     rack = create_rack({ 
    //         ...stored, 
    //         pianos: stored.pianos.map(create_piano)
    //     });

    //     rack.selected_id = stored.selected_id;

    //     initialized = true;
    // });

    // $effect(() => {
    //     if (!browser) return;
    //     localStorage.setItem('rack', JSON.stringify($state.snapshot(rack)));
    // });
</script>

<div class="flex">
    <Sidebar bind:piano={rack.selected_piano} />

    <main class="flex flex-col flex-1 min-w-0 min-h-dvh">
        <Rack bind:rack />
        <Footer bind:rack />
    </main>
</div>