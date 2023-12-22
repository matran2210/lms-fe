import { IProfilePages } from 'src/type/Profile'
import MyProfile from './MyProfile'
import { StaticImageData } from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import Certificate from './Certificate'

interface IProps {
  page: IProfilePages
  className: any
}
const CertificateContent = ({ page, className }: IProps) => {
  return (
    <div className="bg-white p-6 flex-1 shadow-box">
      {page === 'certificates' && (
        <Certificate className={className}></Certificate>
      )}
    </div>
  )
}

export default CertificateContent
