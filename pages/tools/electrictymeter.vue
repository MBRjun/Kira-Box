<template>
  <div class="app">
    <h1>Electricty Meter</h1>
    <p class="description">
      Power and Electricity Bill Costs calculater.
    </p>
    <div class="search-box">
      <div class="input-group">
        <input
          type="number"
          class="search-input"
          v-model.number="impPerKWh"
          placeholder="imp/kWh"
        />
        <button class="submit-btn" @click="recordPulse">Pulse</button>
      </div>
    </div>

    <div class="result" v-if="power !== null">
      Power<p class="power-value">{{ Math.round(power) }} W</p>
    </div>

    <div class="result" v-else>
      Power<p class="placeholder">Press PULSE button to start.</p>
    </div>
    <div class="result">
      <h2>天津 / 阶梯电价计算器</h2>
      <p>Tianjin Electricity Bill Calculator</p>
      <p>仅适用于城乡居民用户。<br>计算数值仅供参考，请以实际账单为准。<br>本计算器仅在本地处理数据，不会上传至服务器或云端。</p>
      <p>基于文件 <a target="_blank" href="https://fzgg.tj.gov.cn/zwgk_47325/zcfg_47338/zcwjx/fgwj/202012/t20201219_5070696.html" rel="nofollow noopener">津发改价管〔2012〕667号</a>。</p>
      <div class="search-box">
        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model="kWhInput"
            placeholder="Energy (kWh)"
            @input="updateCostFromKWhTJ"
            @blur="formatKWh"
          />
        </div>

        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model="avgPowerInput"
            placeholder="Power Avg (W)"
            @input="updateFromAvgPowerTJ"
            @blur="formatAvgPower"
          />
        </div>

        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model="costInput"
            placeholder="Costs (CNY)"
            @input="updateKWhFromCostTJ"
            @blur="formatCost"
          />
        </div>

        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model.number="billingCycle"
            placeholder="Cycle (mo)"
            min="1"
            @input="recalc"
          />
        </div>
      </div>

      <table v-if="details.length > 0">
        <thead>
          <tr>
            <th>Level</th>
            <th>Energy</th>
            <th>¥/kWh</th>
            <th>Costs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in details" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ d.kWh.toFixed(2) }}</td>
            <td>{{ d.rate.toFixed(2) }}</td>
            <td>{{ d.cost.toFixed(2) }}</td>
          </tr>
          <tr>
            <td><b>T</b></td>
            <td><b>{{ kWh?.toFixed(2) }}</b></td>
            <td><b>{{ avgPrice.toFixed(2) }}</b></td>
            <td><b>{{ cost?.toFixed(2) }}</b></td>
          </tr>
          <tr>
            <td colspan="4" style="text-align:left;">
              Power Avg <b>{{ avgPower?.toFixed(2) }} W</b>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
    <div class="result">
      <h2>北京 / 阶梯电价计算器 JM</h2>
      <p>Beijing Resident Electricity Bill Calculator</p>
      <p>仅适用于试行阶梯电价低压居民用户。<br>计算数值仅供参考，请以实际账单为准。<br>本计算器仅在本地处理数据，不会上传至服务器或云端。</p>
      <p>基于文件 <a target="_blank" href="https://www.beijing.gov.cn/zhengce/gfxwj/sj/202012/W020201201332914812668.pdf" rel="nofollow noopener">北京市销售电价表</a>。</p>
      <div class="search-box">
        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model="kWhInputBJ"
            placeholder="Energy (kWh)"
            @input="updateCostFromKWhBJ"
            @blur="formatKWh"
          />
        </div>

        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model="avgPowerInputBJ"
            placeholder="Power Avg (W)"
            @input="updateFromAvgPowerBJ"
            @blur="formatAvgPower"
          />
        </div>

        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model="costInputBJ"
            placeholder="Costs (CNY)"
            @input="updateKWhFromCostBJ"
            @blur="formatCost"
          />
        </div>

        <div class="input-group">
          <input
            type="number"
            class="search-input"
            v-model.number="billingCycleBJ"
            placeholder="Cycle (mo)"
            min="1"
            @input="recalc"
          />
        </div>
      </div>

      <table v-if="detailsBJ.length > 0">
        <thead>
          <tr>
            <th>Level</th>
            <th>Energy</th>
            <th>¥/kWh</th>
            <th>Costs</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in detailsBJ" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ d.kWh.toFixed(2) }}</td>
            <td>{{ d.rate.toFixed(2) }}</td>
            <td>{{ d.cost.toFixed(2) }}</td>
          </tr>
          <tr>
            <td><b>T</b></td>
            <td><b>{{ kWhBJ?.toFixed(2) }}</b></td>
            <td><b>{{ avgPriceBJ.toFixed(2) }}</b></td>
            <td><b>{{ costBJ?.toFixed(2) }}</b></td>
          </tr>
          <tr>
            <td colspan="4" style="text-align:left;">
              Power Avg <b>{{ avgPowerBJ?.toFixed(2) }} W</b>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
  </div>
  
</template>

<script lang="ts" setup>
useHead({
  title: 'Electricty Meter - Kira Box',
  meta: [
    {
      name: 'description',
      content: 'Power and Electricity Bill Costs calculater.',
    },
  ],
})
import { ref, computed } from 'vue'

const impPerKWh = ref(1200)
const pulses = ref<number[]>([])

const avgInterval = ref(0)
const power = ref<number | null>(null)

// TIANJIN CALC
const tierLimitsBaseTJ = [220, 400]
const tierRatesTJ = [0.49, 0.54, 0.79]
const billingCycle = ref<number>(12)
// 天津默认每自然年补差价结算，计费周期 12 个月

const kWh = ref<number | null>(null)
const cost = ref<number | null>(null)
const avgPower = ref<number | null>(null)

const kWhInput = ref<string>('')
const costInput = ref<string>('')
const avgPowerInput = ref<string>('')

// BEIJING CALC
const tierLimitsBaseBJ = [240, 400]
const tierRatesBJ = [0.4883, 0.5383, 0.7883]
const billingCycleBJ = ref<number>(1)

const kWhBJ = ref<number | null>(null)
const costBJ = ref<number | null>(null)
const avgPowerBJ = ref<number | null>(null)
const detailsBJ = ref<{ kWh: number; rate: number; cost: number }[]>([])
const kWhInputBJ = ref<string>('')
const costInputBJ = ref<string>('')
const avgPowerInputBJ = ref<string>('')


const details = ref<{ kWh: number; rate: number; cost: number }[]>([])

function recordPulse() {
  const now = Date.now()
  pulses.value.push(now)

  if (pulses.value.length > 30) {
    pulses.value.shift()
  }
  if (pulses.value.length >= 3) {
    let intervals: number[] = []
    for (let i = 1; i < pulses.value.length; i++) {
      intervals.push(pulses.value[i] - pulses.value[i - 1])
    }
    avgInterval.value =
      intervals.reduce((a, b) => a + b, 0) / intervals.length

    power.value = (3600000 / (avgInterval.value * impPerKWh.value)) * 1000 // W
  }
}

// Energy => Cost
function calcCostFromKWhTJ(kwh: number): number {
  details.value = []
  if (kwh <= 0) return 0

  let remain = kwh
  let total = 0

  const tierLimitsTJ = tierLimitsBaseTJ.map(l => l * billingCycle.value)

  // L1
  let d1 = Math.min(remain, tierLimitsTJ[0])
  total += d1 * tierRatesTJ[0]
  details.value.push({ kWh: d1, rate: tierRatesTJ[0], cost: d1 * tierRatesTJ[0] })
  remain -= d1

  if (remain > 0) {
    // L2
    let d2 = Math.min(remain, tierLimitsTJ[1] - tierLimitsTJ[0])
    total += d2 * tierRatesTJ[1]
    details.value.push({ kWh: d2, rate: tierRatesTJ[1], cost: d2 * tierRatesTJ[1] })
    remain -= d2
  }

  if (remain > 0) {
    // L3
    let d3 = remain
    total += d3 * tierRatesTJ[2]
    details.value.push({ kWh: d3, rate: tierRatesTJ[2], cost: d3 * tierRatesTJ[2] })
  }

  return total
}

function calcCostFromKWhBJ(kwh: number): number {
  detailsBJ.value = []
  if (kwh <= 0) return 0

  let remain = kwh
  let total = 0

  const tierLimitsBJ = tierLimitsBaseBJ.map(l => l * billingCycle.value)

  // L1
  let d1 = Math.min(remain, tierLimitsBJ[0])
  total += d1 * tierRatesBJ[0]
  detailsBJ.value.push({ 
    kWh: d1, 
    rate: tierRatesBJ[0], 
    cost: d1 * tierRatesBJ[0] 
  })
  remain -= d1

  if (remain > 0) {
    // L2
    let d2 = Math.min(remain, tierLimitsBJ[1] - tierLimitsBJ[0])
    total += d2 * tierRatesTJ[1]
    detailsBJ.value.push({ kWh: d2, rate: tierRatesBJ[1], cost: d2 * tierRatesBJ[1] })
    remain -= d2
  }

  if (remain > 0) {
    // L3
    let d3 = remain
    total += d3 * tierRatesBJ[2]
    detailsBJ.value.push({ kWh: d3, rate: tierRatesBJ[2], cost: d3 * tierRatesBJ[2] })
  }

  return total
}

// Cost => Energy
function calcKWhFromCostTJ(cny: number): number {
  if (cny <= 0) {
    details.value = []
    return 0
  }

  const tierLimits = tierLimitsBaseTJ.map(l => l * billingCycle.value)
  const cost1 = tierLimits[0] * tierRatesTJ[0]
  const cost2 = cost1 + (tierLimits[1] - tierLimits[0]) * tierRatesTJ[1]

  if (cny <= cost1) {
    details.value = [
      { kWh: cny / tierRatesTJ[0], rate: tierRatesTJ[0], cost: cny },
    ]
    return cny / tierRatesTJ[0]
  } else if (cny <= cost2) {
    const d1 = tierLimits[0]
    const d1Cost = cost1
    const d2 = (cny - cost1) / tierRatesTJ[1]
    details.value = [
      { kWh: d1, rate: tierRatesTJ[0], cost: d1Cost },
      { kWh: d2, rate: tierRatesTJ[1], cost: cny - cost1 },
    ]
    return d1 + d2
  } else {
    const d1 = tierLimits[0]
    const d2 = tierLimits[1] - tierLimits[0]
    const d3 = (cny - cost2) / tierRatesTJ[2]
    details.value = [
      { kWh: d1, rate: tierRatesTJ[0], cost: cost1 },
      { kWh: d2, rate: tierRatesTJ[1], cost: cost2 - cost1 },
      { kWh: d3, rate: tierRatesTJ[2], cost: cny - cost2 },
    ]
    return d1 + d2 + d3
  }
}

function calcKWhFromCostBJ(cny: number): number {
  if (cny <= 0) {
    detailsBJ.value = []
    return 0
  }

  const tierLimits = tierLimitsBaseBJ.map(l => l * billingCycleBJ.value)
  const cost1 = tierLimits[0] * tierRatesBJ[0]
  const cost2 = cost1 + (tierLimits[1] - tierLimits[0]) * tierRatesBJ[1]

  if (cny <= cost1) {
    detailsBJ.value = [{
      kWh: cny / tierRatesBJ[0],
      rate: tierRatesBJ[0],
      cost: cny
    }]
    return cny / tierRatesBJ[0]
  } else if (cny <= cost2) {
    const d2 = (cny - cost1) / tierRatesBJ[1]
    detailsBJ.value = [
      { kWh: tierLimits[0], rate: tierRatesBJ[0], cost: cost1 },
      { kWh: d2, rate: tierRatesBJ[1], cost: cny - cost1 }
    ]
    return tierLimits[0] + d2
  } else {
    const d3 = (cny - cost2) / tierRatesBJ[2]
    detailsBJ.value = [
      { kWh: tierLimits[0], rate: tierRatesBJ[0], cost: cost1 },
      { 
        kWh: tierLimits[1] - tierLimits[0], 
        rate: tierRatesBJ[1], 
        cost: cost2 - cost1 
      },
      { kWh: d3, rate: tierRatesBJ[2], cost: cny - cost2 }
    ]
    return tierLimits[1] + d3
  }
}


function updateCostFromKWhTJ() {
  if (kWhInput.value === '') {
    kWh.value = null
    cost.value = null
    avgPower.value = null
    details.value = []
    return
  }
  kWh.value = parseFloat(kWhInput.value)
  cost.value = calcCostFromKWhTJ(kWh.value)
  costInput.value = cost.value.toFixed(2)
  calcAvgPower()
}

function updateCostFromKWhBJ() {
  if (!kWhInputBJ.value) {
    resetBJState();
    return;
  }
  
  kWhBJ.value = parseFloat(kWhInputBJ.value);
  costBJ.value = calcCostFromKWhBJ(kWhBJ.value);
  costInputBJ.value = costBJ.value.toFixed(2);
  calcAvgPower();
}

function updateKWhFromCostTJ() {
  if (costInput.value === '') {
    cost.value = null
    kWh.value = null
    avgPower.value = null
    details.value = []
    return
  }
  cost.value = parseFloat(costInput.value)
  kWh.value = calcKWhFromCostTJ(cost.value)
  kWhInput.value = kWh.value.toFixed(2)
  calcAvgPower()
}

function updateKWhFromCostBJ() {
  if (!costInputBJ.value) {
    resetBJState();
    return;
  }
  
  costBJ.value = parseFloat(costInputBJ.value);
  kWhBJ.value = calcKWhFromCostBJ(costBJ.value);
  kWhInputBJ.value = kWhBJ.value.toFixed(2);
  calcAvgPowerBJ();
}

function updateFromAvgPowerTJ() {
  if (avgPowerInput.value === '') {
    avgPower.value = null
    return
  }
  avgPower.value = parseFloat(avgPowerInput.value)
  if (avgPower.value > 0) {
    // 平均功率 -> 推算 kWh
    const hours = billingCycle.value * 30 * 24
    kWh.value = (avgPower.value * hours) / 1000
    kWhInput.value = kWh.value.toFixed(2)
    cost.value = calcCostFromKWhTJ(kWh.value)
    costInput.value = cost.value.toFixed(2)
  }
}

function updateFromAvgPowerBJ() {
  if (!avgPowerInputBJ.value) {
    avgPowerBJ.value = null;
    return;
  }
  
  avgPowerBJ.value = parseFloat(avgPowerInputBJ.value);
  if (avgPowerBJ.value > 0) {
    const hours = billingCycleBJ.value * 30 * 24;
    kWhBJ.value = (avgPowerBJ.value * hours) / 1000;
    kWhInputBJ.value = kWhBJ.value.toFixed(2);
    costBJ.value = calcCostFromKWhBJ(kWhBJ.value);
    costInputBJ.value = costBJ.value.toFixed(2);
  }
}

function calcAvgPower() {
  if (kWh.value && billingCycle.value > 0) {
    const hours = billingCycle.value * 30 * 24
    avgPower.value = (kWh.value * 1000) / hours
    avgPowerInput.value = avgPower.value.toFixed(2)
  }
}

function calcAvgPowerBJ() {
  if (kWhBJ.value && billingCycleBJ.value > 0) {
    const hours = billingCycleBJ.value * 30 * 24;
    avgPowerBJ.value = (kWhBJ.value * 1000) / hours;
    avgPowerInputBJ.value = avgPowerBJ.value.toFixed(2);
  }
}

// 输入框格式化为两位小数
function formatKWh() {
  if (kWhInput.value !== '') {
    kWhInput.value = parseFloat(kWhInput.value).toFixed(2)
  }
}
function formatCost() {
  if (costInput.value !== '') {
    costInput.value = parseFloat(costInput.value).toFixed(2)
  }
}
function formatAvgPower() {
  if (avgPowerInput.value !== '') {
    avgPowerInput.value = parseFloat(avgPowerInput.value).toFixed(2)
  }
}

// 改变周期时重算
function recalc() {
  if (kWh.value !== null) {
    cost.value = calcCostFromKWhTJ(kWh.value)
    costInput.value = cost.value.toFixed(2)
    calcAvgPower()
  } else if (cost.value !== null) {
    kWh.value = calcKWhFromCostTJ(cost.value)
    kWhInput.value = kWh.value.toFixed(2)
    calcAvgPower()
  }
}

function resetBJState() {
  kWhBJ.value = null;
  costBJ.value = null;
  avgPowerBJ.value = null;
  detailsBJ.value = [];
}

// 北京：周期变化重算
function recalcBJ() {
  if (kWhBJ.value !== null) {
    costBJ.value = calcCostFromKWhBJ(kWhBJ.value);
    costInputBJ.value = costBJ.value.toFixed(2);
    calcAvgPowerBJ();
  } else if (costBJ.value !== null) {
    kWhBJ.value = calcKWhFromCostBJ(costBJ.value);
    kWhInputBJ.value = kWhBJ.value.toFixed(2);
    calcAvgPowerBJ();
  }
}

// 平均电价
const avgPrice = computed(() => {
  if (kWh.value && cost.value) {
    return cost.value / kWh.value
  }
  return 0
})
const avgPriceBJ = computed(() => {
  if (kWhBJ.value && costBJ.value) {
    return costBJ.value / kWhBJ.value
  }
  return 0
})
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
  --link-color: #166fd6;
}

.app a,
.app a:link,
.app a:visited,
.app a:hover,
.app a:active,
.app a:focus {
  color: var(--link-color);
  text-decoration: none; /* 可按需改成 none */
  outline: none;
}

.app a:hover {
  color: var(--link-color);
  text-decoration: none; /* 或 none */
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

.power-value {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: right;
}
</style>
