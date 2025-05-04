// import SAPP_PasswordSuccess from '@assets/images/sapp_password_success.svg'
// import SappButton from '@components/base/button/SappButton'
// import Image from 'next/image'
// import { useRouter } from 'next/router'
// import { PageLink } from 'src/constants'
// import { removeJwtToken, removeLocalStorageJwtToken } from '@utils/index'
// import SingleDialogLayout from '@components/layout/SingleDialog'
// import { getkeyCloakInstance } from '@utils/helpers/keycloak'

import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'

const ChangePasswordSuccess = () => {
  const router = useRouter()
  router.push(PageLink.COURSES)
}
//   const router = useRouter()

//   const redirectLogin = () => {
//     removeJwtToken()
//     removeLocalStorageJwtToken()
//     const keycloak = getkeyCloakInstance()
//     keycloak.logout({ redirectUri: window.location.origin })
//   }

//   return (
//     <SingleDialogLayout title="Change Password Successfully">
//       <div className="d-flex flex-column flex-root sapp-height-layout--login justify-content-center">
//         <div className="d-flex flex-column  flex-lg-row justify-content-center">
//           <div className="d-flex flex-lg-row-auto justify-content-center justify-content-lg-end">
//             <div className="bg-body d-flex flex-column align-items-stretch flex-center">
//               <div className="px-lg-10  w-3/4">
//                 {/* Start Form Login */}
//                 <div className="mx-auto block max-w-[38.375rem] px-19 py-17.5 shadow-single-dialog">
//                   <div className="swal2-icon swal2-success swal2-icon-show d-flex mb-6 text-center">
//                     <Image
//                       src={SAPP_PasswordSuccess}
//                       alt="SAPP Logo"
//                       width={164}
//                       height={164}
//                       priority={true}
//                     />
//                   </div>
//                   <div className="mb-16 text-center">
//                     <h1 className="fw-bolder mb-4 text-4xl font-semibold text-bw-1">
//                       Successfully
//                     </h1>
//                     <div className="text-medium-sm font-normal not-italic text-gray-1">
//                       Your password has been reset successfully
//                     </div>
//                   </div>

//                   {/* Start Button Login */}
//                   <div className="d-grid">
//                     <SappButton
//                       size="lager"
//                       full
//                       title="Login"
//                       onClick={redirectLogin}
//                     />
//                   </div>
//                   {/* End Button Login */}
//                 </div>
//                 {/* End Form Login */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </SingleDialogLayout>
//   )
// }

export default ChangePasswordSuccess
