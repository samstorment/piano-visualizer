<script lang="ts">
	import { get_augmented_triad, get_diminished_7, get_diminished_triad, get_dominant_7, get_major_7, get_major_key, get_major_triad, get_minor_7, get_minor_key, get_minor_triad, get_sus_2, get_sus_4, type Note, type NoteRange } from "$lib";
	import { createPiano, type Display } from "$lib/piano.svelte";
	import { create_rack } from "$lib/rack.svelte";
	import { play_note } from "$lib/sound";
	import Keys from "./Keys.svelte";
	import Sidebar from "./Sidebar.svelte";

    let rack = $state(create_rack({
        pianos: [
            createPiano(),
            createPiano()
        ]
    }));

    let small_keys = $state(false);
    let grid_cols = $state(1);


    function toggleKeySize() {
        small_keys = !small_keys;

        let key_size = small_keys ? '1.75rem' : '2.5rem';

        document.querySelectorAll<HTMLDivElement>('.keys')
            .forEach(k => k.style.setProperty('--key-width', key_size));
    }
</script>

<div class="flex">
    <Sidebar bind:piano={rack.selected_piano} />

    <div class="flex flex-col flex-1 min-w-0">
        <div 
            class={{
                "grid gap-4 p-4": true,
                "grid-cols-1": grid_cols === 1,
                "grid-cols-2": grid_cols === 2,
                "grid-cols-3": grid_cols === 3,
                "grid-cols-4": grid_cols === 4,
            }}
        >
            {#each rack.pianos as _, i}
                <Keys bind:piano={rack.pianos[i]} bind:rack />
            {/each}

        </div>
        <div class="flex gap-2 items-center p-2 border-t border-black bg-white mt-auto sticky bottom-0">
            <button 
                class="border rounded px-2 border-zinc-500" 
                class:selected={grid_cols === 1}
                onclick={() => grid_cols = 1}
            >
                List
            </button>
            <button 
                class="border rounded px-2 border-zinc-500" 
                class:selected={grid_cols === 2}
                onclick={() => grid_cols = 2}
            >
                Grid 2
            </button>
            <button 
                class="border rounded px-2 border-zinc-500" 
                class:selected={grid_cols === 3}
                onclick={() => grid_cols = 3}
            >
                Grid 3
            </button>
            <button 
                class="border rounded px-2 border-zinc-500" 
                class:selected={grid_cols === 4}
                onclick={() => grid_cols = 4}
            >
                Grid 4
            </button>
        
            <!-- <span>|</span>

            <button 
                class="border rounded px-2 border-zinc-500"
                class:selected={small_keys}
                onclick={toggleKeySize}
            >
            Small Keys</button> -->

            <span>|</span>

            <button 
                class="border rounded px-2 border-zinc-900 bg-yellow-500"
                onclick={() => rack.pianos.push(createPiano())}
            >
                Add Piano +
            </button>

           
        </div>
    </div>
</div>


<style lang="postcss">
    .selected {
        @apply outline outline-yellow-500
    }
</style>
