<script lang="ts">
	import { get_notes, get_pitch, get_pitch_index, is_accidental, is_flat, is_natural, is_sharp, type Display, type Note, type NoteRange } from "$lib";
	import { play_note } from "$lib/sound";
	import { onMount } from "svelte";

    interface Props {
        range?: NoteRange,
        selected?: Note,
        highlighted: Note[],
        display: Display | undefined
    }

    let { 
        range = { low: 'A0', high: 'C8' },
        selected = $bindable(),
        highlighted,
        display = $bindable()
    }: Props = $props();

    let keys_div: HTMLDivElement;

    let notes = $derived(get_notes(range).toArray());
    let naturals = $derived(notes.filter(is_natural));
    let accidentals =  $derived(notes.filter(is_accidental));

    let accidental_start = is_accidental(range.low);
    let accidental_end = is_accidental(range.high);


    function handleNoteClick(note: Note) {
        selected = note;
        // highlighted.forEach(play_note);
        play_note(note);
    }

</script>

<div bind:this={keys_div} class="keys relative flex overflow-auto pb-4 scroll-smooth"
    class:accidental-end={accidental_end}
    class:accidental-start={accidental_start}
>
    {#each naturals as n}
        <button 
            onclick={() => handleNoteClick(n)}
            id={n}
            class="key white border border-zinc-800 flex items-end justify-center pb-4 shrink-0 rounded-b-lg shadow-md"
            class:highlighted={highlighted.includes(n)}
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
                class:highlighted={highlighted.includes(n)}
            >
                {get_pitch(n)}
            </button>

            {#if get_pitch_index(n) === 3 || get_pitch_index(n) === 10}
                <button class="key black invisible bg-black text-white flex items-end justify-center pb-4">{n}</button>
            {/if}
        {/each}
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
</style>
