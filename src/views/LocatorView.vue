<template>
  <div class="app">
    <h1>AP Locator</h1>
    <p class="description">
      This tool can query the SSID and geographical location based on the MAC or
      IPv6 address.
    </p>
    <p>
      This feature is currently being tested, so errors may occur and are
      considered normal.
    </p>

    <div class="search-box">
      <h3>Search</h3>
      <input
        v-model="searchTerm"
        placeholder="MAC, IPv6 or SSID"
        class="search-input"
      />
      <button @click="handleQuery" class="submit-btn">Submit</button>
    </div>
    <div v-if="result" class="result">
      <h3>Results</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";
const result = ref<string | null>(null);
const searchTerm = ref("");
const recaptcha = useReCaptcha();
async function handleQuery() {
  if (!searchTerm.value.trim()) {
    result.value = "Input MAC, IPv6 or SSID.";
    return;
  }
  try {
    if (typeof recaptcha?.executeRecaptcha !== "function") {
      throw new Error("Recaptcha is not available");
    }
    const token = await recaptcha.executeRecaptcha("submit");
    await getData(token);
  } catch (e) {
    result.value = "Failed to load reCAPTCHA.";
  }
}
async function getData(token: string) {
  try {
    const res = await fetch("https://kira-api.libmbr.com/v1/locator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Recaptcha-Token": token,
      },
      body: JSON.stringify({
        query: searchTerm.value.trim(),
      }),
    });

    const data = await res.json();
    result.value = JSON.stringify(data, null, 2);
  } catch (e) {
    result.value = "Network error.";
  }
}
</script>
<style scoped>
.app {
  padding: 2rem;
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}
.description {
  color: #666;
  margin-bottom: 1.5rem;
}
.search-box {
  margin: 2rem 0;
}
.search-input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0.5rem 0;
}
.submit-btn {
  padding: 0.8rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.submit-btn:hover {
  background: #0056b3;
}
.result {
  margin-top: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eee;
  white-space: pre-wrap;
}
</style>
