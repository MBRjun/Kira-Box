<template>
  <div class="layout-container">
    <NavBar />
    <main class="content">
      <NuxtPage />
    </main>
    <footer class="recaptcha-notice">
      <div class="content-container">
        This site is protected by reCAPTCHA and the Google
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        and
        <a
          href="https://policies.google/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>
        apply.
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import NavBar from "@/components/NavBar.vue";
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

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 10px 0;
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

.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: left;
}
.recaptcha-notice {
  border-top: 1px solid #eee;
  padding: 1.5rem 0;
  margin-top: auto;
  background: white;
  font-size: 0.875rem;
  color: #888;
}
.recaptcha-notice a {
  color: #888;
  text-decoration: underline;
}
</style>
