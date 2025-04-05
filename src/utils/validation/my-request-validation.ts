import { z } from 'zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { REQUEST_TYPE } from 'src/constants/my-request'
import { isPast } from 'date-fns'

// Function to check for overlapping schedules
export const findLastOverlappingIndex = (
  schedules: { start_time: Date; end_time: Date }[],
) => {
  const sortedSchedules = schedules
    .map((item, index) => ({ ...item, index })) // Store original index
    .sort((a, b) => a.start_time?.getTime() - b.start_time?.getTime()) // Sort by start_time

  let lastOverlapIndex = -1

  for (let i = sortedSchedules.length - 1; i > 0; i--) {
    if (sortedSchedules[i - 1].end_time > sortedSchedules[i].start_time) {
      lastOverlapIndex = sortedSchedules[i].index // Store original index
      break
    }
  }

  return lastOverlapIndex
}

const sharedFields = z.object({
  request_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .trim()
    .min(1, VALIDATE_REQUIRED),
  request_type_value: z.string({ required_error: VALIDATE_REQUIRED }),
  note: z.string().optional(),
})
// Request Validation Schema with overlapping schedule check
const discriminated = z.discriminatedUnion('request_type_value', [
  z.object({
    request_name: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    request_type_value: z.literal(REQUEST_TYPE.BUSY_SCHEDULE.value),
    note: z.string().optional(),
  }),

  z.object({
    request_name: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    request_type_value: z.literal(REQUEST_TYPE.WEEKLY_NORM.value),
    note: z.string().optional(),
    request_weekly_norm: z
      .array(
        z
          .object({
            date_range: z
              .array(z.date())
              .length(2, 'Date range must have exactly 2 dates'),
            quantity: z
              .number({ required_error: VALIDATE_REQUIRED })
              .min(1, VALIDATE_REQUIRED)
              .max(6, 'Maximum quantity per week is 6.'),
          })
          .transform((data) => {
            return {
              start_time: new Date(data.date_range[0]),
              end_time: new Date(data.date_range[1]),
              quantity: data.quantity,
            }
          })
          .refine((data) => data.start_time < data.end_time, {
            message: 'Start time must be before end time',
            path: ['date_range'],
          })
          .refine((data) => isPast(data.start_time), {
            message: 'Start time must be greater or equal than today',
            path: ['date_range'],
          })
          .refine(
            (data) =>
              (data.end_time?.getTime() - data.start_time?.getTime()) /
                (1000 * 60 * 60 * 24) <
              91,
            {
              message: `The duration must be less than 91 days`,
              path: ['date_range'],
            },
          )
          .refine(
            (data) =>
              (data.end_time?.getTime() - data.start_time?.getTime()) /
                (1000 * 60 * 60 * 24) >=
              13,
            {
              message: `The duration must be greater than 14 days`,
              path: ['date_range'],
            },
          ),
      )
      .min(1, 'At least one Norm is required')
      .superRefine((schedules, ctx) => {
        // Check for overlapping schedules
        const lastOverlapIndex = findLastOverlappingIndex(schedules)
        if (lastOverlapIndex !== -1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicated time period. Please check again.',
            path: [lastOverlapIndex, 'date_range'],
          })
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicated time period. Please check again.',
            path: [lastOverlapIndex, 'date_range'],
          })
        }
        // Maximum limit of 7 schedules
        if (schedules.length > 7) {
          schedules.forEach((_, index) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Maximum number of Weekly Norms is 5',
              path: [index, 'description'],
            })
          })
        }
      }),
  }),
  z.object({
    request_name: z
      .string({ required_error: VALIDATE_REQUIRED })
      .trim()
      .min(1, VALIDATE_REQUIRED),
    request_type_value:
      z.literal(REQUEST_TYPE.TIMEOFF.value) ||
      z.literal(REQUEST_TYPE.TEACHING_MODE.value),

    // class_code: z.string({ required_error: VALIDATE_REQUIRED }).trim().min(1, VALIDATE_REQUIRED),
    request_time_off: z
      .array(
        z.object({
          lesson: z.object({
            value: z.string({ required_error: VALIDATE_REQUIRED }),
          }),
          reason: z.string({ required_error: VALIDATE_REQUIRED }),
        }),
      )
      .min(1, 'At least one schedule is required')
      .max(2, 'Maximum number of schedules is 2'),
  }),
])
export const requestValidationSchema = sharedFields.and(discriminated)
