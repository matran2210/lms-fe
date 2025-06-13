import React from 'react'
import { Button, Typography } from 'antd'
import CertificateCard from './CertificateCard'
import Image from 'next/image'
import Icon from '@components/icons'
import { ICertificate } from '@pages/certificates/[id]'
import { ClickToCopyButton } from 'src/common/SappCopyLink'
import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import SAPP_Logo from '@assets/images/sapp_logo.svg'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

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
    <CertificateCard
      bodyClassName="flex h-screen justify-center container mx-auto"
      className="lg:hidden"
    >
      <div className="flex max-w-[90%] flex-col items-center gap-10 py-[56px]">
        <div
          className="flex w-full flex-shrink-0 cursor-pointer items-end"
          onClick={() => window.open('https://sapp.edu.vn', '_blank')}
        >
          <div className="mx-auto my-auto block w-1/2 overflow-hidden sm:max-w-[14rem]">
            <Image
              src={SAPP_Logo}
              alt="SAPP Logo"
              priority={true}
              layout="responsive"
            />
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
          {certificate?.certificate_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={certificate?.certificate_url || ''}
              alt={certificate?.course.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <CertificateImg
              size={400}
              className=" max-w-full border-none text-[#A1A1A1] group-hover:text-primary"
            />
          )}
        </div>

        <div className="flex h-[200px] flex-shrink-0 flex-col items-center gap-12">
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
              <ButtonPrimary
                size="medium"
                icon={<Icon type="download" />}
                iconPosition="end"
                onClick={onDownload}
              >
                Download
              </ButtonPrimary>
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
