<script lang="ts">
	import { create_piano, key_counts } from "$lib/piano.svelte";
    import { create_rack, type Rack } from "$lib/rack.svelte";
	import { Plus } from "lucide-svelte";
	import Keys from "./Keys.svelte";
	import Sidebar from "./Sidebar.svelte";
	import { flip } from "svelte/animate";
	import { onDestroy, onMount } from "svelte";
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

    <div class="flex flex-col flex-1 min-w-0 min-h-dvh">

        {#if initialized}
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
        {:else}
            <div class="p-4">Loading Your Keys</div>
        {/if}
        <footer class="flex gap-2 items-center p-2 border-t border-black bg-white mt-auto sticky bottom-0 overflow-auto">
    
            <select 
                name="keyboard-size" 
                id="keyboard-size" 
                class="border px-2 rounded border-zinc-500"
                bind:value={rack.columns}
            >
                <option value={1}>List</option>
                <option value={2}>Grid 2</option>
                <option value={3}>Grid 3</option>
                <option value={4}>Grid 4</option>
            </select>

            <select 
                name="keyboard-size" 
                id="keyboard-size" 
                class="border px-2 rounded border-zinc-500"
                bind:value={rack.key_count}
            >
                {#each key_counts as bs}
                    <option value={bs} selected={bs === rack.key_count}>{bs} Keys</option>
                {/each}
            </select>

            <select 
                class="border px-2 rounded border-zinc-500"
                bind:value={rack.alignment}
            >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>

            <button 
                class="border rounded px-2 border-yellow-900 bg-yellow-500 whitespace-nowrap flex items-center gap-2"
                onclick={() => rack.add_piano()}
            >
                Add Piano <Plus />
            </button>

            
           
        </footer>
    </div>
</div>