import { ITabsTeacher } from 'src/type'

const SappTabs = ({
  tabs,
  setSelected,
  selected,
  bordered = false,
}: {
  tabs: ITabsTeacher[]
  setSelected: React.Dispatch<React.SetStateAction<number>>
  selected: number
  bordered?: boolean
}) => {
  return (
    <ul className={`flex ${bordered ? 'border-b border-gray-100' : ''}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === selected
        return (
          <li
            key={tab.id}
            className="relative pr-6"
            onClick={() => setSelected(tab.id)}
          >
            <span
              className={`relative inline-block w-fit cursor-pointer pb-4 text-base font-medium transition-colors
                  ${isActive ? 'text-primary' : 'text-gray-400'}
                  after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300
                  ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
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
