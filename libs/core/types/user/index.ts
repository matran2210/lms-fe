import { USER_TYPE } from "../../constants/User";
export type UserAccountType = (typeof USER_TYPE)[keyof typeof USER_TYPE]['key']
