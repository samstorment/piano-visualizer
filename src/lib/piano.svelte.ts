import { get_augmented_triad, get_diminished_7, get_diminished_triad, get_dominant_7, get_major_7, get_major_key, get_major_triad, get_minor_7, get_minor_key, get_minor_triad, get_sus_2, get_sus_4, type Note, type NoteRange } from "$lib";

export const display_types = [
    'note', 'major key', 'minor key', 
    'major triad', 'minor triad', 
    'diminished triad', 'augmented triad',
    'sus2', 'sus4',
    'major7', 'minor7', 'dominant7', 'diminished7'
] as const;

export type Display = typeof display_types[number];

export const board_sizes = [ 88, 76, 61, 49, 37, 32, 25 ] as const;

export type BoardSize = typeof board_sizes[number];

export const note_ranges: Record<BoardSize, NoteRange> = {
    88: { low: "A0", high: "C8" },
    76: { low: "E0", high: "G7" },
    61: { low: "C1", high: "C6" },
    49: { low: "C2", high: "C6" },
    37: { low: "C2", high: "C5" },
    32: { low: "F2", high: "C5" },
    25: { low: "C3", high: "C5" },
};

interface Props {
    display?: Display,
    // range?: NoteRange,
    board_size?: BoardSize,
    selected_note?: Note
}

export function createPiano({
    display = "note",
    board_size = 88,
    selected_note = 'C4'
}: Props = {}) {
    let _display = $state(display);
    let _range = $state(note_ranges[board_size]);
    let _selected_note = $state(selected_note);
    let _id = crypto.randomUUID();

    return {
        get display() { return _display },
        set display(value: Display) { _display = value },

        get range() { return _range },
        // set range(value: NoteRange) { _range = value },

        get selected_note() { return _selected_note },
        set selected_note(value: Note) { _selected_note = value },

        get id() { return _id },

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
        set board_size(value: BoardSize) {
            _range = note_ranges[value];
        }
    }
}

export type Piano = ReturnType<typeof createPiano>;