import ButtonCancelSubmit from '@components/v2/base/button/ButtonCancelSubmit'
import TabLayout from './TabLayout'
import { SetStateAction } from 'react'

interface IProp {
  onBack: (value: SetStateAction<boolean>) => void
}

const Settings = ({ onBack }: IProp) => {
  return (
    <div className="relative h-full">
      <form className="flex h-full flex-col">
        <TabLayout title="Settings" headerButtons={null}>
          <div className="flex h-full items-center justify-center">
            <div className="text-[#A1A1A1]">Coming soon</div>
          </div>
        </TabLayout>
      </form>
    </div>
  )
}

export default Settings
