import { UnderDevelopmentIcon } from '@lms/assets'

const Settings = () => {
  return (
    <div className="flex min-h-352 flex-col items-center justify-center gap-6">
      <UnderDevelopmentIcon />
      <div className="text-xl text-txt-secondary">
        This feature is under development.
      </div>
    </div>
  )
}

export default Settings
