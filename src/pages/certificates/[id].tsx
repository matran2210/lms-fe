import { IconDownload, ShareLinkIcon } from '@assets/icons'
import SappButtonIcon from '@components/base/button/SappButtonIcon'
import SinglePageLayout from '@components/layout/SinglePage'
import { LAYOUT } from '@utils/constants'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { ClickToCopyButton } from 'src/common/SappCopyLink'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { CoursesAPI } from '../api/courses'

export interface ICertificate {
  certificate_url: string
  course: {
    name: string
  }
}

const Certificate = () => {
  const router = useRouter()

  /**
   * @description sử dụng react query để call API get certificate
   */
  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await CoursesAPI.getCertificate(router.query.id)
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: router.query.id !== undefined,
      retry: false,
    })
  }

  /**
   * @description lấy data của certificate khi call API get certificate
   */
  const { data: certificate, isLoading } = useGetData('certificate', {})

  /**
   * @description function download certificate từ url
   */
  const download = async () => {
    const originalImage = certificate?.certificate_url
    const image = await fetch(originalImage)

    // Split image name
    const nameSplit = originalImage.split('/')
    const duplicateName = nameSplit.pop()

    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    const link = document.createElement('a')
    link.href = imageURL
    link.download = '' + duplicateName + ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <SappLoadingGlobal loading={isLoading}>
      <SinglePageLayout title="Certificate">
        <div className="h-full">
          <div className="flex h-[70px] items-center justify-between bg-white px-6">
            <div className="flex items-center">
              <div className="me-3 text-lg-xl font-medium text-bw-1">
                {certificate?.course?.name}
              </div>
              <div className="me-1 text-sm text-gray-1">Issued by</div>
              <div
                className="cursor-pointer text-sm font-medium text-primary hover:underline"
                onClick={() => window.open('https://sapp.edu.vn', '_blank')}
              >
                SAPP Academy
              </div>
            </div>
            <div className="flex">
              {/* <div className='cursor-pointer'>Share</div> */}
              <ClickToCopyButton
                link={`${process.env.NEXT_PUBLIC_WEB_LMS_URL}/certificates/${certificate?.id}`}
              >
                <SappButtonIcon title="Share" isBgPrimary isTextPrimary>
                  <ShareLinkIcon />
                </SappButtonIcon>
              </ClickToCopyButton>

              <SappButtonIcon
                title="Download"
                className="ms-4"
                download
                link={certificate?.certificate_url}
                target="_blank"
                onClick={() => download()}
              >
                <IconDownload />
              </SappButtonIcon>
            </div>
          </div>
          <div className="flex max-h-[100vh] min-h-[95vh] items-center justify-center bg-gray-3 md:min-h-[94vh] lg:min-h-[95vh] 3xl:min-h-[93vh]">
            <Image
              src={certificate?.certificate_url}
              alt={certificate?.course?.name}
              className="object-contain"
              width={1100}
              height={800}
              priority
            />
          </div>
        </div>
      </SinglePageLayout>
    </SappLoadingGlobal>
  )
}

export default Certificate

Certificate.layout = LAYOUT.SINGLE_PAGE_LAYOUT
