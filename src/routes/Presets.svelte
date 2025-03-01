<script lang="ts">
	import { DisplayId } from "$lib/display";
	import { get_major_key, get_minor_key, get_notes, get_pitch, type Note } from "$lib/music";
	import { create_piano, type KeyCount } from "$lib/piano.svelte";
	import { create_rack, type RackAlignment } from "$lib/rack.svelte";
	import { RackTab, type Tab, type TabId } from "$lib/tab.svelte";

    
    interface Props {
        tabs: Tab[],
        active_tab_id: TabId
    }

    let { 
        tabs = $bindable(), 
        active_tab_id = $bindable()
    }: Props = $props();

    const key_count: KeyCount = 61;
    const alignment: RackAlignment = 'center';

    function get_major_chord_pianos(note: Note) {

        const pianos = get_major_key(note)
            .slice(0, -1)
            .map((note, i) => {
                let display_id = DisplayId.MAJOR_CHORD;
                if (i === 1 || i === 2 || i === 5) display_id = DisplayId.MINOR_CHORD;
                if (i === 6) display_id = DisplayId.DIMINISHED_CHORD;
                return create_piano({ selected_note: note, display_id, key_count });
            });

        return create_rack({ columns: 2, key_count, pianos, alignment });
    }

    function get_minor_chord_pianos(note: Note) {
        const pianos = get_minor_key(note)
            .slice(0, -1)
            .map((note, i) => {
                let display_id = DisplayId.MAJOR_CHORD;
                if (i === 0 || i === 3 || i === 4) display_id = DisplayId.MINOR_CHORD;
                if (i === 1) display_id = DisplayId.DIMINISHED_CHORD;
                return create_piano({ selected_note: note, display_id, key_count });
            });

        return create_rack({ columns: 2, key_count, pianos, alignment });
    }
</script>

<div class="p-4 flex flex-wrap gap-8">

    <div>
        <h1 class="text-4xl mb-4">Major Chords</h1>

        {#each get_notes({ low: 'C3', high: 'B3' }) as note}
            {@const title = `${get_pitch(note)} Major Chords`}
            <button class="block" onclick={() => {
                const new_tab = new RackTab(get_major_chord_pianos(note), { title });
                tabs.push(new_tab);
                active_tab_id = new_tab.id;
            }}>
                {title}
            </button>
        {/each}
    </div>

    <div>
        <h1 class="text-4xl mb-4">Minor Chords</h1>

        {#each get_notes({ low: 'C3', high: 'B3' }) as note}
            {@const title = `${get_pitch(note)} Minor Chords`}
            <button class="block" onclick={() => {
                const new_tab = new RackTab(get_minor_chord_pianos(note), { title });
                tabs.push(new_tab);
                active_tab_id = new_tab.id;
            }}>
                {title}
            </button>
        {/each}
    </div>
</div>