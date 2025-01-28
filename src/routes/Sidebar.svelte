<script lang="ts">
	import { dispay_types, get_pitch, type Display, type Note, type NoteRange } from "$lib";
	import { play_note } from "$lib/sound";

    interface Props {
        range: NoteRange,
        selected_note?: Note,
        display: Display,
        highlighted: Note[]
    }

    let { 
        selected_note, 
        display = $bindable(),
        highlighted
    }: Props = $props();
</script>


<aside class="border-r border-zinc-900 h-screen p-4 w-60 shrink-0 flex flex-col gap-4">
    {#if !selected_note}
        <h1 class="text-3xl font-serif">Select a Note</h1>
    {:else}
        <h1 class="text-3xl font-serif">{get_pitch(selected_note)}</h1>

        {#each dispay_types as dt}
            <button 
                onclick={() => { display = dt; }}
                class:highlighted={display === dt}
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