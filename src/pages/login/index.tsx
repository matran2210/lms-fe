import Google_Logo from '@assets/images/google_logo.svg'
import Microsoft_Logo from '@assets/images/microsoft_logo.svg'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  LAYOUT,
  VALIDATE_FILED_MIN_LENGTH,
  VALIDATION_FILED,
} from '@utils/constants'
import Image from 'next/image'
// import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface IInputProps {
  authentication_info: string
  password: string
}

const SocialLogos = [
  { url: Microsoft_Logo, alt: 'Microsoft Logo' },
  { url: Google_Logo, alt: 'Google Logo' },
]

const LoginPage = () => {
  // Validate for input
  const validationSchema = z.object({
    authentication_info: z
      .string({ required_error: VALIDATION_FILED })
      .min(5, { message: VALIDATE_FILED_MIN_LENGTH('Username or Email', 5) }),
    password: z
      .string({ required_error: VALIDATION_FILED })
      .min(8, { message: VALIDATE_FILED_MIN_LENGTH('Password', 8) }),
  })

  // Using validate for input
  const { control, handleSubmit } = useForm<IInputProps>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
  })

  // Call API when submit
  const onSubmit = (data: IInputProps) => {
    return data
  }

  // const [passwordVisible, setPasswordVisible] = useState(false)
  // const toggleChangeType = () => {
  //   setPasswordVisible(!passwordVisible)
  // }

  return (
    <>
      <h1 className="4xl font-bold text-bw-1 mb-2">Log In</h1>
      <h1 className="medium-sm text-gray-1 mb-10">
        Login to Continue Learning
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HookFormTextField
          name="authentication_info"
          control={control}
          placeholder="Username or Email"
          type="text"
          className="mb-6"
        />
        <HookFormTextField
          name="password"
          control={control}
          placeholder="Password"
          type="password"
          className="mb-10"
        />
        <ButtonPrimary title="Log In" full={true} className="py-2.75 mb-6" />
        <div className="flex justify-between mb-15">
          <HookFormCheckBox
            control={control}
            name="remember"
            className="min-w-4 min-h-4 h-4"
            title="Keep me logged in"
            classNameTitle="medium-sm text-gray-1"
          />
          <a
            href="javascript:void(0)"
            className="medium-sm text-gray-1 hover:underline"
          >
            Forgot Password
          </a>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-3 h-12.5">
            {SocialLogos.map((img) => (
              <a href="javascript:void(0)" key={img.url}>
                <Image src={img.url} alt={img.alt} width={50} height={50} />
              </a>
            ))}
          </div>
          <p className="medium-sm text-gray-1">
            Don&#39;t have an account?{' '}
            <a
              href="javascript:void(0)"
              className="medium-sm text-state-info hover:underline"
            >
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
