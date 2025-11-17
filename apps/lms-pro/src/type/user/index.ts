import { USER_TYPE } from '@lms/core'

export type UserAccountType = (typeof USER_TYPE)[keyof typeof USER_TYPE]['key']
