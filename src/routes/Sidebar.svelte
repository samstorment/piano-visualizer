<script lang="ts">
	import { DisplayId, get_display } from "$lib/display";
	import { get_inversions, get_pitch, type Note, type NoteRange } from "$lib/music";
	import { type Piano } from '$lib/piano.svelte';
    import { play_note } from "$lib/sound";
	import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-svelte";
	import { fly, slide } from "svelte/transition";

    interface Props {
        piano: Piano,
        sidebar_open: boolean
    }

    let { 
        piano = $bindable(),
        sidebar_open = $bindable()
    }: Props = $props();

    let chords_open = $state(true);
    let scales_open = $state(true);

    function display_change(display_id: DisplayId) {
        piano.display_id = display_id;
        piano.play_highlighted_notes();
    }

    function inversion_click(inversion: number) {
        piano.inversion = inversion;
        piano.play_highlighted_notes();
    }
</script>

{#if sidebar_open}
    <aside 
        class={{ 
            "relative bg-white border-r border-zinc-900 min-h-0 flex flex-col overflow-auto": true,
            "min-w-60": sidebar_open
        }}
    >

        <div class="flex justify-between items-center font-bold px-2 py-2">
            <button onclick={() => display_change(piano.display_id)} class="text-left" class:hidden={!sidebar_open}>
                {get_pitch(piano.selected_note)} {piano.display.name}
            </button>

            <!-- <button class="toggle border bg-white border-black rounded shadow top-4 hover:shadow"
                onclick={() => open = !open}
            >
                <span class="sr-only">Toggle Sidebar</span>
                {#if open}<ChevronLeft />{:else}<ChevronRight />{/if}
            </button> -->
        </div>

        <div class="shadow-inner bg-zinc-100 p-2"></div>

        <details bind:open={chords_open}>
            <summary class="cursor-pointer flex justify-between hover:bg-zinc-200 items-center px-2 py-2 font-bold border-b">
                <span>Scales</span>
                {#if chords_open}<ChevronRight />{:else}<ChevronDown />{/if}
            </summary>
            <div class="flex flex-col gap-1 p-2 border-b shadow-inner bg-zinc-100">
                {@render display_button(DisplayId.MAJOR_SCALE)}
                {@render display_button(DisplayId.MINOR_SCALE)}
            </div>
        </details>

        <details bind:open={scales_open}>
            <summary class="cursor-pointer flex justify-between hover:bg-zinc-200 items-center px-2 py-2 font-bold border-b">
                <span>Chords</span>
                {#if scales_open}<ChevronRight />{:else}<ChevronDown />{/if}
            </summary>
            <div class="flex flex-col gap-1 p-2 border-b shadow-inner bg-zinc-100">
                {@render display_button(DisplayId.MAJOR_CHORD)}
                {@render display_button(DisplayId.MINOR_CHORD)}
                {@render display_button(DisplayId.DIMINISHED_CHORD)}
                {@render display_button(DisplayId.AUGMENTED_CHORD)}
                {@render display_button(DisplayId.SUS2_CHORD)}
                {@render display_button(DisplayId.SUS4_CHORD)}
                {@render display_button(DisplayId.MAJOR7_CHORD)}
                {@render display_button(DisplayId.MINOR7_CHORD)}
                {@render display_button(DisplayId.DOMINANT7_CHORD)}
                {@render display_button(DisplayId.DIMINISHED7_CHORD)}
            </div>
        </details>
    </aside>
{/if}


{#snippet display_button(display_id: DisplayId)}
    {@const display = get_display(display_id)}
    {@const highlighted = piano.display_id === display_id}
    <button 
        onclick={() => display_change(display_id)}
        class={{ 
            "text-left border-l-4 border-transparent p-1 rounded hover:bg-yellow-500": true, 
            "bg-yellow-500": highlighted
        }}
    >
        {display.name}
    </button>
    {#if highlighted && piano.inversions.length > 0 && piano.display.type === 'chord'}
        <div class="text-sm p-2 border rounded shadow-inner bg-white">
            <p class="mb-1">Inversions</p>
            <ul class="flex gap-2">
                {#each piano.inversions as _, i}
                    <li>
                        <button 
                            class={{ 
                                "rounded-full w-7 h-7": true,
                                "bg-zinc-100": i !== piano.inversion,
                                "bg-yellow-500": i === piano.inversion
                            }} 
                            onclick={() => inversion_click(i)}
                        >
                            {i}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
{/snippet}


<style lang="postcss">
    summary {
        list-style-type: none;
    }
</style>