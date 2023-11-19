import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { PageLink } from 'src/constants'
import AuthApi from 'src/redux/services/Authen'
import { z } from 'zod'

const schema = z.object({
  email: z.string({ required_error: VALIDATE_REQUIRED }).email(),
})
const ForgotPasswordPage = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }: { email: string }) => {
    const response = await AuthApi.sendEmail({ email })
    if (response.success) {
      router.push(
        {
          pathname: `${PageLink.AUTH_FORGOT_PASSWORD}/recover`,
          query: { email: email, token: response.data?.token },
        },
        `${PageLink.AUTH_FORGOT_PASSWORD}/recover`,
      )
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="font-bold text-bw-1 mb-2 text-4xl">Forgot Password</div>
      <span className="medium-sm text-gray-1 mb-10">
        Enter the email you used to create your account so we can send you 6
        digits code to reset your password.
      </span>
      <div className="mt-15">
        <HookFormTextField name="email" control={control}></HookFormTextField>
      </div>
      <ButtonPrimary
        title="Send"
        size="lager"
        type="submit"
        className="w-full mt-12"
      ></ButtonPrimary>
      <div className="mt-8">
        <Link href={PageLink.AUTH_LOGIN} passHref>
          <div className="text-lg font-semibold text-center leading-7 cursor-pointer w-full">
            Back to Login
          </div>
        </Link>
      </div>
    </form>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default ForgotPasswordPage
ForgotPasswordPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
