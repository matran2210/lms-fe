import Google_Logo from '@assets/images/google_logo.svg'
import Microsoft_Logo from '@assets/images/microsoft_logo.svg'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
import Image from 'next/image'
// import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { getLoginUser, loginReducer } from '../../../redux/slice/Login/Login'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'
import {
  VALIDATE_MIN,
  VALIDATE_MIN_LENGTH,
  VALIDATE_PASSWORD_REGEX_MSG,
  VALIDATE_REQUIRED,
} from '@utils/helpers/ValidateMessage'
import { VALIDATE_PASSWORD } from '@utils/constants/ValidateRegex'

interface IInputProps {
  username: string
  password: string
}

const SocialLogos = [
  { url: Microsoft_Logo, alt: 'Microsoft Logo' },
  { url: Google_Logo, alt: 'Google Logo' },
]

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userLogin = useAppSelector(loginReducer)
  // Validate for input
  const validationSchema = z.object({
    username: z
      .string({ required_error: VALIDATE_REQUIRED })
      .min(5, { message: VALIDATE_MIN_LENGTH('Username or Email', 5) }),
    password: z
      .string({ required_error: VALIDATE_REQUIRED })
      .min(8, { message: VALIDATE_MIN_LENGTH('Password', 8) })
      .regex(VALIDATE_PASSWORD, VALIDATE_PASSWORD_REGEX_MSG),
  })

  // Using validate for input
  const { control, handleSubmit } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
  })

  // Call API when submit
  const onSubmit = async (data: IInputProps) => {
    const { username, password } = data
    try {
      await dispatch(
        getLoginUser({
          username,
          password,
        }),
      ).unwrap()

      router.push('/')
    } catch (error) {}
  }

  return (
    <>
      <div className="text-4xl font-bold text-bw-1 mb-2">Log In</div>
      <div className="medium-sm text-gray-1 mb-10">
        Login to Continue Learning
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HookFormTextField
          name="username"
          control={control}
          placeholder="Username or Email"
          type="text"
        />
        <HookFormTextField
          name="password"
          control={control}
          placeholder="Password"
          type="password"
          className="mt-6"
        />
        <div className="mt-10">
          <ButtonPrimary
            title="Log In"
            full={true}
            className="mb-6"
            size="lager"
            loading={userLogin.loading}
            type="submit"
          />
        </div>
        <div className="flex justify-between mb-15">
          <HookFormCheckBox
            control={control}
            name="remember"
            className="min-w-4 min-h-4 h-4"
            title="Keep me logged in"
            classNameTitle="medium-sm text-gray-1"
          />
          <span className="medium-sm text-gray-1 hover:underline">
            <Link href={PageLink.AUTH_FORGOT_PASSWORD}>Forgot Password</Link>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-3 h-12.5">
            {SocialLogos.map((img, i) => (
              <a key={i}>
                <Image src={img.url} alt={img.alt} width={50} height={50} />
              </a>
            ))}
          </div>
          <p className="medium-sm text-gray-1">
            Don&#39;t have an account?{' '}
            <a className="medium-sm text-state-info hover:underline">
              Register
            </a>
          </p>
        </div>
      </form>
    </>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default LoginPage
LoginPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
