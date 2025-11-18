<script setup lang="ts">
import { reactive } from 'vue'
import {
  GoalType,
  type ReadingCadence,
  type ReadingGoalInput,
} from '../domain/lifetimeCalculator'

const form = reactive({
  currentAge: null as number | null,
  minutes: null as number | null,
  cadence: 'daily' as ReadingCadence,
  pagesPerHour: 30,
  avgPagesPerBook: 300,
})

type FormErrors = {
  currentAge: string | null
  minutes: string | null
  pagesPerHour: string | null
  avgPagesPerBook: string | null
}

const errors = reactive<FormErrors>({
  currentAge: null,
  minutes: null,
  pagesPerHour: null,
  avgPagesPerBook: null,
})

const emit = defineEmits<{
  (event: 'submit', payload: ReadingGoalInput): void
}>()

const cadenceOptions: Array<{ label: string; value: ReadingCadence }> = [
  { label: 'Minutes per day', value: 'daily' },
  { label: 'Minutes per week', value: 'weekly' },
]

function validate(): boolean {
  let isValid = true

  errors.currentAge = null
  errors.minutes = null
  errors.pagesPerHour = null
  errors.avgPagesPerBook = null

  const age = form.currentAge ?? NaN
  if (!Number.isFinite(age) || age <= 0 || age >= 120) {
    errors.currentAge = 'Enter an age between 1 and 119.'
    isValid = false
  }

  const minutes = form.minutes ?? NaN
  if (!Number.isFinite(minutes) || minutes <= 0) {
    errors.minutes = 'Reading time must be greater than 0.'
    isValid = false
  }

  if (!Number.isFinite(form.pagesPerHour) || form.pagesPerHour <= 0) {
    errors.pagesPerHour = 'Pages per hour must be greater than 0.'
    isValid = false
  }

  if (!Number.isFinite(form.avgPagesPerBook) || form.avgPagesPerBook <= 0) {
    errors.avgPagesPerBook = 'Average pages must be greater than 0.'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', {
    currentAge: form.currentAge as number,
    minutes: form.minutes as number,
    cadence: form.cadence,
    pagesPerHour: form.pagesPerHour,
    avgPagesPerBook: form.avgPagesPerBook,
    goalType: GoalType.Reading,
  })
}
</script>

<template>
  <form class="form-card" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="age">Current age</label>
      <input
        id="age"
        v-model.number="form.currentAge"
        type="number"
        min="1"
        max="119"
        required
        inputmode="numeric"
      />
      <p v-if="errors.currentAge" class="error">{{ errors.currentAge }}</p>
    </div>

    <div class="field-group">
      <div class="field flex-1">
        <label for="reading-time">Reading time</label>
        <input
          id="reading-time"
          v-model.number="form.minutes"
          type="number"
          min="1"
          required
          inputmode="decimal"
        />
        <p v-if="errors.minutes" class="error">{{ errors.minutes }}</p>
      </div>

      <div class="field flex-1">
        <label for="cadence">Cadence</label>
        <select id="cadence" v-model="form.cadence">
          <option
            v-for="option in cadenceOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="field-group">
      <div class="field flex-1">
        <label for="pages-hour">Pages per hour</label>
        <input
          id="pages-hour"
          v-model.number="form.pagesPerHour"
          type="number"
          min="1"
          required
        />
        <p v-if="errors.pagesPerHour" class="error">
          {{ errors.pagesPerHour }}
        </p>
      </div>

      <div class="field flex-1">
        <label for="pages-book">Average pages per book</label>
        <input
          id="pages-book"
          v-model.number="form.avgPagesPerBook"
          type="number"
          min="1"
          required
        />
        <p v-if="errors.avgPagesPerBook" class="error">
          {{ errors.avgPagesPerBook }}
        </p>
      </div>
    </div>

    <button type="submit" class="primary">Calculate</button>
  </form>
</template>

<style scoped>
.form-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.flex-1 {
  flex: 1;
  min-width: 200px;
}

label {
  font-weight: 600;
  color: #1f1f1f;
}

input,
select {
  border: 1px solid #cfd4dc;
  border-radius: 0.5rem;
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.error {
  color: #c2410c;
  font-size: 0.85rem;
  margin: 0;
}

.primary {
  border: none;
  border-radius: 0.75rem;
  background: #2563eb;
  color: white;
  padding: 0.85rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.primary:hover {
  background: #1d4ed8;
}
</style>
