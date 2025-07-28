import { UnderDevelopmentIcon } from '@assets/icons/teacher'

const Settings = () => {
  return (
    <div className="flex min-h-352 flex-col items-center justify-center gap-8">
      <UnderDevelopmentIcon />
      <div className="text-xl text-txt-secondary">
        This feature is under development.
      </div>
    </div>
  )
}

export default Settings
