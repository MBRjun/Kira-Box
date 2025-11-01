<template>
  <div class="about">
    <h1>Converter</h1>
    <p class="description">
      A collection of laboratory and technical unit converters.
      Choose a specific converter below.
    </p>

    <div class="link-list">
      <NuxtLink to="/tools/converter/hormone" class="link-btn">
        Hormone Unit Converter →
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Converter - Kira Box',
  meta: [
    {
      name: 'description',
      content:
        'A collection of laboratory and technical unit converters.',
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
.link-list {
  margin-top: 2rem;
}
.link-btn {
  display: inline-block;
  padding: 0.8rem 1.2rem;
  background: #007bff;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.3s;
}
.link-btn:hover {
  background: #0056b3;
}
</style>
