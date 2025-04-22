import { trackGAEvent } from '@utils/google-analytics'
import { truncateString } from '@utils/index'
import clsx from 'clsx'
import Link from 'next/link'
import SappTooltip from 'src/common/SappTooltip'

const BreadcrumbFilter = ({
  name,
  subpath,
  courseId,
}: {
  name: string
  subpath?: string
  courseId?: string | string[]
}) => {
  return (
    <nav
      className="breadcrumbs md:max-w-[70%]"
      role="navigation"
      aria-label="breadcrumbs"
    >
      <ol className="breadcrumbs__list flex text-medium-sm font-medium">
        <li className="breadcrumbs__item shrink-0 cursor-pointer text-gray-1 hover:underline">
          <Link href="/courses" className="breadcrumbs__link" scroll={false}>
            <span onClick={() => trackGAEvent('Breadcrumb My Course')}>
              My Course
            </span>
          </Link>
        </li>
        <li
          className={clsx(
            'breadcrumbs__item current-course line-clamp-1',
            subpath ? 'text-gray-1' : 'text-bw-1',
          )}
        >
          <Link
            href={`/courses/my-course/${courseId}`}
            className="breadcrumbs__link"
            scroll={false}
          >
            {(name as string)?.length > 80 ? (
              <SappTooltip title={name} showTooltip>
                <span>{truncateString(name, 80)}</span>
              </SappTooltip>
            ) : (
              <div onClick={() => trackGAEvent(`Breadcrumb Course ${name}`)}>
                <span> /&nbsp;</span>
                <span
                  className={clsx(courseId && 'cursor-pointer hover:underline')}
                >{`${name}`}</span>
              </div>
            )}
          </Link>
        </li>
        {subpath && (
          <li className="breadcrumbs__item current-course ml-1 line-clamp-1 text-bw-1">
            /&nbsp;{subpath}
          </li>
        )}
      </ol>
    </nav>
  )
}

export default BreadcrumbFilter
