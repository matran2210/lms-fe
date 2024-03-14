import { LAYOUT } from '@utils/constants'
import { GetServerSideProps } from 'next'
import { PageLink } from 'src/constants'
import InputCodeForm from '../../../components/auth/InputCodeForm'

type IProps = {
  email: string
  token: string
}

const ForgotPasswordRecoverPage = ({ email, token }: IProps) => {
  return (
    <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog">
      <div className="font-semibold text-bw-1 mb-2 text-4xl">
        Forgot Password
      </div>
      <span className="text-medium-sm text-gray-1 mb-10">
        Enter your 6 digits code that you received on your email.
      </span>
      <div className="mt-12">
        <InputCodeForm email={email} token={token} />
      </div>
    </div>
  )
}

export default ForgotPasswordRecoverPage
ForgotPasswordRecoverPage.layout = LAYOUT.SINGLE_DIALOG_LAYOUT

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
