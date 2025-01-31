import { createPiano, type Piano } from "./piano.svelte";

interface Props {
    pianos?: Piano[],
}

export function create_rack({
    pianos = [ createPiano() ]
}: Props = {}) {
    let _pianos = $state(pianos);
    let _selected_id = $state(pianos[0]?.id);

    return {
        get pianos() { return _pianos },
        get selected_id() { return _selected_id },
        set selected_id(value) { _selected_id = value },
        get selected_piano(): Piano { 
            return _pianos.find(p => p.id === _selected_id)!
        },
        remove_piano: (piano: Piano) => {
            const i = _pianos.findIndex(p => p.id === piano.id);
            if (i < 0) return;
            if (i === 0 && _pianos.length === 1) return;
            else if (i === 0) _selected_id = _pianos[1].id;
            else _selected_id = _pianos[i - 1].id;
            _pianos.splice(i, 1);
        }
    }
}

export type Rack = ReturnType<typeof create_rack>;