<template>
<div class="app">
  <h1>DTMF</h1>
  <p class="description">Online telephone keypad and DTMF signaling tools.</p><br>
  <div class="button-wrapper">
  <button @click="start" class="submit-btn">Start Detection</button>
  </div>
  <div class="input-box">
  <input
    :value="text"
    readonly
    placeholder="Results here"
    class="results-box"
  />
  </div>
  <canvas ref="canvas" width="800" height="200" class="waveform"></canvas>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

useHead({
  title: 'DTMF - Kira Box',
  meta: [{ name: 'description', content: 'Online telephone keypad and DTMF signaling tools.' }],
})

const text = ref('')
const canvas = ref<HTMLCanvasElement | null>(null)

const dtmfFrequencies = {
  rows: [697, 770, 852, 941],
  cols: [1209, 1336, 1477, 1633],
}

const dtmfMap: Record<string, string> = {
  '697,1209': '1', '697,1336': '2', '697,1477': '3', '697,1633': 'A',
  '770,1209': '4', '770,1336': '5', '770,1477': '6', '770,1633': 'B',
  '852,1209': '7', '852,1336': '8', '852,1477': '9', '852,1633': 'C',
  '941,1209': '*', '941,1336': '0', '941,1477': '#', '941,1633': 'D',
}

function goertzel(samples: Float32Array, freq: number, sampleRate: number) {
  const N = samples.length
  const k = Math.round(0.5 + (N * freq) / sampleRate)
  const w = (2 * Math.PI * k) / N
  const cosine = Math.cos(w)
  const sine = Math.sin(w)
  const coeff = 2 * cosine

  let q0 = 0, q1 = 0, q2 = 0
  for (let i = 0; i < N; i++) {
    q0 = coeff * q1 - q2 + samples[i]
    q2 = q1
    q1 = q0
  }
  const real = q1 - q2 * cosine
  const imag = q2 * sine
  return Math.sqrt(real * real + imag * imag)
}

async function start() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioCtx = new AudioContext()
  const source = audioCtx.createMediaStreamSource(stream)
  const processor = audioCtx.createScriptProcessor(1024, 1, 1)
  source.connect(processor)
  processor.connect(audioCtx.destination)

  const sampleRate = audioCtx.sampleRate
  let lastDetected = ''
  const ctx = canvas.value?.getContext('2d')

  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0)

    // waveform
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.beginPath()
      const step = Math.ceil(input.length / ctx.canvas.width)
      const amp = ctx.canvas.height / 2
      for (let i = 0; i < ctx.canvas.width; i++) {
        const min = input[i * step]
        const y = (1 + min) * amp
        if (i === 0) ctx.moveTo(0, y)
        else ctx.lineTo(i, y)
      }
      ctx.strokeStyle = '#42b983'
      ctx.stroke()
    }

    // DTMF
    const rowPowers = dtmfFrequencies.rows.map(f => goertzel(input, f, sampleRate))
    const colPowers = dtmfFrequencies.cols.map(f => goertzel(input, f, sampleRate))

    const rowMax = Math.max(...rowPowers)
    const colMax = Math.max(...colPowers)
    const rowFreq = dtmfFrequencies.rows[rowPowers.indexOf(rowMax)]
    const colFreq = dtmfFrequencies.cols[colPowers.indexOf(colMax)]

    if (rowMax > 10 && colMax > 10) {
      const key = dtmfMap[`${rowFreq},${colFreq}`]
      if (key && key !== lastDetected) {
        text.value += key
        lastDetected = key
      }
    } else {
      lastDetected = ''
    }
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
  margin-bottom: 0.5rem;
}

canvas {
  margin-top: 1rem;
  border: 1px solid #ccc;
  display: block;
}

.button-wrapper {
margin-bottom: 1rem;
}

.input-box {
margin-bottom: 1.5rem;
}

.results-box {
width: 100%;
padding: 0.8rem;
font-size: 1rem;
border: 1px solid #ddd;
border-radius: 4px;
box-sizing: border-box;
color: #000;
background-color: #f5f5f5;
}

.submit-btn {
width: 100%;
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

.waveform {
max-width: 100%;
height: 200px;
display: block;
border: 1px solid #ddd;
border-radius: 4px;
}
</style>
