import SAPP_Logo from '@assets/images/sapp_logo.svg'
import { ButtonPrimary } from '@lms/ui'
import { Icon } from '@lms/assets/icons'
import CertificateImg from '@components/layout/ExpandIcon/CertificateImg'
import { ICertificate } from '@pages/certificates/[id]'
import Image from 'next/image'
import React, { useState } from 'react'
import { ClickToCopyButton } from 'src/common/SappCopyLink'
import { LinkedInShareButton } from './ButtonShareLinkedin'
import CertificateCard from './CertificateCard'
import ModalShareToLinkedin from './ModalShareToLinkedin'
import { CopyIcon } from '@assets/icons'

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
  const [openModalShare, setOpenModalShare] = useState(false)
  const onOpenModalShare = () => setOpenModalShare(true)
  const onCloseModalShare = () => setOpenModalShare(false)
  return (
    <CertificateCard
      bodyClassName="2xl:px-[373px] py-[138px] px-[70px] justify-center"
      className=" hidden lg:block"
    >
      <div className="flex h-full items-center gap-12 xl:gap-20">
        <div className="flex h-full w-[55%] items-center justify-center">
          {certificate?.certificate_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={certificate?.certificate_url || ''}
              alt={certificate?.course.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <CertificateImg
              size={800}
              className=" max-w-[500px] border-none text-[#A1A1A1] group-hover:text-primary"
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-12">
          <div
            className="flex w-full cursor-pointer items-end"
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
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-bold text-primary">
                Congratulation!
              </div>
              <div className="text-center">
                <p>Congratulations, you have achieved the</p>
                <p className="font-bold">{certificate?.course?.name}</p>
                <p>issued by {issuedBy}!</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <ButtonPrimary
                size="medium"
                icon={<Icon type="download" />}
                iconPosition="end"
                onClick={onDownload}
                className="!px-[29px]"
              >
                Download
              </ButtonPrimary>
              <LinkedInShareButton
                certificateUrl={certificate?.certificate_url || ''}
                onOpenModalShare={onOpenModalShare}
              />
              <ClickToCopyButton
                className="h-auto"
                link={`${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`}
              >
                <div className="cursor-pointer rounded-full hover:bg-gray-200">
                  <CopyIcon />
                </div>
              </ClickToCopyButton>
            </div>
          </div>
        </div>
      </div>
      {certificate && (
        <ModalShareToLinkedin
          open={openModalShare}
          onClose={onCloseModalShare}
          certificate={certificate}
        />
      )}
    </CertificateCard>
  )
}

export default CertificateVertical
