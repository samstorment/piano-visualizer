<script lang="ts">
	import type { Editor } from "$lib/stores/editor.svelte";
	import type { TabId } from "$lib/stores/tab.svelte";
	import { Plus, X } from "lucide-svelte";
	import { tick } from "svelte";
	import { flip } from "svelte/animate";
	import { slide } from "svelte/transition";
	import TabButton from "./TabButton.svelte";

    interface Props {
        editor: Editor
    }

    let { 
        editor = $bindable()
    }: Props = $props();

    let tab_bar_element = $state<HTMLElement>();
    let new_tab_id: TabId | undefined = $state(undefined);

    // make it so tabs are automatically scrolled to 
    // if they become active and they're overflowing the tab bar
    $effect.pre(() => {
        if (!tab_bar_element) return;
        if (!editor.active_tab_id) return;

        // reference this just so effect re-runs when it changes
        new_tab_id;
        
        tick().then(() => {
            const active_button = document.querySelector(`#tab-button-${editor.active_tab_id}`);
            if (!active_button || !tab_bar_element) return;

            const btn_box = active_button.getBoundingClientRect();
            const bar_box = tab_bar_element.getBoundingClientRect();
            const is_btn_overflowing = btn_box.left < bar_box.left || btn_box.right > bar_box.right;

            if (!is_btn_overflowing) return;

            active_button.scrollIntoView({ inline: "nearest", behavior: "smooth" })
        })

    })
</script>

<header class="flex gap-1 items-center shrink border-b border-black px-1">
    {#if editor.tabs.length > 0}
        <ul bind:this={tab_bar_element} class="overflow-auto flex gap-1 py-1">
            {#each editor.tabs as tab, i (tab)}
                {@const active = editor.active_tab_id === tab.id}
                <li 
                    in:slide|global={{ axis: 'x', duration: 80 }} 
                    animate:flip={{ duration: 100 }}
                    onintroend={() => new_tab_id = tab.id}
                >
                    <TabButton {active} bind:editor bind:tab={editor.tabs[i]} />
                </li>
            {/each}
        </ul>
    {/if}
    <div class="py-1">
        <button 
            class="p-1 hover:bg-zinc-200 rounded"
            onclick={() => editor.add_rack_tab()}
        >
            <span class="sr-only">Add New Tab</span>
            <Plus />
        </button>
    </div>
</header>