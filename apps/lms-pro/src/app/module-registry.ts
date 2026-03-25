import { AppModule } from '@lms/core'
import { scheduleModule } from '@lms/feature-schedule'
import { testModule } from '@lms/feature-test'
import { certificateModule } from '@lms/feature-certificate'
import { examModule } from '@lms/feature-exam'

export const modules: AppModule[] = [
  scheduleModule,
  testModule,
  certificateModule,
  examModule,
]
