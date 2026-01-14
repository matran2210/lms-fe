"use client"
import { useRef, useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { INotificationAPI, LOCAL_STORAGE_KEYS } from '@lms/core'
import { getCountUnRead,
  getNotification,
  getNotificationDetail,
  loadMoreNotification,
  markAllNotifications,
  updateStatusAll,
  toggleStatusById,
  deleteNotificationById,
  deleteAllNotifications,
  useFeature,} from '@lms/contexts'
import { useTailwindBreakpoint } from './useTailwindBreakpoint'

export const useNotification = (notificationApi: INotificationAPI) => {
  const { router, useAppSelector, dispatch } = useFeature()
  const notifyDetail = useAppSelector?.((state) => state.notificationReducer)
  const notifyLists = useAppSelector?.(
    (state) => state.notificationReducer.list_notifications,
  )
  const pagination = useAppSelector?.((state) => state.notificationReducer.meta)
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [isDesktopView, setIsDesktopView] = useState(false)
  const [isViewDetail, setIsViewDetail] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)
  const [selectedTab, setSelectedTab] = useState<number>(1)
  const [hasNewNotification, setHasNewNotification] = useState<boolean>(false)

  const storedCount = localStorage.getItem(
    LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT,
  )
  const [notificationUnread, setNotificationUnread] = useState(() => {
    return parseInt(storedCount ?? '0', 10)
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const isFetching = useRef(false)
  const refreshNotification = (isRefresh = false) => {
    const loadMultiplePages = async () => {
      const screenHeight = window.innerHeight

      isRefresh && (await dispatch?.(getCountUnRead(notificationApi)))

      const firstPageAction = await dispatch?.(
        getNotification({
          api: notificationApi,
          params: {
            page_index: 1,
          page_size: 10,
          ...(selectedTab === 2 && {
            is_read: false,
          }),
          }
        }),
      )

      const totalPages = firstPageAction?.payload?.meta?.total_pages || 1
      const baseHeight = 911
      const heightRatio = screenHeight / baseHeight
      const calculatedPages = Math.ceil(heightRatio)
      const pagesToLoad = Math.min(calculatedPages, totalPages)

      for (let page = 2; page <= pagesToLoad; page++) {
        await dispatch?.(
          loadMoreNotification({
            api: notificationApi,
            params: {
            page_index: page,
            page_size: 10,
            ...(selectedTab === 2 && {
              is_read: false,
            }),
          }
          }),
        )
      }
    }

    loadMultiplePages()
  }

  const countNotificationsUnRead = async () => {
      await dispatch?.(getCountUnRead(notificationApi))
  }

  const markAllRead = async (selectedTab: number) => {
      await dispatch?.(markAllNotifications(notificationApi))
      if (selectedTab === 2) {
        dispatch?.(deleteAllNotifications())
      } else {
        dispatch?.(updateStatusAll())
      }
      await countNotificationsUnRead()
  }

  const handleMarkAll = (tab: number) => {
    markAllRead(tab)
  }

  const handleMarkById = async (ids: string[], selectedTab: number) => {
      const res = await notificationApi.markById(ids, true)
      if (!res?.data) {
        return
      }
      dispatch?.(getCountUnRead(notificationApi))
      ids.forEach((id) => {
        if (selectedTab === 2) {
          dispatch?.(deleteNotificationById(id))
        } else {
          dispatch?.(toggleStatusById(id))
        }
      })
  }

  const handleUnMarkById = async (ids: string[], selectedTab: number) => {
      const res = await notificationApi.markById(ids, false)
      if (!res?.data) {
        return
      }
      ids.forEach((id) => {
        dispatch?.(toggleStatusById(id))
      })
      dispatch?.(getCountUnRead(notificationApi))
  }

  const getApiNotificationDetail = async (
    id: string,
    redirect: string | null,
    content: string,
  ) => {
      if (id !== notifyDetail?.id) {
        const res = await dispatch?.(getNotificationDetail({ api: notificationApi, id }))
        if (res) {
          await countNotificationsUnRead()
        }
      }
      if (!isEmpty(redirect)) {
        router.replace(`/${content}`)
      }
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
    if (isDesktopView) {
      setIsViewDetail(false)
      refreshNotification(true)
    } else {
      if (isViewDetail) {
        setIsViewDetail(false)
      } else {
        setOpenNotification(false)
      }
    }
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
            await dispatch?.(
              loadMoreNotification({
                api: notificationApi,
                params: {
                page_index: page_index + 1,
                page_size,
                ...(selectedTab === 2 && {
                  is_read: false,
                }),
              }
              }),
            )
            await countNotificationsUnRead()
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
    if (isAlwaysShowSidebar) setIsDesktopView(true)
  }, [isAlwaysShowSidebar])

  useEffect(() => {
    const handleStorage = () => {
      const count = parseInt(
        localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT) ?? '0',
        10,
      )
      setNotificationUnread(count)
      // Nếu có thông báo mới (tăng số lượng)
      setHasNewNotification((prev) => {
        const storedPrev = notificationUnread
        if (count > storedPrev) {
          return true
        }
        return prev
      })
      setTimeout(() => setHasNewNotification(false), 3000)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
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
    isDesktopView,
    hasNewNotification,
  }
}
