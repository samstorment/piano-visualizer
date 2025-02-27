import { createPiano, type BoardSize, type CreatePianoProps, type Piano } from "./piano.svelte";

interface Props {
    pianos?: Piano[],
}

export function create_rack({
    pianos = [ createPiano() ]
}: Props = {}) {
    let _pianos = $state(pianos);
    let _selected_id = $state(pianos[0]?.id);
    let _board_size = $state(88 as BoardSize);

    return {
        get pianos() { return _pianos },
        get selected_id() { return _selected_id },
        set selected_id(value) { _selected_id = value },
        get selected_piano(): Piano { 
            return _pianos.find(p => p.id === _selected_id)!
        },
        add_piano: (props: CreatePianoProps = { board_size: _board_size }) => {
            _pianos.push(createPiano(props));
        },
        remove_piano: (piano: Piano) => {
            const i = _pianos.findIndex(p => p.id === piano.id);
            if (i < 0) return;

            if (_selected_id === piano.id) {
                if (i < _pianos.length - 1) _selected_id = _pianos[i + 1].id;
                else _selected_id = _pianos[i - 1].id;
            }

            _pianos.splice(i, 1);
        },
        get board_size(): BoardSize {
            return _board_size;
        },
        set board_size(value: BoardSize) {
            _board_size = value;
            _pianos.forEach(p => p.board_size = value)
        }
    }
}

export type Rack = ReturnType<typeof create_rack>;