<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import NavBar from "./components/NavBar.vue";
</script>

<style>
@font-face {
  font-family: "Google Sans Display";
  font-style: normal;
  font-weight: 400;
  src: url("https://www.mbrjun.cn/assets/fonts/GoogleSansDisplay-LR.woff2")
    format("woff2");
  font-display: swap;
}

@font-face {
  font-family: "Google Sans Display";
  font-style: normal;
  font-weight: 700;
  src: url("https://www.mbrjun.cn/assets/fonts/GoogleSansDisplay-BR.woff2")
    format("woff2");
  font-display: swap;
}

@font-face {
  font-family: "Google Sans Display";
  font-style: italic;
  font-weight: 300;
  src: url("https://www.mbrjun.cn/assets/fonts/GoogleSansDisplay-LI.woff2")
    format("woff2");
  font-display: swap;
}

@font-face {
  font-family: "Google Sans Display";
  font-style: italic;
  font-weight: 700;
  src: url("https://www.mbrjun.cn/assets/fonts/GoogleSansDisplay-BI.woff2")
    format("woff2");
  font-display: swap;
}

.icon-button i {
  font-size: 28px;
  line-height: 1;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "Google Sans Display", sans-serif;
}

#app {
  font-family: "Google Sans Display", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

button {
  font-family: "Google Sans Display", sans-serif;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
