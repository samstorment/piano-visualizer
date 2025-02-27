<script lang="ts">
	import { createPiano, type BoardSize, type Display } from "$lib/piano.svelte";
	import { create_rack } from "$lib/rack.svelte";
	import { play_note } from "$lib/sound";
	import type { ChangeEventHandler } from "svelte/elements";
	import Keys from "./Keys.svelte";
	import Sidebar from "./Sidebar.svelte";
	import { flip } from "svelte/animate";

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

        <ul 
            class={{
                "grid gap-4 p-4": true,
                "grid-cols-1": grid_cols === 1,
                "grid-cols-2": grid_cols === 2,
                "grid-cols-3": grid_cols === 3,
                "grid-cols-4": grid_cols === 4,
            }}
        >
            {#each rack.pianos as p, i (p)}
                <li animate:flip={{ duration: 200 }}>
                    <Keys bind:piano={rack.pianos[i]} bind:rack />
                </li>
            {/each}

        </ul>
        <footer class="flex gap-2 items-center p-2 border-t border-black bg-white mt-auto sticky bottom-0 overflow-auto">
    
            <select 
                name="keyboard-size" 
                id="keyboard-size" 
                class="border px-2 rounded border-zinc-500"
                bind:value={grid_cols}
            >
                <option value={1}>List</option>
                <option value={2}>Grid 2</option>
                <option value={3}>Grid 3</option>
                <option value={4}>Grid 4</option>
            </select>
        
            <!-- <span>|</span>

            <button 
                class="border rounded px-2 border-zinc-500"
                class:selected={small_keys}
                onclick={toggleKeySize}
            >
            Small Keys</button> -->

            <span>|</span>

            <select 
                name="keyboard-size" 
                id="keyboard-size" 
                class="border px-2 rounded border-zinc-500"
                bind:value={rack.board_size}
            >
                <option value={25}>25 Keys</option>
                <option value={32}>32 Keys</option>
                <option value={37}>37 Keys</option>
                <option value={49}>49 Keys</option>
                <option value={61}>61 Keys</option>
                <option value={76}>76 Keys</option>
                <option value={88}>88 Keys</option>
            </select>

            <span>|</span>

            <button 
                class="border rounded px-2 border-yellow-900 bg-yellow-500 whitespace-nowrap"
                onclick={() => rack.pianos.push(createPiano())}
            >
                Add Piano +
            </button>

            
           
        </footer>
    </div>
</div>