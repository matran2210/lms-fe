import Google_Logo from '@assets/images/google_logo.svg'
import Microsoft_Logo from '@assets/images/microsoft_logo.svg'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
import Image from 'next/image'
// import { useState } from 'react'
import SappButton from '@components/base/button/SappButton'
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
import { getLoginUser, loginReducer } from '../../../redux/slice/Login/Login'
import toast from 'react-hot-toast'

interface IInputProps {
  username: string
  password: string
  remember_me: boolean
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
    remember_me: z.boolean().default(false),
  })

  // Using validate for input
  const { control, handleSubmit } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      remember_me: false,
    },
  })

  // Call API when submit
  const onSubmit = async (data: IInputProps) => {
    const { username, password, remember_me } = data
    try {
      await dispatch(
        getLoginUser({
          username,
          password,
          remember_me: remember_me ? remember_me : false,
        }),
      ).unwrap()

      router.push('/')
    } catch (error) {}
  }
  const socialLogin = () => {
    toast.error('Chức năng này sẽ được update vào version sau!')
  }
  return (
    <>
      <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog">
        <div className="text-4xl font-bold text-bw-1 mb-2">Log In</div>
        <div className="text-medium-sm text-gray-1 mb-10">
          Login to Continue Learning
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <HookFormTextField
            name="username"
            control={control}
            placeholder="Username or Email"
            type="text"
            textSize="sm"
          />
          <HookFormTextField
            name="password"
            control={control}
            placeholder="Password"
            type="password"
            className="mt-6"
            textSize="sm"
          />
          <div className="mt-10">
            <SappButton
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
              name="remember_me"
              className="min-w-4 min-h-4 h-4"
              title="Keep me logged in"
              classNameTitle="text-medium-sm text-gray-1"
            />
            <span className="text-medium-sm text-gray-1 hover:underline">
              <Link href={PageLink.AUTH_FORGOT_PASSWORD}>Forgot Password</Link>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-3 h-12.5">
              {SocialLogos.map((img, i) => (
                <a key={i} onClick={socialLogin}>
                  <Image src={img.url} alt={img.alt} width={50} height={50} />
                </a>
              ))}
            </div>
            <p className="text-medium-sm text-gray-1">
              Don&#39;t have an account?{' '}
              <a className="text-medium-sm text-state-info hover:underline">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default LoginPage
LoginPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
