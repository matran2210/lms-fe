import TeacherMenu from '@components/layout/MenuItemsList/TeacherMenu'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { Typography } from 'antd'
import { ITabs } from '@lms/core'
import { memo } from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import { useCourseContext } from '@contexts/index'

const { Title } = Typography
type LayoutTeacherProps = {
  children: React.ReactNode
  title?: string
  breadcrumbs?: ITabs[]
  className?: string
  isCourseDetail?: boolean
  isActivity?: boolean
}

const LayoutTeacher: React.FC<LayoutTeacherProps> = ({
  children,
  title = '',
  breadcrumbs = [],
  className = '',
  isCourseDetail = false,
  isActivity = false,
}: LayoutTeacherProps) => {
  const { showPinnedTrial } = useCourseContext()
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-nowrap">
        <TeacherMenu isCourseDetail={isCourseDetail} isActivity={isActivity} />
        <div
          className={clsx(
            'min-h-screen w-full bg-gray-10',
            showPinnedTrial && 'mt-[54px]',
          )}
        >
          <div className="px-56 py-6">
            <SappBreadCrumbs breadcrumbs={breadcrumbs} />
            <Title level={3} className="mt-1 pb-2 text-[#374151]">
              {title}
            </Title>
            <div
              className={clsx('rounded-xl', className || 'bg-white px-8 py-6')}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default memo(LayoutTeacher)
