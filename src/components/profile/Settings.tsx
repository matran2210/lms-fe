import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import TabLayout from './TabLayout'

interface IProp {
  onOpenTab?: () => void
}

const Settings = ({ onOpenTab }: IProp) => {
  return (
    <div className="relative h-full">
      <form className="flex h-full flex-col">
        <TabLayout
          title="Settings"
          headerButtons={
            <div className=" flex gap-x-2">
              <ButtonCancelSubmit
                className="flex gap-12"
                cancel={{
                  title: 'Cancel',
                  size: 'medium',
                  isPaddingHorizontal: false,
                  disabled: true,
                  className: 'min-w-fit !px-0 text-base w-30',
                }}
                submit={{
                  title: 'Save',
                  size: 'medium',
                  className: 'min-w-fit px-0 text-sm w-30',
                  type: 'submit',
                  disabled: true,
                }}
              />
            </div>
          }
        >
          <div className="flex h-full items-center justify-center">
            <div className="text-gray-1">Coming soon</div>
          </div>
        </TabLayout>
      </form>
    </div>
  )
}

export default Settings
