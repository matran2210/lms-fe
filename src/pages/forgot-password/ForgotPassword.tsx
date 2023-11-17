import { LAYOUT } from '@utils/constants'
// import Link from 'next/link'
import InputCodeForm from './InputCodeForm'

const ForgotPasswordPage = () => {
  return (
    <>
      <h1 className="4xl font-bold text-bw-1 mb-2">Forgot Password</h1>
      <h1 className="medium-sm text-gray-1 mb-10">
        Enter your 6 digits code that you received on your email.
      </h1>
      <InputCodeForm />
    </>
  )
}

// eslint-disable-next-line import/no-unused-modules
export default ForgotPasswordPage
ForgotPasswordPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
