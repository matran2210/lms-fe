'use client'
import { useFeature, UserType } from '@lms/contexts'
import { LAYOUT } from '@lms/core'
import { useQuery } from 'react-query'
import { withAuthorization } from '@lms/hoc'
import { SappLoadingGlobal, SinglePageLayout } from '@lms/ui'
import { CertificateVertical, HorizontalCertificate } from '../../components'

export interface ICertificate {
  certificate_url: string
  course: {
    name: string
  }
  id: string
}

const CertificateDetail = () => {
  const { courseApi, params } = useFeature()
  const { id } = params
  /**
   * @description sử dụng react query để call API get certificate
   */
  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await courseApi.getCertificate(id)
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: id !== undefined,
      retry: false,
    })
  }

  /**
   * @description lấy data của certificate khi call API get certificate
   */
  const { data: certificate, isLoading } = useGetData('certificate', {})

  return (
    <SappLoadingGlobal loading={isLoading}>
      <SinglePageLayout title="Certificate">
        <CertificateVertical certificate={certificate} />
        <HorizontalCertificate
          certificate={certificate}
        />
      </SinglePageLayout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([
  UserType.STUDENT,
])(CertificateDetail)

CertificateDetail.layout = LAYOUT.SINGLE_PAGE_LAYOUT
