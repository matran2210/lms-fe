// import SappButton from '@components/base/button/SappButton'
// import HookFormTextField from '@components/base/textfield/HookFormTextField'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { LAYOUT } from '@utils/constants'
// import { VALIDATE_REQUIRED } from '@utils/helpers/ValidateMessage'
// import { display422Errors } from '@utils/helpers/form'
// import { useRouter } from 'next/router'
// import { useForm } from 'react-hook-form'
// import { PageLink } from 'src/constants'
// import { z } from 'zod'
// import { AuthAPI } from '../../api/profile/index'
// import { removeJwtToken } from '@utils/index'
// import SingleDialogLayout from '@components/layout/SingleDialog'

import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'

// const schema = z.object({
//   email: z
//     .string({ required_error: VALIDATE_REQUIRED })
//     .trim()
//     .email()
//     .refine((e) => e),
// })
const ForgotPasswordPage = () => {
  const router = useRouter()
  router.push(PageLink.COURSES)
}
//   const router = useRouter()
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<{ email: string }>({
//     resolver: zodResolver(schema),
//   })

//   const onSubmit = async ({ email }: { email: string }) => {
//     try {
//       const response = await AuthAPI.sendEmail({ email })
//       if (response.success) {
//         router.push(
//           {
//             pathname: `${PageLink.AUTH_FORGOT_PASSWORD_RECOVER}`,
//             query: { email: email, token: response.data?.token },
//           },
//           `${PageLink.AUTH_FORGOT_PASSWORD_RECOVER}`,
//         )
//       }
//     } catch (error: any) {
//       display422Errors(error, setError)
//     }
//   }
//   const redirectLogin = () => {
//     removeJwtToken()
//     router.push(PageLink.AUTH_LOGIN)
//   }

//   return (
//     <SingleDialogLayout title="Forgot Password">
//       <div className="mx-auto block max-w-[38.375rem] px-8 py-10 shadow-single-dialog md:px-19 md:py-17.5">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="mb-2 text-3xl font-semibold text-bw-1 md:text-4xl">
//             Forgot Password
//           </div>
//           <span className="mb-10 text-medium-sm text-gray-1">
//             Enter the email you used to create your account so we can send you 6
//             digits code to reset your password.
//           </span>
//           <div className="mt-8 md:mt-15">
//             <HookFormTextField
//               name="email"
//               control={control}
//               textSize="sm"
//               placeholder="Email"
//             ></HookFormTextField>
//           </div>
//           {!Object.values(errors)?.[0] && <div className="mt-[21px]"></div>}
//           <SappButton
//             title="Send"
//             size="lager"
//             type="submit"
//             className="mt-[27px] w-full !font-semibold"
//           />
//           <div className="mt-8">
//             <SappButton
//               title="Back to Login"
//               size="lager"
//               type="submit"
//               className="w-full !font-semibold"
//               color="text"
//               isUnderLine={false}
//               isPadding={false}
//               onClick={redirectLogin}
//             ></SappButton>
//           </div>
//         </form>
//       </div>
//     </SingleDialogLayout>
//   )
// }

// // eslint-disable-next-line import/no-unused-modules
export default ForgotPasswordPage
// ForgotPasswordPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
