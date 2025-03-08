<script lang="ts">
	import { DisplayId } from "$lib/display";
	import { get_major_key, get_minor_key, get_notes, get_pitch, type Note } from "$lib/music";
	import type { Editor } from "$lib/stores/editor.svelte";
	import { create_piano, type KeyCount } from "$lib/stores/piano.svelte";
	import { create_rack, type RackAlignment } from "$lib/stores/rack.svelte";

    interface Props {
        editor: Editor
    }

    let { 
        editor = $bindable()
    }: Props = $props();

    const key_count: KeyCount = 88;

    function get_major_chord_rack(note: Note) {

        const pianos = get_major_key(note)
            .slice(0, -1)
            .map((note, i) => {
                let display_id = DisplayId.MAJOR_CHORD;
                if (i === 1 || i === 2 || i === 5) display_id = DisplayId.MINOR_CHORD;
                if (i === 6) display_id = DisplayId.DIMINISHED_CHORD;
                return create_piano({ selected_note: note, display_id, key_count });
            });

        return create_rack({ 
            columns: 2, 
            key_count, 
            pianos, 
            context: { 
                display_id: DisplayId.MAJOR_CHORD, 
                note, 
                name: `${get_pitch(note)} Major Chords` } 
            }
        );
    }

    function get_minor_chord_rack(note: Note) {
        const pianos = get_minor_key(note)
            .slice(0, -1)
            .map((note, i) => {
                let display_id = DisplayId.MAJOR_CHORD;
                if (i === 0 || i === 3 || i === 4) display_id = DisplayId.MINOR_CHORD;
                if (i === 1) display_id = DisplayId.DIMINISHED_CHORD;
                return create_piano({ selected_note: note, display_id, key_count });
            });

        return create_rack({ 
            columns: 2, 
            key_count, 
            pianos, 
            context: { 
                display_id: DisplayId.MINOR_CHORD, 
                note, 
                name: `${get_pitch(note)} Minor Chords` } 
            }
        );
    }
</script>

<div class="p-4 flex flex-wrap gap-8">

    <div>
        <h1 class="text-3xl mb-4">Major Chords</h1>

        <ul>
            {#each get_notes({ low: 'A3', high: 'G#4' }) as note}
                {@const title = `${get_pitch(note)} Major Chords`}
                <li class="mb-1 last:mb-0">
                    <button 
                        class="w-full bg-zinc-200 rounded text-left block px-2 py-1" 
                        onclick={() => editor.add_rack_tab(get_major_chord_rack(note), title)}
                    >
                        {get_pitch(note)}
                    </button>
                </li>
            {/each}
        </ul>
    </div>

    <div>
        <h1 class="text-3xl mb-4">Minor Chords</h1>

        <ul>
            {#each get_notes({ low: 'A3', high: 'G#4' }) as note}
                {@const title = `${get_pitch(note)} Minor Chords`}
                <li class="mb-1 last:mb-0">
                    <button 
                        class="w-full bg-zinc-200 rounded text-left block px-2 py-1" 
                        onclick={() => editor.add_rack_tab(get_minor_chord_rack(note), title)}
                    >
                        {get_pitch(note)}
                    </button>
                </li>
            {/each}
        </ul>
    </div>
</div>