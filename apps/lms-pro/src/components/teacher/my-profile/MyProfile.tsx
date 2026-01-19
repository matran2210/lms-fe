import TeacherProfileCard from '@components/common/TeacherProfileCard'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@lms/assets'
import {
  getLogoutUser,
  getMe,
  updateUser,
  updateUserAvatar,
  userReducer,
} from '@lms/contexts'
import { USER_TYPE } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  ButtonCancelSubmit,
  ButtonPrimary,
  ButtonSecondary,
  HookFormTextField,
  HookFormTextFieldSmartRounded,
  TextSkeleton,
} from '@lms/ui'
import {
  VALIDATE_MAX,
  VALIDATE_MIN,
  VALIDATE_REQUIRED,
  convertHumanReadableToSnakeCase,
  formatDateToSlash,
} from '@lms/utils'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { Tag } from 'antd'
import clsx from 'clsx'
import { StaticImageData } from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { Control, useForm } from 'react-hook-form'
import UserApi from 'src/redux/services/User/user'
import { z } from 'zod'
import FullScreenMobile from './Modal/FullScreenMobile'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'

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
  const { isMobileView } = useTailwindBreakpoint()

  const [openEditProfile, setOpenEditProfile] = useState(false)
  const dispatch = useAppDispatch()
  const { user, loading, loadingEditName } = useAppSelector(userReducer)
  // Sử dụng hook useForm để quản lý form và xác thực dữ liệu
  const { control, setValue, handleSubmit, reset } = useForm<{
    full_name: string
  }>({
    resolver: zodResolver(schema),
  })
  const facilities = user?.facilities || []
  /**
   * Hàm để chuyển sang chế độ chỉnh sửa form
   */
  const handleChangeToEditForm = () => {
    // Đặt giá trị cho trường full_name bằng tên hiện tại của người dùng
    setValue('full_name', user?.detail?.full_name)
    // Đặt trạng thái isEdit thành true
    setIsEdit(true)
    setOpenEditProfile(true)
  }
  /**
   * Hàm để chuyển sang chế độ view
   */
  const handleChangeToPreview = () => {
    // Gọi hành động thunk open của confirmDialogThunk và chờ kết quả
    setIsEdit(false)
    setOpenEditProfile(false)
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
        await dispatch(
          updateUser({ full_name, avatar: null, api: UserApi }),
        ).unwrap()
        await dispatch(
          updateUser({ full_name, avatar: null, api: UserApi }),
        ).unwrap()
        // Gọi hành động thunk getMe để lấy lại thông tin người dùng
        dispatch(getMe(UserApi))
        // Đặt trạng thái isEdit thành false
        setIsEdit(false)
        setOpenEditProfile(false)
        return
      }
      // Gọi hành động thunk updateUser để cập nhật tên của người dùng
      await dispatch(updateUser({ full_name, api: UserApi })).unwrap()
      // Nếu có avatar
      if (avatar) {
        // Gọi hành động thunk updateUserAvatar để cập nhật avatar của người dùng
        await dispatch(updateUserAvatar({ api: UserApi, avatar })).unwrap()
        await dispatch(updateUserAvatar({ api: UserApi, avatar })).unwrap()
        // Đặt lại giá trị của avatar
        handleSetAvatar(undefined)
        // Gọi hành động thunk getMe để lấy lại thông tin người dùng
      }
      dispatch(getMe(UserApi))
      // Đặt trạng thái isEdit thành false
      setIsEdit(false)
      setOpenEditProfile(false)
    } catch (error: any) {
      setIsEdit(false)
      setOpenEditProfile(false)
      setReViewImageSrc(undefined)
      if (error?.response?.data?.error?.code === '403|1002') {
        await dispatch(
          getLogoutUser({ authManager: new AuthenticationManager() }),
        )
        await dispatch(
          getLogoutUser({ authManager: new AuthenticationManager() }),
        )
      }
    }
  }
  const renderFacilities = () => {
    if (!facilities?.length) return
    return (
      <div className="flex flex-wrap items-center gap-[10px]">
        {facilities?.map((facility) => (
          <Tag
            key={facility.id}
            bordered={false}
            className="!m-0 rounded px-[20px] py-2 text-xs font-medium text-gray-800"
          >
            {facility.name}
          </Tag>
        ))}
      </div>
    )
  }
  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="block">
        <TeacherProfileCard
          title={isEdit ? 'Edit Profile' : 'Overview'}
          extra={
            <>
              {!isEdit && (
                <div className="cursor-pointer text-primary hover:underline lg:hidden">
                  <div
                    className="flex items-center justify-end gap-2"
                    onClick={handleChangeToEditForm}
                  >
                    <div>Edit Profile</div>
                    <Icon type="edit" />
                  </div>
                </div>
              )}
            </>
          }
        >
          <>
            <ul>
              <TextWrapper
                title="Code"
                value={user?.code?.toString() ?? user?.key?.toString()}
                loading={loading}
                control={control}
                hiddenOnEdit={isEdit}
              />
              <TextWrapper
                title="Name"
                showEditIcon
                isEdit={isEdit}
                loading={loading}
                handleClickEdit={handleChangeToEditForm}
                control={control}
                isInForm
              >
                {isEdit ? (
                  <div className="flex w-full items-center gap-2">
                    <div className="flex-1">
                      <HookFormTextField
                        placeholder="Enter Text..."
                        control={control}
                        name="full_name"
                        skeleton={loadingEditName}
                        className="h-full w-full"
                        inputClassName="rounded-lg h-full px-4 py-3"
                        textSize="sm"
                      ></HookFormTextField>
                    </div>

                    <ButtonCancelSubmit
                      className="flex flex-row-reverse gap-2"
                      cancel={{
                        title: 'Cancel',
                        onClick: handleChangeToPreview,
                        size: 'medium',
                        disabled: loading || loadingEditName,
                        className:
                          'min-w-fit text-sm w-20 rounded-lg py-2 px-4',
                      }}
                      submit={{
                        title: 'Confirm',
                        size: 'medium',
                        className:
                          'min-w-fit text-sm w-20 rounded-lg py-2 px-4 !no-underline',
                        htmlType: 'submit',
                        loading: loading || loadingEditName,
                      }}
                    ></ButtonCancelSubmit>
                  </div>
                ) : (
                  <div className="flex flex-auto justify-end break-all text-end font-medium text-gray-800 lg:max-w-[300px] lg:justify-start">
                    <TextSkeleton loading={loading && !isEdit}>
                      {user.detail.full_name}
                    </TextSkeleton>
                  </div>
                )}
              </TextWrapper>
              <TextWrapper
                title="Username"
                value={user?.username}
                loading={loading}
                control={control}
                isEdit={isEdit}
              />
              <TextWrapper
                title="Phone"
                value={user?.user_contacts?.[0]?.phone}
                loading={loading}
                control={control}
                isEdit={isEdit}
              />
              <TextWrapper
                title="Email"
                value={user?.user_contacts?.[0]?.email}
                loading={loading}
                control={control}
                isEdit={isEdit}
              />

              <TextWrapper
                title="Facility"
                loading={loading}
                control={control}
                isEdit={isEdit}
              >
                {renderFacilities()}
              </TextWrapper>
            </ul>
            <div className="cursor-pointer rounded-lg bg-warning-50 p-4 text-warning md:hidden">
              <div
                className="flex items-center justify-between gap-2"
                onClick={handleChangeToEditForm}
              >
                <div>Edit Profile</div>
                <Icon type="edit" />
              </div>
            </div>
            {isEdit && (
              <div className="hidden items-center justify-between gap-2 md:flex lg:hidden">
                <ButtonSecondary
                  className="w-full"
                  size="medium"
                  title="Cancel"
                  onClick={handleChangeToPreview}
                  disabled={loading || loadingEditName}
                />
                <ButtonPrimary
                  className="w-full"
                  size="medium"
                  title="Confirm"
                  htmlType="submit"
                  disabled={loading || loadingEditName}
                />
              </div>
            )}
          </>
        </TeacherProfileCard>
      </form>
      {isMobileView && openEditProfile && (
        <FullScreenMobile
          className="bg-gray-100 px-4 pb-4"
          title={'My Profile'}
          open={openEditProfile}
          onClose={handleChangeToPreview}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-lg bg-white p-4 shadow-small">
              <div className="mb-6 text-base font-semibold text-gray-800">
                Edit Profile
              </div>
              <>
                <ul>
                  <TextWrapper
                    title="Full Name"
                    value={user?.detail?.full_name}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="Username"
                    value={user?.username}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="Role"
                    value={USER_TYPE[user?.type]?.label}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="D.O.B"
                    value={
                      user?.detail?.dob
                        ? formatDateToSlash(user?.detail?.dob, true)
                        : ''
                    }
                    loading={loading}
                    control={control}
                    isEdit
                    type="date"
                  />
                  <TextWrapper
                    title="Email"
                    value={user?.user_contacts?.[0]?.email}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="Phone"
                    value={user?.user_contacts?.[0]?.phone}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="University"
                    value={user?.detail?.university?.name ?? ''}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="Major"
                    value={user?.detail?.major?.name}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="Field of work"
                    value={user?.detail?.company_type ?? ''}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                  <TextWrapper
                    title="Position"
                    value={user?.detail?.company_position ?? ''}
                    loading={loading}
                    control={control}
                    isEdit
                  />
                </ul>

                <div className="flex items-center justify-between gap-2">
                  <ButtonSecondary
                    className="w-full"
                    size="medium"
                    title="Cancel"
                    onClick={handleChangeToPreview}
                    disabled={loading || loadingEditName}
                  />
                  <ButtonPrimary
                    className="w-full px-4 py-2"
                    size="medium"
                    title="Confirm"
                    htmlType="submit"
                    disabled={loading || loadingEditName}
                  />
                </div>
              </>
            </div>
          </form>
        </FullScreenMobile>
      )}
    </div>
  )
}

const TextWrapper = ({
  title,
  isEdit = false,
  value,
  loading,
  children,
  handleClickEdit,
  showEditIcon = false,
  control,
  isInForm = false,
  type,
  hiddenOnEdit = false,
}: {
  title: string
  children?: React.ReactNode
  isEdit?: boolean
  value?: React.ReactNode
  loading: boolean
  handleClickEdit?: () => void
  showEditIcon?: boolean
  control: Control<
    {
      full_name: string
    },
    any
  >
  isInForm?: boolean
  type?: 'number' | 'email' | 'password' | 'text' | 'date'
  hiddenOnEdit?: boolean
}) => {
  return (
    <li
      className={clsx(
        'group mb-6 flex gap-[22.4px] text-sm md:mb-4 md:text-base',
        {
          'transition-[margin]': isEdit,
          '!block': isInForm && isEdit,
          hidden: hiddenOnEdit,
        },
      )}
    >
      <div
        className={clsx({
          hidden: !isEdit,
          'w-full md:block lg:hidden': isEdit,
        })}
      >
        <HookFormTextFieldSmartRounded
          label={title}
          placeholder="Enter Text..."
          control={control}
          name={convertHumanReadableToSnakeCase(title)}
          skeleton={loading}
          className="h-full w-full flex-1 rounded-lg px-4 py-3"
          textSize="sm"
          defaultValue={value}
          type={type}
        ></HookFormTextFieldSmartRounded>
      </div>

      <div
        className={clsx(
          'max-w-[200px] flex-none text-gray-400 md:w-[278.88px] lg:max-w-[50%]',
          { 'hidden lg:mb-2 lg:block': isEdit },
        )}
      >
        {title}
      </div>
      <div className="flex items-center gap-6">
        <div
          className={clsx(
            'flex flex-auto justify-end break-all text-end font-medium text-gray-800 lg:max-w-[300px] lg:justify-start',
            {
              '!hidden !max-w-full lg:!block': isEdit,
            },
          )}
        >
          {value && (
            <TextSkeleton loading={loading && !isEdit}>{value}</TextSkeleton>
          )}
          {children}
        </div>
        {!isEdit && showEditIcon && (
          <div className="flex-auto justify-end lg:flex">
            <div className="block grow cursor-pointer text-primary">
              <div
                className="flex items-center gap-2"
                onClick={handleClickEdit}
              >
                <div>Edit</div>
                <Icon type="edit" />
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

export default MyProfile
