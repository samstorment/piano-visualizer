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

    let keys_div: HTMLDivElement;

    let notes = $derived(get_notes(piano.range).toArray());
    let naturals = $derived(notes.filter(is_natural));
    let accidentals =  $derived(notes.filter(is_accidental));

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

    <div bind:this={keys_div} class="keys rounded-md shadow-inner shadow-zinc-500 relative flex overflow-auto p-4 scroll-smooth border-4 border-zinc-200"
        class:accidental-end={accidental_end}
        class:accidental-start={accidental_start}
        class:selected
    >
        {#each naturals as n}
            <button 
                onclick={() => handleNoteClick(n)}
                id={n}
                class="key white border border-zinc-800 flex items-end justify-center pb-4 shrink-0 rounded-b-lg shadow-md"
                class:highlighted={piano.highlighted_notes.includes(n)}
            >   
                {get_pitch(n)}
            </button>
        {/each}
        <div class="accidentals h-0 absolute flex"
            class:has-first-key={accidental_start}
        >
            {#each accidentals as n}
                <button 
                    id={n}
                    onclick={() => handleNoteClick(n)}
                    class="key black border border-zinc-800 flex items-end justify-center pb-4 rounded-b-lg shadow-md"
                    class:highlighted={piano.highlighted_notes.includes(n)}
                >
                    {get_pitch(n)}
                </button>

                {#if get_pitch_index(n) === 3 || get_pitch_index(n) === 10}
                    <button class="key black invisible bg-black text-white flex items-end justify-center pb-4">{n}</button>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    .keys {
        --key-width: 2.5rem; 
        --black-key-width: calc(var(--key-width) * 2/3);
        --key-height: calc(var(--key-width) * 6);
        --black-key-height: calc(var(--key-height) * 2/3);
        --key-gap: calc(var(--key-width) / 20);

        gap: var(--key-gap);
    }

    .keys.accidental-start {
        padding-left: calc(var(--black-key-width) / 2);
    }

    .keys.accidental-end {
        padding-right: calc(var(--black-key-width) / 2);
    }
    
    .key {
        transition: scale ease-in-out 100ms, padding ease-in-out 100ms, font-size ease-in-out 100ms;
        box-shadow: 0 5px 1px rgba(32,32,32,0.2);
        font-size: calc(var(--key-width) / 2.5);

        &:active {
            @apply text-sm;
            box-shadow: none;
            scale: 1 1.03;
            padding-bottom: .75rem;
        }
    }

    .key.highlighted {
        @apply !bg-yellow-500 !text-black;
    }

    .key.white {
        width: var(--key-width); 
        height: var(--key-height);

        &:is(:hover, :focus-visible) {
            @apply bg-zinc-200;
        }
    }

    .accidentals {
        translate: calc(var(--key-width) - var(--black-key-width) / 2);
        gap: calc(var(--key-width) - var(--black-key-width) + var(--key-gap));

    }

    .accidentals.has-first-key {
        translate: calc(var(--black-key-width) / 2 * -1);
    }

    .key.black {
        @apply text-white bg-zinc-900 flex;

        width: var(--black-key-width);
        height: var(--black-key-height); 

        &:is(:hover, :focus-visible) {
            @apply bg-black;
        }

        &:active {
            box-shadow: 0 3px 1px rgba(32,32,32,0.2);
        }
    }

    .keys.selected {
        @apply border-yellow-500 rounded;
    }

    button.selected .dot {
        @apply bg-yellow-400 border-yellow-500 shadow-md;
    }
</style>
