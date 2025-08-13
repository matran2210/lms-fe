'use client'

import { UserApi } from '@/api/user'
import { COOKIE_INFO } from '@/constants'
import { IUser } from '@/types'
import { setCookie } from '@/utils'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'

export interface IAuthContext {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>>
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const ref = useRef(false)

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

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider')
  }
  return context
}
