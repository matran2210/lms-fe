import { UnderDevelopmentIcon } from '@lms/assets'

const Settings = () => {
  return (
    <div className="flex min-h-[352px]  flex-col items-center justify-center gap-6">
      <UnderDevelopmentIcon />
      <div className="text-xl text-gray-400">
        This feature is under development.
      </div>
    </div>
  )
}

export default Settings
