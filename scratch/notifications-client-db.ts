// Some scaffolding (copy paste) for the indexeddb clientside persistant storage for notifications using Dexie for a better API
import Dexie from 'dexie'

export class NotificationsDatabase extends Dexie {
  notifications!: Dexie.Table<INotification, number>
  notificationInteractions!: Dexie.Table<INotificationInteraction, number>

  constructor() {
    super('NotificationsDatabase')

    this.version(1).stores({
      notifications: '++id, content, read',
      notificationInteractions: '++id, notificationId, val',
    })
  }
}

export interface INotification {
  id?: number // Primary key. Optional (autoincremented)
  content: string
  read: string
}

export interface INotificationInteraction {
  id?: number
  notificationId: number // "Foreign key" to an INotification
  val: string
}
