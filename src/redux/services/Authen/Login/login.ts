import { IResponse } from 'src/redux/types'
import {
  LoginReq,
  LoginRes,
  ChangePasswordReq,
  ChangePasswordRes,
} from '../../../types/Login/login'
import { httpService } from '../../httpService'
import url from '../url'

const handleLogin = {
  login: (request: LoginReq): Promise<IResponse<LoginRes>> => {
    const uri = url.login
    return httpService.POST<LoginReq, IResponse<LoginRes>>({
      uri,
      request,
    })
  },
  changePassword: (request: ChangePasswordReq) => {
    const uri = url.changePassword
    return httpService.POST<ChangePasswordReq, ChangePasswordRes>({
      uri,
      request,
    })
  },
}

export default handleLogin
