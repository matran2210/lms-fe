import { LAYOUT } from '@utils/constants'
import { GetServerSideProps } from 'next'
import { PageLink } from 'src/constants'
import InputCodeForm from '../../../components/auth/InputCodeForm'
import SingleDialogLayout from '@components/layout/SingleDialog'

type IProps = {
  email: string
  token: string
}

const ForgotPasswordRecoverPage = ({ email, token }: IProps) => {
  return (
    <SingleDialogLayout title="Password Recover">
      <div className="block max-w-[38.375rem] md:py-17.5 py-10 px-8 md:px-19 mx-auto shadow-single-dialog">
        <div className="font-semibold text-bw-1 mb-2 md:text-4xl text-3xl">
          Forgot Password
        </div>
        <span className="text-medium-sm text-gray-1 mb-10">
          Enter your 6 digits code that you received on your email.
        </span>
        <div className="md:mt-12 mt-8">
          <InputCodeForm email={email} token={token} />
        </div>
      </div>
      <span className="text-medium-sm text-gray-1 mb-10">
        Enter your 6 digits code that you received on your email.
      </span>
      <div className="md:mt-12 mt-8">
        <InputCodeForm email={email} token={token} />
      </div>
    </SingleDialogLayout>
  )
}

export default ForgotPasswordRecoverPage

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context,
) => {
  if (!context.query.email || !context.query.token) {
    return {
      redirect: {
        destination: PageLink.AUTH_FORGOT_PASSWORD,
        permanent: false,
      },
    }
  }

  return {
    props: {
      email: context.query.email as string,
      token: context.query.token as string,
    },
  }
}
