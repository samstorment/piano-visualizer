import { create_rack, type Rack } from "$lib/stores/rack.svelte";

export type TabId = ReturnType<typeof crypto.randomUUID>;

type TabType = 'page' | 'rack';

export interface CreateTabProps {
    title?: string;
    id?: TabId;
}

abstract class BaseTab<T extends TabType> {
    
    abstract readonly type: T;
    readonly id = crypto.randomUUID();
    title: string = $state('Untitled')

    constructor({ title, id }: CreateTabProps = {}) {
        this.title = title ?? this.title;
        this.id = id ?? this.id;
    }
}


export class RackTab extends BaseTab<"rack"> {

    readonly type = "rack";
    #rack?: Rack = $state<Rack>();

    constructor(rack: Rack = create_rack(), props: CreateTabProps = {}) {
        super(props);
        this.#rack = rack;
    }

    get rack() { return this.#rack! }
    set rack(v) { this.#rack = v }
}

export type TabPage = 'about' | 'presets' | 'settings';

export class PageTab extends BaseTab<"page"> {

    readonly type = "page";
    page: TabPage;

    constructor(page: TabPage, props: CreateTabProps = { }) {
        super(props);
        this.page = page;
    }
}

export type Tab = RackTab | PageTab;