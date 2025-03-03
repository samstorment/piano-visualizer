<script lang="ts">
	import { roman_numeral } from "$lib";
	import { get_pitch, type Chord, type Note } from "$lib/music";
	import type { Rack } from "$lib/stores/rack.svelte";

    interface Props {
        rack: Rack
    }

    let { 
        rack = $bindable(),
    }: Props = $props();


    let open = $state(true);

    const pianos = $state.snapshot(rack.pianos).filter(p => p.display.type === "chord"); 

    function get_short_chord_name(note: Note, chord: Chord) {
        const pitch = get_pitch(note);
        if (chord === "minor") return `${pitch}m`;
        if (chord === "diminished") return `${pitch}°`
        else return pitch;
    }

    function get_chord_numeral(num: number, chord: Chord) {
        const numeral = roman_numeral(num);
        if (chord === "diminished") return `${numeral}°`;
        else return numeral;
    }
</script>

{#if rack.context && open}
    <div class="border-l px-4 py-2 border-black h-full flex flex-col">

        <!-- this setup is super fragile if I ever add things beyond major, minor, diminished! -->
        <table class="w-full">
            <caption class="text-nowrap mb-4 font-bold">{rack.context.name}</caption>
            <tbody>
                {#each pianos as p, i}
                    {#if p.display.type === "chord"}
                        <tr class="font-serif">
                            <td class="border border-zinc-500 py-0.5 px-2" class:lowercase={p.display.style !== "major"}>
                                {get_chord_numeral(i + 1, p.display.style)}
                            </td>
                            <td class="border border-zinc-500 py-0.5 px-2">
                                <span>{get_short_chord_name(p.selected_note, p.display.style)}</span>
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>

        <button class="mt-auto bg-zinc-200 rounded p-1 hover:bg-zinc-300 border border-zinc-300 active:scale-95" onclick={() => open = false}>Hide</button>
    </div>
{/if}