import { DisplayId } from "$lib/display";
import type { Note } from "$lib/music";
import type { KeyCount } from "./piano.svelte";
import type { RackAlignment, RackColumns } from "./rack.svelte";

interface RackSettings {
    alignment: RackAlignment,
    columns: RackColumns,
    share_scroll: boolean,
    sidebar: {
        open: boolean,
        scales_open: boolean,
        chords_open: boolean
    }
}

interface PianoSettings {
    key_count: KeyCount,
    key_size: number,
    display_id: DisplayId,
    locked: boolean
}


class Settings {
    rack: RackSettings = $state({ 
        alignment: 'center',
        columns: 2,
        share_scroll: false,
        sidebar: {
            open: true,
            scales_open: true,
            chords_open: true
        }
    });

    piano: PianoSettings = $state({
        key_count: 32,
        key_size: 125,
        display_id: DisplayId.NOTE,
        locked: false
    });
}

export const settings = new Settings();