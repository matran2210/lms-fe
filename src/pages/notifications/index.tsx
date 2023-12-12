import SearchForm from '@components/notification/Search'
import NotifyTab from '@components/notification/NotifyTab'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import ActionCell from '@components/base/action/ActionCell'
import NotifyList from '@components/notification/NotifyList'
import NotifyDetail from '@components/notification//NotifyDetail'
import NotifyActions from '@components/notification/NotifyActions'
import {
  notificationReducer,
  getNotification,
  getCountUnRead,
  getNotificationDetail,
  markAllNotifications,
  loadMoreNotification,
  updateStatus,
  updateStatusAll,
} from 'src/redux/slice/Notification/Notification'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import SappModelSidebar from '@components/base/modal/SappModelSidebar'
import { useRouter } from 'next/router'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import PopupStep from '@components/user-guide/PopupStep'

const Notifications = () => {
  const [openModel, setOpenModel] = useState<boolean>(false)
  const [openToolTip, setOpenToolTip] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.notificationReducer.loading)

  const notifyLists = useAppSelector(
    (state) => state.notificationReducer.list_notifications,
  )

  const notifyDetail = useAppSelector((state) => state.notificationReducer)
  const getTotal = useAppSelector(
    (state) => state.notificationReducer.total_records,
  )

  const pagination = useAppSelector((state) => state.notificationReducer.meta)

  // Config Tabs
  const tabs = [
    { label: 'All', path: 'all' },
    { label: 'Unread', path: 'unread', total: getTotal },
  ]

  const coutNotificationsUnRead = async () => {
    try {
      await dispatch(getCountUnRead())
    } catch (error) {}
  }

  const getNotifications = async (params: Object) => {
    try {
      await dispatch(getNotification(params))
      await coutNotificationsUnRead()
    } catch (error) {}
  }

  const loadMore = async (params: Object) => {
    try {
      await dispatch(loadMoreNotification(params))
      await coutNotificationsUnRead()
    } catch (error) {}
  }

  const getApiNotificationDetail = async (id: string) => {
    try {
      await dispatch(getNotificationDetail(id))
      await coutNotificationsUnRead()
      dispatch(updateStatus({ id: id }))
    } catch (error) {}
  }

  const markAllRead = async () => {
    try {
      await dispatch(markAllNotifications())
      await coutNotificationsUnRead()
      dispatch(updateStatusAll())
    } catch (error) {}
  }

  const handleMarkAll = () => {
    setOpenToolTip(false)
    markAllRead()
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return
    }
    const totalPages = pagination?.total_pages
    const pageIndex = pagination?.page_index
    const pageSize = pagination?.page_size
    if (totalPages && pageIndex < totalPages) {
      loadMore({
        page_index: pageIndex + 1,
        page_size: pageSize,
        ...(router.asPath.includes('unread') && {
          is_read: false,
        }),
      })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pagination])

  useEffect(() => {
    getNotifications({
      page_index: 1,
      page_size: 10,
      ...(router.asPath.includes('unread') && {
        is_read: false,
      }),
    })
  }, [router])

  return (
    <>
      <div className="header bg-white border-b border-default px-4 lg:px-20">
        <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
          <SearchForm
            placeholder="Find..."
            formStyle="w-full flex items-center"
            getNotifications={getNotifications}
          />
        </div>
      </div>
      <div className="lg:px-20">
        <div className="main max-w-xxl my-0 mx-auto pt-6 px-4 lg:px-0">
          <h2 className="text-medium-sm font-semibold text-bw-1 pb-6">
            Notifications
          </h2>
        </div>
        <div className="heading bg-white max-w-xxl my-0 px-6 mx-auto flex justify-between">
          <NotifyTab tabs={tabs} />
          <div className="settings flex items-center relative">
            <ActionCell open={openToolTip} setOpen={setOpenToolTip}>
              <NotifyActions handleMarkAll={handleMarkAll} />
            </ActionCell>
          </div>
        </div>
        <div className="max-w-xxl my-0 mx-auto">
          <NotifyList
            notifyLists={notifyLists}
            open={openModel}
            setOpen={setOpenModel}
            getApiNotificationDetail={getApiNotificationDetail}
          />
        </div>
        <SappModelSidebar
          open={openModel}
          setOpen={setOpenModel}
          title={'Notification Detail'}
        >
          <NotifyDetail notifyDetail={notifyDetail} />
        </SappModelSidebar>
      </div>
      {/*<PopupWelcome />*/}
      <PopupStep content="xyz" index={1} total={6} handleNext={() => {}} />
    </>
  )
}

export default Notifications
