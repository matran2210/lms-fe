import SAPP_PasswordSuccess from '@assets/images/sapp_password_success.svg'
import SappButton from '@components/base/button/SappButton'
import { LAYOUT } from '@utils/constants'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'

const ChangePasswordSuccess = () => {
  const router = useRouter()
  const redirectLogin = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push(PageLink.AUTH_LOGIN)
  }
  return (
    <div className="d-flex flex-column flex-root sapp-height-layout--login justify-content-center">
      <div className="d-flex flex-column  flex-lg-row justify-content-center">
        <div className="d-flex flex-lg-row-auto justify-content-center justify-content-lg-end">
          <div className="bg-body d-flex flex-column align-items-stretch flex-center">
            <div className="d-flex flex-center flex-column  px-lg-10">
              {/* Start Form Login */}
              <div className="block max-w-[38.375rem] py-17.5 px-19 mx-auto shadow-single-dialog">
                <div className="swal2-icon swal2-success swal2-icon-show d-flex mb-6 text-center">
                  <Image
                    src={SAPP_PasswordSuccess}
                    alt="SAPP Logo"
                    width={164}
                    height={164}
                    priority={true}
                  />
                </div>
                <div className="text-center mb-16">
                  <h1 className="text-bw-1 fw-bolder font-semibold mb-4 text-4xl">
                    Successfully
                  </h1>
                  <div className="text-gray-1 text-medium-sm font-normal not-italic">
                    Your password has been reset successfully
                  </div>
                </div>

                {/* Start Button Login */}
                <div className="d-grid">
                  <SappButton
                    size="medium"
                    full
                    title="Login"
                    onClick={redirectLogin}
                  />
                </div>
                {/* End Button Login */}
              </div>
              {/* End Form Login */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordSuccess
ChangePasswordSuccess.layout = LAYOUT.SINGLE_DIALOG_LAYOUT
