<template>
  <div class="app">
    <h1>CJK Comparison</h1>
    <p class="description">
      Compare CJK character glyphs across different languages.
    </p>
    <p class="description">
      CJK 汉字字形对比，漢字字形對比，漢字の字形比較，한자 자형 비교。
    </p>
    <p>This test uses only local fonts.</p>
    <div class="input-box">
      <div class="input-group">
        <input
          v-model="text"
          placeholder="Type CJK characters, e.g. 直 将 门 船"
          class="search-input"
          lang="und"
        />
      </div>
    </div>
    <div class="font-samples">
      <div class="font-group">
        <label>zh-Hans 简体中文</label>
        <input :value="text" readonly placeholder="直 将 门 船" class="font-sample" lang="zh-Hans" />
      </div>
      <div class="font-group">
        <label>zh-Hant 繁體中文</label>
        <input :value="text" readonly placeholder="直 将 门 船" class="font-sample" lang="zh-Hant" />
      </div>
      <div class="font-group">
        <label>ja-JP 日本語</label>
        <input :value="text" readonly placeholder="直 将 门 船" class="font-sample" lang="ja-JP" />
      </div>
      <div class="font-group">
        <label>ko-KR 한국어</label>
        <input :value="text" readonly placeholder="直 将 门 船" class="font-sample" lang="ko-KR" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: 'CJK Comparison - Kira Box',
  meta: [
    {
      name: 'description',
      content: 'Compare CJK character glyphs across different languages. CJK 汉字字形对比，漢字字形對比，漢字の字形比較，한자 자형 비교。',
    },
  ],
})
import { ref } from 'vue'

const text = ref('')
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
  margin-bottom: 0.5rem;
}

.input-box .input-group {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

input[type="text"], .search-input, .font-sample {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000;
  background-color: #fff;
}

.font-sample {
  background-color: #f5f5f5;
}

.font-samples {
  margin-top: 2rem;
}

.font-group {
  margin-bottom: 1rem;
}

.font-group label {
  display: block;
  margin-bottom: 0.25rem;
  color: #333;
  font-weight: bold;
}
</style>
