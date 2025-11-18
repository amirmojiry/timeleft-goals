<script setup lang="ts">
import { ref } from 'vue'
import ReadingForm from './components/ReadingForm.vue'
import ResultCard from './components/ResultCard.vue'
import LifespanVisualizer from './components/LifespanVisualizer.vue'
import {
  calculateReadingLifetime,
  type LifetimeReadingResult,
  type ReadingGoalInput,
} from './domain/lifetimeCalculator'

const result = ref<LifetimeReadingResult | null>(null)

function handleSubmit(payload: ReadingGoalInput) {
  result.value = calculateReadingLifetime(payload)
}
</script>

<template>
  <main class="app-container">
    <header class="hero">
      <p class="eyebrow">Reading goal</p>
      <h1>Lifetime Reading Estimate</h1>
      <p class="lede">
        Estimate how many books you can realistically enjoy in your remaining
        lifetime using a simple, transparent model.
      </p>
    </header>

    <section class="panel">
      <ReadingForm @submit="handleSubmit" />
    </section>

    <LifespanVisualizer v-if="result" :result="result" />

    <ResultCard v-if="result" :result="result" />

    <footer class="footer">
      Crafted with care by <strong>Amir Mojiri</strong>.
    </footer>
  </main>
</template>
