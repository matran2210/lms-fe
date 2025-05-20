import React from 'react'
import { Button, Typography } from 'antd'
import CertificateCard from './CertificateCard'
import Image from 'next/image'
import Icon from '@components/icons'
import { ICertificate } from '@pages/certificates/[id]'
import { ClickToCopyButton } from 'src/common/SappCopyLink'

const { Title, Text } = Typography

interface HorizontalCertificateProps {
  certificate?: ICertificate
  issuedBy?: string
  onDownload?: () => void
}

const HorizontalCertificate: React.FC<HorizontalCertificateProps> = ({
  certificate,
  issuedBy = 'SAPP Academy',
  onDownload,
}) => {
  return (
    <CertificateCard bodyClassName="flex justify-center py-14 container mx-auto px-149">
      <div className="flex  h-full max-w-[90%] flex-col items-center gap-10">
        <div
          className="flex cursor-pointer items-end"
          onClick={() => window.open('https://sapp.edu.vn', '_blank')}
        >
          <Icon type="sapp-icon" />
          <Icon type="sapp-logo" />
        </div>
        <div className="flex h-full items-center justify-center">
          {certificate?.certificate_url && (
            <Image
              src={certificate.certificate_url}
              alt={certificate.course.name}
              className="max-h-full max-w-full"
              width={726}
              height={515}
              priority
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-bold text-primary">
                Congratulation!
              </div>
              <div className="text-center ">
                Congratulations, you have achieved the{' '}
                <span className="font-bold">{certificate?.course.name}</span>{' '}
                issued by {issuedBy}!
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                className="!border-none bg-sapp-black-1 px-6 py-3 text-white hover:!border-none hover:!bg-black hover:!text-white"
                icon={<Icon type="download" />}
                iconPosition="end"
                onClick={onDownload}
              >
                Download
              </Button>
              <ClickToCopyButton
                link={`${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`}
              >
                <Button
                  icon={<Icon type="share" />}
                  type="text"
                  className="underline"
                >
                  Share Certificate
                </Button>
              </ClickToCopyButton>
            </div>
          </div>
        </div>
      </div>
    </CertificateCard>
  )
}

export default HorizontalCertificate
