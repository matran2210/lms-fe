import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

type IProps = {
  id: string
  name: string
  type: string
}

const SappBreadcrumbNotLink = ({ paths }: { paths: IProps[] }) => {
  const router = useRouter()
  const getCourseId = router?.query?.courseId ?? router.query.id
  return (
    <>
      {paths.map((path, index) => {
        let url = ''
        switch (path.type) {
          case 'PART':
            url = `/courses/${getCourseId}/section/${path?.id}`
            break
          case 'CHAPTER':
            url = `/courses/${getCourseId}/section/${paths?.[0]?.id}?unit_id=${path?.id}`
            break
          case 'UNIT':
            url = `/courses/${getCourseId}/section/${paths?.[0]?.id}?unit_id=${paths?.[1].id}`
            break
          case 'ACTIVITY':
            url = `/courses/${getCourseId}/section/${paths?.[0]?.id}?unit_id=${paths?.[1].id}`
            break
        }
        return (
          <span
            key={path?.id}
            className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <Link href={url} className="breadcrumbs__link" scroll={false}>
              <span className="font-normal text-sm text-gray-1 w-full max-w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                {path?.name}
              </span>
            </Link>
            {index < paths.length - 1 && (
              <span className="font-normal text-sm text-gray-1 inline-block overflow-hidden px-1">
                {' '}
                /{' '}
              </span>
            )}
          </span>
        )
      })}
    </>
  )
}

export default SappBreadcrumbNotLink
