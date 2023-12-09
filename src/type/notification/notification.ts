export interface ICountUnread {
  total_records: number
}

export interface INotification {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  title: string
  notification_user_instances?: Object
}
