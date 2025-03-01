import { create_rack, type Rack } from "./rack.svelte";

interface ITab {
    title: string
}

interface RackTab extends ITab {
    rack: Rack 
}

// interface 

export interface CreateTabProps {
    title?: string;
    rack?: Rack
}

export function create_tab({
    title = 'New Tab',
    rack = create_rack()
}: CreateTabProps = {}) {
    let _title = $state(title);
    let _rack = $state(rack);

    return {
        get title() { return _title },
        set title(val) { _title = val },
        get rack() { return _rack },
        set rack(val) { _rack = val },
    }
}

export type Tab = ReturnType<typeof create_tab>;
