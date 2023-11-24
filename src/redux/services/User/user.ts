import { IUser } from 'src/redux/types/User/urser'
import { httpService } from '../httpService'
import url from './url'
import { IResponse } from 'src/redux/types'

const UserApi = {
  getMe: (): Promise<IUser> => {
    const uri = url.me
    return httpService.GET<any, IUser>({
      uri,
    })
  },
  updateUserName: (
    full_name: string,
  ): Promise<IResponse<{ message: string }>> => {
    const uri = url.user
    return httpService.PUT<
      { full_name: string },
      IResponse<{ message: string }>
    >({
      uri,
      request: { full_name },
    })
  },

  updateUserAvatar: (avatar: File) => {
    const uri = url.userAvatar
    const formData = new FormData()
    formData.append('avatar', avatar)
    return httpService.POST_FORM_DATA<any, any>({
      uri,
      request: formData,
    })
  },
}

export default UserApi
