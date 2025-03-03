<script lang="ts">
	import type { Editor } from "$lib/stores/editor.svelte";
	import type { TabPage } from "$lib/stores/tab.svelte";
	import { Info, Piano as PianoIcon } from "lucide-svelte";
	import IconButton from "./IconButton.svelte";

    interface Props {
        editor: Editor
    }

    let { 
        editor = $bindable()
    }: Props = $props();
</script>

<aside class="border-r border-black flex flex-col">
    <IconButton {editor} page="presets" title="Presets">
        <PianoIcon class="w-6 h-6" />
    </IconButton>

    <IconButton {editor} page="about" title="About" class="mt-auto">
        <Info class="w-6 h-6" />
    </IconButton>
</aside>
