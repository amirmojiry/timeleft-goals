export const GoalType = {
  Reading: 'reading',
} as const

export type GoalType = (typeof GoalType)[keyof typeof GoalType]

export type ReadingCadence = 'daily' | 'weekly'

export interface ReadingGoalInput {
  currentAge: number
  minutes: number
  cadence: ReadingCadence
  pagesPerHour: number
  avgPagesPerBook: number
  goalType?: GoalType
}

export interface LifetimeReadingResult {
  goalType: GoalType
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
}

const DAYS_IN_YEAR = 365
const DEFAULT_EXPECTED_AGE = 80

/**
 * Simple energy model that reduces available time as the user ages.
 */
export function getEnergyFactor(currentAge: number): number {
  if (currentAge < 50) return 1
  if (currentAge <= 65) return 0.8
  return 0.6
}

export interface LifetimeCalculatorOptions {
  expectedAge?: number
}

/**
 * Calculates the remaining reading capacity for the user.
 * The returned object stays generic so it can power other goal types later.
 */
export function calculateReadingLifetime(
  input: ReadingGoalInput,
  options: LifetimeCalculatorOptions = {}
): LifetimeReadingResult {
  const expectedAge = options.expectedAge ?? DEFAULT_EXPECTED_AGE
  const yearsLeft = Math.max(expectedAge - input.currentAge, 0)
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
  }
}
