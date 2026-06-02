import { AppModule } from '@lms/core'
import { scheduleModule } from '@lms/feature-schedule'
import { testModule } from '@lms/feature-test'
import { certificateModule } from '@lms/feature-certificate'
import { examinationModule } from '@lms/feature-examination'
import { attendanceModule } from '@lms/feature-attendance'

export const modules: AppModule[] = [
  scheduleModule,
  testModule,
  certificateModule,
  examinationModule,
  attendanceModule,
]
