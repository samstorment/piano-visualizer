<script lang="ts">
	import { key_counts } from "$lib/piano.svelte";
	import type { Rack } from "$lib/rack.svelte";
	import { ChevronLeft, ChevronRight, Plus } from "lucide-svelte";

    interface Props {
        rack: Rack,
        sidebar_open: boolean
    }

    let { 
        rack = $bindable(),
        sidebar_open = $bindable()
    }: Props = $props();
</script>

<footer class="flex gap-2 items-center p-2 border-t border-black bg-white mt-auto overflow-auto z-50">

    <button class="toggle border bg-white border-black rounded shadow top-4 hover:shadow"
        onclick={() => sidebar_open = !sidebar_open}
    >
        <span class="sr-only">Toggle Sidebar</span>
        {#if sidebar_open}<ChevronLeft />{:else}<ChevronRight />{/if}
    </button>

    <select 
        name="keyboard-size" 
        id="keyboard-size" 
        class="border px-2 rounded border-zinc-500"
        bind:value={rack.columns}
    >
        <option value={1}>List</option>
        <option value={2}>Grid 2</option>
        <option value={3}>Grid 3</option>
        <option value={4}>Grid 4</option>
    </select>

    <select 
        name="keyboard-size" 
        id="keyboard-size" 
        class="border px-2 rounded border-zinc-500"
        bind:value={rack.key_count}
    >
        {#each key_counts as bs}
            <option value={bs} selected={bs === rack.key_count}>{bs} Keys</option>
        {/each}
    </select>

    <select 
        class="border px-2 rounded border-zinc-500"
        bind:value={rack.alignment}
    >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
    </select>

    <button 
        class="border rounded px-2 border-yellow-900 bg-yellow-500 whitespace-nowrap flex items-center gap-2"
        onclick={() => rack.add_piano()}
    >
        Add Piano <Plus />
    </button>
</footer>