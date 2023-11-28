import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
// import { useState } from 'react'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'
import {
  VALIDATE_MIN_LENGTH,
  VALIDATE_PASSWORD_REGEX_MSG,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { PageLink } from 'src/constants'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { changePassword, loginReducer } from '../../../redux/slice/Login/Login'
import { useState } from 'react'
import AuthApi from 'src/redux/services/Authen'
import { display422Errors } from '@utils/helpers/form'
import SappButton from '@components/base/button/SappButton'

interface IInputProps {
  password: string
  confirmPassword: string
}

const ChangePasswordPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  // Validate for input
  const validationSchema = z
    .object({
      password: z
        .string({ required_error: VALIDATE_REQUIRED })
        .trim()
        .min(1, { message: VALIDATE_REQUIRED })
        .min(8, { message: VALIDATE_MIN_LENGTH('Password', 8) })
        .regex(VALIDATE_PASSWORD, {
          message: VALIDATE_PASSWORD_REGEX_MSG,
        }),
      confirmPassword: z
        .string({ required_error: VALIDATE_REQUIRED })
        .min(1, { message: VALIDATE_REQUIRED })
        .min(8, { message: VALIDATE_MIN_LENGTH('Confirm Password', 8) })
        .regex(VALIDATE_PASSWORD, {
          message: VALIDATE_PASSWORD_REGEX_MSG,
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })

  // Using validate for input
  const { control, handleSubmit, setError } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
  })

  // Call API when submit
  const onSubmit = async ({ password }: IInputProps) => {
    setLoading(true)
    try {
      const response = await AuthApi.resetPassword({ new_password: password })
      if (response.success) {
        setTimeout(() => {
          router.push(PageLink.AUTH_CHANGE_PASSWORD_SUCCESS)
        }, 500)
      }
    } catch (error) {
      display422Errors(error, setError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog">
      <div className="text-4xl font-bold text-bw-1 mb-2">New Password</div>
      <div className="text-medium-sm text-gray-1 mb-10">
        Set the new password for your account.
      </div>
      <div>
        <form>
          <HookFormTextField
            name="password"
            control={control}
            placeholder="New password"
            type="password"
            textSize="sm"
          />
          <HookFormTextField
            name="confirmPassword"
            control={control}
            placeholder="Confirm Password"
            type="password"
            className="mt-6"
            textSize="sm"
          />
          <div className="mt-10">
            <SappButton
              title="Submit"
              full={true}
              className="mb-6"
              size="lager"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            />
            <div className="mt-8">
              <Link href={PageLink.AUTH_LOGIN} passHref>
                <div className="text-lg font-semibold text-center leading-7 cursor-pointer w-full">
                  Cancel
                </div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default ChangePasswordPage
ChangePasswordPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
