import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MyProfileAPI from 'src/pages/api/profile'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  className: any
}
const Certificate = ({ className }: IProps) => {
  const [certificateData, setCertificateData] = useState<any>([])

  const { id } = useParams()

  const fetchChapterDetail = async (userId: any) => {
    try {
      const res = await MyProfileAPI.getProfile(userId)
      const certificate = res.course_user_certificate_instances
      setCertificateData(certificate)
    } catch (error) {}
  }

  useEffect(() => {
    fetchChapterDetail(id)
  }, [id])
  return (
    <div>
      {certificateData.map((idx: number) => {
        ;<div className={className}>
          <div className="hover:bg-secondary hover:text-primary relative flex flex-row gap-4 w-full items-start px-6 cursor-pointer">
            <div className=" flex flex-row justify-center mb-5 w-20 items-start pt-4">
              <a className="hover:text-primary hover:border-active border-solid border px-6 py-1 ">
                <CertificateImg className="" />
              </a>
            </div>
            <div className="relative flex flex-col gap-1 w-full items-start cursor-pointer pt-4">
              <div className="font-medium leading-[24px] text-active hover:text-primary">
                {certificateData[idx]}
              </div>
              <div className="text-xs leading-[16px] cursor-pointer text-gray-1">
                <a>Grade Achieved: 94.03%</a>
              </div>
            </div>
          </div>
        </div>
      })}
    </div>
  )
}

export default Certificate
