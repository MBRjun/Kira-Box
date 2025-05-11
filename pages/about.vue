<template>
  <div class="about">
    <h1>About</h1>
    <p class="description">
      Kira Box is a collection of my web tools, all developed out of personal
      interest. This project is built with Vue 3 and TypeScript. It was renamed
      and fully refactored from MBRjun-Toolbox in May 2025.
    </p>
    <p>
      This project is partially open-source. More source code will be released
      on GitHub in the future, and links will be provided below.
    </p>
    <p>
      I began learning frontend development for the first time alongside this
      project.
    </p>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'About - Kira Box',
  meta: [
    {
      name: 'description',
      content: "Something about Kira Box's development information.",
    },
  ],
})
</script>

<style scoped>
.about {
  padding: 2rem;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}
.description {
  color: #666;
  margin-bottom: 1.5rem;
}
</style>
