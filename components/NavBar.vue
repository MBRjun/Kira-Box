<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="title-link">
        <h1 class="title">Kira Box</h1>
      </router-link>
    </div>
    <div class="nav-right">
      <button class="icon-button" @click="toggleTools">
        <IconMdiApps />
      </button>
      <router-link to="/about">
        <button class="icon-button">
          <IconMdiInfo />
        </button>
      </router-link>
    </div>

    <div v-if="showTools" class="tools-dropdown">
      <router-link
        to="/tools/aplocator"
        @click="closeTools"
        class="dropdown-item"
        >AP Locator</router-link
      >
      <router-link
        to="/tools/compressionratio"
        @click="closeTools"
        class="dropdown-item"
        >Compression Ratio</router-link
      >
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IconMdiApps from '~icons/mdi/apps'
import IconMdiInfo from '~icons/mdi/info'

const showTools = ref(false);

function toggleTools() {
  showTools.value = !showTools.value;
}

function closeTools() {
  showTools.value = false;
}
</script>

<style scoped>
.navbar {
  background-color: #4385f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.2rem;
  height: 52px;
  color: white;
  position: relative;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.title-link:hover {
  opacity: 0.9;
}

.title {
  font-size: 1.4rem;
  font-weight: normal;
  margin: 0;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
}

.icon-button:hover {
  opacity: 0.85;
}

.icon-button svg {
  vertical-align: middle;
  transform: translateY(-1px);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.tools-dropdown {
  position: absolute;
  top: 100%;
  right: 60px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 0;
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
