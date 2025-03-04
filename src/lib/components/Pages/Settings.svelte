<script>
	import { get_displays } from "$lib/display";
import { create_piano, key_counts } from "$lib/stores/piano.svelte";
	import { settings } from "$lib/stores/settings.svelte";
	import Keys from "../Piano/Keys.svelte";


    let piano = $state(create_piano());

    $effect(() => {
        piano.key_count = settings.piano.key_count;
        piano.display_id = settings.piano.display_id;
        piano.key_size = settings.piano.key_size;
    })
</script>


<div class="relative isolate h-full overflow-auto bg-zinc-50">
    <div class="max-w-screen-md mx-auto p-4 grid gap-2 grid-cols-2 sm:grid-cols-4">

        <h2 class="text-xl font-bold mb-2 col-span-full">Piano Defaults</h2>

        <div class="border border-zinc-300 bg-white p-2 backdrop-blur-sm rounded-md col-span-1">
            <h3 class="mb-2 font-bold text-nowrap">Key Count</h3>

            <select 
                class="border px-2 rounded border-zinc-300 w-full bg-white/50"
                bind:value={settings.piano.key_count}
            >
                {#each key_counts as kc}
                    <option value={kc}>{kc}</option>
                {/each}
            </select>
        </div>

        <div class="border border-zinc-300 bg-white p-2 backdrop-blur-sm rounded-md col-span-1">
            <h3 class="mb-2 font-bold text-nowrap">Display Type</h3>

            <select 
                class={{ 
                    "border px-2 rounded border-zinc-300 w-full bg-white/50": true,
                }}
                bind:value={settings.piano.display_id} onchange={() => piano.play_highlighted_notes()}
            >
                {#each get_displays() as d}
                    <option value={d.id}>{d.name}</option>
                {/each}
            </select>
        </div>

        <div class="border border-zinc-300 bg-white p-2 backdrop-blur-sm rounded-md col-span-1">
            <h3 class="mb-2 font-bold text-nowrap">Alignment</h3>

            <select 
                class="border px-2 rounded border-zinc-300 w-full bg-white/50"
                bind:value={settings.rack.alignment}
            >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="stretch">Stretch</option>
            </select>
        </div>

        <div class="border border-zinc-300 bg-white p-2 backdrop-blur-sm rounded-md col-span-1">
            <h3 class="mb-2 font-bold text-nowrap">Columns</h3>

            <select 
                class="border px-2 rounded border-zinc-300 w-full bg-white/50"
                bind:value={settings.rack.columns}
            >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
            </select>
        </div>

        <div class="rounded-md p-2 border bg-white overflow-hidden relative isolate col-span-full">
            
            {@render grid()}

            <div class={{ 
                "grid gap-2": true,
                "grid-cols-2": settings.rack.columns === 2,
                "grid-cols-3": settings.rack.columns === 3,
                "grid-cols-4": settings.rack.columns === 4,
                "max-w-[650px] w-fit": settings.rack.alignment !== 'stretch', 
                "mx-auto": settings.rack.alignment === 'center', 
                "ml-auto": settings.rack.alignment === 'right',
            }}>
                {#each { length: settings.rack.columns } as _, i}
                    <Keys bind:piano selected={false} stretch={settings.rack.alignment === 'stretch'} />
                {/each}
            </div>
        </div>

        <div class="border border-zinc-300 bg-white p-2 backdrop-blur-sm rounded-md col-span-full">
            <h3 class="mb-2 font-bold text-nowrap">Key Size <span class="text-sm text-zinc-600 font-normal">(Height {settings.piano.key_size} px)</span></h3>
            
            <input type="range" min="70" max="300" bind:value={settings.piano.key_size}>
        </div>

    </div>

</div>

{#snippet grid()}
    <div class="empty bg"></div>
    <div class="empty vertical"></div>
    <div class="empty horizontal"></div>
{/snippet}



<style lang="postcss">
    .empty {
        --diag-dark: #e2e2e2;
        --diag-light: transparent;
        --dark-width: 1px;
        --light-width: 10px;
        --angle: 90deg;
        z-index: -1;
        position: absolute;
        inset: 0;

        &.bg {
            background-color: white;
            z-index: -2;
        }

        &:is(.horizontal, .vertical) {
            background: repeating-linear-gradient(
                var(--angle), 
                var(--diag-dark) 0px, 
                var(--diag-dark) var(--dark-width), 
                var(--diag-light) var(--dark-width), 
                var(--diag-light) calc(var(--light-width) * 2)
            );
        }

        &.horizontal {
            --angle: 0deg;
        }

        &.vertical {
            --angle: 90deg;
        }
    }
</style>