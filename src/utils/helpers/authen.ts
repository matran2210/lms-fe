import AsyncStorage from '@react-native-async-storage/async-storage'

export const getAccessToken = async (): Promise<string> => {
  return (await AsyncStorage.getItem('accessToken')) || ''
}

export const getRefreshToken = async (): Promise<string> => {
  return (await AsyncStorage.getItem('refreshToken')) || ''
}

export const setAccessToken = (accToken: string) => {
  AsyncStorage.setItem('accessToken', accToken)
}

export const setRefreshToken = (refreshToken: string) => {
  AsyncStorage.setItem('refreshToken', refreshToken)
}

export const removeJwtToken = () => {
  AsyncStorage.removeItem('accessToken')
  AsyncStorage.removeItem('refreshToken')
  AsyncStorage.removeItem('userInfo')
}
