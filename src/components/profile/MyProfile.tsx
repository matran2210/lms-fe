import SappDrawer from '@components/base/SappDrawer'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappButton from '@components/base/button/SappButton'
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { USER_STATUS, USER_TYPE } from '@utils/constants/User'
import { formatDate } from '@utils/helpers'
import {
  VALIDATE_MAX,
  VALIDATE_MIN,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import { StaticImageData } from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import {
  getMe,
  makeContactDefault,
  updateUser,
  updateUserAvatar,
  userReducer,
} from 'src/redux/slice/User/User'
import { z } from 'zod'
import TabLayout from './TabLayout'
import ProfileCard from '@components/card/ProfileCard'

interface IProps {
  isEdit: boolean
  setIsEdit: (edit: boolean) => void
  avatar: File | undefined
  handleSetAvatar: (avatar: File | undefined) => void
  setReViewImageSrc: Dispatch<
    SetStateAction<string | StaticImageData | undefined>
  >
  onOpenTab?: () => void
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
  onOpenTab,
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
    setValue('full_name', user?.detail?.full_name)
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
    } catch (error: any) {
      setIsEdit(false)
      setReViewImageSrc(undefined)
      if (error?.response?.data?.error?.code === '403|1002') {
        await dispatch(getLogoutUser())
      }
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="block">
        <ProfileCard
          title="Overview"
          // extra={
          //   <div className=" flex gap-x-2">
          //     <SappButton
          //       onClick={onOpenTab}
          //       size="medium"
          //       title={'Back'}
          //       color="textUnderline"
          //       className="block min-w-[120px] pr-0 text-base lg:hidden"
          //       loading={loading && !isEdit}
          //     ></SappButton>
          //     {!isEdit ? (
          //       <SappButton
          //         onClick={handleChangeToEditForm}
          //         size="medium"
          //         title={'Edit'}
          //         className="min-w-[120px] text-base"
          //         loading={loading && !isEdit}
          //       ></SappButton>
          //     ) : (
          //       <ButtonCancelSubmit
          //         className="flex gap-12"
          //         cancel={{
          //           title: 'Cancel',
          //           onClick: handleChangeToPreview,
          //           size: 'medium',
          //           isPaddingHorizontal: false,
          //           disabled: loading || loadingEditName,
          //           className: 'min-w-fit !px-0 text-base w-30',
          //         }}
          //         submit={{
          //           title: 'Save',
          //           size: 'medium',
          //           className: 'min-w-fit px-0 text-sm w-30',
          //           type: 'submit',
          //           loading: loading || loadingEditName,
          //         }}
          //       ></ButtonCancelSubmit>
          //     )}
          //   </div>
          // }
        >
          <>
            <ul>
              <TextWrapper
                title="Code"
                value={user?.code?.toString() ?? user?.key?.toString()}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper title="Full Name" isEdit={isEdit} loading={loading}>
                {isEdit ? (
                  <HookFormTextField
                    control={control}
                    name="full_name"
                    skeleton={loadingEditName}
                    className="w-full flex-1"
                  ></HookFormTextField>
                ) : (
                  <div className="max-w-[300px] flex-auto font-medium text-bw-1">
                    <TextSkeleton loading={loading && !isEdit}>
                      {user.detail.full_name}
                    </TextSkeleton>
                  </div>
                )}
              </TextWrapper>
              <TextWrapper
                title="Username"
                value={user?.username}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Role"
                value={USER_TYPE[user?.type]?.label}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="D.O.B"
                value={
                  user?.detail?.dob ? formatDate(user?.detail?.dob, true) : ''
                }
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Email"
                value={user?.user_contacts?.[0]?.email}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Phone"
                value={user?.user_contacts?.[0]?.phone}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="University"
                value={user?.detail?.university?.name ?? ''}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Major"
                value={user?.detail?.major?.name}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Field of work"
                value={user?.detail?.company_type ?? ''}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Position"
                value={user?.detail?.company_position ?? ''}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Main Class"
                value={user?.main_class?.join(',') ?? ''}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper
                title="Deferred/Retake class"
                value={user?.reserve_retook_class?.join(', ') ?? ''}
                isEdit={isEdit}
                loading={loading}
              />
              <TextWrapper title="Status" isEdit={isEdit} loading={loading}>
                <span className={`${USER_STATUS[user?.status]?.color}`}>
                  {USER_STATUS[user.status]?.label}
                </span>
              </TextWrapper>
              {!isEdit && (
                <TextWrapper
                  title="Updated At"
                  value={formatDate(user?.updated_at) ?? ''}
                  isEdit={isEdit}
                  loading={loading}
                />
              )}
            </ul>
          </>
        </ProfileCard>
      </form>
    </div>
  )
}

const TextWrapper = ({
  title,
  isEdit,
  value,
  loading,
  children,
}: {
  title: string
  children?: React.ReactNode
  isEdit: boolean
  value?: string
  loading: boolean
}) => {
  return (
    <li
      className={`block gap-[1.4rem] md:flex ${
        !isEdit ? 'mb-4' : 'mb-8 transition-[margin]'
      }`}
    >
      <div className="w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%]">
        {title}
      </div>
      <div className="max-w-[300px] flex-auto font-medium text-bw-1">
        {value && (
          <TextSkeleton loading={loading && !isEdit}>{value}</TextSkeleton>
        )}
        {children}
      </div>
    </li>
  )
}

export default MyProfile
