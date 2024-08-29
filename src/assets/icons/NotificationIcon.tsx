import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { LOCAL_STORAGE_KEYS } from 'src/constants'
import { IIcon } from 'src/type'

const NotificationIcon = ({ className }: IIcon) => {
  const [badgeClass, setBadgeClass] = useState('w-4 h-4 -top-1.5 -right-1.5') // Default width
  const storedCount = localStorage.getItem(
    LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT,
  )
  const [notificationUnread, setNotificationUnread] = useState(() => {
    return parseInt(storedCount ?? '0', 10)
  })
  useEffect(() => {
    window.addEventListener('storage', (e) => {
      const count = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT)
      setNotificationUnread(parseInt(count ?? '0', 10))
    })

    return () => window.removeEventListener('storage', () => {})
  }, [])

  useEffect(() => {
    if (notificationUnread > 9) {
      setBadgeClass('w-5 h-5 -top-2 -right-2')
    } else {
      setBadgeClass('w-4 h-4 -top-1.5 -right-1.5') // Default width for single digits
    }
  }, [notificationUnread])

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        className={className}
      >
        <path
          fill="currentColor"
          d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 0 1-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 0 1-2.9-1.413 3.616 3.616 0 0 1-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 0 1-1.713.731 3.795 3.795 0 0 1-1.008 0 3.618 3.618 0 0 1-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
        />
      </svg>
      {notificationUnread > 0 && (
        <span
          className={clsx(
            'absolute  flex aspect-1 items-center  justify-center rounded-full bg-danger text-ssm text-white',
            badgeClass,
          )}
        >
          {notificationUnread}
        </span>
      )}
    </div>
  )
}

export default NotificationIcon
