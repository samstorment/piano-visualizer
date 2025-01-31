<script lang="ts">
	import { get_pitch, type Note, type NoteRange } from "$lib";
	import { display_types, type Display, type Piano } from '$lib/piano.svelte';
    import { play_note } from "$lib/sound";

    interface Props {
        piano: Piano
    }

    let { piano = $bindable() }: Props = $props();

    function display_change(display: Display) {
        piano.display = display;
        piano.highlighted_notes.forEach(n => {
            play_note(n)
        });
    }
</script>


<aside class="sticky top-0 border-r border-zinc-900 h-dvh p-4 w-[200px] shrink-0 flex flex-col gap-4 overflow-auto">
    {#if !piano.selected_note}
        <h1 class="text-3xl font-serif">Select a Note</h1>
    {:else}
        <h1 class="text-3xl font-serif">{get_pitch(piano.selected_note)}</h1>

        {#each display_types as dt}
            <button 
                onclick={() => display_change(dt)}
                class:highlighted={piano.display === dt}
            >
                {dt}
            </button>
        {/each}
    {/if}
</aside>


<style lang="postcss">
    button {
        @apply border p-2 border-zinc-500 rounded-sm w-full hover:bg-zinc-100 rounded-r-lg;
        box-shadow: -.25rem .25rem black;

        &:active {
            translate: -.125rem .125rem;
            box-shadow: -.125rem .125rem black;
        }
        
        &.highlighted {
            @apply bg-yellow-500;
        } 
    }
</style>