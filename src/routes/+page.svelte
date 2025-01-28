<script lang="ts">
	import { get_augmented_triad, get_diminished_7, get_diminished_triad, get_dominant_7, get_major_7, get_major_key, get_major_triad, get_minor_7, get_minor_key, get_minor_triad, get_sus_2, get_sus_4, type Display, type Note, type NoteRange } from "$lib";
	import { play_note } from "$lib/sound";
	import Keys from "./Keys.svelte";
	import Sidebar from "./Sidebar.svelte";

    let range: NoteRange = $state({ low: "A0", high: "C8" });
    let selected: Note | undefined = $state();
    let display: Display = $state('note');

    let highlighted: Note[] = $derived.by(() => {
        if (!selected) return [];
        if (display === 'note') return [ selected ];
        if (display === 'major key') return get_major_key(selected);
        if (display === 'major triad') return get_major_triad(selected);
        if (display === 'minor key') return get_minor_key(selected);
        if (display === 'minor triad') return get_minor_triad(selected);
        if (display === 'augmented triad') return get_augmented_triad(selected);
        if (display === 'diminished triad') return get_diminished_triad(selected);
        if (display === 'sus2') return get_sus_2(selected);
        if (display === 'sus4') return get_sus_4(selected);
        if (display === 'major7') return get_major_7(selected);
        if (display === 'minor7') return get_minor_7(selected);
        if (display === 'dominant7') return get_dominant_7(selected);
        if (display === 'diminished7') return get_diminished_7(selected);
        return [];
    });

    $effect(() => {
        highlighted.forEach(play_note)
    })
</script>



<div class="flex">
    <Sidebar {range} {highlighted} selected_note={selected} bind:display />
    <div class="p-4 flex-1 min-w-0">
        <Keys {range} {highlighted} bind:display bind:selected />
    </div>
</div>