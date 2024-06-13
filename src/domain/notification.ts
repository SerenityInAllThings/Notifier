export type Notification = {
  id: string
  message: string
  creationDate: string // ISO 8601
  tags: Record<string, string>
}

export type NotificationCreationRequest = Omit<Notification, 'id' | 'creationDate'>

export const getSentDate = (date?: Date) => {
  if (!date) date = new Date()
  return date.toISOString().split('T')[0]
}
