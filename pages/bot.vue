<template>
    <div class="about">
      <h1>Kira Bot</h1>
      <p class="description">
        Kira Box is a collection of my web tools, all developed out of personal
        interest. Some of these tools (such as Compression Ratio Test) require 
        network requests. All of the request sent by Kira Box identifies itself
        as Kira Bot.
      </p>
      <p>
        Kira Bot does not currently cache any web content or personal data.
        Instead it destroys all downloaded data after Page Speed Test finished.
      </p>
      <h3>Bot Type</h3>
      <p>Page Speed Test</p>
      <h3>IP Range</h3>
      <p>Distributed, Worldwide</p>
      <h3>Obeys Robots.txt</h3>
      <p>Yes</p>
      <h3>User Agent</h3>
      <p>Mozilla/5.0 (compatible; KiraBot; https://kira.libmbr.com/bot/)</p>
      <h3>Data served at</h3>
      <p>kira.libmbr.com</p>
    </div>
  </template>
  
  <script lang="ts" setup>
  useHead({
    title: 'Kira Bot - Kira Box',
    meta: [
      {
        name: 'description',
        content: "Kira Bot informations page.",
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
