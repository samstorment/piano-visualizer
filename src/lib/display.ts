type DisplayType = 'note' | 'chord' | 'scale';
type ChordStyle = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7' | 'diminished7' | 'sus2' | 'sus4' | 'major7' | 'minor7'; 
type ScaleStyle = 'major' | 'minor';

interface IDisplay {
    type: DisplayType;
    name: string;
    id: number;
}

interface INoteDisplay extends IDisplay {
    type: 'note';
}

interface IChordDisplay extends IDisplay {
    type: 'chord';
    style: ChordStyle;
    inversion: number;
}

interface IScaleDisplay extends IDisplay {
    type: 'scale';
    style: ScaleStyle;
}

export enum DisplayId {
    NOTE,
    MAJOR_SCALE,
    MINOR_SCALE,
    MAJOR_CHORD,
    MINOR_CHORD,
    DIMINISHED_CHORD,
    AUGMENTED_CHORD,
    SUS2_CHORD,
    SUS4_CHORD,
    MAJOR7_CHORD,
    MINOR7_CHORD,
    DOMINANT7_CHORD,
    DIMINISHED7_CHORD,
}

const note: INoteDisplay         =          { id: DisplayId.NOTE,               type: 'note',  name: 'Note'                               } as const;
const major_scale: IScaleDisplay =          { id: DisplayId.MAJOR_SCALE,        type: 'scale', style: 'major',                      name: 'Major Scale' } as const;
const minor_scale: IScaleDisplay =          { id: DisplayId.MINOR_SCALE,        type: 'scale', style: 'minor',                      name: 'Minor Scale' } as const;
const major_chord: IChordDisplay =          { id: DisplayId.MAJOR_CHORD,        type: 'chord', style: 'major',        inversion: 0, name: 'Major Triad' } as const;
const minor_chord: IChordDisplay =          { id: DisplayId.MINOR_CHORD,        type: 'chord', style: 'minor',        inversion: 0, name: 'Minor Triad' } as const;
const diminished_chord: IChordDisplay =     { id: DisplayId.DIMINISHED_CHORD,   type: 'chord', style: 'diminished',   inversion: 0, name: 'Diminished Triad' } as const;
const augmented_chord: IChordDisplay =      { id: DisplayId.AUGMENTED_CHORD,    type: 'chord', style: 'augmented',    inversion: 0, name: 'Augmented Triad' } as const;
const sus2_chord: IChordDisplay =           { id: DisplayId.SUS2_CHORD,         type: 'chord', style: 'sus2',         inversion: 0, name: 'Suspended 2nd' } as const;
const sus4_chord: IChordDisplay =           { id: DisplayId.SUS4_CHORD,         type: 'chord', style: 'sus4',         inversion: 0, name: 'Suspended 4th' } as const;
const major7_chord: IChordDisplay =         { id: DisplayId.MAJOR7_CHORD,       type: 'chord', style: 'major7',       inversion: 0, name: 'Major 7th' } as const;
const minor7_chord: IChordDisplay =         { id: DisplayId.MINOR7_CHORD,       type: 'chord', style: 'minor7',       inversion: 0, name: 'Minor 7th' } as const;
const dominant7_chord: IChordDisplay =      { id: DisplayId.DOMINANT7_CHORD,    type: 'chord', style: 'dominant7',    inversion: 0, name: 'Dominant 7th' } as const;
const diminished7_chord: IChordDisplay =    { id: DisplayId.DIMINISHED7_CHORD,  type: 'chord', style: 'diminished7',  inversion: 0, name: 'Diminished 7th' } as const;

const display_types = {
    [`${DisplayId.NOTE}`]: note,
    [`${DisplayId.MAJOR_SCALE}`]: major_scale,
    [`${DisplayId.MINOR_SCALE}`]: minor_scale,
    [`${DisplayId.MAJOR_CHORD}`]: major_chord,
    [`${DisplayId.MINOR_CHORD}`]: minor_chord,
    [`${DisplayId.DIMINISHED_CHORD}`]: diminished_chord,
    [`${DisplayId.AUGMENTED_CHORD}`]: augmented_chord,
    [`${DisplayId.SUS2_CHORD}`]: sus2_chord,
    [`${DisplayId.SUS4_CHORD}`]: sus4_chord,
    [`${DisplayId.MAJOR7_CHORD}`]: major7_chord,
    [`${DisplayId.MINOR7_CHORD}`]: minor7_chord,
    [`${DisplayId.DOMINANT7_CHORD}`]: dominant7_chord,
    [`${DisplayId.DIMINISHED7_CHORD}`]: diminished7_chord,
}

export function get_display(display: DisplayId) {
    return display_types[display];
}

export function get_displays() {
    return Object.entries(display_types).map(([ _, v ]) => v);
}