import { IUser } from 'src/redux/types/User/urser'
import { httpService } from '../httpService'
import url from './url'

const UserApi = {
  getUser: (): Promise<IUser> => {
    const uri = url.getUser
    return httpService.GET<any, IUser>({
      uri,
    })
  },
}

export default UserApi
