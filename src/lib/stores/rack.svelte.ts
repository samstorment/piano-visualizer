import type { DisplayId } from "$lib/display";
import type { Note } from "$lib/music";
import { create_piano, type KeyCount as KeyCount, type CreatePianoProps, type Piano, type PianoID } from "./piano.svelte";


export type RackAlignment = 'left' | 'center' | 'right' | 'stretch';
export type RackColumns = 1 | 2 | 3 | 4;

export type RackContext = {
    display_id: DisplayId,
    note: Note,
    name: string
}

export interface CreateRackProps {
    alignment?: RackAlignment,
    columns?: RackColumns,
    key_count?: KeyCount,
    pianos?: Piano[],
    selected_id?: PianoID,
    context?: RackContext
}

export function create_rack({
    alignment = 'left',
    columns = 1,
    key_count = 32,
    pianos = [ create_piano({ key_count }) ],
    selected_id = pianos[0]?.id,
    context = undefined
}: CreateRackProps = {}) {

    let _pianos = $state(pianos);
    let _selected_id = $state(selected_id);
    let _key_count = $state(key_count);
    let _columns = $state(columns);
    let _alignment = $state(alignment);

    return {
        get pianos() { return _pianos },
        get selected_id() { return _selected_id },
        set selected_id(value) { _selected_id = value },
        get selected_index() { return _pianos.findIndex(p => p.id === _selected_id) },
        get selected_piano() { return _pianos[this.selected_index] },
        get key_count() { return _key_count },
        set key_count(value) {
            _key_count = value;
            _pianos.forEach(p => p.key_count = value)
        },
        get columns() { return _columns },
        set columns(value) { _columns = value },
        get alignment() { return _alignment },
        set alignment(value) { _alignment = value },
        get context() { return context },
        add_piano(props: CreatePianoProps = { key_count: _key_count }) {
            const piano = create_piano(props);
            _pianos.push(create_piano(props));
            return piano;
        },
        remove_piano(piano: Piano) {
            const i = _pianos.findIndex(p => p.id === piano.id);
            if (i < 0) return;

            if (_selected_id === piano.id) {
                if (i < _pianos.length - 1) _selected_id = _pianos[i + 1].id;
                else _selected_id = _pianos[i - 1].id;
            }

            _pianos.splice(i, 1);
        }
    }
}

export type Rack = ReturnType<typeof create_rack>;