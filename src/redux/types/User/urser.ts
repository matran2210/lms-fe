export interface IUser {
  updated_at: string
  code: string | null
  username: string
  status: string
  detail: {
    phone: string
    full_name: string
    avatar: {
      [key: string]: string
    }
    settings: any
  }
  course_user_certificate_instances: any[]
}

export interface UserState {
  loading: boolean
  errors: object
  user: IUser
}
