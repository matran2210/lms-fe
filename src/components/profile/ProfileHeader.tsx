import blankAvatar from '@assets/images/blank_avatar.webp'
import SappButton from '@components/base/button/SappButton'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import Image, { StaticImageData } from 'next/image'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useAppSelector } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'

interface IProps {
  isEdit: boolean
  setAvatar: (avatar?: File) => void
  inputFileRef: MutableRefObject<HTMLInputElement | null>
  reViewImageSrc: string | StaticImageData | undefined
  setReViewImageSrc: Dispatch<
    SetStateAction<string | StaticImageData | undefined>
  >
}
const ProfileHeader = ({
  isEdit,
  setAvatar,
  inputFileRef,
  reViewImageSrc,
  setReViewImageSrc,
}: IProps) => {
  // Sử dụng hook useAppSelector để lấy dữ liệu từ state redux
  const { user, loading, loadingEditName, loadingEditAvatar } =
    useAppSelector(userReducer)

  // Sử dụng state để lưu giá trị của hình ảnh xem trước

  /**
   * Một hàm để xử lý khi người dùng thay đổi file ảnh tải lên
   * @param {any} e - Đối tượng sự kiện của input file
   */
  const handlerChangeUploadAvatar = (e: any) => {
    // Lấy file ảnh đầu tiên từ input file
    const file = e.target.files?.[0]

    // Kiểm tra xem file có đúng định dạng ảnh hay không
    if (!validateImage(file?.type, file?.size)) {
      return
    }

    // Nếu có file
    if (file) {
      // Tạo một url tạm thời cho file ảnh
      const url = URL.createObjectURL(file)
      // Đặt giá trị cho state reViewImageSrc bằng url
      setReViewImageSrc(url)
      // Đặt giá trị cho state avatar bằng file
      setAvatar(file)
      // Xóa giá trị của input file
      if (inputFileRef.current) {
        inputFileRef.current.value = ''
      }
    }
  }
  /**
   * Một hàm để xử lý khi người dùng hủy bỏ việc tải ảnh lên
   */
  const handlerCancelUploadAvatar = () => {
    // Đặt giá trị cho state reViewImageSrc bằng hình ảnh mặc định
    setReViewImageSrc(blankAvatar)
    // Đặt giá trị cho state avatar thành undefined
    setAvatar(undefined)
  }

  /**
   * Một hàm để kiểm tra xem file có đúng định dạng ảnh hay không
   * @param {string} type - Loại file
   * @param {number} size - Kích thước file (tính bằng byte)
   * @returns {boolean} Một giá trị boolean cho biết file có đúng định dạng ảnh hay không
   */
  const validateImage = (type: string, size: number = 0): boolean => {
    // Tạo một mảng chứa các loại file ảnh được chấp nhận
    const acceptedTypes = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
    // Tạo một biến chứa kích thước file tối đa được chấp nhận (tính bằng byte)
    const maxSize = 20 * 1024 * 1024 // 20 MB
    // Nếu loại file không nằm trong mảng acceptedTypes
    if (!acceptedTypes.includes(type)) {
      // Hiển thị thông báo lỗi
      toast.error('File không đúng định dạng')
      // Trả về false
      return false
    }
    // Nếu kích thước file vượt quá maxSize
    if (size > maxSize) {
      // Hiển thị thông báo lỗi
      toast.error('File quá lớn, thước file vượt quá 20MB')
      // Trả về false
      return false
    }
    // Trả về true
    return true
  }

  return (
    <div className="shadow-box  block pr-8.25 py-10 pl-10 bg-white mb-6">
      <div className="lg:flex block justify-start items-center gap-6">
        <div className="relative">
          <div className="w-30 pt-29.2 rounded-full border-2 w border-primary  shrink mb-6 lg:mb-0 relative">
            <div
              className={`${
                loading ? 'animate-pulse' : ''
              } w-100 h-100 rounded-full absolute top-0 left-0 right-0 bottom-0 overflow-hidden`}
            >
              <div className="w-fit h-fit rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden leading-[0]">
                {isEdit && (
                  <div className="z-10 absolute top-0 left-0 right-0 bottom-0 cursor-pointer">
                    <input
                      type="file"
                      className="w-full h-full opacity-0 cursor-pointer absolute top-0 left-0 right-0 bottom-0 z-10"
                      onChange={handlerChangeUploadAvatar}
                      ref={inputFileRef}
                    />
                    <div className="w-full h-full flex justify-center items-center bg-black opacity-40">
                      {!loadingEditAvatar ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.2857 7.14314C19.2857 6.76425 19.1351 6.40089 18.8672 6.13298C18.5994 5.86508 18.2359 5.71456 17.8571 5.71456H14.9999L12.8571 2.85742H7.1428L4.99995 5.71456H2.1428C1.76392 5.71456 1.40056 5.86508 1.13265 6.13298C0.864743 6.40089 0.714233 6.76425 0.714233 7.14314V15.7146C0.714233 16.0934 0.864743 16.4569 1.13265 16.7247C1.40056 16.9926 1.76392 17.1431 2.1428 17.1431H17.8571C18.2359 17.1431 18.5994 16.9926 18.8672 16.7247C19.1351 16.4569 19.2857 16.0934 19.2857 15.7146V7.14314Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.99993 13.9286C11.7751 13.9286 13.2142 12.4895 13.2142 10.7143C13.2142 8.93909 11.7751 7.5 9.99993 7.5C8.22473 7.5 6.78564 8.93909 6.78564 10.7143C6.78564 12.4895 8.22473 13.9286 9.99993 13.9286Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <Image
                  src={
                    reViewImageSrc ||
                    user.detail.avatar['150x150'] ||
                    user.detail.avatar['ORIGIN'] ||
                    blankAvatar
                  }
                  alt="avatar"
                  className=""
                  width={108}
                  height={108}
                  layout="fixed"
                  objectFit={'cover'}
                  priority={true}
                />
              </div>
            </div>
          </div>
          {isEdit && (
            <div
              className="absolute right-0 bottom-2 w-fit opacity-1 z-10"
              onClick={handlerCancelUploadAvatar}
            >
              <div
                className="w-6 h-6 bg-white rounded-full shadow-box flex justify-center items-center cursor-pointer hover:text-state-error"
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 mb-6 lg:mb-0">
          <div className="font-bold text-2xl mb-4 truncate max-w-[600px] ">
            <TextSkeleton
              loading={loading || loadingEditName}
              height="6"
              width="[300px]"
            >
              {user.detail.full_name}
            </TextSkeleton>
          </div>
          <div className="md:flex block justify-start items-center gap-8 text-gray-1">
            <div className="flex justify-start items-center gap-1.5 mb-3 md:mb-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              35 Enrolled Courses
            </div>

            <div className="flex justify-start items-center gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.21 13.8909L7 23.0009L12 20.0009L17 23.0009L15.79 13.8809"
                  stroke="#A1A1A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              25 Certificates
            </div>
          </div>
        </div>
        <div>
          <SappButton size="lager" title={'Enroll New Course'}></SappButton>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
