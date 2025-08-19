import { ComingSoonIcon } from '@assets/icons'
import TabLayout from './TabLayout'

const Settings = () => {
  return (
    <div className="flex min-h-352 flex-col items-center justify-center gap-6">
      <ComingSoonIcon className="h-[112px] w-[140px]" />
      <div className="text-base text-gray-800">Coming Soon!</div>
    </div>
  )
}

export default Settings
