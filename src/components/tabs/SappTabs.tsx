import clsx from 'clsx'
import { ITabsTeacher } from 'src/type'
import { useRouter } from 'next/router'

interface SappTabsProps {
  tabs: ITabsTeacher[]
  setSelected: React.Dispatch<React.SetStateAction<number>>
  selected: number
  bordered?: boolean
}

const SappTabs: React.FC<SappTabsProps> = ({
  tabs,
  setSelected,
  selected,
  bordered = false,
}) => {
  const router = useRouter()
  const tabUrlTitleQuery = router.query.tabId as string
  // Nếu không có tabId trên url thì lấy tab đầu tiên hoặc selected
  const activeTabUrlTitle =
    tabUrlTitleQuery || tabs.find((tab) => tab.id === selected)?.urlTitle

  return (
    <ul className={clsx('flex', { 'border-b border-gray-100': bordered })}>
      {tabs.map((tab) => {
        const isActive = tab.urlTitle === activeTabUrlTitle
        return (
          <li
            key={tab.id}
            className="relative pr-6"
            onClick={() => {
              setSelected(tab.id)
              router.push(
                {
                  pathname: router.pathname,
                  query: { ...router.query, tabId: tab.urlTitle },
                },
                undefined,
                { shallow: true },
              )
            }}
          >
            <span
              className={clsx(
                'relative inline-block w-fit cursor-pointer pb-4 text-base font-medium transition-colors',
                'after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300',
                {
                  'text-primary after:w-full': isActive,
                  'text-gray-400 after:w-0 hover:after:w-full': !isActive,
                },
              )}
            >
              {tab.title}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default SappTabs
