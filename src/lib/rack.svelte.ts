import { createPiano, type BoardSize, type CreatePianoProps, type Piano } from "./piano.svelte";


const DEFAULT_BOARD_SIZE: BoardSize = 32;

export function create_rack() {

    let piano: Piano = createPiano({ board_size: DEFAULT_BOARD_SIZE });

    let _pianos = $state([ piano ]);
    let _selected_id = $state(_pianos[0]?.id);
    let _board_size = $state<BoardSize>(DEFAULT_BOARD_SIZE);

    return {
        get pianos() { return _pianos },
        get selected_id() { return _selected_id },
        set selected_id(value) { _selected_id = value },
        get selected_piano(): Piano { 
            return _pianos.find(p => p.id === _selected_id)!
        },
        add_piano(props: CreatePianoProps = { board_size: _board_size }) {
            const piano = createPiano(props);
            _pianos.push(createPiano(props));
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