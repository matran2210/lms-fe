import { LAYOUT } from '@utils/constants'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import SappLoadingGlobal from '@components/common/SappLoadingGlobal'
import { CoursesAPI } from '../api/courses'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import useDownloadImage from 'src/hooks/useDownloadImage'
import SinglePageLayout from '@components/layout/SinglePage'
import CertificateVertical from '@components/profile/CertificateDetail/VerticalCertificate'
import HorizontalCertificate from '@components/profile/CertificateDetail/HorizontalCertificate'

export interface ICertificate {
  certificate_url: string
  course: {
    name: string
  }
  id: string
}

const Certificate = () => {
  const router = useRouter()
  const { downloadImage } = useDownloadImage()

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
    if (!originalImage) return
    downloadImage(originalImage)
  }

  return (
    <SappLoadingGlobal loading={isLoading}>
      <SinglePageLayout title="Certificate">
        <CertificateVertical certificate={certificate} onDownload={download} />
        <HorizontalCertificate
          certificate={certificate}
          onDownload={download}
        />
      </SinglePageLayout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(Certificate)

Certificate.layout = LAYOUT.SINGLE_PAGE_LAYOUT
