import { DeleteIcon, EditIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'
import HookFormSelect from '@components/base/select/HookFormSelect'
import React from 'react'

const LearningNotesList = () => {
  const paths = ['Part A: Audit framework', 'Chapter 1: Audit and']
  return (
    <SappDrawer
      isOpen={false}
      message="message"
      onClose={() => {}}
      title="Notes List"
      footer={false}
    >
      <div className="flex justify-between">
        <HookFormSelect className="w-52" placeholder="Section" />
        <HookFormSelect className="w-52" placeholder="Subsection" />
        <HookFormSelect className="w-52" placeholder="Unit" />
        <HookFormSelect className="w-52" placeholder="Activity" />
      </div>

      <div className=" mt-6 p-6" style={{ border: '1px solid #DCDDDD' }}>
        {/* <Breadcrumb tabs={crumbs} currentPage='1' /> */}
        <div>
          <SappBreadcrumbNotLink paths={paths} />
        </div>
        <div className="mt-6 font-normal text-base">
          Time value of money equates cash flows that occur on different dates.
          Cash flows in the future must be discounted at appropriate interest
          rates to find the equivalent present value. With a one-year interest
          rate of 5%, receiving $100 today is equivalent to receiving $105 in
          one year.
        </div>
        <div className="mt-5 flex justify-between">
          <div className="font-normal text-sm text-gray-1">
            23/12/2023 14:45
          </div>
          <div className="flex">
            <div className="cursor-pointer">
              <EditIcon />
            </div>
            <div className="ms-4 cursor-pointer">
              <DeleteIcon />
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-6 p-6" style={{ border: '1px solid #DCDDDD' }}>
        {/* <Breadcrumb tabs={crumbs} currentPage='1' /> */}
        <div>
          <SappBreadcrumbNotLink paths={paths} />
        </div>
        <div className="mt-6 font-normal text-base">
          Time value of money equates cash flows that occur on different dates.
          Cash flows in the future must be discounted at appropriate interest
          rates to find the equivalent present value. With a one-year interest
          rate of 5%, receiving $100 today is equivalent to receiving $105 in
          one year.
        </div>
        <div className="mt-5 flex justify-between">
          <div className="font-normal text-sm text-gray-1">
            23/12/2023 14:45
          </div>
          <div className="flex">
            <div className="cursor-pointer">
              <EditIcon />
            </div>
            <div className="ms-4 cursor-pointer">
              <DeleteIcon />
            </div>
          </div>
        </div>
      </div>
    </SappDrawer>
  )
}

export default LearningNotesList
