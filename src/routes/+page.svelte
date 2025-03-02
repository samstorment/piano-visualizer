<script lang="ts">
    import { create_rack, type Rack } from "$lib/rack.svelte";
	import RackComponent from "./Rack.svelte";
	import { onMount, tick } from "svelte";
	import { create_piano } from "$lib/piano.svelte";
	import { browser } from "$app/environment";
	import { RackTab, PageTab, type Tab, type TabPage } from "$lib/tab.svelte";
	import { Info, Piano as PianoIcon, Plus, X } from "lucide-svelte";
	import About from "./About.svelte";
	import Presets from "./Presets.svelte";
	import { fly, scale, slide } from "svelte/transition";
	import { flip } from "svelte/animate";

    let tabs : Tab[] = $state([ new RackTab() ]);
    let active_tab_id = $state(tabs[0].id);
    let active_tab = $derived(tabs.find(t => t.id === active_tab_id));
    let active_page = $derived(active_tab?.type === "page" ? active_tab : undefined);
    let active_rack = $derived(active_tab?.type === "rack" ? active_tab : undefined);
    let tab_bar_element: HTMLElement;

    function add_page(page: TabPage, title: string) {
        const existing_about_tab = tabs.find(t => t.type === 'page' && t.page === page);

        if (existing_about_tab) {
            active_tab_id = existing_about_tab.id;
            scroll_to_active_tab_button();
            return;
        }

        const new_tab = new PageTab(page, { title }); 
        tabs.push(new_tab); 
        active_tab_id = new_tab.id 
    }


    function scroll_to_active_tab_button() {
        tick().then(() => document.getElementById(`tab-button-${active_tab_id}`)?.scrollIntoView({ inline: 'center', behavior: 'smooth' }))
    }

    // load rack saved in local storage
    // don't really like that this causes a load but its a useful feature
    // onMount(() => {
    //     if (!browser) {
    //         initialized = true;
    //         return;
    //     }

    //     const stored_json = localStorage.getItem('racks');

    //     if (!stored_json) {
    //         initialized = true;
    //         return;
    //     }

    //     const stored = JSON.parse(stored_json) as Rack[];

    //     racks = stored.map(rack => create_rack({ 
    //         ...rack, 
    //         pianos: rack.pianos.map(create_piano)
    //     }));

    //     initialized = true;
    // });

    // $effect(() => {
    //     if (!browser) return;
    //     localStorage.setItem('racks', JSON.stringify($state.snapshot(racks)));
    // });
</script>

<div class="flex h-dvh">

    <aside class="border-r border-black">
        <button class={{ 
            "block relative p-2 hover:bg-zinc-200": true, 
            "text-zinc-500": active_page?.page !== "presets",
            "before:content-[''] before:w-1 before:bg-yellow-500 before:h-full before:block before:absolute before:left-0 before:top-0 text-inherit": active_page?.page === "presets"
         }}
            onclick={() => add_page('presets', 'Presets')}
        >
            <span class="sr-only">Presets</span>
            <PianoIcon class="w-6 h-6" />
        </button>
        <button 
            class={{ 
                "block relative p-2 hover:bg-zinc-200": true, 
                "text-zinc-500": active_page?.page !== "about",
                "before:content-[''] before:w-1 before:bg-yellow-500 before:h-full before:block before:absolute before:left-0 before:top-0 text-inherit": active_page?.page === "about"
            }}
            onclick={() => add_page('about', 'About')}
        >
            <span class="sr-only">About</span>
            <Info class="w-6 h-6" />
        </button>
    </aside>

    <main class="flex flex-col flex-1 min-w-0">
        <header bind:this={tab_bar_element} class="flex gap-1 items-center shrink border-b border-black px-1">
            <ul class="overflow-auto flex gap-1 py-1">
                {#each tabs as tab, i (tab)}
                    {@const active = active_tab_id === tab.id}
                    <li 
                        id="tab-button-{tab.id}"
                        class={{ 
                            "relative rounded text-sm": true, 
                            "bg-yellow-500": active, 
                            "hover:bg-zinc-200": !active
                        }} 
                        in:slide={{ axis: 'x', duration: 100 }} 
                        animate:flip={{ duration: 100 }}
                        onintroend={() => scroll_to_active_tab_button()}
                    >
                        <button 
                            onclick={() => { active_tab_id = tab.id; }}
                            class={{ "px-2 py-1 rounded pr-8 w-full text-left text-nowrap": true }}
                        >
                            {tab.title}
                        </button>
                        <button 
                            class={{ 
                                "absolute p-0.5 right-1.5 top-1/2 -translate-y-1/2 rounded hover:bg-white/30": true,  
                            }}
                            onclick={() => {
                                const i = tabs.findIndex(t => t.id === tab.id);
                                if (i < 0) return;

                                if (tab.id === active_tab_id) {
                                    if (i < tabs.length - 1) active_tab_id = tabs[i + 1].id;
                                    else if (tabs.length > 1) active_tab_id = tabs[i - 1].id;
                                }

                                tabs.splice(i, 1);
                            }}
                        >
                            <X class="w-4 h-4" />
                        </button>
                    </li>
                {/each}
            </ul>
            <button 
                class="p-1 hover:bg-zinc-200 rounded"
                onclick={() => { const new_tab =  new RackTab(); tabs.push(new_tab); active_tab_id = new_tab.id }}
            >
                <span class="sr-only">Add New Tab</span>
                <Plus />
            </button>
        </header>
        <section class="flex-1 min-h-0">
            {#if !active_tab}
                <div class="p-4">Oh No! You closed all the tabs and I haven't implemented anything to handle that yet!</div>
            {:else if active_tab.type === 'rack'}
                <RackComponent bind:rack={active_tab.rack} />
            {:else if active_tab.type === 'page'}
                <div class="h-full overflow-auto">
                    {#if active_tab.page === 'about'}
                        <About />
                    {:else if active_tab.page === 'presets'}
                        <Presets bind:tabs bind:active_tab_id />
                    {/if}
                </div>
            {/if}   
        </section>
    </main>


    <!-- <Sidebar bind:piano={rack.selected_piano} /> -->

    <!-- <main class="flex flex-col flex-1 min-w-0 min-h-dvh">
        {#if initialized}
            <RackComponent bind:rack />
        {:else}
            <div class="p-4 text-center">
                Loading Your Keys
            </div>
        {/if}
        <Footer bind:rack />
    </main> -->
</div>