import { PencilFillV2Icon, PencilV2Icon } from '@assets/icons'
import { CheckCircleOutlineYellow } from '@assets/icons/test'
import blankAvatar from '@assets/images/blank_avatar.webp'
import { ProfileSkeleton } from '@lms/ui'
import { CloseIconV2 } from '@lms/assets/icons'
import { Divider, Tag } from 'antd'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import {
  getMe,
  getUserInformation,
  updateUser,
  updateUserAvatar,
  userReducer,
} from 'src/redux/slice/User/User'
interface IProps {
  isEdit: boolean
  avatar: File | undefined
  setAvatar: (avatar?: File) => void
  inputFileRef: MutableRefObject<HTMLInputElement | null>
  reViewImageSrc: string | StaticImageData | undefined
  setReViewImageSrc: Dispatch<
    SetStateAction<string | StaticImageData | undefined>
  >
  setIsEdit: (edit: boolean) => void
}
const ProfileHeader = ({
  isEdit,
  avatar,
  setAvatar,
  inputFileRef,
  reViewImageSrc,
  setReViewImageSrc,
  setIsEdit,
}: IProps) => {
  const dispatch = useAppDispatch()
  // Sử dụng hook useAppSelector để lấy dữ liệu từ state redux
  const { user, loading, loadingEditName, loadingEditAvatar } =
    useAppSelector(userReducer)

  const [isEditAvatar, setIsEditAvatar] = useState(false)

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
      setIsEditAvatar(true)
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
    setIsEdit(false)
    setIsEditAvatar(false)
  }
  const onCancelUploadAvatar = () => {
    // Đặt giá trị cho state avatar thành undefined
    setAvatar(undefined)
    setIsEdit(false)
    setIsEditAvatar(false)
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
  /**
   * Hàm để xử lý khi người dùng submit form
   * @param {{full_name: string}} data - Đối tượng chứa dữ liệu của form
   * @returns {Promise<void>} Một promise không có giá trị trả về
   */
  const onSubmit = async ({
    full_name,
  }: {
    full_name: string
  }): Promise<void> => {
    try {
      // Nếu không có avatar và người dùng có avatar hiện tại
      if (!avatar && user?.detail?.avatar) {
        // Gọi hành động thunk updateUser để cập nhật tên và avatar của người dùng
        await dispatch(updateUser({ full_name, avatar: null })).unwrap()
        // Gọi hành động thunk getMe để lấy lại thông tin người dùng
        dispatch(getMe())
        // Đặt trạng thái isEdit thành false
        setIsEdit(false)
        setIsEditAvatar(false)
        return
      }

      // Nếu có avatar
      if (avatar) {
        // Gọi hành động thunk updateUserAvatar để cập nhật avatar của người dùng
        await dispatch(updateUserAvatar(avatar)).unwrap()
        // Đặt lại giá trị của avatar
        setAvatar(undefined)
        // Gọi hành động thunk getMe để lấy lại thông tin người dùng
      }
      dispatch(getMe())
      // Đặt trạng thái isEdit thành false
      setIsEdit(false)
      setIsEditAvatar(false)
    } catch (error: any) {
      setIsEdit(false)
      setIsEditAvatar(false)
      setReViewImageSrc(undefined)
      if (error?.response?.data?.error?.code === '403|1002') {
        await dispatch(getLogoutUser())
      }
    }
  }
  useEffect(() => {
    dispatch(getUserInformation())
  }, [])

  return (
    <div className="flex flex-col items-center justify-start gap-4 md:flex-row md:gap-6">
      <div className="relative pb-3 md:pb-0">
        <div className="relative h-[100px] w-[100px] shrink rounded-full">
          <div
            className={`${
              loading ? 'animate-pulse' : ''
            } w-100 h-100 absolute bottom-0 left-0 right-0 top-0 overflow-hidden rounded-full lg:block`}
          >
            <div className="group absolute left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full leading-[0]">
              {/* {isEdit && ( */}
              <div
                className={clsx(
                  'absolute bottom-0 left-0 right-0 top-0 z-10 cursor-pointer',
                  {
                    'hidden lg:hover:block lg:group-hover:block': !isEdit,
                    block: isEdit || isEditAvatar,
                  },
                )}
              >
                <input
                  type="file"
                  className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={handlerChangeUploadAvatar}
                  ref={inputFileRef}
                />
                <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-40">
                  {!loadingEditAvatar ? (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <PencilFillV2Icon className="h-6 w-6 text-white" />
                      <span className="text-xs font-medium text-white">
                        Edit
                      </span>
                    </div>
                  ) : (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="fill-blue-600 text-[#DCDDDD]00 h-8 w-8 animate-spin dark:text-[#4b5563]"
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
              {/* )} */}
              <Image
                src={
                  reViewImageSrc ||
                  user.detail.avatar['150x150'] ||
                  user.detail.avatar?.['ORIGIN'] ||
                  blankAvatar
                }
                alt="avatar"
                className=""
                width={100}
                height={100}
                layout="fixed"
                objectFit={'cover'}
                priority={true}
              />
            </div>
          </div>
          {isEdit || isEditAvatar ? (
            <div
              className={clsx(
                'absolute -right-[0.5px] bottom-0 z-[1] rounded-full bg-white p-1 shadow-small md:hidden',
                {
                  'cursor-not-allowed': loadingEditAvatar,
                  'cursor-pointer': !loadingEditAvatar,
                },
              )}
              onClick={() =>
                avatar
                  ? onSubmit({ full_name: user.detail.full_name })
                  : onCancelUploadAvatar()
              }
            >
              {avatar ? (
                <CheckCircleOutlineYellow
                  className={clsx('h-5 w-5 text-primary', {
                    'animate-spin': loadingEditAvatar,
                  })}
                />
              ) : (
                <CloseIconV2 className="h-5 w-5" />
              )}
            </div>
          ) : (
            <div
              className="absolute -right-[0.5px] bottom-0 z-[1] cursor-pointer rounded-full bg-white p-1 shadow-small hover:text-primary md:hidden"
              onClick={() => setIsEdit(true)}
            >
              <PencilV2Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        {(isEdit || isEditAvatar) && (
          <div
            className={clsx(
              'opacity-1 absolute bottom-2 right-0 z-10 hidden w-fit md:block',
              {
                'cursor-not-allowed': loadingEditAvatar,
                'cursor-pointer': !loadingEditAvatar,
              },
            )}
            onClick={() =>
              avatar
                ? onSubmit({ full_name: user.detail.full_name })
                : handlerCancelUploadAvatar()
            }
          >
            <div
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white shadow-box hover:text-error"
              role="button"
            >
              {avatar ? (
                <CheckCircleOutlineYellow
                  className={clsx('h-5 w-5 text-primary', {
                    'animate-spin': loadingEditAvatar,
                  })}
                />
              ) : (
                <CloseIconV2 className="h-5 w-5" />
              )}
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg> */}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex-1 md:my-6 lg:my-0">
        <div
          className={clsx(
            'mb-3 flex items-center justify-center gap-2 truncate text-lg font-bold text-secondary md:mb-4 md:block md:max-w-[600px] md:text-2xl',
          )}
        >
          <div className="flex w-full items-center justify-center gap-3 md:justify-start">
            <ProfileSkeleton loading={loading || loadingEditName}>
              {user.detail.full_name}
            </ProfileSkeleton>
            <div>
              <Tag
                bordered={false}
                className="m-0 rounded bg-success-50 px-2 py-[2px] text-sm font-normal text-success md:text-base"
              >
                Active
              </Tag>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 md:justify-start md:gap-6">
          <div className="flex items-center justify-center gap-[5px] md:mb-0 md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.4453 1.25H14.5551C15.9227 1.24998 17.025 1.24996 17.8919 1.36652C18.792 1.48754 19.5499 1.74643 20.1518 2.34835C20.7538 2.95027 21.0126 3.70814 21.1337 4.60825C21.2502 5.47522 21.2502 6.57754 21.2502 7.94513V16.0549C21.2502 17.4225 21.2502 18.5248 21.1337 19.3918C21.0126 20.2919 20.7538 21.0497 20.1518 21.6517C19.5499 22.2536 18.792 22.5125 17.8919 22.6335C17.025 22.75 15.9226 22.75 14.5551 22.75H10.4453C9.07773 22.75 7.9754 22.75 7.10844 22.6335C6.20833 22.5125 5.45045 22.2536 4.84854 21.6517C4.24662 21.0497 3.98773 20.2919 3.86671 19.3918C3.82801 19.1039 3.80216 18.7902 3.7849 18.4494C3.74582 18.326 3.73821 18.1912 3.76895 18.0568C3.75016 17.4649 3.75017 16.7991 3.75019 16.0549V7.94513C3.75017 6.57754 3.75015 5.47522 3.86671 4.60825C3.98773 3.70814 4.24662 2.95027 4.84854 2.34835C5.45045 1.74643 6.20833 1.48754 7.10843 1.36652C7.9754 1.24996 9.07772 1.24998 10.4453 1.25ZM5.27694 18.2491C5.29214 18.6029 5.31597 18.914 5.35333 19.1919C5.45199 19.9257 5.63243 20.3142 5.9092 20.591C6.18596 20.8678 6.57453 21.0482 7.30831 21.1469C8.06366 21.2484 9.06477 21.25 10.5002 21.25H14.5002C15.9356 21.25 16.9367 21.2484 17.6921 21.1469C18.4258 21.0482 18.8144 20.8678 19.0912 20.591C19.3679 20.3142 19.5484 19.9257 19.647 19.1919C19.7299 18.5756 19.7462 17.7958 19.7494 16.75H14.2502V19.5309C14.2502 19.5396 14.2502 19.5485 14.2502 19.5578C14.2504 19.6691 14.2506 19.8276 14.2293 19.9638C14.2033 20.1302 14.1177 20.4514 13.7851 20.6468C13.4647 20.8349 13.1513 20.765 13.0024 20.7187C12.8726 20.6783 12.7302 20.6105 12.624 20.56C12.6156 20.556 12.6074 20.5521 12.5995 20.5483L11.5002 20.0261L10.4009 20.5483C10.3929 20.5521 10.3848 20.5559 10.3764 20.56C10.2702 20.6105 10.1278 20.6783 9.99796 20.7187C9.84903 20.765 9.53567 20.8349 9.2153 20.6468C8.88263 20.4514 8.79705 20.1302 8.77104 19.9638C8.74976 19.8276 8.75 19.6691 8.75016 19.5578C8.75017 19.5485 8.75019 19.5396 8.75019 19.5309V16.75H8.39796C7.41971 16.75 7.0777 16.7564 6.81562 16.8267C6.0963 17.0194 5.52286 17.5541 5.27694 18.2491ZM10.2502 16.75V18.9592L10.9995 18.6033C11.0013 18.6024 11.0043 18.6009 11.0083 18.5989C11.0573 18.5738 11.2638 18.4682 11.5002 18.4682C11.7365 18.4682 11.943 18.5738 11.9921 18.5989C11.9961 18.6009 11.999 18.6024 12.0009 18.6033L12.7502 18.9592V16.75H10.2502ZM8.39796 15.25C8.35879 15.25 8.3202 15.25 8.28217 15.25C7.4642 15.2497 6.90605 15.2495 6.42739 15.3778C5.99941 15.4925 5.60242 15.6798 5.25019 15.9259V8C5.25019 6.56458 5.25178 5.56347 5.35333 4.80812C5.45199 4.07435 5.63243 3.68577 5.9092 3.40901C6.18596 3.13225 6.57453 2.9518 7.30831 2.85315C8.06366 2.75159 9.06477 2.75 10.5002 2.75H14.5002C15.9356 2.75 16.9367 2.75159 17.6921 2.85315C18.4258 2.9518 18.8144 3.13225 19.0912 3.40901C19.3679 3.68577 19.5484 4.07435 19.647 4.80812C19.7486 5.56347 19.7502 6.56458 19.7502 8V15.25H8.39796ZM7.75019 7C7.75019 6.58579 8.08597 6.25 8.50019 6.25H16.5002C16.9144 6.25 17.2502 6.58579 17.2502 7C17.2502 7.41421 16.9144 7.75 16.5002 7.75H8.50019C8.08597 7.75 7.75019 7.41421 7.75019 7ZM7.75019 10.5C7.75019 10.0858 8.08597 9.75 8.50019 9.75H13.5002C13.9144 9.75 14.2502 10.0858 14.2502 10.5C14.2502 10.9142 13.9144 11.25 13.5002 11.25H8.50019C8.08597 11.25 7.75019 10.9142 7.75019 10.5Z"
                fill="currentColor"
              />
            </svg>
            {user.courses?.template_full ?? 0} Enrolled Courses
          </div>
          <Divider type="vertical" className="m-0 bg-gray-300" />
          <div className="flex items-center justify-start gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.44513 1.25H16.5549C17.9225 1.24998 19.0248 1.24996 19.8918 1.36652C20.7919 1.48754 21.5497 1.74643 22.1517 2.34835C22.7536 2.95027 23.0125 3.70814 23.1335 4.60825C23.25 5.47522 23.25 6.57754 23.25 7.94513V12.0549C23.25 13.4225 23.25 14.5248 23.1335 15.3918C23.0125 16.2919 22.7536 17.0497 22.1517 17.6516C21.6537 18.1496 21.0469 18.4146 20.3361 18.5593C19.9739 18.6331 19.5724 18.6779 19.1302 18.7053C19.1324 18.7104 19.1347 18.7155 19.1369 18.7207C19.4098 19.361 19.1769 20.1059 18.557 20.4572C18.3707 20.5629 18.1702 20.6009 18.0301 20.6227C17.8836 20.6454 17.7006 20.6633 17.4974 20.6832L17.4776 20.6851C17.3468 20.6979 17.2726 20.7053 17.2175 20.7132C17.1924 20.7168 17.1791 20.7194 17.1739 20.7206C17.1583 20.7267 17.1477 20.7343 17.1409 20.7408C17.1358 20.7457 17.1321 20.7506 17.1294 20.7557C17.1282 20.7613 17.1265 20.7704 17.1244 20.7839C17.1166 20.8342 17.1091 20.903 17.0957 21.0292L17.0935 21.0498C17.0729 21.2432 17.054 21.421 17.0298 21.5641C17.0066 21.702 16.9648 21.9054 16.8486 22.0938C16.4743 22.7006 15.7273 22.8883 15.1126 22.6475C14.9208 22.5723 14.7668 22.4498 14.6557 22.3543C14.5419 22.2565 14.4078 22.1279 14.2577 21.984L12.5 20.2989L10.7424 21.984C10.5922 22.1279 10.4581 22.2565 10.3443 22.3543C10.2332 22.4498 10.0792 22.5723 9.88737 22.6475C9.27269 22.8883 8.52567 22.7006 8.1514 22.0938C8.03523 21.9054 7.99345 21.702 7.97018 21.5641C7.94605 21.421 7.92711 21.2431 7.90651 21.0497L7.90432 21.0292C7.89088 20.903 7.88336 20.8342 7.87555 20.7839C7.87346 20.7704 7.87178 20.7613 7.87065 20.7557C7.86789 20.7506 7.86415 20.7457 7.85908 20.7408C7.85227 20.7343 7.84174 20.7267 7.82614 20.7206C7.82086 20.7194 7.80762 20.7168 7.78255 20.7132C7.72741 20.7053 7.65319 20.6979 7.52244 20.6851L7.50262 20.6832C7.29938 20.6633 7.11637 20.6454 6.96992 20.6227C6.82977 20.6009 6.62935 20.5629 6.44298 20.4572C5.82307 20.1059 5.59019 19.361 5.86311 18.7207C5.86532 18.7155 5.86757 18.7104 5.86985 18.7052C5.47118 18.6805 5.10714 18.6418 4.77635 18.5811C4.01836 18.4418 3.37328 18.1766 2.84835 17.6517C2.24643 17.0497 1.98754 16.2919 1.86652 15.3918C1.74996 14.5248 1.74998 13.4225 1.75 12.0549V7.94513C1.74998 6.57754 1.74996 5.47522 1.86652 4.60825C1.98754 3.70814 2.24643 2.95027 2.84835 2.34835C3.45027 1.74643 4.20814 1.48754 5.10825 1.36652C5.97522 1.24996 7.07754 1.24998 8.44513 1.25ZM7.2329 17.2462L8.0487 16.4641L8.75788 15.7549C8.88413 13.7981 10.5113 12.25 12.5 12.25C14.4887 12.25 16.1159 13.7981 16.2421 15.7549L16.9513 16.4641L17.8122 17.2894L17.8117 17.2458C18.7984 17.2353 19.5017 17.1984 20.0368 17.0895C20.5513 16.9847 20.859 16.8229 21.091 16.591C21.3678 16.3142 21.5482 15.9257 21.6469 15.1919C21.7484 14.4365 21.75 13.4354 21.75 12V8C21.75 6.56458 21.7484 5.56347 21.6469 4.80812C21.5482 4.07435 21.3678 3.68577 21.091 3.40901C20.8142 3.13225 20.4257 2.9518 19.6919 2.85315C18.9365 2.75159 17.9354 2.75 16.5 2.75H8.5C7.06458 2.75 6.06347 2.75159 5.30812 2.85315C4.57435 2.9518 4.18577 3.13225 3.90901 3.40901C3.63225 3.68577 3.4518 4.07435 3.35315 4.80812C3.25159 5.56347 3.25 6.56459 3.25 8V12C3.25 13.4354 3.25159 14.4365 3.35315 15.1919C3.4518 15.9257 3.63225 16.3142 3.90901 16.591C4.15246 16.8344 4.48054 17.0016 5.04735 17.1057C5.58573 17.2046 6.28062 17.2368 7.2329 17.2462ZM15.9159 17.5495C15.5094 18.4444 14.7614 19.1513 13.8384 19.5041L15.2819 20.888C15.4099 21.0107 15.5009 21.0977 15.5719 21.1622C15.581 21.0864 15.5912 20.9919 15.6041 20.8702C15.6059 20.8537 15.6076 20.8368 15.6094 20.8197C15.6285 20.636 15.6511 20.4185 15.7269 20.2221C15.8949 19.7871 16.2449 19.4585 16.6765 19.3054C16.8708 19.2364 17.0859 19.2158 17.2795 19.1973C17.2969 19.1956 17.3143 19.1939 17.3314 19.1922C17.4388 19.1817 17.5267 19.1731 17.6 19.1652C17.543 19.1094 17.473 19.0423 17.3857 18.9586L15.9159 17.5495ZM12.5301 18.2498L12.5 18.2209L12.4699 18.2498C11.2411 18.2337 10.25 17.2326 10.25 16C10.25 14.7574 11.2574 13.75 12.5 13.75C13.7426 13.75 14.75 14.7574 14.75 16C14.75 17.2326 13.7589 18.2337 12.5301 18.2498ZM11.1616 19.5041L9.71809 20.888C9.59009 21.0107 9.49913 21.0977 9.42814 21.1622C9.41902 21.0864 9.40885 20.9919 9.39588 20.8702C9.39412 20.8537 9.39237 20.8368 9.39059 20.8197C9.37152 20.636 9.34895 20.4185 9.2731 20.2221C9.10513 19.7871 8.75507 19.4585 8.32352 19.3054C8.12918 19.2364 7.91411 19.2158 7.72052 19.1973C7.70304 19.1956 7.68573 19.1939 7.66863 19.1922C7.5612 19.1817 7.47333 19.1731 7.40005 19.1652C7.45701 19.1094 7.52695 19.0423 7.61427 18.9586L9.08407 17.5495C9.49065 18.4444 10.2386 19.1513 11.1616 19.5041ZM8.75 6C8.75 5.58579 9.08579 5.25 9.5 5.25H15.5C15.9142 5.25 16.25 5.58579 16.25 6C16.25 6.41421 15.9142 6.75 15.5 6.75H9.5C9.08579 6.75 8.75 6.41421 8.75 6ZM6.75 9.5C6.75 9.08579 7.08579 8.75 7.5 8.75H17.5C17.9142 8.75 18.25 9.08579 18.25 9.5C18.25 9.91422 17.9142 10.25 17.5 10.25H7.5C7.08579 10.25 6.75 9.91422 6.75 9.5Z"
                fill="currentColor"
              />
            </svg>
            {user.certificates?.template_full ?? 0} Certificates
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
