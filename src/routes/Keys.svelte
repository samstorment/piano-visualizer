<script lang="ts">
	import { get_notes, get_pitch, get_pitch_index, is_accidental, is_flat, is_natural, is_sharp, type Note, type NoteRange } from "$lib";
	import { display_types, type Display, type Piano } from "$lib/piano.svelte";
	import type { Rack } from "$lib/rack.svelte";
	import { play_note } from "$lib/sound";
	import { fly, slide } from "svelte/transition";

    interface Props {
        rack: Rack,
        piano: Piano
    }

    let { 
        piano = $bindable(), 
        rack = $bindable() 
    }: Props = $props();

    let key_column = 1;

    let keys_div: HTMLDivElement;

    let notes = $derived(get_notes(piano.range).toArray());
    let naturals = $derived(notes.filter(is_natural));
    let accidentals =  $derived(notes.filter(is_accidental));

    let natural_columns = $derived.by(() => {
        let col_number = 0;
        return notes.map(n => is_natural(n) ? col_number++ : col_number);
    });


    let accidental_start = is_accidental(piano.range.low);
    let accidental_end = is_accidental(piano.range.high);

    let selected = $derived(rack.selected_id === piano.id);

    function handleNoteClick(note: Note) {
        piano.selected_note = note;
        rack.selected_id = piano.id;
        piano.play_highlighted_notes();
    }


</script>

<div in:fly={{ y: 200 }}>
    <div class="flex mb-2 gap-2 items-center overflow-auto">
        <button 
            class="flex gap-2 sticky left-0 bg-white"
            onclick={() => rack.selected_id = piano.id}
            class:selected
        >
            <div class="dot rounded-full border-4 border-zinc-200 aspect-square w-7 h-7 shadow"></div>
            <span class={{ 'w-8': true, 'text-zinc-500': !selected }}>{piano.selected_note}</span>
        </button>

        <select class="border px-2 rounded border-zinc-500" bind:value={piano.display} onchange={() => piano.play_highlighted_notes()}>
            {#each display_types as dt}
                <option value={dt}>{dt}</option>
            {/each}
        </select>

       

        {#if rack.pianos.length > 1}
            <button 
                class="border-2 rounded px-2 border-zinc-300 ml-auto" 
                onclick={() => rack.remove_piano(piano)}
            >
                Delete
            </button>
        {/if}
    </div>

    <div bind:this={keys_div} class="rounded-md shadow-inner shadow-zinc-500 relative flex overflow-auto p-4 scroll-smooth border-4 border-zinc-200"
        style="--natural-count: {naturals.length}; --accidental-count: {accidentals.length};"
        class:accidental-end={accidental_end}
        class:accidental-start={accidental_start}
        class:selected
    >
        <div class="keys">
            {#each notes as n, i}
                <button 
                    onclick={() => handleNoteClick(n)}
                    id={n}
                    class="key white border border-zinc-800 flex items-end justify-center shrink-0 pb-2 px-1 rounded-b-lg shadow-md"
                    class:highlighted={piano.highlighted_notes.includes(n)}
                    class:white={is_natural(n)}
                    class:black={is_accidental(n)}
                    style="--key-column: {natural_columns[i]};"
                >   
                    {get_pitch(n)}
                </button>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    .keys {
        display: grid;
        gap: 2px;
        position: relative;
        isolation: isolate;

        --height-white: 200px;
        --min-width-white: 35px;

        --height-black: calc(var(--height-white) * .66);
        --min-width-black: calc(var(--min-width-white) * .75);


        /* remove these three lines for wide keys with unconstrained size */
        --max-width-white: 50px;
        --max-width-black: calc(var(--max-width-white) * .75);
        /* max-width: fit-content; */
        /* margin: 0 auto; */
    }

    .key {
        transition: scale ease-in-out 100ms, padding ease-in-out 100ms, font-size ease-in-out 100ms;
        box-shadow: 0 5px 1px rgba(32,32,32,0.2);

        &:active {
            @apply text-sm;
            box-shadow: none;
            scale: 1 1.03;
            padding-bottom: .75rem;
        }
    }
    
    .key.white {
        grid-column: span 3;
        grid-row: 1;
        min-width: var(--min-width-white);
        max-width: var(--max-width-white);
        height: var(--height-white);


        &:is(:hover, :focus-visible) {
            @apply bg-zinc-200;
        }
    }

    .key.black {
        position: absolute;
        width: 100%;
        min-width: var(--min-width-black);
        max-width: var(--max-width-black);
        height: var(--height-black);
        aspect-ratio: 1 / 6;
        grid-row: 1;
        grid-column: calc(var(--key-column) * 3) / span 2;
        z-index: 1;

        @apply text-white bg-zinc-900 flex;

        &:is(:hover, :focus-visible) {
            @apply bg-black;
        }

        &:active {
            box-shadow: 0 3px 1px rgba(32,32,32,0.2);
        }
    }

    .key.highlighted {
        @apply !bg-yellow-500 !text-black;
    }

    .keys.selected {
        @apply border-yellow-500 rounded;
    }

    button.selected .dot {
        @apply bg-yellow-400 border-yellow-500 shadow-md;
    }
</style>
