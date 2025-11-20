import { listTab } from '@pages/lms-pro-new-version'
import clsx from 'clsx'
import { useRouter } from 'next/router'

const NavigationBarMKTInApp = () => {
  const router = useRouter()

  const navigationItems = listTab.map(({ title, value }) => ({
    title,
    href: value,
  }))

  return (
    <div className="pointer-events-auto fixed left-1/2 top-8 z-50 hidden w-auto -translate-x-1/2 items-center justify-between rounded-[50px] bg-white p-3 shadow-navigator md:inline-flex lg:top-10 xl:top-[53px] short:top-8">
      {navigationItems.map((item) => {
        const isActive = (router.query?.tab || 'home') === item.href

        return (
          <div
            key={item.title}
            className={clsx(
              'flex cursor-pointer items-center justify-center gap-2.5 rounded-[50px] px-2 py-1 lg:px-4 lg:py-2 xl:px-6',
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
                'text-gray-500 justify-start text-nowrap text-center text-sm font-normal leading-normal lg:text-base',
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
