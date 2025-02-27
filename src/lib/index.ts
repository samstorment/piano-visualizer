// const naturals = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ] as const;
// export type Natural = typeof naturals[number];



export type Natural = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Sharp = `${Natural}#`;
export type Flat = `${Natural}b`;
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type PitchIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Pitch = `${Natural | Sharp | Flat}`;
export type Note = `${Pitch}${Octave}`;
export interface NoteRange { low: Note, high: Note };
export type PitchType = 'natural' | 'flat' | 'sharp';
export type Interval = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant';


const MAX_PITCH_INDEX = 11;
const MAX_OCTAVE = 8;

const pitch_indices: Record<Pitch, PitchIndex> = {
    'C' : 0, 'B#': 0,
    'C#': 1, 'Db': 1,
    'D' : 2,
    'D#': 3, 'Eb': 3,
    'E' : 4, 'Fb': 4,
    'F' : 5, 'E#': 5,
    'F#': 6, 'Gb': 6,
    'G' : 7,
    'G#': 8, 'Ab': 8,
    'A' : 9,
    'A#': 10, 'Bb': 10,
    'B' : 11, 'Cb': 11,
}


export function is_valid_note(str: string) {
    const all_notes = get_notes({ low: "A0", high: "G8" });
    return all_notes.find(note => note === str);
}

export function get_octave(note: Note): Octave {
    return parseInt(note.at(-1)!) as Octave;
}

export function get_pitch(note: Note): Pitch {
    return note.slice(0, -1) as Pitch;
}

export function step_up(note: Note, half_steps = 1): Note {

    function inc(note: Note): Note {
        let pitch = get_pitch(note);
        let octave = get_octave(note);
        let pitch_index = pitch_indices[pitch];

        if (pitch_index === MAX_PITCH_INDEX) {
            pitch_index = 0;
            octave += 1;
        } else {
            pitch_index += 1;
        }

        pitch = get_pitch_by_index(pitch_index as PitchIndex);

        return `${pitch}${octave as Octave}`;
    }

    for (let i = 0; i < half_steps; i++) {
        note = inc(note);
    }

    return note;
}

export function step_down(note: Note, half_steps = 1): Note {
    function dec(note: Note): Note {
        let pitch = get_pitch(note);
        let octave = get_octave(note);
        let pitch_index = pitch_indices[pitch];

        if (pitch_index === 0) {
            pitch_index = MAX_PITCH_INDEX;
            octave -= 1;
        } else {
            pitch_index -= 1;
        }

        pitch = get_pitch_by_index(pitch_index as PitchIndex);

        return `${pitch}${octave as Octave}`;
    }

    for (let i = 0; i < half_steps; i++) {
        note = dec(note);
    }

    return note;
}


export function get_half_step_difference(a: Note, b: Note) {
    const octave_a = get_octave(a);
    const octave_b = get_octave(b);
    const pitch_index_a: number = get_pitch_index(a);
    const pitch_index_b: number = get_pitch_index(b);
    return (octave_a - octave_b) * 12 + (pitch_index_a - pitch_index_b);
}

export function is_sharp<T extends Note | Pitch>(note: T) {
    return note.includes("#");
}

export function is_flat<T extends Note | Pitch>(note: T) {
    return note.includes("b");
}

export function is_accidental<T extends Note | Pitch>(note: T) {
    return !is_natural(note);
}

export function is_natural<T extends Note | Pitch>(note: T) {
    return !is_sharp(note) && !is_flat(note);
}

export function compare_pitch(p1: Pitch, p2: Pitch): number {
    if (pitch_indices[p1] > pitch_indices[p2]) return  1;
    if (pitch_indices[p1] < pitch_indices[p2]) return -1;
    return 0;
}

export function get_pitch_index(note: Note) {
    return pitch_indices[get_pitch(note)];
}

export function get_pitch_by_index(index: PitchIndex, type_preference: PitchType[] = ['natural', 'sharp', 'flat']): Pitch {
    const pitches = Object.entries(pitch_indices)
        .filter(([_, i]) => i === index)
        .map(([pitch]) => pitch as Pitch);

    if (pitches.length === 0) return pitches[0];

    const naturals = pitches.filter(is_natural);
    const sharps = pitches.filter(is_sharp);
    const flats = pitches.filter(is_flat);

    for (const pref in type_preference) {
        if (pref === 'natural' && naturals.length > 0) return naturals[0];
        if (pref === 'sharp' && sharps.length > 0) return sharps[0];
        if (pref === 'flat' && flats.length > 0) return flats[0];
    }

    return naturals.concat(sharps).concat(flats)[0];
}

export function* get_notes({ low, high }: NoteRange): Generator<Note> {
    let pitch_index  = pitch_indices[get_pitch(low)];
    let octave = get_octave(low);

    let high_octave = get_octave(high);
    let high_pitch_index = pitch_indices[get_pitch(high)];

    while (octave <= high_octave) {

        while (octave === high_octave ? pitch_index <= high_pitch_index : pitch_index <= MAX_PITCH_INDEX) {
            yield `${get_pitch_by_index(pitch_index)}${octave}`;
            pitch_index += 1;
        }

        pitch_index = 0;
        octave += 1;
    }
}

export function get_major_key(note: Note) {
    const [ _1,, _2,, _3, _4,, _5,, _6,, _7, _8 ] = get_notes({ low: note, high: step_up(note, 12) });
    return [ _1, _2, _3, _4, _5, _6, _7, _8 ];
}

export function get_major_triad(note: Note) {
    const [ _1,, _3,, _5 ] = get_major_key(note);
    return [ _1, _3, _5 ];
}

export function get_minor_key(note: Note) {
    const [ _1,, _2, _3,, _4,, _5, _6,, _7,, _8 ] = get_notes({ low: note, high: step_up(note, 12) });
    return [ _1, _2, _3, _4, _5, _6, _7, _8 ];
}

export function get_minor_triad(note: Note) {
    const [ _1,, _3,, _5 ] = get_minor_key(note);
    return [ _1, _3, _5 ];
}

export function get_augmented_triad(note: Note) {
    const [ _1, _3, _5 ] = get_major_triad(note);
    return [ _1, _3, step_up(_5) ];
}

export function get_diminished_triad(note: Note) {
    const [ _1, _3, _5 ] = get_minor_triad(note);
    return [ _1, _3, step_down(_5) ];
}

export function get_sus_2(note: Note) {
    const [ _1, _2,,, _5] = get_major_key(note);
    return [ _1, _2, _5 ];
}

export function get_sus_4(note: Note) {
    const [ _1,,, _4, _5 ] = get_major_key(note);
    return [ _1, _4, _5 ];
}

export function get_major_7(note: Note) {
    const [ _1,, _3,, _5,, _7 ] = get_major_key(note);
    return [ _1, _3, _5, _7 ];
}

export function get_minor_7(note: Note) {
    const [ _1,, _3,, _5,, _7 ] = get_minor_key(note);
    return [ _1, _3, _5, _7 ];
}

export function get_dominant_7(note: Note) {
    const [ _1,, _3,, _5,, _7 ] = get_major_key(note);
    return [ _1, _3, _5, step_down(_7) ];
}

export function get_diminished_7(note: Note) {
    const major_7 = get_major_key(note)[6];
    const [ _1, _3, _5 ] = get_diminished_triad(note);
    return [ _1, _3, _5, step_down(major_7, 2) ];
}