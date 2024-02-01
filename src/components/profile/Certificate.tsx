import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import { useEffect, useState } from 'react'
import MyProfileAPI from 'src/pages/api/profile'
import PopUpCertificate from './popupCertificate'

const Certificate = () => {
  const [certificateData, setCertificateData] = useState<any>([])
  const [totalCertificateData, setTotalCertificateData] = useState<any>()
  const [modalOpen, setOpenModal] = useState(false)
  const [userDetail, setUserDetail] = useState('')

  const fetchChapterDetail = async () => {
    try {
      const res = await MyProfileAPI.getCertificate(1, 10)
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
    <div>
      <div className="relative">
        <div className="text-xl font-bold border-b pb-5 border-gray-3 mx-6">
          Certificates ({totalCertificateData})
        </div>
        <div className="absolute inset-0 border-b border-gray-3 bottom-0"></div>
      </div>
      <div
        style={{ maxHeight: '478px', overflowY: 'auto', minHeight: '400px' }}
      >
        {certificateData.map((certificate: any, index: any) => {
          return (
            <div key={certificate.id}>
              <div
                className="hover:bg-secondary hover:text-primary group relative flex flex-row gap-2 w-full items-start self-center pt-5 px-6 cursor-pointer min-h-[88px]  border-b border-gray-2"
                onClick={() => {
                  setCertificateDataPopup(certificate)
                  setOpenModal(true)
                }}
              >
                <div className=" flex flex-row justify-center mb-5  items-start bg-gray-4 border border-bottom ">
                  <a className="hover:text-primary group-hover:bg-secondary group-hover:border-active border-solid border px-5 py-1 h-[48px] w-[80px] ">
                    <CertificateImg className="border-none text-gray-1 group-hover:text-primary" />
                  </a>
                </div>

                <div className="relative flex flex-col gap-1 w-full items-start cursor-pointer">
                  <div className="text-base leading-[24px] text-active hover:text-primary font-medium">
                    {certificate.course.name}
                  </div>
                  <div className="text-[13px] leading-[16px] cursor-pointer text-gray-1">
                    <div> Grade Achieved: {certificate.pass_point} %</div>
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
