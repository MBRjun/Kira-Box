<template>
  <div class="app">
    <h1>Hormone Unit Converter</h1>
    <p class="description">
      Convert between common units for FSH, LH, E2, P, T, PRL and hCG.
    </p>

    <div class="search-box">
      <h3>Input</h3>
      <div class="input-group">
        <input
          v-model="inputValue"
          placeholder="Value"
          class="search-input"
          type="number"
        />
        <select v-model="selectedHormone" class="select">
          <option v-for="(cfg, key) in hormones" :key="key" :value="key">
            {{ key }}
          </option>
        </select>
        <select v-model="selectedUnit" class="select">
          <option v-for="u in currentUnits" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>
    </div>

    <div v-if="converted" class="result">
      <h3>Results — {{ selectedHormone }}</h3>
      <table>
        <thead>
          <tr>
            <th>Unit</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in currentUnits" :key="u">
            <td>{{ u }}</td>
            <td>
              <template v-if="converted[u] === null">-</template>
              <template v-else>{{ formatNumber(converted[u]) }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="back-link">
      <NuxtLink to="/tools/converter" class="back-btn">← Back to Converter</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Hormone Unit Converter - Kira Box',
  meta: [
    {
      name: 'description',
      content:
        'Convert between common units for FSH, LH, E2, P, T, PRL and hCG.',
    },
  ],
})

import { ref, computed, watch } from "vue";

type HormoneKey = "FSH" | "LH" | "E2" | "P" | "T" | "PRL" | "HCG";

const inputValue = ref<number | null>(null);
const selectedHormone = ref<HormoneKey>("FSH");
const selectedUnit = ref<string>("");

const hormones: Record<
  HormoneKey,
  {
    units: string[];
    convert: (v: number, from: string) => Record<string, number | null>;
  }
> = {
  FSH: {
    units: ["IU/L", "mIU/mL", "U/L"],
    convert(value, from) {
      const t = { "IU/L": value, "mIU/mL": value, "U/L": value };
      return t;
    },
  },
  LH: {
    units: ["IU/L", "mIU/mL", "U/L"],
    convert(value, from) {
      const t = { "IU/L": value, "mIU/mL": value, "U/L": value };
      return t;
    },
  },
  E2: {
    units: ["pmol/L", "pg/mL", "ng/L"],
    convert(v, from) {
      const table = { "pmol/L": null, "pg/mL": null, "ng/L": null } as Record<
        string,
        number | null
      >;
      if (isNaN(v)) return table;
      const ratio = 3.6713; // 1 pg/mL = 3.6713 pmol/L
      if (from === "pmol/L") {
        table["pmol/L"] = v;
        table["pg/mL"] = v / ratio;
        table["ng/L"] = v / ratio;
      } else if (from === "pg/mL") {
        table["pg/mL"] = v;
        table["pmol/L"] = v * ratio;
        table["ng/L"] = v;
      } else if (from === "ng/L") {
        table["ng/L"] = v;
        table["pg/mL"] = v;
        table["pmol/L"] = v * ratio;
      }
      return table;
    },
  },
  P: {
    units: ["nmol/L", "ng/mL", "µg/L"],
    convert(v, from) {
      const table = { "nmol/L": null, "ng/mL": null, "µg/L": null } as Record<
        string,
        number | null
      >;
      if (isNaN(v)) return table;
      const ratio = 0.31446; // 1 nmol/L = 0.31446 ng/mL
      if (from === "nmol/L") {
        table["nmol/L"] = v;
        table["ng/mL"] = v * ratio;
        table["µg/L"] = v * ratio;
      } else if (from === "ng/mL") {
        table["ng/mL"] = v;
        table["µg/L"] = v;
        table["nmol/L"] = v / ratio;
      } else if (from === "µg/L") {
        table["µg/L"] = v;
        table["ng/mL"] = v;
        table["nmol/L"] = v / ratio;
      }
      return table;
    },
  },
  T: {
    units: ["nmol/L", "ng/mL", "µg/L", "ng/dL"],
    convert(v, from) {
      const table = {
        "nmol/L": null,
        "ng/mL": null,
        "µg/L": null,
        "ng/dL": null,
      } as Record<string, number | null>;
      if (isNaN(v)) return table;
      const nmolToNgMl = 0.28842; // 1 nmol/L = 0.28842 ng/mL
      if (from === "nmol/L") {
        table["nmol/L"] = v;
        table["ng/mL"] = v * nmolToNgMl;
      } else if (from === "ng/mL") {
        table["ng/mL"] = v;
        table["nmol/L"] = v / nmolToNgMl;
      } else if (from === "µg/L") {
        table["µg/L"] = v;
        table["ng/mL"] = v;
        table["nmol/L"] = v / nmolToNgMl;
      } else if (from === "ng/dL") {
        table["ng/dL"] = v;
        table["ng/mL"] = v / 100;
        table["nmol/L"] = (v / 100) / nmolToNgMl;
      }
      if (table["ng/mL"] !== null) {
        table["µg/L"] = table["ng/mL"];
        table["ng/dL"] = table["ng/mL"]! * 100;
      }
      return table;
    },
  },
  PRL: {
    units: ["mIU/L", "ng/mL", "µg/L", "µIU/mL"],
    convert(v, from) {
      const table = {
        "mIU/L": null,
        "ng/mL": null,
        "µg/L": null,
        "µIU/mL": null,
      } as Record<string, number | null>;
      if (isNaN(v)) return table;
      const mIUperNg = 21.2;
      if (from === "mIU/L") {
        table["mIU/L"] = v;
        table["ng/mL"] = v / mIUperNg;
      } else if (from === "ng/mL") {
        table["ng/mL"] = v;
        table["mIU/L"] = v * mIUperNg;
      } else if (from === "µg/L") {
        table["µg/L"] = v;
        table["ng/mL"] = v;
        table["mIU/L"] = v * mIUperNg;
      } else if (from === "µIU/mL") {
        table["µIU/mL"] = v;
        table["mIU/L"] = v;
        table["ng/mL"] = v / mIUperNg;
      }
      if (table["ng/mL"] !== null) table["µg/L"] = table["ng/mL"];
      if (table["mIU/L"] !== null) table["µIU/mL"] = table["mIU/L"];
      return table;
    },
  },
  HCG: {
    units: ["IU/L", "mIU/mL", "U/L", "ng/mL"],
    convert(v, from) {
      const table = {
        "IU/L": null,
        "mIU/mL": null,
        "U/L": null,
        "ng/mL": null,
      } as Record<string, number | null>;
      if (isNaN(v)) return table;
      const mIUperNg = 15.0; // 1 ng/mL ≈ 15 mIU/mL
      if (["IU/L", "mIU/mL", "U/L"].includes(from)) {
        table["IU/L"] = v;
        table["mIU/mL"] = v;
        table["U/L"] = v;
        table["ng/mL"] = v / mIUperNg;
      } else if (from === "ng/mL") {
        table["ng/mL"] = v;
        table["IU/L"] = v * mIUperNg;
        table["mIU/mL"] = v * mIUperNg;
        table["U/L"] = v * mIUperNg;
      }
      return table;
    },
  },
};

const currentUnits = computed(() => hormones[selectedHormone.value].units);
if (!selectedUnit.value) selectedUnit.value = currentUnits.value[0];

const converted = ref<Record<string, number | null> | null>(null);

function handleConvert() {
  const v = inputValue.value;
  if (v === null || isNaN(v)) {
    converted.value = null;
    return;
  }
  converted.value = hormones[selectedHormone.value].convert(v, selectedUnit.value);
}

// Auto-update on hormone/unit changes
watch([selectedHormone, selectedUnit, inputValue], () => {
  if (inputValue.value !== null && !isNaN(inputValue.value)) {
    handleConvert();
  }
});

function formatNumber(n: number | null) {
  if (n === null) return "-";
  if (n < 0.001) return "<0.001";
  const abs = Math.abs(n);
  const intPart = Math.floor(abs);
  return intPart !== 0 ? n.toFixed(2) : n.toFixed(3);
}
</script>

<style scoped>
.search-box .input-group {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
  align-items: center;
}

.app {
  padding: 2rem;
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
}
.description {
  color: #666;
  margin-bottom: 1rem;
}
.search-box {
  margin: 2rem 0;
}
.search-input {
  width: 120px;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0;
}
.select {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.submit-btn {
  padding: 0.6rem 1rem;
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
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
  white-space: nowrap;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
th,
td {
  border: 1px solid #e6e6e6;
  padding: 0.6rem;
  text-align: left;
}
th {
  background: #f1f3f5;
}

.back-link {
  margin-top: 2rem;
}

.back-btn {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: #6c757d;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}
</style>
