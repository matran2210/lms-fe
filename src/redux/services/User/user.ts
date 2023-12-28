import { IUser } from 'src/redux/types/User/urser'
import { apiURL, httpService } from '../httpService'
import url from './url'
import { IResponse } from 'src/redux/types'
import axios from 'axios'

const UserApi = {
  /**
   * Một hàm để lấy thông tin của người dùng hiện tại
   * @returns {Promise<IUser>} Một promise chứa đối tượng IUser
   */
  getMe: (): Promise<IUser> => {
    // Đường dẫn api để lấy thông tin người dùng
    const uri = url.me
    // Sử dụng httpService để gửi yêu cầu GET
    return httpService.GET<any, IUser>({
      uri,
    })
  },
  /**
   * Một hàm để cập nhật thông tin của người dùng
   * @param {string} full_name - Tên đầy đủ của người dùng
   * @param {{[key: string]: string} | null} avatar - Đối tượng chứa thông tin avatar của người dùng
   * @returns {Promise<IResponse<{message: string}>>} Một promise chứa đối tượng IResponse
   */
  updateUser: (
    full_name: string,
    avatar?: { [key: string]: string } | null,
  ): Promise<IResponse<{ message: string }>> => {
    // Đường dẫn api để cập nhật thông tin người dùng
    const uri = url.user
    // Sử dụng httpService để gửi yêu cầu PUT
    return httpService.PUT<
      { full_name: string },
      IResponse<{ message: string }>
    >({
      uri,
      request: { full_name },
    })
  },

  /**
   * Một hàm để cập nhật avatar của người dùng
   * @param {File} avatar - File ảnh của avatar
   * @returns {Promise<any>} Một promise chứa dữ liệu trả về từ api
   */
  updateUserAvatar: (avatar: File): Promise<any> => {
    // Đường dẫn api để cập nhật avatar
    const uri = url.userAvatar
    // Tạo một đối tượng formData để chứa file ảnh
    const formData = new FormData()
    formData.append('avatar', avatar)
    // Sử dụng httpService để gửi yêu cầu POST_FORM_DATA
    return httpService.POST_FORM_DATA<any, any>({
      uri,
      request: formData,
    })
  },

  makeContactDefault: (id: string): Promise<any> => {
    const uri = `${url.makeContactDefault}/${id}/make-this-default`
    return httpService.POST<{}, IResponse<{ message: string }>>({
      uri,
    })
  },
  getListDevicesServerSide: async (
    accessToken: string,
  ): Promise<IResponse<any>> => {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    }
    const response = await axios.get<{}, IResponse<{ data: any }>>(
      `${apiURL}${url.devices}`,
      {
        headers,
      },
    )
    return response.data?.data
  },
  getListDevices: async (): Promise<IResponse<any>> => {
    const uri = url.devices
    const res = httpService.GET<any, any>({
      uri,
    })
    return res
  },
  getListHistory: async ({ page_index, page_size }: any): Promise<any> => {
    const uri = url.history
    const res = httpService.GET<any, any>({
      uri,
      params: {
        page_index: page_index,
        page_size: page_size,
      },
    })
    return res
  },
}

export default UserApi
