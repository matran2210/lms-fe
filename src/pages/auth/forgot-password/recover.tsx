// import { GetServerSideProps } from 'next'
// import { PageLink } from 'src/constants'
// import InputCodeForm from '../../../components/auth/InputCodeForm'
// import SingleDialogLayout from '@components/layout/SingleDialog'

// type IProps = {
//   email: string
//   token: string
// }

// const ForgotPasswordRecoverPage = ({ email, token }: IProps) => {
//   return (
//     <SingleDialogLayout title="Password Recover">
//       <div className="mx-auto block max-w-[38.375rem] px-8 py-10 shadow-single-dialog md:px-19 md:py-17.5">
//         <div className="mb-2 text-3xl font-semibold text-bw-1 md:text-4xl">
//           Forgot Password
//         </div>
//         <span className="mb-10 text-medium-sm text-gray-1">
//           Enter your 6 digits code that you received on your email.
//         </span>
//         <div className="mt-8 md:mt-12">
//           <InputCodeForm email={email} token={token} />
//         </div>
//       </div>
//     </SingleDialogLayout>
//   )
// }

// export default ForgotPasswordRecoverPage

// export const getServerSideProps: GetServerSideProps<IProps> = async (
//   context,
// ) => {
//   if (!context.query.email || !context.query.token) {
//     return {
//       redirect: {
//         destination: PageLink.AUTH_FORGOT_PASSWORD,
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {
//       email: context.query.email as string,
//       token: context.query.token as string,
//     },
//   }
// }
