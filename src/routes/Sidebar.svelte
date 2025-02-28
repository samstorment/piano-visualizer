<script lang="ts">
	import { DisplayId, get_display } from "$lib/display";
	import { get_inversions, get_pitch, type Note, type NoteRange } from "$lib/music";
	import { type Piano } from '$lib/piano.svelte';
    import { play_note } from "$lib/sound";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import { fly, slide } from "svelte/transition";

    interface Props {
        piano: Piano
    }

    let open = $state(true);

    let { piano = $bindable() }: Props = $props();

    function display_change(display_id: DisplayId) {
        piano.display_id = display_id;
        piano.play_highlighted_notes();
    }

    function inversion_click(inversion: number) {
        piano.inversion = inversion;
        piano.play_highlighted_notes();
    }
</script>


<aside class={{ 
    "top-0 bg-white z-10 border-r border-zinc-900 h-dvh": true,
    "fixed sm:sticky": open,
    "sticky": !open
}}>

    <button class="toggle absolute right-0 border translate-x-1/2 bg-white border-black rounded shadow top-4 hover:shadow z-20"
        onclick={() => open = !open}
    >
        <span class="sr-only">Toggle Sidebar</span>
        {#if open}
            <ChevronLeft />
        {:else}
            <ChevronRight />
        {/if}
    </button>

    {#if open}
        <div class="sticky top-0 overflow-auto shrink-0 flex flex-col gap-3 h-full p-4 w-[200px]">
            {@render display_button(DisplayId.NOTE)}

            {@render display_button(DisplayId.MAJOR_SCALE)}
            {@render display_button(DisplayId.MINOR_SCALE)}

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
    {:else}
        <div class="w-4"></div>
    {/if}

</aside>

{#snippet display_button(display_id: DisplayId)}
    {@const display = get_display(display_id)}
    {@const highlighted = piano.display_id === display_id}
    <button 
        onclick={() => display_change(display_id)}
        class:highlighted
        class="display"
    >
        {display.name}
    </button>
    {#if highlighted && piano.inversions.length > 0 && piano.display.type === 'chord'}
        <div class="text-sm pl-4">
            <p class="text-sm italic mb-1.5">Inversions</p>
            <ul class="flex gap-2">
                {#each piano.inversions as _, i}
                    <li>
                        <button 
                            class="inversion border border-black rounded-full w-7 h-7" 
                            class:highlighted={i === piano.inversion}
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

    button.toggle {
        box-shadow: -.125rem .125rem black;

        &:active {
            translate: -.06rem .06rem;
            box-shadow: -.06rem .06rem black;
        }

    }

    .inversion.highlighted {
        @apply bg-yellow-500;
    }
</style>