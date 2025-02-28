import { get_augmented_triad, get_diminished_7, get_diminished_triad, get_dominant_7, get_inversions, get_major_7, get_major_key, get_major_triad, get_minor_7, get_minor_key, get_minor_triad, get_sus_2, get_sus_4, type Note, type NoteRange } from "$lib/music";
import { DisplayId, get_display } from "./display";
import { play_note } from "./sound";

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
    selected_note?: Note;
    id?: PianoID;
    inversion?: number;
}

export function create_piano({
    display_id = DisplayId.NOTE,
    key_count = 88,
    selected_note = 'C4',
    id = crypto.randomUUID(),
    inversion = 0
}: CreatePianoProps = {}) {
    let _display_id = $state(display_id);
    let _selected_note = $state(selected_note);
    let _key_count = $state(key_count);
    let _inversion = $state(inversion);

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
            if (!_selected_note) return [];
            if (_display_id === DisplayId.NOTE) return [ _selected_note ];
       
            if (_display_id === DisplayId.MAJOR_SCALE) return get_major_key(_selected_note);
            if (_display_id === DisplayId.MINOR_SCALE) return get_minor_key(_selected_note);
            
            if (_display_id === DisplayId.MAJOR_CHORD) return get_major_triad(_selected_note);
            if (_display_id === DisplayId.MINOR_CHORD) return get_minor_triad(_selected_note);
            if (_display_id === DisplayId.AUGMENTED_CHORD) return get_augmented_triad(_selected_note);
            if (_display_id === DisplayId.DIMINISHED_CHORD) return get_diminished_triad(_selected_note);
            if (_display_id === DisplayId.SUS2_CHORD) return get_sus_2(_selected_note);
            if (_display_id === DisplayId.SUS4_CHORD) return get_sus_4(_selected_note);
            if (_display_id === DisplayId.MAJOR7_CHORD) return get_major_7(_selected_note);
            if (_display_id === DisplayId.MINOR7_CHORD) return get_minor_7(_selected_note);
            if (_display_id === DisplayId.DOMINANT7_CHORD) return get_dominant_7(_selected_note);
            if (_display_id === DisplayId.DIMINISHED7_CHORD) return get_diminished_7(_selected_note);
            
            return [];
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