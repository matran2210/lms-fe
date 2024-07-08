import { getActToken, getLocalStorgeActToken } from '@utils/index'
import { useRouter } from 'next/router'
import React, {
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

        if(oldPinnedId !== res?.data?.id || Boolean(oldPinnedFlag === 'true')){
          setPinnedNotifications(res)
          setOpenPinned(true)
          localStorage.setItem('pinnedId', res?.data?.id)
          localStorage.setItem('openPinned', "true")
        } else {
          if(Boolean(oldPinnedFlag === 'false')){
            setOpenPinned(false)
          } else {
            setOpenPinned(true)
          }
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
    PageLink.AUTH_CHANGE_PASSWORD_SUCCESS
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
