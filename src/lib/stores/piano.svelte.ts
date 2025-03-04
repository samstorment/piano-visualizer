import { get_inversions, type Note, type NoteRange } from "$lib/music";
import { DisplayId, get_display, get_display_notes } from "$lib/display";
import { play_note } from "$lib/sound";
import { settings } from "./settings.svelte";

export const key_counts = [ 25, 32, 37, 49, 61, 76, 88 ] as const;

export type KeyCount = typeof key_counts[number];

export const note_ranges: Record<KeyCount, NoteRange> = {
    25: { low: "C3", high: "C5" },
    32: { low: "F2", high: "C5" },
    37: { low: "C2", high: "C5" },
    49: { low: "C2", high: "C6" },
    61: { low: "C1", high: "C6" },
    76: { low: "E0", high: "G7" },
    88: { low: "A0", high: "C8" },
};

export type PianoID = ReturnType<typeof crypto.randomUUID>;

export interface CreatePianoProps {
    display_id?: DisplayId;
    // range?: NoteRange,
    key_count?: KeyCount;
    key_size?: number; 
    selected_note?: Note;
    id?: PianoID;
    inversion?: number;
}

export function create_piano({
    display_id = settings.piano.display_id,
    key_count = settings.piano.key_count,
    key_size = settings.piano.key_size,
    selected_note = 'C4',
    id = crypto.randomUUID(),
    inversion = 0,
}: CreatePianoProps = {}) {
    let _display_id = $state(display_id);
    let _selected_note = $state(selected_note);
    let _key_count = $state(key_count);
    let _inversion = $state(inversion);
    let _key_size = $state(key_size);

    return {
        get display_id() { return _display_id },
        set display_id(value: DisplayId) { 
            _inversion = 0;
            _display_id = value 
        },

        get display() { 
            const d = get_display(_display_id) 
            if (d.type === 'chord') {
                d.inversion = _inversion;
            }
            return d;
        },

        get key_size() { return _key_size; },
        set key_size(val) { 
            if (val < 70) val = 70;
            if (val > 300) val = 300;
            _key_size = val; 
        },

        get range() { 
            return note_ranges[_key_count];
        },

        get selected_note() { return _selected_note },
        set selected_note(value: Note) { 
            _inversion = 0;
            _selected_note = value;
        },

        get id() { return id },

        // get the notes using our selected note as the root
        get root_notes(): Note[] {
            return get_display_notes(_selected_note, _display_id)
        },
        get highlighted_notes() {
            if (this.inversions.length > 0 && _inversion && _inversion < this.inversions.length) {
                return this.inversions[_inversion]
            }
            else {
                return this.root_notes
            }
        },

        set inversion(value: number) {
            _inversion = value;
        },
        get inversion() {
            return _inversion
        },


        get inversions() {
            return get_inversions(this.root_notes)
        },

        get key_count() {
            return _key_count;
        },
        set key_count(value) {
            _key_count = value;
        },
        async play_highlighted_notes() {
            this.highlighted_notes.forEach(n => play_note(n));
        }
    }
}

export type Piano = ReturnType<typeof create_piano>;