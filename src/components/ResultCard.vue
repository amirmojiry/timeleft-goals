<script setup lang="ts">
import { computed } from 'vue'
import type { LifetimeReadingResult } from '../domain/lifetimeCalculator'

const props = defineProps<{
  result: LifetimeReadingResult
}>()

const decimal = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })
const integer = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

const formattedExpectedAge = computed(() =>
  integer.format(props.result.expectedAge)
)
const formattedYearsLeft = computed(() =>
  decimal.format(Math.max(props.result.yearsLeft, 0))
)
const formattedBooks = computed(() =>
  integer.format(Math.max(props.result.totalBooks, 0))
)
const formattedPages = computed(() =>
  integer.format(Math.max(props.result.avgPagesPerBook, 0))
)

const formattedHours = computed(() =>
  decimal.format(Math.max(props.result.totalReadableHours, 0))
)

const summarySentence = computed(() => {
  if (props.result.yearsLeft <= 0) {
    return `From this point forward, you could still work through roughly ${formattedBooks.value} books of about ${formattedPages.value} pages each if you keep showing up.`
  }

  return `If you keep this pace, you might be able to read about ${formattedBooks.value} books of around ${formattedPages.value} pages each in the rest of your life.`
})
</script>

<template>
  <section class="result-card">
    <h2>Estimated plan</h2>
    <ul>
      <li>
        <span>Estimated lifespan:</span>
        <strong>{{ formattedExpectedAge }} years</strong>
      </li>
      <li>
        <span>Years remaining:</span>
        <strong>{{ formattedYearsLeft }} years</strong>
      </li>
      <li>
        <span>Total reading hours:</span>
        <strong>{{ formattedHours }} hrs</strong>
      </li>
      <li>
        <span>Projected books (~{{ formattedPages }} pages each):</span>
        <strong>{{ formattedBooks }} books</strong>
      </li>
    </ul>
    <p class="summary">
      {{ summarySentence }}
    </p>
  </section>
</template>

<style scoped>
.result-card {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1rem;
  color: #334155;
}

span {
  color: #475467;
}

strong {
  color: #0f172a;
}

.summary {
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
  line-height: 1.5;
}
</style>
