import { z } from 'zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { REQUEST_TYPE } from '@lms/core'

// Shared fields for all schemas

const MAX_RANGE_DAYS = 91 // Maximum range in days

const sharedFields = z
  .object({
    request_name: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    note: z.string().optional(),
    request_type_value: z.string().optional(),
  })
  .refine(
    (data) => {
      // Ensure request_type_value exists if it's not provided
      return data.request_type_value && data.request_type_value.trim() !== ''
    },
    {
      message: VALIDATE_REQUIRED,
      path: ['request_type'],
    },
  )

// Busy schedule schema
const busySheduleSchema = z.object({
  request_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),
  request_type_value: z.literal(REQUEST_TYPE.BUSY_SCHEDULE.value), // Discriminant field

  request_busy_schedule: z
    .array(
      z.object({
        date_range: z
          .array(z.union([z.string(), z.date()]))
          .min(2, 'Date range must have exactly 2 dates')
          .refine(
            ([start, end]) => {
              const startDate = new Date(start)
              const endDate = new Date(end)
              const diffDays =
                (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
              return diffDays <= MAX_RANGE_DAYS
            },
            { message: VALIDATE_REQUIRED },
          ),
        description: z
          .string({ required_error: VALIDATE_REQUIRED })
          .trim()
          .min(1, VALIDATE_REQUIRED),
      }),
    )
    .min(1, 'At least one schedule is required'),
})

// Weekly norm schema
const weeklyNormSchema = z.object({
  request_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),
  request_type_value: z.literal(REQUEST_TYPE.WEEKLY_NORM.value), // Discriminant field
  note: z.string().optional(),

  request_weekly_norm: z
    .array(
      z.object({
        date_range: z
          .array(z.union([z.string(), z.date()]))
          .min(2, 'Date range must have exactly 2 dates')
          .refine(
            ([start, end]) => {
              const startDate = new Date(start)
              const endDate = new Date(end)
              const diffDays =
                (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
              return diffDays <= MAX_RANGE_DAYS
            },
            { message: 'Date range must be less than or equal to 91 days' },
          ),
        quantity: z
          .number({ required_error: VALIDATE_REQUIRED })
          .min(1, VALIDATE_REQUIRED)
          .max(6, 'Maximum quantity per week is 6.'),
      }),
    )
    .min(1, 'At least one Norm is required')
    .superRefine((entries, ctx) => {
      // Step 1: Validate each date_range duration
      entries.forEach((entry, index) => {
        const [start, end] = entry.date_range
        const startDate = new Date(start)
        const endDate = new Date(end)

        const diffDays =
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

        // Check that start is Monday
        if (startDate.getDay() !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'date_range'],
            message: 'Start date must be a Monday',
          })
        }

        // Check that end is Sunday
        if (endDate.getDay() !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'date_range'],
            message: 'End date must be a Sunday',
          })
        }

        if (diffDays < 13) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'date_range'],
            message: 'The duration must be at least 14 days',
          })
        }
      })

      const sorted = entries
        .map((entry, index) => ({
          index,
          start: new Date(entry.date_range[0]),
          end: new Date(entry.date_range[1]),
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime())

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]
        const current = sorted[i]
        if (prev.end > current.start) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [current.index, 'date_range'],
            message: 'Duplicated time period. Please check again.',
          })
        }
      }
    }),
})

// Time-off schema
const timeOffSchema = z.object({
  request_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),
  request_type_value: z.literal(REQUEST_TYPE.TIMEOFF.value), // Discriminant field
  class_code: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),
  request_time_off: z
    .array(
      z.object({
        lessonId: z
          .string({ required_error: VALIDATE_REQUIRED })
          .min(1, VALIDATE_REQUIRED),
        reason: z
          .string({ required_error: VALIDATE_REQUIRED })
          .min(1, VALIDATE_REQUIRED),
      }),
    )
    .min(1, 'At least one schedule is required')
    .max(2, 'Maximum number of schedules is 2'),
})

// Teaching mode schema
const teachingModeSchema = z.object({
  request_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),
  request_type_value: z.literal(REQUEST_TYPE.TEACHING_MODE.value), // Discriminant field

  class_code: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),

  request_time_off: z
    .array(
      z.object({
        lessonId: z.string({ required_error: VALIDATE_REQUIRED }),
        reason: z.string({ required_error: VALIDATE_REQUIRED }),
      }),
    )
    .min(1, 'At least one schedule is required')
    .max(2, 'Maximum number of schedules is 2'),
})

// Discriminated union
const discriminated = z.discriminatedUnion('request_type_value', [
  busySheduleSchema,
  weeklyNormSchema,
  timeOffSchema,
  teachingModeSchema,
])

export const requestValidationSchema = sharedFields.and(discriminated)
