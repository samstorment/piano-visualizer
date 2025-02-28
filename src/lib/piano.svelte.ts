import { get_augmented_triad, get_diminished_7, get_diminished_triad, get_dominant_7, get_major_7, get_major_key, get_major_triad, get_minor_7, get_minor_key, get_minor_triad, get_sus_2, get_sus_4, type Note, type NoteRange } from "$lib/music";
import { play_note } from "./sound";

export const display_types = [
    'note', 'major key', 'minor key', 
    'major triad', 'minor triad', 
    'diminished triad', 'augmented triad',
    'sus2', 'sus4',
    'major7', 'minor7', 'dominant7', 'diminished7'
] as const;

export type Display = typeof display_types[number];

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
    display?: Display,
    // range?: NoteRange,
    key_count?: KeyCount,
    selected_note?: Note,
    id?: PianoID
}

export function create_piano({
    display = "note",
    key_count = 88,
    selected_note = 'C4',
    id = crypto.randomUUID()
}: CreatePianoProps = {}) {
    let _display = $state(display);
    let _selected_note = $state(selected_note);
    let _key_count = $state(key_count);

    return {
        get display() { return _display },
        set display(value: Display) { _display = value },

        get range() { 
            return note_ranges[_key_count];
        },

        get selected_note() { return _selected_note },
        set selected_note(value: Note) { _selected_note = value },

        get id() { return id },

        get highlighted_notes(): Note[] {
            if (!_selected_note) return [];
            if (_display === 'note') return [ _selected_note ];
            if (_display === 'major key') return get_major_key(_selected_note);
            if (_display === 'major triad') return get_major_triad(_selected_note);
            if (_display === 'minor key') return get_minor_key(_selected_note);
            if (_display === 'minor triad') return get_minor_triad(_selected_note);
            if (_display === 'augmented triad') return get_augmented_triad(_selected_note);
            if (_display === 'diminished triad') return get_diminished_triad(_selected_note);
            if (_display === 'sus2') return get_sus_2(_selected_note);
            if (_display === 'sus4') return get_sus_4(_selected_note);
            if (_display === 'major7') return get_major_7(_selected_note);
            if (_display === 'minor7') return get_minor_7(_selected_note);
            if (_display === 'dominant7') return get_dominant_7(_selected_note);
            if (_display === 'diminished7') return get_diminished_7(_selected_note);
            return [];
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