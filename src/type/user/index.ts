import { USER_TYPE } from '@utils/constants/User'

export type UserAccountType = (typeof USER_TYPE)[keyof typeof USER_TYPE]['key']
