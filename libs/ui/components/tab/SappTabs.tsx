import clsx from 'clsx'
import { ITabsTeacher } from '@lms/core'
import { useFeature } from '@lms/contexts'
import { buildQueryString } from '@lms/utils'

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
  const { router, query, pathname } = useFeature()
  const tabUrlTitleQuery = query.tabId as string
  // Nếu không có tabId trên url thì lấy tab đầu tiên hoặc selected
  const activeTabUrlTitle =
    tabUrlTitleQuery || tabs.find((tab) => tab.id === selected)?.urlTitle

  return (
    <ul className={clsx('flex', { 'border-gray-100 border-b': bordered })}>
      {tabs.map((tab) => {
        const isActive = tab.urlTitle === activeTabUrlTitle
        return (
          <li
            key={tab.id}
            className="relative pr-6"
            onClick={() => {
              setSelected(tab.id)
              router.push(`${pathname}?${buildQueryString({ ...query, tabId: tab.urlTitle })}`)
            }}
          >
            <span
              className={clsx(
                'relative inline-block w-fit cursor-pointer pb-4 text-base font-medium transition-colors',
                'after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300',
                {
                  'text-primary after:w-full': isActive,
                  'text-zinc-400 after:w-0 hover:after:w-full': !isActive,
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
