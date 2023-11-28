import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { LAYOUT } from '@utils/constants'
import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
import { display422Errors } from '@utils/helpers/form'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { PageLink } from 'src/constants'
import AuthApi from 'src/redux/services/Authen'
import { z } from 'zod'

const schema = z.object({
  email: z
    .string({ required_error: VALIDATE_REQUIRED })
    .email()
    .refine((e) => e),
})
const ForgotPasswordPage = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      const response = await AuthApi.sendEmail({ email })
      if (response.success) {
        router.push(
          {
            pathname: `${PageLink.AUTH_FORGOT_PASSWORD_RECOVER}`,
            query: { email: email, token: response.data?.token },
          },
          `${PageLink.AUTH_FORGOT_PASSWORD_RECOVER}`,
        )
      }
    } catch (error: any) {
      display422Errors(error, setError)
    }
  }

  return (
    <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="font-bold text-bw-1 mb-2 text-4xl">Forgot Password</div>
        <span className="medium-sm text-gray-1 mb-10">
          Enter the email you used to create your account so we can send you 6
          digits code to reset your password.
        </span>
        <div className="mt-15">
          <HookFormTextField name="email" control={control}></HookFormTextField>
        </div>
        {!Object.values(errors)?.[0] && <div className="mt-[21px]"></div>}
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
    </div>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default ForgotPasswordPage
ForgotPasswordPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
