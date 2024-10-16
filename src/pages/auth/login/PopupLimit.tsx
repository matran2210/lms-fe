// import { AlertIcon } from '@assets/icons'
// import SappModalV2 from '@components/base/modal/SappModalV2'
// import { Dispatch, SetStateAction, useEffect } from 'react'
// import { MY_COURSES } from 'src/constants/lang'
// import { useAppDispatch } from 'src/redux/hook'

import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'

// interface IProps {
//   open: boolean
//   setOpen: Dispatch<SetStateAction<boolean>>
//   handleAction?: () => void
// }

const PopUpLimit = () => {
  const router = useRouter()
  router.push(PageLink.PAGE_NOT_FOUND)
}
//   const dispatch = useAppDispatch()
//   // const {} = useAppSelector()
//   //to do: call api to get datail
//   const getData = useEffect(() => {
//     //dispatch(getDetailTest)
//   }, [])

//   const onOk = () => {
//     setOpen(false)
//     handleAction && handleAction()
//   }
//   return (
//     <SappModalV2
//       open={open}
//       okButtonCaption="Back to Login"
//       onOk={onOk}
//       showCancelButton={false}
//       showHeader={false}
//       size="max-w-[646px]"
//       footerButtonClassName="flex flex-col-reverse gap-6"
//       childClass="flex flex-col justify-center items-center"
//       parentChildClass=""
//       position="center"
//       fullWidthBtn={true}
//       closeAfterSubmit={true}
//       buttonSize="extra"
//       title={undefined}
//       handleCancel={() => {
//         setOpen(false)
//         handleAction && handleAction()
//       }}
//     >
//       <div className="flex justify-center">
//         <div
//           className="rounded-full bg-secondary p-8"
//           style={{ width: 'fit-content' }}
//         >
//           <AlertIcon />
//         </div>
//       </div>
//       <div className="mt-6 flex justify-center text-4xl font-semibold text-bw-1">
//         Access Limits
//       </div>
//       <div className="mb-7 mt-4 text-center text-medium-sm font-normal text-gray-1">
//         You can only access a maximum of 3 browsers, please contact our support
//         at {MY_COURSES.hotline}.
//       </div>
//     </SappModalV2>
//   )
// }

export default PopUpLimit
