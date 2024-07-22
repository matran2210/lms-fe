import { convertUTCToLocalTime } from '@utils/helpers'
import {
  getActToken,
  getLocalStorageItem,
  setLocalStorageItem,
} from '@utils/index'
import { useRouter } from 'next/router'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { PageLink } from 'src/constants'
import UserApi from 'src/redux/services/User/user'
import { PinnedNotifications } from 'src/type'

// type for context
type Context = {
  openPinned: boolean
  setOpenPinned: (flag: boolean) => void
  pinnedNotifications: PinnedNotifications
  getPinnedData: () => void
}

// initContext
const initContext: Context = {
  openPinned: true,
  setOpenPinned: () => true,
  pinnedNotifications: {
    data: {
      action: '',
      content: '',
      created_at: '',
      created_by: '',
      created_from: '',
      deleted_at: '',
      id: '',
      mode: '',
      send_finish_time: '',
      send_time: '',
      status: '',
      title: '',
      type: '',
      updated_at: '',
    },
  },
  getPinnedData: () => {},
}

const PinnedNotifyContext = createContext<Context>(initContext)

export function PinnedNotifyProvider(props: PropsWithChildren<{}>) {
  const [openPinned, setOpenPinned] = useState(true)
  const [pinnedNotifications, setPinnedNotifications] =
    useState<PinnedNotifications>({
      data: {
        action: '',
        content: '',
        created_at: '',
        created_by: '',
        created_from: '',
        deleted_at: '',
        id: '',
        mode: '',
        send_finish_time: '',
        send_time: '',
        status: '',
        title: '',
        type: '',
        updated_at: '',
      },
    })

  const authToken = getActToken()

  const getPinnedData = async () => {
    if (authToken) {
      const res: PinnedNotifications = await UserApi.getPinnedNotifications()
      const oldPinnedId = getLocalStorageItem('pinnedId')
      const oldPinnedFlag = getLocalStorageItem('openPinned')

      if (oldPinnedId !== res?.data?.id || Boolean(oldPinnedFlag === 'true')) {
        // * Logic đúng
        const pin_start = convertUTCToLocalTime(res?.data?.send_time)
        const unix_pin_start = pin_start.getTime()

        const pin_end = convertUTCToLocalTime(res?.data?.send_finish_time)
        const unix_pin_end = pin_end.getTime()

        const now = new Date()
        const unix_now = now.getTime()

        // * Kiểm tra thời gian pin có hợp lệ để show cho client
        if (unix_pin_start <= unix_now && unix_now <= unix_pin_end) {
          setPinnedNotifications(res)
          setOpenPinned(true)
          setLocalStorageItem('pinnedId', res?.data?.id)
          setLocalStorageItem('openPinned', 'true')
          setLocalStorageItem('pinnedStatus', res?.data?.status)
        }
      } else {
        if (Boolean(oldPinnedFlag === 'false')) {
          setOpenPinned(false)
        } else {
          setOpenPinned(true)
        }
      }
    }
  }

  const router = useRouter()

  const isLoginPage = ![
    PageLink.AUTH_LOGIN,
    PageLink.AUTH_FORGOT_PASSWORD,
    PageLink.AUTH_FORGOT_PASSWORD_RECOVER,
    PageLink.AUTH_CHANGE_PASSWORD,
    PageLink.AUTH_CHANGE_PASSWORD_SUCCESS,
  ].includes(router.pathname)

  useEffect(() => {
    if (isLoginPage) {
      getPinnedData()
    }
  }, [router.pathname])

  return (
    <PinnedNotifyContext.Provider
      value={{
        openPinned,
        setOpenPinned,
        pinnedNotifications,
        getPinnedData,
      }}
      {...props}
    />
  )
}

export function usePinnedNotifyContext(): Context {
  const context = useContext(PinnedNotifyContext)

  if (!context) {
    throw new Error('Error!')
  }

  return context
}
