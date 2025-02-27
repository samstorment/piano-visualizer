<script lang="ts">
	import { get_pitch, type Note, type NoteRange } from "$lib";
	import { display_types, type Display, type Piano } from '$lib/piano.svelte';
    import { play_note } from "$lib/sound";
	import { fly, slide } from "svelte/transition";

    interface Props {
        piano: Piano
    }

    let open = $state(true);

    let { piano = $bindable() }: Props = $props();

    function display_change(display: Display) {
        piano.display = display;
        piano.play_highlighted_notes();
    }
</script>


<aside class="sticky top-0 bg-white z-10 border-r border-zinc-900 h-dvh">

    <button class="absolute right-0 border translate-x-1/2 bg-white border-black rounded px-1 shadow top-4 hover:shadow z-20"
        onclick={() => open = !open}
    >
        {#if open}
            &lt;
        {:else}
            &gt;
        {/if}
    </button>

    {#if open}
        <div class="sticky top-0 overflow-auto shrink-0 flex flex-col gap-3 h-full p-4 w-[200px]">
            {#each display_types as dt}
                <button 
                    onclick={() => display_change(dt)}
                    class:highlighted={piano.display === dt}
                    class="display"
                >
                    {dt}
                </button>
            {/each}
        </div>
    {:else}
        <div class="w-4"></div>
    {/if}

</aside>


<style lang="postcss">
    button.display {
        @apply border px-2 py-1 border-zinc-500 rounded-sm w-full hover:bg-zinc-100 rounded-r-lg;
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