<template>
  <div class="app">
    <Landing v-if="!showApp" @launch-app="showApp = true" />
    <FHEarn v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import FHEarn from "./components/FHEarn.vue";
import Landing from "./components/Landing.vue";

export default defineComponent({
  name: "App",
  components: {
    FHEarn,
    Landing,
  },
  setup() {
    const showApp = ref(false);
    onMounted(() => {
      const persisted = localStorage.getItem("fhearn_show_app");
      if (persisted === "1") showApp.value = true;
    });
    return { showApp };
  },
});
</script>

<style>
/* Global styles */
</style>
