<script module>
    let drag_tab: Tab;
    let drag_index: number;
</script>

<script lang="ts">
	import { debounce, swap, throttle } from "$lib";

	import type { Editor } from "$lib/stores/editor.svelte";
	import type { Tab } from "$lib/stores/tab.svelte";
	import { X } from "lucide-svelte";
	import { tick } from "svelte";

    interface Props {
        active: Boolean,
        editor: Editor,
        tab: Tab,
        index: number
    }

    let { active, editor = $bindable(), tab = $bindable(), index }: Props = $props();

    let editing = $state(false);
    let dragging = $state(false);
    let prev_title = $state(tab.title);
    let text_width = $state(100);
    let input_element: HTMLInputElement | undefined = $state(undefined);
    let measure_element: HTMLElement | undefined = $state(undefined);

    async function begin_edit() {
        editing = true;
        prev_title = tab.title;
        await tick();
        input_element?.focus();
        input_element?.select();
    }

    async function end_edit() {
        editing = false;
        if (!tab.title) {
            tab.title = prev_title;
        }
    }

    async function resize_input() {
        if (!measure_element || !input_element) return;
        await tick();
        const width = measure_element.offsetWidth;
        input_element.style.width = `${width}px`;
    }

    function drag_start(event: DragEvent) {
        dragging = true;
        editor.active_tab_id = tab.id;
        drag_tab = tab;
        drag_index = index;
    }

    const drag_enter = throttle(() => {

        if (drag_tab.id === tab.id) return;

        console.log(drag_tab.title, "enetered");

        swap(editor.tabs, drag_index, index);
        
        drag_index = index;
    })

    function drag_end() {
        dragging = false;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={{ 
        "group relative w-fit rounded": true,
        "bg-white hover:bg-zinc-200": !active,
    }}
    class:dragging
    draggable={true}
    ondragstart={drag_start}
    ondragover={drag_enter}
    ondragend={drag_end}
>
    <button 
        id="tab-button-{tab.id}"
        onclick={() => editor.active_tab_id = tab.id}
        ondblclick={begin_edit}
        class={{ 
            "px-2 py-1 rounded pr-8 w-full text-left text-nowrap relative text-sm overflow-hidden": true,
            "max-w-48": !editing,
            "bg-white": active,
            "bg-yellow-500": active, 
        }}

    >
        {#if editing}
            <input 
                class="w-auto min-w-4 px-1"
                style="width: {text_width + 10}px"
                bind:this={input_element} 
                bind:value={tab.title} 
                onfocusout={end_edit} 
                oninput={resize_input}
                onkeydown={e => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                        end_edit();
                    }
                }}
            >
            <span class="absolute invisible whitespace-pre -top-96 -left-96" bind:offsetWidth={text_width}>{tab.title}</span>
        {:else}
            <span bind:offsetWidth={text_width}>{tab.title}</span>
        {/if}
    </button>
    {#if !editing}
        <div class={{
            "absolute right-0 top-0 h-full aspect-square flex items-center justify-center bg-gradient-to-r rounded-r pointer-events-none": true,
            "from-yellow-500/70 to-yellow-500": active,
            "from-white/70 to-white group-hover:from-zinc-200/50 group-hover:to-zinc-200": !active
        }}></div>
    {/if}
    <button 
        class={{ 
            "absolute rounded p-0.5 right-1 top-1/2 -translate-y-1/2": true,
            "bg-yellow-500 hover:bg-yellow-400 shadow shadow-yellow-500": active,
            "bg-inherit hover:bg-zinc-100 shadow shadow-white group-hover:shadow-zinc-200": !active
        }}
        onclick={() => editor.remove_tab(tab)}
    >
        <X class="w-4 h-4" />
    </button>
</div>


<style>
    /* a lil hack to make it so the ghost image remains but 
        the original tab is hidden during dragging. just
        makes the drag look much smoother when the tab follows
        the cursor
    */
    .dragging {
        transition: 0.01s;
        transform: translateX(-9999px);
    }
</style>