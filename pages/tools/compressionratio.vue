<template>
  <div class="app">
    <h1>Compression Ratio</h1>
    <p class="description">
      This tool allows you to view and compare the size and compression time of
      a document using different levels of Gzip, Brotli, and Zstd compression.
    </p>
    <p>All tests were conducted on 1 core 4.2 GHz x86-64 processor.</p>
    <div class="search-box">
      <h3>File URL</h3>
      <p>File size limit is 10MB.</p>
      <div class="input-group">
        <input v-model="searchTerm" placeholder="URL" class="search-input" />
        <button @click="handleQuery" class="submit-btn">Submit</button>
      </div>
    </div>
    <div class="result">
      <h3>Compression Table</h3>
      <div v-if="loading" class="loading-status">
        Running Test ({{ completedTests }}/{{ totalTests }})
      </div>
      <table>
        <thead>
          <tr>
            <th>File size</th>
            <th>Transfered</th>
            <th>Encoding</th>
          </tr>
        </thead>
        <tbody v-if="fileInfo">
          <tr>
            <td>{{ (fileInfo.originalSize / 1000).toFixed(1) }}kB</td>
            <td>{{ (fileInfo.transferSize / 1000).toFixed(1) }}kB</td>
            <td>{{ (fileInfo.algorithm) }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Gzip</th>
            <th>Brotli</th>
            <th>Zstd</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="level in allLevels" :key="level">
            <td>{{ level }}</td>
            <td v-for="algo in algorithms" :key="algo">
              <template v-if="resultMap.get(`${algo}-${level}`)?.error">
                <span class="error">Failed</span>
              </template>
              <template v-else-if="!fileInfo"> - </template>
              <template v-else>
                <div v-if="getResult(algo, level)" class="compression-data">
                <div class="data-row">
                  <span class="percentage">{{ getResult(algo, level)!.percentage }}%</span>        </div>
                <div class="data-row">
                  <span class="size">{{ getResult(algo, level)!.size }}kB</span>        </div>
                <div class="data-row">
                  <span class="time">{{ getResult(algo, level)!.time }}ms</span>        </div>
                </div>
                <div v-else>-</div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: 'Compression Ratio - Kira Box',
  meta: [
    {
      name: 'description',
      content: 'This tool allows you to view and compare the size and compression time of a document using different levels of Gzip, Brotli, and Zstd compression.',
    },
  ],
})
import { ref, computed, onMounted } from "vue";
import { useReCaptcha } from "vue-recaptcha-v3";
type Algorithm = "gzip" | "brotli" | "zstd";
interface FileInfo {
  originalSize: number;
  transferSize: number;
  algorithm: string;
}
interface CompressionResult {
  algorithm: "gzip" | "brotli" | "zstd";
  level: number;
  size?: number;
  time?: number;
  error?: boolean;
}
const fileInfo = ref<FileInfo>();
const algorithms = ["gzip", "brotli", "zstd"] as const;
const levelRanges = {
  gzip: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  brotli: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  zstd: Array.from({ length: 22 }, (_, i) => i + 1),
};
const loading = ref(false);
const completedTests = ref(0);
const totalTests = computed(
  () =>
    levelRanges.gzip.length +
    levelRanges.brotli.length +
    levelRanges.zstd.length
);
const resultMap = ref(new Map<string, CompressionResult>());

const initializeResults = () => {
  resultMap.value.clear();
  algorithms.forEach((algo) => {
    levelRanges[algo].forEach((level) => {
      const key = `${algo}-${level}`;
      resultMap.value.set(key, {
        algorithm: algo,
        level,
      });
    });
  });
};
onMounted(initializeResults);

const allLevels = [...new Set(Object.values(levelRanges).flat())].sort(
  (a, b) => a - b
);
const getResult = (algo: Algorithm, level: number) => {
  const key = `${algo}-${level}`;
  const result = resultMap.value.get(key);
  if (!result || result.error || !result.size || !result.time) return null;
  return {
    percentage: ((result.size / originalSize.value) * 100).toFixed(1),
    size: (result.size / 1000).toFixed(1),
    time: (result.time * 1000).toFixed(0)
  };
};

const originalSize = computed(() => fileInfo.value?.originalSize || 0);

const result = ref<string | null>(null);
const searchTerm = ref("");
const recaptcha = useReCaptcha();
async function handleQuery() {
  if (!searchTerm.value.trim()) {
    result.value = "Input URL.";
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
  initializeResults();
  loading.value = true;
  completedTests.value = 0;
  fileInfo.value = undefined;
  try {
    const res = await fetch("https://kira-api.libmbr.com/v1/compress/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Recaptcha-Token": token,
      },
      body: JSON.stringify({ query: searchTerm.value.trim() }),
    });
    
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      if (!reader) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      lines.forEach((line) => {
        if (!line.trim()) return;
        const data = JSON.parse(line);
        if (data.originalSize) {
          fileInfo.value = {
            originalSize: data.originalSize,
            transferSize: data.transferSize,
            algorithm: data.encoding
          };
        } 
        else {
          const key = `${data.algorithm}-${data.level}`;
          resultMap.value.set(key, {
            ...data,
            time: data.time ? Number(data.time.toFixed(2)) : undefined,
          });
          completedTests.value++;
        }
      });
    }
  } catch (e) {
    const error = e as Error;
    result.value = `Error: ${error.message}`;
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .compression-data {
    flex-direction: column;
    gap: 4px;
  }
  .data-row {
    display: flex;
    justify-content: space-between;
  }
  .label {
    color: #666;
    margin-right: 8px;
  }
  th, td {
    padding: 0.3rem;
  }
  th:nth-child(1),
  td:nth-child(1) { width: 20%; }
  
  th:nth-child(n+2),
  td:nth-child(n+2) { width: 26%; }
}
.percentage,
.size,
.time {
  display: inline-block;
  min-width: 50px;
  text-align: right;
}
.compression-data {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.compression-data span {
  flex: 1;
}
.file-info {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.search-box .input-group {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.placeholder {
  color: #999;
  font-style: italic;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
thead {
  background-color: #f1f1f1;
}
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
  flex-grow: 1;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0;
}
.submit-btn {
  padding: 0.8rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 1rem;
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
