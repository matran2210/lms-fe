import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappButton from '@components/base/button/SappButton'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { USER_STATUS, USER_TYPE } from '@utils/constants/User'
import { formatDate, formatPhoneNumber } from '@utils/helpers'
import {
  VALIDATE_MAX,
  VALIDATE_MIN,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import { StaticImageData } from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  getMe,
  updateUser,
  updateUserAvatar,
  userReducer,
} from 'src/redux/slice/User/User'
import { z } from 'zod'

interface IProps {
  isEdit: boolean
  setIsEdit: (edit: boolean) => void
  avatar: File | undefined
  handleSetAvatar: (avatar: File | undefined) => void
  setReViewImageSrc: Dispatch<
    SetStateAction<string | StaticImageData | undefined>
  >
}

const schema = z.object({
  full_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .min(3, { message: VALIDATE_MIN('Fullname', 3) })
    .max(100, { message: VALIDATE_MAX('Fullname', 100) }),
})

const MyProfile = ({
  isEdit,
  setIsEdit,
  avatar,
  handleSetAvatar,
  setReViewImageSrc,
}: IProps) => {
  const dispatch = useAppDispatch()
  const { user, loading, loadingEditName } = useAppSelector(userReducer)
  // Sử dụng hook useForm để quản lý form và xác thực dữ liệu
  const { control, setValue, handleSubmit, reset } = useForm<{
    full_name: string
  }>({
    resolver: zodResolver(schema),
  })

  /**
   * Hàm để chuyển sang chế độ chỉnh sửa form
   */
  const handleChangeToEditForm = () => {
    // Đặt giá trị cho trường full_name bằng tên hiện tại của người dùng
    setValue('full_name', user.detail.full_name)
    // Đặt trạng thái isEdit thành true
    setIsEdit(true)
  }
  /**
   * Hàm để chuyển sang chế độ view
   */
  const handleChangeToPreview = () => {
    // Gọi hành động thunk open của confirmDialogThunk và chờ kết quả
    setIsEdit(false)
    // Đặt lại giá trị của form về ban đầu
    handleSetAvatar(undefined)
    setReViewImageSrc(undefined)
    reset(
      {
        full_name: user.detail.full_name,
      },
      {
        keepDirty: false,
        keepErrors: false,
        keepDirtyValues: false,
        keepIsValid: false,
        keepTouched: false,
      },
    )
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
        return
      }
      // Gọi hành động thunk updateUser để cập nhật tên của người dùng
      await dispatch(updateUser({ full_name })).unwrap()
      // Nếu có avatar
      if (avatar) {
        // Gọi hành động thunk updateUserAvatar để cập nhật avatar của người dùng
        await dispatch(updateUserAvatar(avatar)).unwrap()
        // Đặt lại giá trị của avatar
        handleSetAvatar(undefined)
        // Gọi hành động thunk getMe để lấy lại thông tin người dùng
      }
      dispatch(getMe())
      // Đặt trạng thái isEdit thành false
      setIsEdit(false)
    } catch (error) {}
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="block min-h-[40.3rem]">
        <div className="relative">
          <div className="text-xl font-bold pb-6 mb-6 text-bw-1">
            {`${isEdit ? 'Edit' : 'My'}`} Profile
          </div>
          <div className="absolute inset-0 border-b border-gray-3 bottom-0"></div>
        </div>
        <ul>
          {/* start:: Code*/}
          <li
            className={`md:flex block gap-[1.4rem] transition-[margin] ${
              !isEdit ? 'mb-5' : 'mb-6'
            } `}
          >
            <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
              Code
            </div>
            <div className="flex-auto max-w-[300px] font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit} height="4">
                {user.code?.toString()}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Code*/}

          {/* start:: Full Name*/}
          <li
            className={`md:flex block transition-[margin] ${
              !isEdit ? 'mb-5 gap-[1.4rem]' : 'mb-5 gap-y-6 gap-2 '
            }`}
          >
            <div
              className={`text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%] ${
                isEdit ? 'py-2.5' : ''
              }`}
            >
              Full Name
            </div>

            {isEdit ? (
              <HookFormTextField
                control={control}
                name="full_name"
                skeleton={loadingEditName}
                className="w-full flex-1"
              ></HookFormTextField>
            ) : (
              <div className="flex-auto max-w-[300px] font-medium text-bw-1">
                <TextSkeleton loading={loading && !isEdit} height="4">
                  {user.detail.full_name}
                </TextSkeleton>
              </div>
            )}
          </li>

          {/* start:: Username*/}
          <li
            className={`md:flex block gap-[1.4rem] transition-[margin] ${
              !isEdit ? 'mb-5' : 'mb-8'
            }`}
          >
            <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
              Username
            </div>
            <div className="flex-auto max-w-[300px] font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit} height="4">
                {user.username}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Username*/}

          {/* start:: Email*/}
          <li
            className={`md:flex block gap-[1.4rem] transition-[margin] ${
              !isEdit ? 'mb-5' : 'mb-[2rem]'
            }`}
          >
            <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
              Email
            </div>
            <div className="flex-auto max-w-[300px] font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit} height="4">
                {user.detail.email}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Email*/}

          {/* start:: Phone Number*/}
          <li
            className={`md:flex block gap-[1.4rem] transition-[margin] ${
              !isEdit ? 'mb-5' : 'mb-[2rem]'
            }`}
          >
            <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
              Phone Number
            </div>
            <div className="flex-auto max-w-[300px] font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit} height="4">
                {formatPhoneNumber(user.detail.phone)}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Phone Number*/}

          {/* start:: Role*/}
          <li
            className={`md:flex block gap-[1.4rem] ${
              !isEdit ? 'mb-5' : 'mb-8 transition-[margin]'
            }`}
          >
            <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
              Role
            </div>
            <div className="flex-auto max-w-[300px] font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit} height="4">
                {USER_TYPE[user.type]?.label}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Role*/}

          {/* start:: Status*/}
          <li className={`md:flex block gap-[1.4rem] ${!isEdit ? 'mb-5' : ''}`}>
            <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
              Status
            </div>
            <div className={`flex-auto max-w-[300px] font-medium`}>
              <TextSkeleton loading={loading && !isEdit} height="4">
                <span className={`${USER_STATUS[user.status]?.color}`}>
                  {USER_STATUS[user.status]?.label}
                </span>
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Status*/}

          {/* start:: Updated At*/}
          {!isEdit && (
            <li className={`md:flex block gap-[1.4rem]`}>
              <div className="text-gray-1 flex-none w-[17.43rem] max-w-[200px] lg:max-w-[50%]">
                Updated At
              </div>
              <div className="flex-auto max-w-[300px] font-medium text-bw-1">
                <TextSkeleton loading={loading && !isEdit} height="4">
                  {formatDate(user.updated_at)}
                </TextSkeleton>
              </div>
            </li>
          )}
          {/* end:: Updated At*/}
        </ul>
        <div className={`${isEdit ? 'mt-11' : 'mt-10'}`}>
          {!isEdit ? (
            <SappButton
              onClick={handleChangeToEditForm}
              size="medium"
              title={'Edit'}
              className="min-w-[120px] text-sm"
              loading={loading && !isEdit}
            ></SappButton>
          ) : (
            <ButtonCancelSubmit
              cancel={{
                title: 'Cancel',
                onClick: handleChangeToPreview,
                size: 'medium',
                isPaddingHorizontal: false,
                disabled: loading || loadingEditName,
                className: 'min-w-fit !px-0 text-base w-30',
              }}
              submit={{
                title: 'Save',
                size: 'medium',
                className: 'min-w-fit px-0 text-sm w-30',
                type: 'submit',
                loading: loading || loadingEditName,
              }}
            ></ButtonCancelSubmit>
          )}
        </div>
      </form>
    </div>
  )
}

export default MyProfile
