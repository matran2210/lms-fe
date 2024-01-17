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
  return (
    <>
      {paths.map((path, index) => {
        let url = ''
        switch (path.type) {
          case 'PART':
            url = `/courses/${router.query.id}/section/${path?.id}`
            break
          case 'CHAPTER':
            url = `/courses/${router.query.id}/section/${paths?.[1]?.id}?unit_id=${path?.id}`
            break
          case 'UNIT':
            url = `/courses/${router.query.id}/section/${paths?.[1]?.id}?unit_id=${paths?.[2]?.id}`
            break
          case 'ACTIVITY':
            url = `#`
            break
        }
        return (
          <span key={path?.id}>
            <Link href={url} className="breadcrumbs__link" scroll={false}>
              <span className="font-normal text-sm text-gray-1 w-max max-w-[190px] inline-block whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
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
