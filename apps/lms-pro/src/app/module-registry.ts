import { AppModule } from '@lms/core'
import { calendarModule } from '@lms/feature-calendar'
import { testModule } from '@lms/feature-test'

export const modules: AppModule[] = [calendarModule, testModule]
