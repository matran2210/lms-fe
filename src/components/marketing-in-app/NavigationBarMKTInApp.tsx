import clsx from 'clsx'
import { useRouter } from 'next/router'

const NavigationBarMKTInApp = () => {
  const router = useRouter()
  const navigationItems = [
    { title: 'Home', href: 'home' },
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'My Course', href: 'my-course' },
    { title: 'Student Calendar', href: 'student-calendar' },
    { title: 'Learning Activity', href: 'learning-activity' },
    { title: 'Test', href: 'test' },
    { title: 'Dashboard Test', href: 'dashboard-test' },
    { title: 'Exam List', href: 'exam-list' },
  ]

  return (
    <div className="absolute left-1/2 top-[72px] inline-flex w-auto -translate-x-1/2 items-center justify-between rounded-[50px] bg-white p-3 outline outline-1 outline-offset-[-1px] outline-primary">
      {navigationItems.map((item) => {
        const isActive = (router.query?.tab || 'home') === item.href

        return (
          <div
            key={item.title}
            className={clsx(
              'flex cursor-pointer items-center justify-center gap-2.5 rounded-[50px] px-6 py-2',
              isActive && 'bg-primary',
            )}
            onClick={() => {
              router.push({
                pathname: router.pathname,
                query: { tab: item.href },
              })
            }}
          >
            <div
              className={clsx(
                'justify-start text-nowrap text-center text-base font-normal leading-normal text-gray-500',
                isActive && 'text-white',
              )}
            >
              {item.title}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NavigationBarMKTInApp
