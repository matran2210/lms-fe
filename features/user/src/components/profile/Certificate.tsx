import React from 'react';
import { useLayoutEffect, useState } from 'react'
import { Divider, Table, TableProps } from 'antd'
import { CertificateImg, Icon, NoCertificationIcon } from '@lms/assets'
import {useDownloadImage} from '@lms/hooks'

import Image from 'next/image'
import { sappFormatDate } from '@lms/utils'
import clsx from 'clsx'
import { useFeature } from '@lms/contexts';
import PopUpCertificate from './popupCertificate/PopupCertificare';

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
  const {authApi} = useFeature()
  const { downloadImage } = useDownloadImage()
  const [certificateData, setCertificateData] = useState<
    ICertificate[] | undefined
  >(undefined)
  const [modalOpen, setOpenModal] = useState(false)
  const [userDetail, setUserDetail] = useState('')

  const fetchChapterDetail = async () => {
    try {
      const res = await authApi.getCertificate(1, 30)
      const certificate = res.data.certificates
      const userDetail = res.username
      setCertificateData(certificate)
      setUserDetail(userDetail)
    } catch (error) {}
  }

  useLayoutEffect(() => {
    fetchChapterDetail()
  }, [])
  const [certificateDataPopup, setCertificateDataPopup] = useState<unknown>()

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
          <span className="text-base font-medium group-hover:text-primary">
            {record?.course?.name}
          </span>
        </div>
      ),
    },
    {
      title: 'Grade Achieved',
      align: 'center',
      render: (record) => (
        <div className="text-base text-secondary">{record?.pass_point ? `${record?.pass_point}%` : "-"}</div>
      ),
    },
    {
      title: 'Certificate Received',
      align: 'center',
      render: (record) => (
        <div className="text-base text-secondary">
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
    <div className="mb-6 mt-0 md:mb-0 md:mt-8 lg:mt-10">
      {certificateData && !certificateData?.length ? (
        <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-2 md:min-h-352">
          <NoCertificationIcon />
          <div className="text-small text-gray-400">
            You don&rsquo;t have any certificate!
          </div>
        </div>
      ) : null}
      {certificateData?.length ? (
        <Table<ICertificate>
          className="profile-certificate-table hidden lg:block"
          columns={columns}
          dataSource={certificateData}
          pagination={false}
        />
      ) : null}

      <div className="flex flex-col gap-4 md:gap-6 lg:hidden">
        {certificateData?.length ? (
          <div className="hidden text-xl font-semibold text-secondary md:block">
            Certificate
          </div>
        ) : null}
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
        'flex flex-col gap-3 rounded-xl bg-white p-4 shadow-small md:gap-6 md:rounded-none md:bg-transparent md:p-0 md:shadow-none',
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
      <InfoWrapper title="Grade Achieved:" value={`${record?.pass_point}%`} />

      <InfoWrapper
        title="Certificate Received:"
        value={sappFormatDate(record?.received_times, 'DD/MM/YYYY HH:mm')}
      />
      <InfoWrapper
        value={
          <div className="flex items-center justify-center gap-[11px]">
            <div
              onClick={() =>
                record?.certificate_url && downloadImage(record.certificate_url)
              }
            >
              <Icon
                type="download"
                className="cursor-pointer !text-icon hover:text-primary"
              />
            </div>

            <Divider type="vertical" className="!mx-0 bg-icon" />
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
                className="cursor-pointer !text-icon hover:text-primary"
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
