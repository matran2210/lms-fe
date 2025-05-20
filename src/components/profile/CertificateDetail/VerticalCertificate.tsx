import React from 'react'
import { Button } from 'antd'
import CertificateCard from './CertificateCard'
import Image from 'next/image'
import Icon from '@components/icons'
import { ClickToCopyButton } from 'src/common/SappCopyLink'
import { ICertificate } from '@pages/certificates/[id]'

interface CertificateVerticalProps {
  certificate?: ICertificate
  issuedBy?: string
  onDownload?: () => void
}

const CertificateVertical: React.FC<CertificateVerticalProps> = ({
  certificate,
  issuedBy = 'SAPP Academy',
  onDownload,
}) => {
  return (
    <CertificateCard bodyClassName="px-93.25 py-34.5">
      <div className="flex h-full items-center justify-between gap-20">
        <div className="flex h-full max-w-45% items-center justify-center">
          {certificate?.certificate_url && (
            <Image
              src={certificate.certificate_url}
              alt={certificate.course.name}
              className="max-h-full max-w-full"
              width={573}
              height={805}
              priority
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-12">
          <div
            className="flex cursor-pointer items-end"
            onClick={() => window.open('https://sapp.edu.vn', '_blank')}
          >
            <Icon type="sapp-icon" />
            <Icon type="sapp-logo" />
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-bold text-primary">
                Congratulation!
              </div>
              <div className="text-center">
                <p>Congratulations, you have achieved the</p>
                <p className="font-bold">{certificate?.course.name}</p>
                <p>issued by {issuedBy}!</p>
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

export default CertificateVertical
