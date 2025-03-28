import TeacherMenu from '@components/layout/MenuItemsList/TeacherMenu'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import { Typography } from 'antd'
import { ITabs } from 'src/type'

const { Title } = Typography
type LayoutTeacherProps = {
  children: React.ReactNode
  title?: string
  breadcrumbs?: ITabs[]
  className?: string
}

export default function LayoutTeacher({
  children,
  title = '',
  breadcrumbs = [],
  className = '',
}: LayoutTeacherProps) {
  return (
    <div className="flex flex-nowrap">
      <TeacherMenu />
      <div className="min-h-screen w-full bg-gray-10">
        <div className="min-h-screen w-full px-56 py-6">
          <SappBreadCrumbs breadcrumbs={breadcrumbs} />
          <Title level={3} className="mt-1 pb-2 text-gray-700">
            {title}
          </Title>
          <div
            className={`min-h-screen w-full rounded-xl ${className ? className : 'bg-white px-8 py-6'}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
