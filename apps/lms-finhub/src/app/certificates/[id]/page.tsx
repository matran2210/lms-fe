'use client'
import { UserType } from '@lms/contexts'
import { LAYOUT } from '@lms/core'
import { CertificateVertical, HorizontalCertificate } from '@lms/feature-user'
import { SappLoadingGlobal, SinglePageLayout } from '@lms/ui'
import { useParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { CoursesAPI } from 'src/api/courses'
import withAuthorization from 'src/HOC/withAuthorization'

export interface ICertificate {
  certificate_url: string
  course: {
    name: string
  }
  id: string
}

const Certificate = () => {
  const param = useParams()
  /**
   * @description sử dụng react query để call API get certificate
   */
  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await CoursesAPI.getCertificate(param.id)
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: param.id !== undefined,
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

  return (
    <SappLoadingGlobal loading={isLoading}>
      <SinglePageLayout title="Certificate">
        <CertificateVertical certificate={certificate}/>
        <HorizontalCertificate
          certificate={certificate}
        />
      </SinglePageLayout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(Certificate)

Certificate.layout = LAYOUT.SINGLE_PAGE_LAYOUT
