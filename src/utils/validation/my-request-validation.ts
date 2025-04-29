import { z } from 'zod'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { REQUEST_TYPE } from 'src/constants/my-request'
import { isPast } from 'date-fns'
import { REPEAT_TYPE } from '@utils/constants/repeat'
import dayjs from 'dayjs'

// Shared fields for all schemas
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
      message: 'Request type value is required',
      path: ['request_type_value'],
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
        date_range: z.array(z.date()).length(2, { message: VALIDATE_REQUIRED }),
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
  description: z.string({ required_error: VALIDATE_REQUIRED }),

  request_weekly_norm: z
    .array(
      z.object({
        date_range: z
          .array(z.union([z.string(), z.date()]))
          .min(2, 'Date range must have exactly 2 dates'),
        quantity: z
          .number({ required_error: VALIDATE_REQUIRED })
          .min(1, VALIDATE_REQUIRED)
          .max(6, 'Maximum quantity per week is 6.'),
      }),
    )
    .min(1, 'At least one Norm is required'),
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
