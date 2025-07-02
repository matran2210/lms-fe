import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'
import {
  VALIDATE_MIN_LENGTH_PASSWORD,
  VALIDATE_PASSWORD_REGEX_MSG,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthAPI } from 'src/pages/api/profile'
import { z } from 'zod'
import exceptions from '../../services/en.exceptions.json'
import PasswordProfile from './PasswordProfile'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

export interface IChangePassword {
  password: string
  newPassword: string
  confirmPassword: string
}

interface IProp {
  handleCancel?: () => void
}

const ChangePassword = ({ handleCancel }: IProp) => {
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
  const { control, handleSubmit, reset, getValues, watch, setError } =
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
    } catch (error: any) {
      const errorCode = error?.response?.data?.error?.code
      const errorMessage = exceptions.find(
        (exception) => exception.code === errorCode,
      )

      setError('password', {
        message: errorMessage?.message || '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <div className="mt-6 md:mt-8 lg:mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="block">
          <div className="mb-6 flex flex-col gap-6">
            <div className="relative">
              <HookFormTextField
                label="Current Password"
                labelClass="textfield-label as-label z-10 text-ssm font-normal"
                inputClassName="rounded-lg"
                control={control}
                name="password"
                type="password"
                required
              />
            </div>

            <div className="relative">
              <HookFormTextField
                label="New Password"
                labelClass="textfield-label as-label z-10 text-ssm font-normal"
                inputClassName="rounded-lg"
                required
                control={control}
                name="newPassword"
                type="password"
              />
            </div>

            <div className="relative">
              <HookFormTextField
                label="Confirm New Password"
                labelClass="textfield-label as-label z-10 text-ssm font-normal"
                inputClassName="rounded-lg"
                required
                control={control}
                name="confirmPassword"
                type="password"
              />
            </div>
          </div>
          <div className="hidden justify-end lg:flex">
            <ButtonCancelSubmit
              className="flex flex-row-reverse gap-2"
              cancel={{
                title: 'Cancel',
                onClick: handleCancel,
                size: 'medium',
                disabled: loading,
                className: 'min-w-fit text-sm w-[5rem] rounded-lg py-2 px-4',
              }}
              submit={{
                title: 'Confirm',
                size: 'medium',
                className:
                  'min-w-fit text-sm w-[5rem] !text-white !bg-[#29353C] hover:!bg-black rounded-lg py-2 px-4 !no-underline',
                htmlType: 'submit',
                disabled:
                  loading ||
                  isEmpty(watch('confirmPassword')) ||
                  isEmpty(watch('newPassword')) ||
                  isEmpty(watch('password')),
              }}
            ></ButtonCancelSubmit>
          </div>
          <div className="flex items-center justify-between gap-2 lg:hidden">
            <ButtonSecondary
              className="w-full"
              size="medium"
              title="Cancel"
              onClick={handleCancel}
              disabled={loading}
            />
            <ButtonPrimary
              className="w-full py-2"
              size="medium"
              title="Confirm"
              htmlType="submit"
              disabled={
                loading ||
                isEmpty(watch('confirmPassword')) ||
                isEmpty(watch('newPassword')) ||
                isEmpty(watch('password'))
              }
            />
          </div>
        </form>
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
