import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import { useEffect, useState } from 'react'
import MyProfileAPI from 'src/pages/api/profile'

const Certificate = () => {
  const [certificateData, setCertificateData] = useState<any>([])

  const fetchChapterDetail = async () => {
    try {
      const res = await MyProfileAPI.getProfile()
      const certificate = res.course_user_certificate_instances
      setCertificateData(certificate)
    } catch (error) {}
  }

  useEffect(() => {
    fetchChapterDetail()
  }, [])
  return (
    <div>
      <div className="relative">
        <div className="text-xl font-bold pb-6 mb-6 text-bw-1">
          Certificates ({certificateData.length})
        </div>
        <div className="absolute inset-0 border-b border-gray-3 bottom-0"></div>
      </div>
      {certificateData.map((certificate: any) => {
        return (
          <div key={certificate.id}>
            <div className="hover:bg-secondary hover:text-primary group relative flex flex-row gap-4 w-full items-start px-6 cursor-pointer">
              <div className=" flex flex-row justify-center mb-5  items-start bg-gray-4 ">
                <a className="hover:text-primary group-hover:border-active border-solid border px-6 py-1 ">
                  <CertificateImg className="" />
                </a>
              </div>
              <div className="relative flex flex-col gap-1 w-full items-start cursor-pointer">
                <div className="text-base leading-[24px] text-active hover:text-primary">
                  {certificate.certificate.name}
                </div>
                <div className="text-xs leading-[16px] cursor-pointer text-gray-1">
                  <div> Grade Achieved: {certificate.pass_point} %</div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Certificate
