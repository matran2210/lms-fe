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
  const [certificateData, setCertificateData] = useState<
    ICertificate[] | undefined
  >(undefined)
  const [modalOpen, setOpenModal] = useState(false)
  const [userDetail, setUserDetail] = useState('')

  const fetchChapterDetail = async () => {
    try {
      const res = await AuthAPI.getCertificate(1, 10)
      const certificate = res.data.certificates
      const userDetail = res.username
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
        <div className="text-secondary-500">{record?.pass_point}%</div>
      ),
    },
    {
      title: 'Certificate Received',
      align: 'center',
      render: (record) => (
        <div className="text-secondary-500">
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
              className="cursor-pointer text-secondary-500 hover:text-primary"
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
              className="cursor-pointer text-secondary-500 hover:text-primary"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="mb-6 mt-0 md:mb-0 md:mt-8 lg:mt-10">
      {certificateData && !certificateData?.length ? (
        <div className="flex min-h-352 flex-col items-center justify-center gap-8">
          <svg
            width="185"
            height="185"
            viewBox="0 0 185 185"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_4398_26737)">
              <rect
                x="20"
                y="33.646"
                width="125.551"
                height="125.55"
                rx="19.6025"
                fill="white"
              />
              <rect
                x="32.5801"
                y="46.13"
                width="100.428"
                height="9.56452"
                rx="4.78226"
                fill="#F3F4F6"
              />
            </g>
            <rect
              x="32.5801"
              y="64.576"
              width="90.8634"
              height="9.56452"
              rx="4.78226"
              fill="#F6F6F6"
            />
            <rect
              x="32.2705"
              y="82.8518"
              width="52.6051"
              height="9.56452"
              rx="4.78226"
              fill="#F6F6F6"
            />
            <rect
              x="32.2974"
              y="101.469"
              width="52.6051"
              height="43.0403"
              rx="7"
              fill="#F6F6F6"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M128.936 126.006C133.712 122.438 136.798 116.785 136.798 110.42C136.798 99.6281 127.927 90.8799 116.985 90.8799C106.043 90.8799 97.1731 99.6281 97.1731 110.42C97.1731 117.06 100.531 122.926 105.664 126.457V136.318C105.664 138.61 108.13 140.055 110.129 138.936L117.3 134.922L124.47 138.936C126.47 140.055 128.936 138.61 128.936 136.318V126.006Z"
              fill="#E5E7EB"
            />
            <g filter="url(#filter1_d_4398_26737)">
              <rect
                x="110.463"
                y="18.8037"
                width="49.5369"
                height="49.5367"
                rx="12.0848"
                fill="white"
              />
              <path
                d="M138.418 36.696C137.742 35.376 136.68 34.716 135.232 34.716C133.783 34.716 132.709 35.376 132.009 36.696C131.333 38.016 130.995 40.308 130.995 43.572C130.995 46.836 131.333 49.128 132.009 50.448C132.709 51.768 133.783 52.428 135.232 52.428C136.68 52.428 137.742 51.768 138.418 50.448C139.118 49.128 139.468 46.836 139.468 43.572C139.468 40.308 139.118 38.016 138.418 36.696ZM143.125 53.904C141.411 56.016 138.78 57.072 135.232 57.072C131.683 57.072 129.04 56.016 127.302 53.904C125.589 51.792 124.732 48.348 124.732 43.572C124.732 38.796 125.589 35.352 127.302 33.24C129.04 31.128 131.683 30.072 135.232 30.072C138.78 30.072 141.411 31.128 143.125 33.24C144.863 35.352 145.732 38.796 145.732 43.572C145.732 48.348 144.863 51.792 143.125 53.904Z"
                fill="#E5E7EB"
              />
            </g>
            <ellipse
              cx="116.985"
              cy="110.179"
              rx="12.9805"
              ry="12.9804"
              fill="#FEFEFE"
            />
            <defs>
              <filter
                id="filter0_d_4398_26737"
                x="0"
                y="18.646"
                width="165.551"
                height="165.55"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="5" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_4398_26737"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_4398_26737"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_4398_26737"
                x="86.2935"
                y="0.676461"
                width="97.8762"
                height="97.8761"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="6.04242" />
                <feGaussianBlur stdDeviation="12.0848" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_4398_26737"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_4398_26737"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <div className="text-xl text-txt-secondary">
            You don&rsquo;t have any certificate!
          </div>
        </div>
      ) : null}
      {certificateData?.length ? (
        <Table<ICertificate>
          className="profile-certificate-table hidden lg:block"
          columns={columns}
          dataSource={certificateData}
        />
      ) : null}

      <div className="flex flex-col gap-4 md:gap-6 lg:hidden">
        <div className="hidden text-xl font-semibold text-secondary-500 md:block">
          Certificate
        </div>
        {certificateData?.length
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
      className={clsx(
        'flex flex-col gap-4 rounded-xl bg-white p-4 shadow-small md:gap-6 md:rounded-none md:bg-transparent md:p-0 md:shadow-none',
        {
          'md:border-b md:border-b-gray-300 md:pb-6': !isLastItem,
        },
      )}
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
          <CertificateImg
            size={80}
            className="border-none text-[#A1A1A1] group-hover:text-primary"
          />
        )}
        <span className="text-base font-medium group-hover:text-primary md:text-lg md:font-semibold">
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
                className="cursor-pointer text-secondary-500 hover:text-primary"
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
                className="cursor-pointer text-secondary-500 hover:text-primary"
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
    <div className="flex items-center justify-between text-sm md:text-base">
      <div className="font-normal">{title}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  )
}
export default Certificate
