import Link from 'next/link'
import { useRouter } from 'next/router'
import { ITabs } from 'src/type'

const SappTabs = ({ tabs }: { tabs: ITabs[] }) => {
  const router = useRouter()
  return (
    <ul className="flex">
      {tabs.map((tab) => {
        const isActive = tab.link.includes(router.query.page as string)
        return (
          <li key={tab.title} className="relative pr-6">
            <Link href={tab.link} passHref>
              <span
                className={`relative inline-block w-fit cursor-pointer pb-2 text-sm font-medium transition-colors
                  ${isActive ? 'font-bold text-primary' : 'text-gray-400'}
                  after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300
                  ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
              >
                {tab.title}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default SappTabs
