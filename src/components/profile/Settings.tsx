import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappButton from '@components/base/button/SappButton'
import React from 'react'

interface IProp {
  onOpenTab?: () => void
}

const Settings = ({ onOpenTab }: IProp) => {
  return (
    <div className="relative h-full p-6 pt-4">
      <form className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-b-gray-3 pb-6">
          <div className="text-xl font-medium text-bw-1">Settings</div>
          <div className=" flex gap-x-2">
            <ButtonCancelSubmit
              className="flex gap-12"
              cancel={{
                title: 'Cancel',
                //   onClick: handleChangeToPreview,
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
                //   loading: loading || loadingEditName,
              }}
            />
          </div>
        </div>
        <div className="flex flex-grow items-center justify-center">
          <div className="text-gray-1">Coming soon</div>
        </div>
      </form>
    </div>
  )
}

export default Settings
