import lifeExpectancyData from '../data/lifeExpectancy.json'

export const GoalType = {
  Reading: 'reading',
} as const

export type GoalType = (typeof GoalType)[keyof typeof GoalType]
export type ReadingCadence = 'daily' | 'weekly'
export type GenderSelection = 'male' | 'female' | 'all'

const DAYS_IN_YEAR = 365

const AGE_BANDS = [
  { label: '0-19', min: 0, max: 19 },
  { label: '20-39', min: 20, max: 39 },
  { label: '40-59', min: 40, max: 59 },
  { label: '60-79', min: 60, max: 120 },
] as const

type AgeBand = (typeof AGE_BANDS)[number]['label']

type RemainingYearsByAgeBand = Record<AgeBand, number>

interface LifeExpectancyEntry {
  atBirth: number
  remainingYearsByAgeBand: RemainingYearsByAgeBand
}

type CountryLifeExpectancy = Record<string, LifeExpectancyEntry>
type LifeExpectancyDataset = Record<string, CountryLifeExpectancy>

const lifeExpectancy = lifeExpectancyData as unknown as LifeExpectancyDataset

export interface ReadingGoalInput {
  currentAge: number
  minutes: number
  cadence: ReadingCadence
  pagesPerHour: number
  avgPagesPerBook: number
  goalType?: GoalType
  countryCode?: string | null
  gender?: GenderSelection | null
}

export interface LifetimeReadingResult {
  goalType: GoalType
  currentAge: number
  expectedAge: number
  yearsLeft: number
  daysLeft: number
  dailyMinutes: number
  energyFactor: number
  totalReadableHours: number
  totalPages: number
  totalBooks: number
  pagesPerHour: number
  avgPagesPerBook: number
  remainingYearsModel: number
  lifeExpectancyLabel: string
}

/**
 * Simple energy model that reduces available time as the user ages.
 */
export function getEnergyFactor(currentAge: number): number {
  if (currentAge < 50) return 1
  if (currentAge <= 65) return 0.8
  return 0.6
}

function normalizeCountry(code?: string | null): string | undefined {
  const trimmed = code?.trim().toUpperCase()
  if (!trimmed) return undefined
  return trimmed
}

function normalizeGender(
  gender?: GenderSelection | null
): GenderSelection | undefined {
  if (!gender) {
    return undefined
  }
  return gender
}

/**
 * Maps the age into one of the configured age bands.
 * Ages above 79 are clamped into the "60-79" band to keep the model simple.
 */
function getAgeBand(age: number): AgeBand {
  for (const band of AGE_BANDS) {
    if (age >= band.min && age <= band.max) {
      return band.label
    }
  }
  const lastBand = AGE_BANDS[AGE_BANDS.length - 1]
  return lastBand ? lastBand.label : '60-79'
}

function getGlobalEntry(): LifeExpectancyEntry | undefined {
  const globalEntry = lifeExpectancy.global?.all
  return globalEntry
}

/**
 * Retrieves remaining years based on optional country/gender context.
 * Falls back to global averages if no specific data is available.
 */
export function getRemainingYears(
  age: number,
  countryCode?: string | null,
  gender?: GenderSelection | null
): number {
  const normalizedCountry = normalizeCountry(countryCode)
  const normalizedGender = normalizeGender(gender)
  const band = getAgeBand(age)

  const fallback = getGlobalEntry()
  const fallbackYears =
    fallback?.remainingYearsByAgeBand[band] ?? Math.max(80 - age, 0)

  if (normalizedCountry) {
    const countryEntry = lifeExpectancy[normalizedCountry]
    if (countryEntry) {
      const specific =
        (normalizedGender && countryEntry[normalizedGender]) ?? countryEntry.all
      const years = specific?.remainingYearsByAgeBand[band]
      if (typeof years === 'number') {
        return years
      }
    }
  }

  return fallbackYears
}

function buildLifeExpectancyLabel(
  countryCode?: string | null,
  gender?: GenderSelection | null
): string {
  const normalizedCountry = normalizeCountry(countryCode)
  const normalizedGender = normalizeGender(gender)

  if (!normalizedCountry) {
    return 'Using global average expectancy'
  }

  if (normalizedGender && normalizedGender !== 'all') {
    return `Using ${normalizedCountry} · ${normalizedGender}`
  }

  return `Using ${normalizedCountry} average expectancy`
}

/**
 * Calculates the remaining reading capacity for the user.
 * The returned object stays generic so it can power other goal types later.
 */
export function calculateReadingLifetime(
  input: ReadingGoalInput
): LifetimeReadingResult {
  const remainingYears = getRemainingYears(
    input.currentAge,
    input.countryCode,
    input.gender
  )
  const expectedAge = input.currentAge + remainingYears
  const yearsLeft = Math.max(remainingYears, 0)
  const dailyMinutes =
    input.cadence === 'daily' ? input.minutes : input.minutes / 7
  const daysLeft = Math.round(yearsLeft * DAYS_IN_YEAR)
  const energyFactor = getEnergyFactor(input.currentAge)
  const totalReadableMinutes = daysLeft * dailyMinutes * energyFactor
  const totalReadableHours = totalReadableMinutes / 60
  const totalPages = totalReadableHours * input.pagesPerHour
  const totalBooks =
    input.avgPagesPerBook > 0
      ? Math.max(Math.floor(totalPages / input.avgPagesPerBook), 0)
      : 0

  return {
    goalType: input.goalType ?? GoalType.Reading,
    currentAge: input.currentAge,
    expectedAge,
    yearsLeft,
    daysLeft,
    dailyMinutes,
    energyFactor,
    totalReadableHours,
    totalPages,
    totalBooks,
    pagesPerHour: input.pagesPerHour,
    avgPagesPerBook: input.avgPagesPerBook,
    remainingYearsModel: remainingYears,
    lifeExpectancyLabel: buildLifeExpectancyLabel(
      input.countryCode,
      input.gender
    ),
  }
}
