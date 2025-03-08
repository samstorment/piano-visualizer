<script lang="ts">
	import RackComponent from "$lib/components/Rack/Rack.svelte";
	import About from "$lib/components/Pages/About.svelte";
	import Presets from "$lib/components/Pages/Presets.svelte";
	import { Editor } from "$lib/stores/editor.svelte";
	import IconBar from "$lib/components/IconBar/IconBar.svelte";
	import TabBar from "$lib/components/TabBar/TabBar.svelte";
	import Settings from "$lib/components/Pages/Settings.svelte";

    let editor = $state(new Editor());
</script>

<div class="flex h-dvh">

   <IconBar bind:editor />

    <div class="flex flex-col flex-1 min-w-0">
        
        <TabBar bind:editor />

        <main class="flex-1 min-h-0">
            {#if !editor.active_tab}
                <div class="p-4">Oh No! You closed all the tabs and I haven't implemented anything to handle that yet!</div>
            {:else }
                <div class="h-full overflow-auto">
                    {#if editor.active_tab.type === 'rack'}
                        <RackComponent bind:rack={editor.active_tab.rack} />
                    {:else if editor.active_tab.type === 'page'}
                        {#if editor.active_tab.page === 'about'}
                            <About />
                        {:else if editor.active_tab.page === 'presets'}
                            <Presets bind:editor />
                        {:else if editor.active_tab.page === 'settings'}
                            <Settings />
                        {/if}
                    {/if}  
                </div>
            {/if}
        </main>
    </div>
</div>

