import clsx from 'clsx'

const NavigationBar = () => {
  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      isActive: true,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      isActive: false,
    },
    {
      label: 'My Course',
      href: '/my-course',
      isActive: false,
    },
    {
      label: 'Student Calendar',
      href: '/student-calendar',
      isActive: false,
    },
    {
      label: 'Learning Activity',
      href: '/learning-activity',
      isActive: false,
    },
    {
      label: 'Test',
      href: '/test',
      isActive: false,
    },
    {
      label: 'Dashboard Test',
      href: '/dashboard-test',
      isActive: false,
    },
    {
      label: 'Exam List',
      href: '/exam-list',
      isActive: false,
    },
  ]
  return (
    <div className="absolute left-1/2 top-20 inline-flex w-auto -translate-x-1/2 items-center justify-between rounded-[50px] bg-white p-3 outline outline-1 outline-offset-[-1px] outline-primary">
      {navigationItems.map((item) => (
        <div
          className={clsx(
            'flex items-center justify-center gap-2.5 rounded-[50px] px-6 py-2',
            item.isActive && 'bg-primary',
          )}
          key={item.label}
          onClick={() => {}}
        >
          <div
            className={clsx(
              'justify-start text-nowrap text-center text-base font-normal leading-normal text-gray-500',
              item.isActive && 'text-white',
            )}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default NavigationBar
