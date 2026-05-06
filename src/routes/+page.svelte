<script lang="ts">
  import { user_preferences } from "$lib/stores.svelte";
</script>

<label for="openPinOnLoad">
  <input id="openPinOnLoad" type="checkbox" bind:checked={user_preferences.current.openPinOnLoad} />
  Open pinned list on load
</label>
