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

  const [makeDefaultDrawer, setMakeDefaultDrawer] = useState<{
    status: boolean
    email: string
    phone: string
    address: string
    index: number
    id: string
    is_default: boolean
  }>()

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
        // router.push(PageLink.AUTH_LOGIN)
      }
    }
  }
  const closeMakeDefault = () => {
    setMakeDefaultDrawer(undefined)
  }

  const submitMakeDefault = async () => {
    try {
      if (makeDefaultDrawer?.id) {
        await dispatch(makeContactDefault(makeDefaultDrawer.id))
          .unwrap()
          .then(async (e) => {
            setMakeDefaultDrawer(undefined)
            await dispatch(getMe())
          })
      }
    } catch (error) {}
  }

  /**
   * Sắp xếp mảng người dùng theo thời gian tạo và is_default.
   *
   * @param {Array} users - Mảng người dùng cần sắp xếp.
   * @returns {Array} - Mảng đã sắp xếp theo is_default và created_at.
   */
  const sortByCreatedAtAndDefault = (users: Array<any>) => {
    const sortedUsers = [...users]

    sortedUsers.sort((a, b) => {
      if (a?.is_default && !b?.is_default) return -1
      if (!a?.is_default && b?.is_default) return 1

      const dateA = new Date(a?.created_at)
      const dateB = new Date(b?.created_at)

      return dateB?.getTime() - dateA?.getTime()
    })

    return sortedUsers
  }

  return (
    <div className="p-6 pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="block">
        <div className="relative">
          <div className="flex items-center justify-between border-b border-b-gray-3 pb-6">
            <div className="text-xl font-medium text-bw-1">Overview</div>
            <div className=" flex gap-x-2">
              <SappButton
                onClick={onOpenTab}
                size="medium"
                title={'Back'}
                color="textUnderline"
                className="block min-w-[120px] pr-0 text-base lg:hidden"
                loading={loading && !isEdit}
              ></SappButton>
              {!isEdit ? (
                <SappButton
                  onClick={handleChangeToEditForm}
                  size="medium"
                  title={'Edit'}
                  className="min-w-[120px] text-base"
                  loading={loading && !isEdit}
                ></SappButton>
              ) : (
                <ButtonCancelSubmit
                  className="flex gap-12"
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
          </div>
        </div>

        <ul className="mt-6">
          {/* start:: Code*/}
          <li
            className={`block gap-[1.4rem] transition-[margin] md:flex ${
              !isEdit ? 'mb-5' : 'mb-6'
            } `}
          >
            <div className="w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%]">
              Code
            </div>
            <div className="max-w-[300px] flex-auto font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit}>
                {user?.code?.toString() ?? user?.key?.toString()}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Code*/}

          {/* start:: Full Name*/}
          <li
            className={`block transition-[margin] md:flex ${
              !isEdit ? 'mb-5 gap-[1.4rem]' : 'mb-5 gap-2 gap-y-6 '
            }`}
          >
            <div
              className={`w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%] ${
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
              <div className="max-w-[300px] flex-auto font-medium text-bw-1">
                <TextSkeleton loading={loading && !isEdit}>
                  {user.detail.full_name}
                </TextSkeleton>
              </div>
            )}
          </li>

          {/* start:: Username*/}
          <li
            className={`block gap-[1.4rem] transition-[margin] md:flex ${
              !isEdit ? 'mb-5' : 'mb-8'
            }`}
          >
            <div className="w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%]">
              Username
            </div>
            <div className="max-w-[300px] flex-auto font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit}>
                {user?.username}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Username*/}

          {/* start:: Role*/}
          <li
            className={`block gap-[1.4rem] md:flex ${
              !isEdit ? 'mb-5' : 'mb-8 transition-[margin]'
            }`}
          >
            <div className="w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%]">
              Role
            </div>
            <div className="max-w-[300px] flex-auto font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit}>
                {USER_TYPE[user?.type]?.label}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Role*/}

          {/* start:: Status*/}
          <li className={`block gap-[1.4rem] md:flex ${!isEdit ? 'mb-5' : ''}`}>
            <div className="w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%]">
              Status
            </div>
            <div className={`max-w-[300px] flex-auto font-medium`}>
              <TextSkeleton loading={loading && !isEdit}>
                <span className={`${USER_STATUS[user?.status]?.color}`}>
                  {USER_STATUS[user.status]?.label}
                </span>
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Status*/}

          {/* start:: Updated At*/}
          {!isEdit && (
            <li className={`block gap-[1.4rem] md:flex`}>
              <div className="w-[17.43rem] max-w-[200px] flex-none text-gray-1 lg:max-w-[50%]">
                Updated At
              </div>
              <div className="max-w-[300px] flex-auto font-medium text-bw-1">
                <TextSkeleton loading={loading && !isEdit}>
                  {formatDate(user?.updated_at)}
                </TextSkeleton>
              </div>
            </li>
          )}
          {/* end:: Updated At*/}
        </ul>
        {sortByCreatedAtAndDefault(user?.user_contacts || [])?.map((e, i) => {
          return (
            <div className={`mt-5`} key={e.id}>
              <div
                className={`border border-gray-3 p-4 ${
                  isEdit ? 'bg-gray-3' : ''
                } `}
              >
                <div>
                  <span className="text-gray-1">Profile {i + 1}</span>
                  {e?.is_default && (
                    <span className="ml-[10px] inline-block select-none bg-blue-600 bg-opacity-5 px-2 py-1 text-medium-sm leading-4 text-state-info">
                      Default
                    </span>
                  )}
                </div>
                <div className="mt-3 flex font-medium text-bw-1">
                  <div className="w-fit">
                    {e?.phone && e?.phone}
                    {e?.email && e?.phone && (
                      <span className="mx-3 text-gray-1">|</span>
                    )}
                    {e?.email && e?.email}
                  </div>
                  {!isEdit && (
                    <div
                      className="group ml-auto w-fit cursor-pointer select-none"
                      onClick={() =>
                        setMakeDefaultDrawer({
                          status: true,
                          email: e?.email,
                          phone: e?.phone,
                          address: e?.address,
                          index: i + 1,
                          id: e?.id,
                          is_default: e?.is_default,
                        })
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                      >
                        <path
                          className="fill-current text-gray-500 transition-colors duration-300 group-hover:text-primary"
                          d="M13.102 19.147a.562.562 0 0 1 0-.795l5.79-5.79H3.75a.562.562 0 1 1 0-1.125h15.142l-5.79-5.79a.563.563 0 0 1 .796-.795l6.75 6.75a.563.563 0 0 1 0 .795l-6.75 6.75a.562.562 0 0 1-.796 0Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </form>
      <SappDrawer
        isOpen={makeDefaultDrawer?.status || false}
        onClose={closeMakeDefault}
        title={'Profile ' + makeDefaultDrawer?.index || ''}
        message=""
        confirmOnClose={false}
        widthDrawer="w-6/12"
        btnSubmitTile="Make Default"
        handleSubmit={submitMakeDefault}
        showSubmitButton={makeDefaultDrawer?.is_default ? false : true}
      >
        <div className="text-bw-1">
          <span className="inline-block w-[302px] text-gray-1">Email:</span>
          <span className="font-medium">{makeDefaultDrawer?.email || ''}</span>
        </div>
        {makeDefaultDrawer?.phone && (
          <div className="mt-5 text-bw-1">
            <span className="inline-block w-[302px] text-gray-1">
              Phone Number:
            </span>
            <span className="font-medium">
              {makeDefaultDrawer?.phone || ''}{' '}
            </span>
          </div>
        )}
        {makeDefaultDrawer?.address && (
          <div className="mt-5 text-bw-1">
            <span className="inline-block w-[302px] text-gray-1">
              {' '}
              Address:{' '}
            </span>
            <span className="font-medium">
              {makeDefaultDrawer?.address || ''}{' '}
            </span>
          </div>
        )}
      </SappDrawer>
    </div>
  )
}

export default MyProfile
