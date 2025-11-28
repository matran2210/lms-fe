export interface ICountUnread {
  total_records: number
}

export interface INotifications {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  title: string
  notification_user_instances: object
  notifications: unknown
  meta: object
}

export interface INotificationDetail {
  id: string | number
  created_at: string
  updated_at: string
  deleted_at?: null
  title: string
  type: string
  mode: string
  status: string
  action: string
  content: string
  send_time?: string
  created_by: unknown
  created_from: unknown
  files: unknown
}
