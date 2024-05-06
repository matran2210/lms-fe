import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'
import { VALIDATE_MIN_LENGTH_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG, VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import PasswordProfile from './PasswordProfile'

interface IInputProps {
  password: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword = () => {
  const validationSchema = z
    .object({
      password: z
        .string({ required_error: VALIDATE_REQUIRED })
        .min(8, { message: VALIDATE_REQUIRED }),
      newPassword: z
        .string({ required_error: VALIDATE_REQUIRED })
        .trim()
        .min(1, {
          message: VALIDATE_REQUIRED,
        })
        .min(8, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) })
        .regex(VALIDATE_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG),
      confirmPassword: z
        .string({ required_error: VALIDATE_REQUIRED })
        .trim()
        .min(1, {
          message: VALIDATE_REQUIRED,
        })
        .min(8, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) })
        .regex(VALIDATE_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })

  const { control, handleSubmit, reset } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
  })

  const [editPassword, setEditPassword] = useState(false)

  const [openPopup, setOpenPopup] = useState(false)

  const onSubmit = async (data: IInputProps) => {
    console.log(data)
    setOpenPopup(true)
  }

  return (
    <React.Fragment>
      <div className="bg-white p-6 flex-1 shadow-box">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="block"
        >
          <div className="relative">
            <div className="flex items-center justify-between pb-6 border-b border-b-gray-3">
              <div className="text-xl font-medium text-bw-1">Overview</div>
              <div>
                {!editPassword ? (
                  <SappButton
                    onClick={() => setEditPassword(true)}
                    size="medium"
                    title={'Edit'}
                    className="min-w-[120px] text-base"
                  ></SappButton>
                ) : (
                  <ButtonCancelSubmit
                    className="gap-12 flex"
                    cancel={{
                      title: 'Cancel',
                      onClick: () => setEditPassword(false),
                      size: 'medium',
                      isPaddingHorizontal: false,
                      className: 'min-w-fit !px-0 text-base w-30',
                    }}
                    submit={{
                      title: 'Save',
                      size: 'medium',
                      className: 'min-w-fit px-0 text-sm w-30',
                      type: 'submit',
                    }}
                  ></ButtonCancelSubmit>
                )}
              </div>
            </div>
          </div>

        </form>
        <div className='grid grid-cols-2 mt-6'>
          <div className='flex items-center text-gray-1 text-base'>Current Password</div>
          <div>
            <HookFormTextField
              control={control}
              name='password'
              type='password'
              disabled={!editPassword}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 mt-6'>
          <div className='flex items-center text-gray-1 text-base'>New Password</div>
          <div>
            <HookFormTextField
              control={control}
              name='newPassword'
              type='password'
              disabled={!editPassword}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 mt-6'>
          <div className='flex items-center text-gray-1 text-base'>Confirm New Password</div>
          <div>
            <HookFormTextField
              control={control}
              name='confirmPassword'
              type='password'
              disabled={!editPassword}
            />
          </div>
        </div>
      </div>
      <PasswordProfile open={openPopup} setOpen={setOpenPopup} reset={reset} setEditPassword={setEditPassword}/>
    </React.Fragment>
  )
}

export default ChangePassword