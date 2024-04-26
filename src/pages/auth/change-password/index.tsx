import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
// import { useState } from 'react'
import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'
import {
  VALIDATE_MIN_LENGTH,
  VALIDATE_PASSWORD_REGEX_MSG,
  VALIDATE_REQUIRED,
  VALIDATE_MIN_LENGTH_PASSWORD,
} from '@utils/helpers/ValidateMessage'
import { display422Errors } from '@utils/helpers/form'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PageLink } from 'src/constants'
import AuthApi from 'src/redux/services/Authen'
import { z } from 'zod'
import { AuthAPI } from '../../api/profile/index';
import { removeJwtToken } from '@utils/index'

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
        .min(1, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) })
        .min(8, { message: VALIDATE_MIN_LENGTH_PASSWORD('Password', 8, 1, 1) })
        .regex(VALIDATE_PASSWORD, {
          message: VALIDATE_PASSWORD_REGEX_MSG,
        }),
      confirmPassword: z
        .string({ required_error: VALIDATE_REQUIRED })
        .trim()
        .min(1, {
          message: VALIDATE_MIN_LENGTH_PASSWORD('Confirm password', 8, 1, 1),
        })
        .min(8, {
          message: VALIDATE_MIN_LENGTH_PASSWORD('Confirm password', 8, 1, 1),
        })
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
      const response = await AuthAPI.resetPassword({ new_password: password })
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
  const redirectLogin = () => {
    removeJwtToken()
    router.push(PageLink.AUTH_LOGIN)
  }

  return (
    <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog">
      <div className="text-4xl font-bold text-bw-1 mb-2">New password</div>
      <div className="text-medium-sm text-gray-1 mb-10">
        Set the new password for your account.
      </div>
      <div>
        <form>
          <HookFormTextField
            name="password"
            control={control}
            placeholder="New Password"
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
              className="mb-8"
              size="lager"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            />
            <div className="text-center">
              <SappButton
                title="Cancel"
                size="lager"
                onClick={redirectLogin}
                isUnderLine={false}
                isPadding={false}
                color="text"
              ></SappButton>
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
