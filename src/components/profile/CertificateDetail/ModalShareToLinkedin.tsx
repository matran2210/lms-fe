import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormCheckBox from '@components/base/checkbox/HookFormCheckBox'
import SappModalV3 from '@components/base/modal/SappModalV3'
import HookFormTextAreaV2 from '@components/base/textfield/HookFormTextAreaV2'
import { getPersonURN, uploadImageToLinkedIn } from '@pages/api/certificate'
import { ICertificate } from '@pages/certificates/[id]'
import { Image } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface IProps {
  open: boolean
  onClose: () => void
  certificate?: ICertificate
}
interface IForm {
  shareToFeed: boolean
  addToProfile: boolean
  text?: string
}
const ModalShareToLinkedin = ({ open, onClose, certificate }: IProps) => {
  const [loading, setLoading] = useState(false)
  const certId = certificate?.id || ''
  const certURL = certificate?.certificate_url || ''
  const form = useForm<IForm>({
    defaultValues: {
      shareToFeed: true,
      addToProfile: true,
    },
  })
  const onResetForm = () => {
    form.reset({
      shareToFeed: true,
      addToProfile: true,
    })
  }

  const handleClose = () => {
    onResetForm()
    onClose()
  }
  const onSubmit = async (data: IForm) => {
    const shareUrl = encodeURIComponent(certURL)
    if (data.addToProfile && data.shareToFeed) {
    }
    // share to feed
    if (data.shareToFeed && !data.addToProfile) {
      const token = sessionStorage.getItem('linkedin_access_token')
      const personURN = sessionStorage.getItem('urn')

      if (!token || !personURN) {
        // Chưa có token → mở popup login LinkedIn
        const popup = window.open(
          `/api/auth/linkedin?popup=true&shareUrl=${encodeURIComponent(shareUrl)}&certId=${encodeURIComponent(certId)}`,
          'LinkedInPopup',
          'width=600,height=600',
        )

        // Lắng nghe message từ popup khi login xong
        window.addEventListener('message', async (event) => {
          if (event.origin !== window.location.origin) return

          if (event.data.type === 'LINKEDIN_TOKEN') {
            sessionStorage.setItem('linkedin_access_token', event.data.token)
            sessionStorage.setItem('urn', event.data.personURN)

            popup?.close()
            const personURN = event.data.personURN
            if (!personURN) {
              toast.error('Không lấy được URN')
              return
            }
            setLoading(true)
            // Gọi luôn hàm upload sau khi login
            const res = await uploadImageToLinkedIn(
              event.data.token,
              personURN,
              shareUrl,
              data.text || '',
            )
            setLoading(false)
            if (res && res?.data?.success) {
              toast.success(res?.data?.message)
              handleClose()
            } else {
              toast.error(res?.data?.message)
            }
          }
        })
      } else {
        // Có sẵn token rồi → gọi upload luôn
        const personURN = sessionStorage.getItem('urn')
        if (!personURN) {
          toast.error('Không lấy được URN')
          return
        }
        setLoading(true)
        const res = await uploadImageToLinkedIn(
          token,
          personURN,
          shareUrl,
          data.text || '',
        )
        setLoading(false)
        if (res && res?.data?.success) {
          toast.success(res?.data?.message)
          handleClose()
        } else {
          toast.error(res?.data?.message)
        }
      }
    }
    if (data.addToProfile && !data.shareToFeed) {
      // add to profile
      const linkedInUrl =
        `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
        `&name=${encodeURIComponent(certificate?.course.name || '')}` +
        `&organizationName=${encodeURIComponent('SAPP Academy')}` +
        `&issueYear=${dayjs().year()}` +
        `&issueMonth=${dayjs().month() + 1}` +
        `&certUrl=${encodeURIComponent(certURL)}` +
        `&certId=${encodeURIComponent(certificate?.id || '')}`

      window.open(linkedInUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <SappModalV3
      open={open}
      onOk={() => {}}
      handleCancel={handleClose}
      isClosable
      showFooter={false}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="text-3xl font-bold">Share with Linkedin</div>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-3">
            <HookFormCheckBox
              control={form.control}
              name="shareToFeed"
              title="Share to your Feed"
              classNameTitle="text-gray-800 font-semibold"
            />
            <div className="flex items-center gap-5 rounded-lg border border-gray-300 p-4">
              {certificate?.certificate_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <Image
                  src={certURL}
                  alt={certificate?.course.name}
                  className="max-h-[125px] max-w-[80px] object-contain"
                  //   width={80}
                  //   height={125}
                />
              )}
              <HookFormTextAreaV2
                className="h-full flex-1"
                control={form.control}
                variant="borderless"
                name="text"
                placeholder="Say something about this..."
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </div>
          </div>
          <div>
            <HookFormCheckBox
              control={form.control}
              name="addToProfile"
              title="Add to your Profile"
              classNameTitle="text-gray-800 font-semibold"
            />
          </div>
        </div>
        <div className="w-full">
          <ButtonPrimary
            loading={loading}
            full
            size="medium"
            onClick={form.handleSubmit(onSubmit)}
          >
            Share to Linkedin
          </ButtonPrimary>
        </div>
      </div>
    </SappModalV3>
  )
}

export default ModalShareToLinkedin
