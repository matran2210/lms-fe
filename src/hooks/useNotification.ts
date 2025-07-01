import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NotificationAPI } from 'src/pages/api/notification'
import { isEmpty } from 'lodash'
import { LOCAL_STORAGE_KEYS } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getCountUnRead,
  getNotification,
  getNotificationDetail,
  loadMoreNotification,
  markAllNotifications,
  updateStatusAll,
} from 'src/redux/slice/Notification/Notification'

export const useNotification = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const notifyDetail = useAppSelector((state) => state.notificationReducer)
  const notifyLists = useAppSelector(
    (state) => state.notificationReducer.list_notifications,
  )
  const pagination = useAppSelector((state) => state.notificationReducer.meta)

  const [isViewDetail, setIsViewDetail] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)
  const [selectedTab, setSelectedTab] = useState<number>(1)
  const [notificationUnread, setNotificationUnread] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const isFetching = useRef(false)

  const refreshNotification = (isRefresh = false) => {
    const getNotifications = async (params: Object) => {
      try {
        isRefresh && (await dispatch(getCountUnRead()))
        await dispatch(getNotification(params))
      } catch (error) {}
    }

    getNotifications({
      page_index: 1,
      page_size: 10,
      ...(selectedTab === 2 && {
        is_read: false,
      }),
    })
  }

  const countNotificationsUnRead = async () => {
    try {
      await dispatch(getCountUnRead())
    } catch (error) {}
  }

  const markAllRead = async () => {
    try {
      await dispatch(markAllNotifications())
      dispatch(updateStatusAll())
      await countNotificationsUnRead()
    } catch (error) {}
  }

  const handleMarkAll = () => {
    setOpenNotification(false)
    markAllRead()
  }

  const handleMarkById = async (ids: string[]) => {
    try {
      const res = await NotificationAPI.markById(ids, true)
      if (!res?.data) {
        return
      }
      refreshNotification(true)
    } catch (error) {}
  }

  const handleUnMarkById = async (ids: string[]) => {
    try {
      const res = await NotificationAPI.markById(ids, false)
      if (!res?.data) {
        return
      }
      refreshNotification(true)
    } catch (error) {}
  }

  const getApiNotificationDetail = async (
    id: string,
    redirect: string | null,
    content: string,
  ) => {
    try {
      if (id !== notifyDetail?.id) {
        const res = await dispatch(getNotificationDetail(id))
        if (res) {
          await countNotificationsUnRead()
        }
      }
      if (!isEmpty(redirect)) {
        router.replace(`/${content}`)
      }
    } catch (error) {}
  }

  const handleViewDetail = async (
    id: string,
    redirect?: string,
    content?: string,
    tag?: string,
  ) => {
    await getApiNotificationDetail(id, redirect ?? null, content ?? '')
    const regexTagA = /<a\b[^>]*>(.*?)<\/a>/
    const containsAnchorTag = regexTagA.test(content ?? '')
    if (containsAnchorTag && tag === 'STRONG') {
      setIsViewDetail(false)
    } else if (!isEmpty(redirect)) {
      setOpenNotification(false)
    } else if (isEmpty(redirect)) {
      setIsViewDetail((prev) => !prev)
    }
  }

  const handleBack = () => {
    setIsViewDetail(false)
    refreshNotification(true)
  }

  useEffect(() => {
    if (openNotification) refreshNotification(false)
  }, [selectedTab])

  useEffect(() => {
    const handleScroll = async () => {
      const scrollEl = scrollRef.current
      if (scrollEl) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl
        if (scrollTop + clientHeight + 200 >= scrollHeight) {
          const { page_index, page_size, total_pages } = pagination
          if (page_index >= total_pages || isFetching.current) return
          try {
            isFetching.current = true
            await dispatch(
              loadMoreNotification({
                page_index: page_index + 1,
                page_size,
                ...(selectedTab === 2 && {
                  is_read: false,
                }),
              }),
            )
            await countNotificationsUnRead()
          } catch (err) {
          } finally {
            isFetching.current = false
          }
        }
      }
    }

    const scrollEl = scrollRef.current
    scrollEl?.addEventListener('scroll', handleScroll)

    return () => {
      scrollEl?.removeEventListener('scroll', handleScroll)
    }
  }, [pagination])

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      const count = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT)
      setNotificationUnread(parseInt(count ?? '0', 10))
    })

    return () => window.removeEventListener('storage', () => {})
  }, [])

  return {
    isViewDetail,
    openNotification,
    setOpenNotification,
    selectedTab,
    setSelectedTab,
    notifyDetail,
    notifyLists,
    scrollRef,
    notificationUnread,
    handleMarkAll,
    handleMarkById,
    handleUnMarkById,
    handleViewDetail,
    handleBack,
    refreshNotification,
  }
}
