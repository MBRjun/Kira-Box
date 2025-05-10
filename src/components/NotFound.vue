<template>
  <div class="not-found">
    <h1>404 Not Found</h1>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from "@vueuse/head";

useHead({
  title: "404 Not Found",
  meta: [
    {
      name: "robots",
      content: "noindex",
    },
  ],
});
</script>

<style scoped>
.not-found {
  padding: 2rem;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}
</style>
