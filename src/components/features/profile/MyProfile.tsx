import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { control } = useForm<{ name: string }>()
  return (
    <div>
      <div className="text-xl font-bold mb-12 text-bw-1">My Profile</div>
      <ul>
        {/* start:: Code*/}
        <li className="md:flex block gap-6 pb-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Code
          </div>
          <div className="flex-auto font-medium text-bw-1">S000478</div>
        </li>
        {/* end:: Code*/}

        {/* start:: Full Name*/}
        <li className={`md:flex block gap-6 ${isEdit ? '' : 'py-2.5'}`}>
          <div
            className={`text-gray-1 flex-none w-[300px] max-w-[50%] ${
              isEdit ? 'py-2.5' : ''
            }`}
          >
            Full Name
          </div>
          {isEdit ? (
            <HookFormTextField
              control={control}
              name="name"
            ></HookFormTextField>
          ) : (
            <div className="flex-auto font-medium text-bw-1">
              Nguyễn Duy Anh
            </div>
          )}
        </li>
        {/* end:: Full Name*/}

        {/* start:: Username*/}
        <li className="md:flex block gap-6 py-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Username
          </div>
          <div className="flex-auto font-medium text-bw-1">duyanh123</div>
        </li>
        {/* end:: Username*/}

        {/* start:: Email*/}
        <li className="md:flex block gap-6 py-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Email
          </div>
          <div className="flex-auto font-medium text-bw-1">
            duyanhnguyen@gmail.com
          </div>
        </li>
        {/* end:: Email*/}

        {/* start:: Phone Number*/}
        <li className="md:flex block gap-6 py-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Phone Number
          </div>
          <div className="flex-auto font-medium text-bw-1">0908 798 797</div>
        </li>
        {/* end:: Phone Number*/}

        {/* start:: Role*/}
        <li className="md:flex block gap-6 py-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Role
          </div>
          <div className="flex-auto font-medium text-bw-1">Học viên</div>
        </li>
        {/* end:: Role*/}

        {/* start:: Status*/}
        <li className="md:flex block gap-6 py-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Status
          </div>
          <div className="flex-auto font-medium text-state-success">Active</div>
        </li>
        {/* end:: Status*/}

        {/* start:: Updated At*/}
        <li className="md:flex block gap-6 py-2.5">
          <div className="text-gray-1 flex-none w-[300px] max-w-[50%]">
            Updated At
          </div>
          <div className="flex-auto font-medium text-bw-1">
            12/10/2023 11:04
          </div>
        </li>
        {/* end:: Updated At*/}
      </ul>
      <div className="mt-10">
        {!isEdit ? (
          <ButtonPrimary
            onClick={() => setIsEdit(true)}
            size="medium"
            title={'Edit'}
            className="min-w-[120px] text-sm"
          ></ButtonPrimary>
        ) : (
          <ButtonCancelSubmit
            cancel={{
              title: 'Cancel',
              onClick: () => setIsEdit(false),
              size: 'medium',
              isPaddingHorizontal: false,
            }}
            submit={{
              title: 'Save',
              onClick: () => setIsEdit(false),
              size: 'medium',
              className: 'min-w-fit px-0 text-sm',
            }}
          ></ButtonCancelSubmit>
        )}
      </div>
    </div>
  )
}

export default MyProfile
