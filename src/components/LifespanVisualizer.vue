<script setup lang="ts">
import { computed } from 'vue'
import type { LifetimeReadingResult } from '../domain/lifetimeCalculator'

const props = defineProps<{
  result: LifetimeReadingResult
}>()

const agePercent = computed(() => {
  if (props.result.expectedAge <= 0) return 0
  return Math.min(
    Math.max((props.result.currentAge / props.result.expectedAge) * 100, 0),
    100
  )
})

const remainingPercent = computed(() => 100 - agePercent.value)

const formattedAge = computed(() =>
  props.result.currentAge.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })
)

const formattedRemaining = computed(() =>
  Math.max(props.result.yearsLeft, 0).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })
)
</script>

<template>
  <section class="visualizer">
    <header>
      <h3>Lifespan overview</h3>
      <p>Age {{ formattedAge }} vs. {{ formattedRemaining }} years remaining.</p>
    </header>

    <div class="bar">
      <div class="segment age" :style="{ width: agePercent + '%' }">
        <span v-if="agePercent > 15">
          {{ formattedAge }} yrs lived
        </span>
      </div>
      <div class="segment remaining" :style="{ width: remainingPercent + '%' }">
        <span v-if="remainingPercent > 15">
          {{ formattedRemaining }} yrs left
        </span>
      </div>
    </div>

    <div class="labels">
      <div>
        <strong>{{ formattedAge }} yrs</strong>
        <span>Current age</span>
      </div>
      <div>
        <strong>{{ formattedRemaining }} yrs</strong>
        <span>Estimated remaining</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.visualizer {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

header h3 {
  margin: 0;
  font-size: 1.1rem;
}

header p {
  margin: 0;
  color: #475467;
  font-size: 0.95rem;
}

.bar {
  display: flex;
  width: 100%;
  height: 28px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
}

.segment {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  transition: width 0.3s ease;
}

.segment.age {
  background: linear-gradient(90deg, #1d4ed8, #2563eb);
}

.segment.remaining {
  background: linear-gradient(90deg, #10b981, #34d399);
  color: #064e3b;
}

.segment.remaining span {
  color: #064e3b;
}

.labels {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  color: #475467;
}

.labels strong {
  display: block;
  font-size: 1rem;
  color: #0f172a;
}
</style>
