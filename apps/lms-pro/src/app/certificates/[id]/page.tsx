"use client"
import { UserType } from '@lms/contexts'
import { LAYOUT } from '@lms/core'
import { useDownloadImage } from '@lms/hooks'
import { useQuery } from 'react-query'
import withAuthorization from 'src/HOC/withAuthorization'
import { SappLoadingGlobal, SinglePageLayout } from '@lms/ui'
import { CertificateVertical, HorizontalCertificate } from '@lms/feature-user'
import { CoursesAPI } from 'src/api/courses'

export interface ICertificate {
    certificate_url: string
    course: {
        name: string
    }
    id: string
}

const Certificate = ({ params }: { params: { id: string } }) => {
    const { downloadImage } = useDownloadImage()
    const { id } = params
    /**
     * @description sử dụng react query để call API get certificate
     */
    const useGetData = (queryKey: string, params: Object) => {
        const fetchData = async () => {
            const { data } = await CoursesAPI.getCertificate(id)
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

export default withAuthorization<{ params: { id: string } }>([UserType.STUDENT])(Certificate)

Certificate.layout = LAYOUT.SINGLE_PAGE_LAYOUT
