import { Dispatch, SetStateAction, useState } from 'react'
import TeacherMenu from '@components/layout/MenuItemsList/TeacherMenu'
import { useAppSelector } from 'src/redux/hook'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { PageLink } from 'src/constants'
import { useRouter } from 'next/router'
import { useCourseContext } from '@contexts/index'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { Typography } from 'antd'

const { Title } = Typography
type DashboardLayoutProps = {
  children: React.ReactNode
  title?: string
}

export default function DashboardLayoutTeacher({
  children,
  title = '',
}: DashboardLayoutProps) {
  const router = useRouter()

  return (
    <div className="flex flex-nowrap">
      <TeacherMenu />
      <div className="min-h-screen w-full bg-[#F2F4F7]">
        <div className="min-h-screen w-full py-6 pl-56 pr-56">
          <SappBreadCrumbs
            breadcrumbs={[
              { title: 'LMS', link: '/' },
              { title: 'MyClass', link: '/lms/my-class' },
            ]}
          />
          <Title level={3} className="mt-1 pb-2 text-gray-700">
            {title}
          </Title>
          <div className="min-h-screen w-full rounded-lg bg-white px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
