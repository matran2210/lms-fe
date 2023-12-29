import AsyncStorage from '@react-native-async-storage/async-storage'

export const getAccessToken = async (): Promise<string> => {
  return (await AsyncStorage.getItem('accessToken')) || ''
}

export const getRefreshToken = async (): Promise<string> => {
  return (await AsyncStorage.getItem('refreshToken')) || ''
}

export const setAccessToken = async (accToken: string) => {
  await AsyncStorage.setItem('accessToken', accToken)
}

export const setRefreshToken = async (refreshToken: string) => {
  await AsyncStorage.setItem('refreshToken', refreshToken)
}

export const removeJwtToken = () => {
  AsyncStorage.removeItem('accessToken')
  AsyncStorage.removeItem('refreshToken')
  AsyncStorage.removeItem('userInfo')
}
