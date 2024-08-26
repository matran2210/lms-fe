import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import { useEffect, useState } from 'react'
import { AuthAPI } from 'src/pages/api/profile'
import PopUpCertificate from './popupCertificate'
import SappButton from '@components/base/button/SappButton'

interface ICertificate {
  certificate: {
    id: string
    name: string
  }
  certificate_id: string
  certificate_url: string
  class_id: string
  course: {
    id: string
    name: string
  }
  course_id: string
  id: string
  user_id: string
  pass_point: number
}
interface IProp {
  onOpenTab?: () => void
}

const Certificate = ({ onOpenTab }: IProp) => {
  const [certificateData, setCertificateData] = useState<ICertificate[]>([])
  const [totalCertificateData, setTotalCertificateData] = useState<any>()
  const [modalOpen, setOpenModal] = useState(false)
  const [userDetail, setUserDetail] = useState('')

  const fetchChapterDetail = async () => {
    try {
      const res = await AuthAPI.getCertificate(1, 10)
      const certificate = res.data.certificates
      const totalCertificate = res.data.meta.total_records
      const userDetail = res.username
      setTotalCertificateData(totalCertificate)
      setCertificateData(certificate)
      setUserDetail(userDetail)
    } catch (error) {}
  }

  useEffect(() => {
    fetchChapterDetail()
  }, [])
  const [certificateDataPopup, setCertificateDataPopup] = useState<any>()

  return (
    <div className="pt-6">
      <div className="relative">
        <div className="item-center bottom-0 mx-6 flex justify-between border-b border-gray-3 pb-6 lg:block">
          <div className="flex items-center text-xl font-medium">
            <div>Certificates ({totalCertificateData})</div>
          </div>
          <SappButton
            onClick={onOpenTab}
            size="medium"
            title={'Back'}
            color="textUnderline"
            className="-mr-8 block min-w-[120px] text-base lg:hidden"
          ></SappButton>
        </div>
      </div>
      <div>
        {certificateData.map((certificate: ICertificate) => {
          return (
            <div key={certificate?.id}>
              <div
                className="group relative flex min-h-[88px] w-full cursor-pointer flex-row items-start gap-2 self-center border-b border-gray-3 px-6 pt-5  hover:bg-secondary hover:text-primary"
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`,
                    '_blank',
                  )
                }
              >
                <div className=" border-bottom mb-5 flex flex-row  items-start justify-center border bg-gray-4 ">
                  <a className="h-[48px] w-[80px] border border-solid px-5 py-1 hover:text-primary group-hover:border-active group-hover:bg-secondary ">
                    <CertificateImg className="border-none text-gray-1 group-hover:text-primary" />
                  </a>
                </div>

                <div className="relative flex w-full cursor-pointer flex-col items-start gap-1">
                  <div className="text-active text-base font-medium leading-[24px] hover:text-primary">
                    {certificate?.course?.name}
                  </div>
                  <div className="cursor-pointer text-[13px] leading-[16px] text-gray-1">
                    <div> Grade Achieved: {certificate?.pass_point} %</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <PopUpCertificate
        openPreview={modalOpen}
        setOpenModal={setOpenModal}
        data={certificateDataPopup}
        message={''}
        onClose={() => {
          setCertificateDataPopup(null)
          setOpenModal(false)
        }}
        userDetail={userDetail}
      />
    </div>
  )
}

export default Certificate
