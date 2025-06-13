import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import { useLayoutEffect, useState } from 'react'
import { AuthAPI } from 'src/pages/api/profile'
import PopUpCertificate from './popupCertificate'
import { Divider, Table, TableProps } from 'antd'
import Icon from '@components/icons'
import useDownloadImage from 'src/hooks/useDownloadImage'
import Image from 'next/image'
import { sappFormatDate } from '@utils/index'
import clsx from 'clsx'

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
  received_times: string
}

const Certificate = () => {
  const { downloadImage } = useDownloadImage()
  const [certificateData, setCertificateData] = useState<ICertificate[]>([])
  const [totalCertificateData, setTotalCertificateData] = useState<string>('0')
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

  useLayoutEffect(() => {
    fetchChapterDetail()
  }, [])
  const [certificateDataPopup, setCertificateDataPopup] = useState<any>()

  const columns: TableProps<ICertificate>['columns'] = [
    {
      title: 'Certificate',
      className: 'max-w-sm',
      render: (record) => (
        <div
          className="group flex cursor-pointer items-center gap-2"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
              '_blank',
            )
          }
        >
          {record?.certificate_url ? (
            <Image
              src={record?.certificate_url || ''}
              alt={record?.course?.name || ''}
              className="ratio-16/9 max-h-50 max-w-80 object-contain"
              width={50}
              height={50}
              priority
            />
          ) : (
            <CertificateImg className="border-none text-[#A1A1A1] group-hover:text-primary" />
          )}
          <span className="font-semibold group-hover:text-primary">
            {record?.course?.name}
          </span>
        </div>
      ),
    },
    {
      title: 'Grade Archive',
      align: 'center',
      render: (record) => (
        <div className="text-secondary">{record?.pass_point}%</div>
      ),
    },
    {
      title: 'Certificate Received',
      align: 'center',
      render: (record) => (
        <div className="text-secondary">
          {sappFormatDate(record?.received_times, 'DD/MM/YYYY HH:mm')}
        </div>
      ),
    },
    {
      title: 'Action',
      align: 'center',
      render: (record) => (
        <div className="flex items-center justify-center gap-1">
          <div
            onClick={() =>
              record?.certificate_url && downloadImage(record.certificate_url)
            }
          >
            <Icon
              type="download"
              className="cursor-pointer text-secondary hover:text-primary"
            />
          </div>

          <Divider type="vertical" className="border-black" />
          <div
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
                '_blank',
              )
            }
          >
            <Icon
              type="eye-view"
              className="cursor-pointer text-secondary hover:text-primary"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-8 lg:mt-10">
      <Table<ICertificate>
        className="profile-certificate-table hidden lg:block"
        columns={columns}
        dataSource={certificateData}
      />
      <div className="flex flex-col gap-6 lg:hidden">
        <div className="text-xl font-semibold text-secondary">Certificate</div>
        {certificateData.length
          ? certificateData.map((item: ICertificate, index: number) => (
              <CertificateItem
                key={item?.id}
                record={item}
                isLastItem={index === certificateData.length - 1}
              />
            ))
          : null}
      </div>

      {modalOpen && (
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
      )}
    </div>
  )
}

const CertificateItem = ({
  record,
  isLastItem,
}: {
  record: ICertificate
  isLastItem: boolean
}) => {
  const { downloadImage } = useDownloadImage()

  return (
    <div
      className={clsx('flex flex-col gap-6', {
        'border-b border-b-gray-300 pb-6': !isLastItem,
      })}
    >
      <div
        className="group flex cursor-pointer items-center gap-4"
        onClick={() =>
          window.open(
            `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
            '_blank',
          )
        }
      >
        {record?.certificate_url ? (
          <Image
            src={record?.certificate_url || ''}
            alt={record?.course?.name || ''}
            className="ratio-16/9 max-h-50 max-w-80 object-contain"
            width={80}
            height={80}
            priority
          />
        ) : (
          <CertificateImg className="border-none text-[#A1A1A1] group-hover:text-primary" />
        )}
        <span className="text-lg font-semibold group-hover:text-primary">
          {record?.course?.name}
        </span>
      </div>
      <InfoWrapper title="Grade Archive:" value={`${record?.pass_point}%`} />

      <InfoWrapper
        title="Certificate Received:"
        value={sappFormatDate(record?.received_times, 'DD/MM/YYYY HH:mm')}
      />
      <InfoWrapper
        value={
          <div className="flex items-center justify-center gap-1">
            <div
              onClick={() =>
                record?.certificate_url && downloadImage(record.certificate_url)
              }
            >
              <Icon
                type="download"
                className="cursor-pointer text-secondary hover:text-primary"
              />
            </div>

            <Divider type="vertical" className="border-black" />
            <div
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${record?.id}`,
                  '_blank',
                )
              }
            >
              <Icon
                type="eye-view"
                className="cursor-pointer text-secondary hover:text-primary"
              />
            </div>
          </div>
        }
      />
    </div>
  )
}
const InfoWrapper = ({
  title,
  value,
}: {
  title?: string
  value: React.ReactNode
}) => {
  return (
    <div className="flex items-center justify-between text-base ">
      <div className="font-normal">{title}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  )
}
export default Certificate
