import { useLayoutEffect, useState } from 'react'
import PopUpCertificate from './popupCertificate'
import { Divider, Table, TableProps } from 'antd'
import { CertificateImg, Icon, LoadingButtonAnimation } from '@lms/assets'
import { useDownloadImage } from '@lms/hooks'
import { sappFormatDate } from '@lms/utils'
import clsx from 'clsx'
import { HaveNoItemIcon } from '@lms/assets'
import { AuthAPI } from 'src/api/profile'
import { useAppSelector, userReducer } from '@lms/contexts'
import { ImageRenderFromHtml } from '@lms/ui'

interface ICertificate {
  certificate: {
    html_template: string
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
  const { detail } = useAppSelector(userReducer).user
  const { downloadCertificate } = useDownloadImage()
  const [certificateData, setCertificateData] = useState<
    ICertificate[] | undefined
  >(undefined)
  const [modalOpen, setOpenModal] = useState(false)
  const [userDetail, setUserDetail] = useState('')
  const [listLoadingId, setListLoadingId] = useState<string[]>([])

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
  const handleDownload = async (certificate: ICertificate) => {
    if (listLoadingId.includes(certificate.id)) return
    setListLoadingId((prev) => [...prev, certificate.id])
    try {
      await downloadCertificate(
        document.getElementById(
          `teacher-desktop-${certificate?.certificate_id}`,
        ) as HTMLElement,
        certificate?.certificate?.html_template,
        detail?.full_name,
        certificate.certificate.name,
      )
    } catch (error) {
    } finally {
      setListLoadingId((prev) => prev.filter((item) => item !== certificate.id))
    }
  }

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
          {record?.certificate?.html_template ? (
            <ImageRenderFromHtml
              id={`teacher-desktop-${record?.certificate_id}`}
              html={record?.certificate?.html_template}
              previewWidth={80}
              previewHeight={80}
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
      title: 'Grade Achieved',
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
            className={clsx('cursor-pointer', {
              '!cursor-not-allowed opacity-50': listLoadingId.includes(
                record.id,
              ),
            })}
            onClick={() => handleDownload(record)}
          >
            {listLoadingId.includes(record.id) ? (
              <LoadingButtonAnimation />
            ) : (
              <Icon
                type="download"
                className="cursor-pointer text-secondary hover:text-primary"
              />
            )}
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
    <div className="mb-6 mt-0 md:mb-0 md:mt-8 lg:mt-10">
      {certificateData && !certificateData?.length ? (
        <div className="flex min-h-352 flex-col items-center justify-center gap-8">
          <HaveNoItemIcon />
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
        <div className="hidden text-xl font-semibold text-secondary md:block">
          Certificate
        </div>
        {certificateData?.length
          ? certificateData.map((item: ICertificate, index: number) => (
              <CertificateItem
                key={item?.id}
                record={item}
                isLastItem={index === certificateData.length - 1}
                listLoadingId={listLoadingId}
                setListLoadingId={setListLoadingId}
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
  listLoadingId,
  setListLoadingId,
}: {
  record: ICertificate
  isLastItem: boolean
  listLoadingId: string[]
  setListLoadingId: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const { detail } = useAppSelector(userReducer).user
  const { downloadCertificate } = useDownloadImage()
  const handleDownload = async (certificate: ICertificate) => {
    if (listLoadingId.includes(certificate.id)) return
    setListLoadingId((prev) => [...prev, certificate.id])
    try {
      await downloadCertificate(
        document.getElementById(
          `teacher-mobile-${certificate?.certificate_id}`,
        ) as HTMLElement,
        certificate?.certificate?.html_template,
        detail?.full_name,
        certificate.certificate.name,
      )
    } catch (error) {
    } finally {
      setListLoadingId((prev) => prev.filter((item) => item !== certificate.id))
    }
  }
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
        {record?.certificate?.html_template ? (
          <ImageRenderFromHtml
            id={`teacher-mobile-${record?.certificate_id}`}
            html={record.certificate.html_template}
            previewWidth={80}
            previewHeight={80}
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
      <InfoWrapper title="Grade Achieved:" value={`${record?.pass_point}%`} />

      <InfoWrapper
        title="Certificate Received:"
        value={sappFormatDate(record?.received_times, 'DD/MM/YYYY HH:mm')}
      />
      <InfoWrapper
        value={
          <div className="flex items-center justify-center gap-1">
            <div
              className={clsx('cursor-pointer', {
                '!cursor-not-allowed opacity-50': listLoadingId.includes(
                  record.id,
                ),
              })}
              onClick={() => handleDownload(record)}
            >
              {listLoadingId.includes(record.id) ? (
                <LoadingButtonAnimation />
              ) : (
                <Icon
                  type="download"
                  className="cursor-pointer text-secondary hover:text-primary"
                />
              )}
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
    <div className="flex items-center justify-between text-sm md:text-base">
      <div className="font-normal">{title}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  )
}
export default Certificate
