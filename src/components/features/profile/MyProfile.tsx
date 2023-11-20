import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getMe, updateUserName, userReducer } from 'src/redux/slice/User/User'
import { z } from 'zod'

const schema = z.object({
  full_name: z
    .string({ required_error: VALIDATE_REQUIRED })
    .min(3, { message: VALIDATE_MIN('Fullname', 3) })
    .max(100, { message: VALIDATE_MAX('Fullname', 100) }),
})

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { user, loading, loadingEditName } = useAppSelector(userReducer)
  const { control, setValue, handleSubmit, reset } = useForm<{
    full_name: string
  }>({
    resolver: zodResolver(schema),
  })

  const handleChangeToEditForm = () => {
    setValue('full_name', user.detail.full_name)
    setIsEdit(true)
  }
  const handleChangeToPreview = () => {
    setIsEdit(false)

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

  const onSubmit = ({ full_name }: { full_name: string }) => {
    dispatch(updateUserName(full_name))
      .unwrap()
      .then(() => {
        setIsEdit(false)
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-xl font-bold mb-12 text-bw-1">My Profile</div>
        <ul>
          {/* start:: Code*/}
          <li className="md:flex block gap-6 pb-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
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
          <li className={`md:flex block gap-6 ${isEdit ? '' : 'py-2.5'}`}>
            <div
              className={`text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%] ${
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
              ></HookFormTextField>
            ) : (
              <div className="flex-auto max-w-[300px] font-medium text-bw-1">
                <TextSkeleton loading={loading && !isEdit} height="4">
                  {user.detail.full_name}
                </TextSkeleton>
              </div>
            )}
          </li>
          {/* end:: Full Name*/}

          {/* start:: Username*/}
          <li className="md:flex block gap-6 py-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
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
          <li className="md:flex block gap-6 py-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
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
          <li className="md:flex block gap-6 py-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
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
          <li className="md:flex block gap-6 py-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
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
          <li className="md:flex block gap-6 py-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
              Status
            </div>
            <div className={`flex-auto max-w-[300px] font-medium`}>
              <TextSkeleton loading={loading && !isEdit} height="4">
                <span
                  className={`text-state-${USER_STATUS[user.status].color}`}
                >
                  {USER_STATUS[user.status]?.label}
                </span>
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Status*/}

          {/* start:: Updated At*/}
          <li className="md:flex block gap-6 py-2.5">
            <div className="text-gray-1 flex-none w-[300px] max-w-[200px] lg:max-w-[50%]">
              Updated At
            </div>
            <div className="flex-auto max-w-[300px] font-medium text-bw-1">
              <TextSkeleton loading={loading && !isEdit} height="4">
                {formatDate(user.updated_at)}
              </TextSkeleton>
            </div>
          </li>
          {/* end:: Updated At*/}
        </ul>
        <div className="mt-10">
          {!isEdit ? (
            <ButtonPrimary
              onClick={handleChangeToEditForm}
              size="medium"
              title={'Edit'}
              className="min-w-[120px] text-sm"
              loading={loading && !isEdit}
            ></ButtonPrimary>
          ) : (
            <ButtonCancelSubmit
              cancel={{
                title: 'Cancel',
                onClick: handleChangeToPreview,
                size: 'medium',
                isPaddingHorizontal: false,
                disabled: loading || loadingEditName,
              }}
              submit={{
                title: 'Save',
                // onClick: () => setIsEdit(false),
                size: 'medium',
                className: 'min-w-fit px-0 text-sm',
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
