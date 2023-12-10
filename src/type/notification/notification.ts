export interface ICountUnread {
  total_records: number
}

export interface INotifications {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  title: string
  notification_user_instances: Object
  notifications: any
}

export interface INotificationDetail {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  title: string
  type: string
  mode: string
  status: string
  action: string
  content: string
  send_time?: Date
  created_by: any
  created_from: any
  files: any
}
