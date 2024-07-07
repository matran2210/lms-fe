import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
  } from 'react'
import UserApi from 'src/redux/services/User/user'
import { PinnedNotifications } from 'src/type'
  
  // type for context
  type Context = {
    openPinned: boolean
    setOpenPinned: (flag: boolean) => void
    pinnedNotifications: PinnedNotifications
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
			updated_at: ''
			}
    }
  }
  
  const PinnedNotifyContext = createContext<any>(initContext)
  
  export function PinnedNotifyProvider(props: PropsWithChildren<{}>) {
    const [openPinned, setOpenPinned] = useState(true)
    const [pinnedNotifications, setPinnedNotifications] = useState<PinnedNotifications>()

		const getPinnedData = async () => {
			const res:any = await UserApi.getPinnedNotifications()
			if(res){
				setPinnedNotifications(res)
			}
		}
		useEffect(() => {
			getPinnedData();
		}, [])
  
    return (
      <PinnedNotifyContext.Provider
        value={{
          openPinned,
          setOpenPinned,
					pinnedNotifications
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
  