<script lang="ts">
	import { ordinalize } from "$lib";
	import { get_displays } from "$lib/display";
	import { get_pitch } from "$lib/music";
	import type { Piano } from "$lib/stores/piano.svelte";
	import type { Rack } from "$lib/stores/rack.svelte";
	import { Lock, LockOpen, X } from "lucide-svelte";

    interface Props {
        rack: Rack,
        piano: Piano
        selected: boolean
    }

    let { 
        piano = $bindable(), 
        rack = $bindable(),
        selected
    }: Props = $props();

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<header 
    class={{ 
        "group flex mb-1 gap-2 items-center overflow-auto cursor-pointer px-2 py-1 rounded-md  hover:outline outline-1 -outline-offset-1 hover:bg-zinc-100 hover:outline-zinc-300": true,
    }}
    onclick={() => rack.selected_id = piano.id}
>
    <button 
        class={{
            "flex gap-2 items-center font-bold": true, 
            "text-zinc-500 hover:text-yellow-600": !selected,
            "text-yellow-600": selected
        }}
        onclick={() => rack.selected_id = piano.id}
        class:selected
    >
        <span class="text-lg w-5 text-left">{get_pitch(piano.selected_note)}</span>
    </button>

    <select 
        class={{ 
            "border px-2 rounded border-zinc-500": true,
        }}
        onclick={e => e.stopPropagation()}
        bind:value={piano.display_id} onchange={() => piano.play_highlighted_notes()}
    >
        {#each get_displays() as d}
            <option value={d.id}>{d.name}</option>
        {/each}
    </select>

    {#if piano.display.type === 'chord' && piano.inversion > 0}
        <span>{ordinalize(piano.inversion)} Inversion</span>
    {/if}

    <button
        class="hover:text-yellow-600 ml-auto" 
        onclick={() => piano.locked = !piano.locked}
    >
        <span class="sr-only">{piano.locked ? "Unlock" : "Lock"} Piano</span>
        {#if piano.locked}
            <Lock />
        {:else}
            <LockOpen />
        {/if}
    </button>


    {#if rack.pianos.length > 1}
        <button 
            class="hover:text-yellow-600" 
            onclick={() => rack.remove_piano(piano)}
        >
            <span class="sr-only">Delete Piano</span>
            <X />
        </button>
    {/if}
</header>