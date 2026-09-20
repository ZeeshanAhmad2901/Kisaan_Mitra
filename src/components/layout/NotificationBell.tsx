import { useEffect, useRef, useState } from 'react'
import {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    type NotificationItem,
} from '../../api/notificationApi'

function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getNotifications(1, 20)

      setNotifications(response.items)
      setUnreadCount(response.unread_count)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load notifications.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()

    const interval = window.setInterval(loadNotifications, 30000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleNotificationClick = async (
    notification: NotificationItem,
  ) => {
    if (notification.is_read) {
      return
    }

    try {
      await markNotificationRead(notification.id)

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item,
        ),
      )

      setUnreadCount((current) => Math.max(0, current - 1))
    } catch {
      // Keep the notification visible if marking it read fails.
    }
  }

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      return
    }

    try {
      await markAllNotificationsRead()

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      )

      setUnreadCount(0)
    } catch {
      setError('Unable to mark notifications as read.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100 hover:text-green-700"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.5-1.5A2 2 0 0118 14V10a6 6 0 10-12 0v4a2 2 0 01-.5 1.5L4 17h5m6 0a3 3 0 01-6 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 overflow-hidden bg-white border border-gray-200 shadow-xl w-80 rounded-xl sm:w-96">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-800">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">
                  {unreadCount} unread
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-green-700 hover:text-green-800"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="px-4 py-8 text-sm text-center text-gray-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={loadNotifications}
                  className="mt-2 text-xs font-semibold text-green-700 hover:text-green-800"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <svg
                  className="w-10 h-10 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.5-1.5A2 2 0 0118 14V10a6 6 0 10-12 0v4a2 2 0 01-.5 1.5L4 17h5m6 0a3 3 0 01-6 0"
                  />
                </svg>

                <p className="mt-3 text-sm text-gray-500">
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`block w-full border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    notification.is_read
                      ? 'bg-white'
                      : 'bg-green-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        notification.is_read
                          ? 'bg-gray-300'
                          : 'bg-green-600'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
