import { IUser } from 'src/redux/types/User/urser'
import { apiURL } from '../httpService'
import url from './url'
import { IResponse } from 'src/redux/types'
import { AuthAPI } from 'src/pages/api/profile'
import { PinnedNotifications } from 'src/type'
import { fetchFormData } from '@services/requestV2'
import { IDeviceItem } from 'src/type/Profile'

const UserApi = {
  /**
   * Một hàm để lấy thông tin của người dùng hiện tại
   * @returns {Promise<IUser>} Một promise chứa đối tượng IUser
   */
  getMe: (): Promise<IUser> => {
    // Đường dẫn api để lấy thông tin người dùng
    // Sử dụng httpService để gửi yêu cầu GET
    return AuthAPI.me()
  },
  /**
   * Một hàm để lấy khóa học và certificate của người dùng hiện tại
   */
  getUserInformation: (): Promise<any> => {
    // Đường dẫn api để lấy khóa học và certificate của người dùng người dùng
    const uri = url.coursesAndCertificates
    // Sử dụng httpService để gửi yêu cầu GET
    return AuthAPI.getUserInformation()
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
    // Sử dụng httpService để gửi yêu cầu PUT
    return AuthAPI.updateUser(full_name, avatar)
  },

  /**
   * Một hàm để cập nhật avatar của người dùng
   * @param {File} avatar - File ảnh của avatar
   * @returns {Promise<any>} Một promise chứa dữ liệu trả về từ api
   */
  updateUserAvatar: (avatar: File): Promise<any> => {
    // Tạo một đối tượng formData để chứa file ảnh
    const formData = new FormData()
    formData.append('avatar', avatar)
    // Sử dụng httpService để gửi yêu cầu POST_FORM_DATA
    return fetchFormData({ url: `${apiURL}/users/avatar`, formData })
  },
  getListDevices: async (): Promise<IDeviceItem[]> => {
    return AuthAPI.getListDevices()
  },
  getListHistory: async ({ page_index, page_size }: any): Promise<any> => {
    return AuthAPI.getListHistory({ page_index, page_size })
  },

  /**
   * Một hàm để lấy Pinned Notification
   *
   */
  getPinnedNotifications: (): Promise<PinnedNotifications> => {
    // Đường dẫn api Pinned Notification
    // Sử dụng httpService để gửi yêu cầu GET
    return AuthAPI.getPinnedNotifications()
  },
}

export default UserApi
