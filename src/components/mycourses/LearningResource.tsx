import { DownloadIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import HookFormSelect from '@components/base/select/HookFormSelect'
import React from 'react'

const LearningResource = () => {
  return (
    <SappDrawer
      isOpen={false}
      message="message"
      onClose={() => {}}
      title="Resource"
      footer={false}
    >
      <div className="flex justify-between">
        <HookFormSelect className="w-52" placeholder="Section" />
        <HookFormSelect className="w-52" placeholder="Subsection" />
        <HookFormSelect className="w-52" placeholder="Unit" />
        <HookFormSelect className="w-52" placeholder="Activity" />
      </div>

      <div className=" mt-6 p-6" style={{ border: '1px solid #DCDDDD' }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-normal text-base text-bw-1">
              Lecture Video (360p).mp4
            </div>
            <div className="text-gray-1 font-normal text-base">134Kb</div>
          </div>
          <div className="cursor-pointer">
            <DownloadIcon />
          </div>
        </div>
      </div>
    </SappDrawer>
  )
}

export default LearningResource
