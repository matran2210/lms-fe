'use client'

import { UserApi } from '@/api/user'
import { COOKIE_INFO } from '@/constants'
import { IUser } from '@/types'
import { getToken, setCookie } from '@/utils'
import { useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'

export interface IAuthContext {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>>
  meetingToken: string | null
  setMeetingToken: Dispatch<SetStateAction<string | null>>
  loadingMeetingToken: boolean
  setLoadingMeetingToken: Dispatch<SetStateAction<boolean>>
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
  meetingToken: null,
  setMeetingToken: () => {},
  loadingMeetingToken: false,
  setLoadingMeetingToken: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const ref = useRef(false)
  const [loadingMeetingToken, setLoadingMeetingToken] = useState(true)
  const [meetingToken, setMeetingToken] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const tokenFromParams = searchParams.get('token')

  useEffect(() => {
    if (user || ref.current) return

    const getUser = async () => {
      const user = await UserApi.getMe()
      setUser(user)
      setCookie(COOKIE_INFO.KEYCLOAK_USER_ID, user.keycloak_user_id)
    }
    getUser()

    return () => {
      ref.current = true
    }
  }, [])

  useEffect(() => {
    const currentToken = getToken(tokenFromParams)
    setMeetingToken(currentToken)
    setLoadingMeetingToken(false)
  }, [tokenFromParams])

  return (
    <AuthContext.Provider
      value={{ user, setUser, meetingToken, setMeetingToken, loadingMeetingToken, setLoadingMeetingToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider')
  }
  return context
}
