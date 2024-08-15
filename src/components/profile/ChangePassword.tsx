import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'
import {
  VALIDATE_MIN_LENGTH_PASSWORD,
  VALIDATE_PASSWORD_REGEX_MSG,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import PasswordProfile from './PasswordProfile'
import { AuthAPI } from 'src/pages/api/profile'
import { isEmpty } from 'lodash'

export interface IChangePassword {
  password: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword = () => {
  const [loading, setLoading] = useState(false)

  /**
   * @description validate password
   */
  const validationSchema = z
    .object({
      password: z
        .string({ required_error: VALIDATE_REQUIRED })
        .trim()
        .min(1, {
          message: VALIDATE_REQUIRED,
        })
        .min(8, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) })
        .regex(VALIDATE_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG),
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

  /**
   * @description sử dụng useForm
   */
  const { control, handleSubmit, reset, getValues, watch } =
    useForm<IChangePassword>({
      resolver: zodResolver(validationSchema),
      mode: 'onSubmit',
    })

  /**
   * @description state này dùng để mở popup khi submit thành công mật khẩu hiện tại
   */
  const [openPopup, setOpenPopup] = useState(false)

  /**
   * @description call API submit mật khẩu hiện tại
   */
  const onSubmit = async (data: IChangePassword) => {
    setLoading(true)
    try {
      await AuthAPI.changeUserPassword(data.password)
      setOpenPopup(true)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <div className="flex-1 bg-white p-6 pt-4 shadow-box">
        <form onSubmit={handleSubmit(onSubmit)} className="block">
          <div className="relative">
            <div className="flex items-center justify-between border-b border-gray-3 pb-5">
              <div className="text-xl font-medium ">Change Password</div>
              <div>
                <ButtonCancelSubmit
                  className="flex gap-12"
                  cancel={{
                    title: '',
                    onClick: () => {},
                    size: 'medium',
                  }}
                  submit={{
                    title: 'Save',
                    size: 'medium',
                    className: 'min-w-fit px-0 text-sm w-30',
                    type: 'submit',
                    disabled:
                      loading ||
                      isEmpty(watch('confirmPassword')) ||
                      isEmpty(watch('newPassword')) ||
                      isEmpty(watch('password')),
                  }}
                />
              </div>
            </div>
          </div>
        </form>
        <div className="mt-6 grid grid-cols-2">
          <div className="flex items-center text-base text-gray-1">
            Current Password
          </div>
          <div>
            <HookFormTextField
              control={control}
              name="password"
              type="password"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2">
          <div className="flex items-center text-base text-gray-1">
            New Password
          </div>
          <div>
            <HookFormTextField
              control={control}
              name="newPassword"
              type="password"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2">
          <div className="flex items-center text-base text-gray-1">
            Confirm New Password
          </div>
          <div>
            <HookFormTextField
              control={control}
              name="confirmPassword"
              type="password"
            />
          </div>
        </div>
      </div>
      <PasswordProfile
        open={openPopup}
        setOpen={setOpenPopup}
        reset={reset}
        getValues={getValues}
      />
    </React.Fragment>
  )
}

export default ChangePassword
