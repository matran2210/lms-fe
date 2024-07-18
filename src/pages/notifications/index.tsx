import SearchForm from '@components/mycourses/Search'
import NotifyTab from '@components/notification/NotifyTab'
import React, { useEffect, useState } from 'react'
import ActionCell from '@components/base/action/ActionCell'
import NotifyList from '@components/notification/NotifyList'
import NotifyDetail from '@components/notification//NotifyDetail'
import NotifyActions from '@components/notification/NotifyActions'
import {
  getNotification,
  getCountUnRead,
  getNotificationDetail,
  markAllNotifications,
  loadMoreNotification,
  updateStatus,
  updateStatusAll,
} from 'src/redux/slice/Notification/Notification'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import Router, { useRouter } from 'next/router'
import { ANIMATION } from 'src/constants'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import Layout from '@components/layout'

const Notifications = () => {
  const [openModel, setOpenModel] = useState<boolean>(false)
  const [openToolTip, setOpenToolTip] = useState<boolean>(false)
  const [loadingRedirect, setLoadingRedirect] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

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
      // await coutNotificationsUnRead()
    } catch (error) {}
  }

  const loadMore = async (params: Object) => {
    setLoading(true)
    try {
      await dispatch(loadMoreNotification(params))
      await coutNotificationsUnRead()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const getApiNotificationDetail = async (
    id: string,
    redirect: string | null,
    content: string,
  ) => {
    try {
      const res = await dispatch(getNotificationDetail(id))
      if (res) {
        await coutNotificationsUnRead()
        dispatch(updateStatus({ id: id }))
        if (redirect !== null) {
          setLoadingRedirect(true)
          Router.replace(`${content?.replace('class_id', 'classId')}`)
        }
      }
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
  const DEFAULT_PAGESIZE = 10
  const [page, setPage] = useState(DEFAULT_PAGESIZE)

  useEffect(() => {
    let isFetching = false
    const isEndPage = page <= pagination?.total_records
    const handleScroll = () => {
      if (
        !isFetching &&
        isEndPage &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10
      ) {
        isFetching = true
        const pageIndex = pagination?.page_index
        const pageSize = pagination?.page_size
        loadMore({
          page_index: pageIndex + 1,
          page_size: pageSize,
          ...(router.asPath.includes('unread') && {
            is_read: false,
          }),
        })
      }
    }
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

  const handleCancel = () => {
    setOpenModel(false)
  }

  return (
    <Layout title="">
      {/* {loadingRedirect && (
        <div className="fixed left-0 top-0 right-0 bottom-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-[9999]">
          Loading
        </div>
      )} */}
      <div className="header bg-white border-b border-default px-4 lg:px-20">
        <div className="max-w-xxl my-0 mx-auto flex py-4.5">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="lg:px-20" data-aos={ANIMATION.DATA_AOS}>
        <div
          className="main max-w-xxl my-0 mx-auto pt-6 px-4 lg:px-0"
          data-aos={ANIMATION.DATA_AOS}
        >
          <h2 className="text-medium-sm font-medium text-bw-1 pb-4">
            Notifications
          </h2>
        </div>

        <div
          className="heading bg-white max-w-xxl my-0 px-6 mx-auto flex justify-between border-b border-gray-2"
          data-aos={ANIMATION.DATA_AOS}
        >
          <NotifyTab tabs={tabs} />
          <div className="settings flex items-center relative">
            <ActionCell open={openToolTip} setOpen={setOpenToolTip}>
              <NotifyActions handleMarkAll={handleMarkAll} />
            </ActionCell>
          </div>
        </div>
        <div className="max-w-xxl my-0 mx-auto" data-aos={ANIMATION.DATA_AOS}>
          <NotifyList
            notifyLists={notifyLists}
            open={openModel}
            setOpen={setOpenModel}
            getApiNotificationDetail={getApiNotificationDetail}
          />
        </div>
      </div>
      <SappDrawerV2
        open={openModel}
        handleCancel={handleCancel}
        title={'Notification Detail'}
      >
        <NotifyDetail notifyDetail={notifyDetail} />
      </SappDrawerV2>
    </Layout>
  )
}

export default Notifications
