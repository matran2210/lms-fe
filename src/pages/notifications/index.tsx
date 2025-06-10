import ActionCell from '@components/base/action/ActionCell'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import Layout from '@components/layout'
import SearchForm from '@components/mycourses/Search'
import NotifyDetail from '@components/notification//NotifyDetail'
import NotifyActions from '@components/notification/NotifyActions'
import NotifyList from '@components/notification/NotifyList'
import NotifyTab from '@components/notification/NotifyTab'
import { trackGAEvent } from '@utils/google-analytics'
import Aos from 'aos'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ANIMATION, LOCAL_STORAGE_KEYS } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getCountUnRead,
  getNotification,
  getNotificationDetail,
  loadMoreNotification,
  markAllNotifications,
  notificationSlice,
  updateStatus,
  updateStatusAll,
} from 'src/redux/slice/Notification/Notification'
import { UserType } from 'src/redux/types/User/urser'

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
      dispatch(updateStatusAll())
      await coutNotificationsUnRead()
      Aos.refresh()
    } catch (error) {}
  }

  const handleMarkAll = () => {
    setOpenToolTip(false)
    markAllRead()
    trackGAEvent('Click Button Mark All As Read Notification')
  }

  const DEFAULT_PAGESIZE = 10
  const [page, setPage] = useState(DEFAULT_PAGESIZE)

  useEffect(() => {
    let isFetching = false
    const isEndPage = page <= pagination?.total_records
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
    const getNotifications = async (params: Object) => {
      try {
        await dispatch(getCountUnRead())
        await dispatch(getNotification(params))
      } catch (error) {}
    }

    getNotifications({
      page_index: 1,
      page_size: 10,
      ...(router.asPath.includes('unread') && {
        is_read: false,
      }),
    })
  }, [router, dispatch])

  const handleCancel = () => {
    setOpenModel(false)
  }

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      const count = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT)

      dispatch(notificationSlice.actions.updateTotalUnread(count))
    })

    // ... rest of the effect ...
  }, [])

  return (
    <Layout title="Notifications">
      {/* {loadingRedirect && (
        <div className="fixed left-0 top-0 right-0 bottom-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-[9999]">
          Loading
        </div>
      )} */}
      <div className="border-b border-[#DCDDDD] bg-white px-4 lg:px-20">
        <div className="py-4.5 mx-auto my-0 flex max-w-[1144px]">
          <SearchForm
            placeholder={MY_COURSES.placeholderSearch}
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="h-full px-5 lg:px-20" data-aos={ANIMATION.DATA_AOS}>
        <div
          className="main mx-auto my-0 max-w-[1144px] pt-6 lg:px-0"
          data-aos={ANIMATION.DATA_AOS}
        >
          <h2 className="pb-4 text-sm font-medium text-[#050505]">
            Notifications
          </h2>
        </div>

        <div
          className="heading mx-auto my-0 flex max-w-[1144px] justify-between border-b border-[#DCDDDD] bg-white px-6"
          data-aos={ANIMATION.DATA_AOS}
        >
          <NotifyTab tabs={tabs} />
          <div className="settings relative flex items-center">
            <ActionCell
              open={openToolTip}
              setOpen={setOpenToolTip}
              className="top-2"
            >
              <NotifyActions handleMarkAll={handleMarkAll} />
            </ActionCell>
          </div>
        </div>

        <div
          className="mx-auto my-0 max-w-[1144px]"
          data-aos={ANIMATION.DATA_AOS}
        >
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

export default withAuthorization([UserType.STUDENT])(Notifications)
