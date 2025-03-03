import { tick } from "svelte";
import { PageTab, RackTab, type Tab, type TabPage } from "./tab.svelte";
import { create_rack, type CreateRackProps, type Rack } from "./rack.svelte";

export class Editor {
    tabs: Tab[] = $state([ new RackTab() ])
    active_tab_id = $state(this.tabs[0]?.id);
    #active_tab = $derived(this.tabs.find(t => t.id === this.active_tab_id))

    get active_tab() {
        return this.#active_tab
    }

    get active_page() {
        return this.#active_tab?.type === "page" ? this.#active_tab : undefined;
    }

    get active_rack() {
        return this.#active_tab?.type === "rack" ? this.#active_tab : undefined;
    }

    add_page_tab(page: TabPage, title: string) {
        const existing_page = this.tabs.find(t => t.type === 'page' && t.page === page);

        if (existing_page) {
            this.active_tab_id = existing_page.id;
            return;
        }
        
        const new_tab = new PageTab(page, { title }); 
        this.tabs.push(new_tab); 
        this.active_tab_id = new_tab.id 
    
    }

    add_rack_tab(rack: Rack = create_rack(), title: string = "Untitled") {
        const new_tab =  new RackTab(rack, { title });
        this.tabs.push(new_tab); 
        this.active_tab_id = new_tab.id
    }

    remove_tab(tab: Tab) {
        const i = this.tabs.findIndex(t => t.id === tab.id);
        if (i < 0) return;

        if (tab.id === this.active_tab_id) {
            if (i < this.tabs.length - 1) this.active_tab_id = this.tabs[i + 1].id;
            else if (this.tabs.length > 1) this.active_tab_id = this.tabs[i - 1].id;
        }

        this.tabs.splice(i, 1);
    }

    // this feels like the wrong place to put dom updating code but I haven't quite figured out 
    // how to gracefullly scroll to a new tab button. Because of the entrance transition delay 
    // when adding a new tab, I can't just add an effect 
    // async scroll_to_active_tab() {
    //     const tab_button = document.getElementById(`tab-button-${this.active_tab_id}`);

    //     if (!tab_button) return;
        
    //     tab_button.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    // }
}