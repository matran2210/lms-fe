import { CERTIFICATE_DETAIL } from '@utils/constants'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ENTRANCE_TEST_RESULT, ENTRANCE_TEST_TABLE_RESULT } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getMe, userReducer } from 'src/redux/slice/User/User'

interface IProps {
  children: JSX.Element
}

export const RouteGuard = ({ children }: IProps) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const dispatch = useAppDispatch()
  const userSlice = useAppSelector(userReducer)
  // First useEffect for getMe
  useEffect(() => {
    callGetMe()
  }, [router.pathname])

  const callGetMe = async () => {
    if (
      userSlice.user.id ||
      [
        CERTIFICATE_DETAIL,
        ENTRANCE_TEST_RESULT,
        ENTRANCE_TEST_TABLE_RESULT,
      ].includes(router.pathname)
    ) {
      setAuthorized(true)
      return
    }

    try {
      await dispatch(getMe()).unwrap()
      setAuthorized(true)
    } catch (error) {}
  }

  return authorized ? children : <></>
}
