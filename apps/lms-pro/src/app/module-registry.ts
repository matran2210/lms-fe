import { AppModule } from '@lms/core'
import { calendarModule } from '@lms/feature-calendar'
import { testModule } from '@lms/feature-test'
import { certificateModule } from '@lms/feature-certificate'

export const modules: AppModule[] = [
  calendarModule,
  testModule,
  certificateModule,
]
