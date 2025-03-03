<script lang="ts">
	import { get_display_notes } from "$lib/display";
	import { get_notes, get_pitch, is_accidental, is_natural, type Note } from "$lib/music";
	import { play_note } from "$lib/sound";
	import type { Piano } from "$lib/stores/piano.svelte";
	import type { Rack } from "$lib/stores/rack.svelte";
	import { onMount } from "svelte";

    interface Props {
        rack: Rack,
        piano: Piano,
        selected: boolean
    }

    let { 
        piano = $bindable(), 
        rack = $bindable(),
        selected
    }: Props = $props();

    let keys_container_element: HTMLDivElement;

    let notes = $derived(Array.from(get_notes(piano.range)));
    let naturals = $derived(notes.filter(is_natural));
    let accidentals =  $derived(notes.filter(is_accidental));

    let accidental_start = $derived(is_accidental(piano.range.low));
    let accidental_end = $derived(is_accidental(piano.range.high));

    let natural_columns = $derived.by(() => {
        let col_number = 0;
        return notes.map(n => is_natural(n) ? col_number++ : col_number);
    });

    function handleNoteClick(note: Note) {
        if (piano.locked) {
            const notes = get_display_notes(note, piano.display_id);
            notes.forEach(n => play_note(n));
            rack.selected_id = piano.id;
            return;
        }

        piano.selected_note = note;
        rack.selected_id = piano.id;
        piano.play_highlighted_notes();
    }

    const scrollToSelected = () => {
        if (!keys_container_element) return;

        const highlighted_elements = Array.from(keys_container_element.querySelectorAll<HTMLElement>('.key.highlighted'));

        const first_note_element = highlighted_elements.at(0);
        const last_note_element = highlighted_elements.at(-1);

        if (!first_note_element || !last_note_element) return;

        const containerRect = keys_container_element.getBoundingClientRect();
        const firstNoteRect = first_note_element.getBoundingClientRect();
        const lastNoteRect = last_note_element.getBoundingClientRect();

        // Check if first or last note are overflowing the container
        if (lastNoteRect.right > containerRect.right || firstNoteRect.left < containerRect.left) {
            // Scroll first note to be 20px from the left
            const scrollLeft = keys_container_element.scrollLeft + (firstNoteRect.left - containerRect.left - firstNoteRect.width);            
            keys_container_element.scrollTo({ left: scrollLeft, behavior: 'instant' });
        }

    }

    onMount(() => {
        const observer = new ResizeObserver(scrollToSelected);
        if (keys_container_element) {
            observer.observe(keys_container_element);
        }
    })
</script>

<div bind:this={keys_container_element} class="keys-container rounded-md shadow-inner shadow-zinc-500 relative flex overflow-auto pb-3 px-2 scroll-smooth border-4 border-zinc-300"
    style="--natural-count: {naturals.length}; --accidental-count: {accidentals.length};"
    class:accidental-end={accidental_end}
    class:accidental-start={accidental_start}
    class:selected
>
    <div class="keys" class:w-full={rack.alignment === 'stretch'}>
        {#each notes as n, i}
            <button 
                onclick={() => handleNoteClick(n)}
                class="key white border border-zinc-800 flex items-end justify-center shrink-0 pb-2 px-1 rounded-b-lg shadow-md"
                class:highlighted={piano.highlighted_notes.includes(n)}
                class:white={is_natural(n)}
                class:black={is_accidental(n)}
                data-note={n}
                style="--key-column: {natural_columns[i]};"
            >   
                {get_pitch(n)}
            </button>
        {/each}
    </div>
</div>


<style lang="postcss">

    .keys {
        display: grid;
        gap: 2px;
        position: relative;
        isolation: isolate;

        --height-white: 125px;
        --min-width-white: 35px;

        --height-black: calc(var(--height-white) * .65);
        --min-width-black: calc(var(--min-width-white) * .75);

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
        height: var(--height-white);

        &:is(:hover, :focus-visible) {
            @apply bg-zinc-200;
        }
    }

    .key.black {
        position: absolute;
        width: 100%;
        min-width: var(--min-width-black);
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

    .keys-container.selected {
        @apply border-yellow-500;
    }
</style>