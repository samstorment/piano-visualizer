<script lang="ts">
	import type { Editor } from "$lib/stores/editor.svelte";
	import type { TabPage } from "$lib/stores/tab.svelte";
	import type { Snippet } from "svelte";

    interface Props {
        page: TabPage,
        title: string,
        children: Snippet,
        editor: Editor,
        class?: string
    }


    let { page, title, children, editor, class: className = "" }: Props = $props();

    let highlighted = $derived(editor.active_page?.page === page);
</script>

<button 
    class={{ 
        "block relative p-2 hover:bg-zinc-200": true, 
        "text-zinc-500": !highlighted,
        "before:content-[''] before:w-1 before:bg-yellow-500 before:h-full before:block before:absolute before:left-0 before:top-0 text-inherit": highlighted,
        [className]: true,
    }}
    onclick={() => editor.add_page_tab(page, title)}
>
    <span class="sr-only">{title}</span>
    {@render children()}
</button>