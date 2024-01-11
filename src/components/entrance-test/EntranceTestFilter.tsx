import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { buildOneChoiceQueryString } from '@utils/index'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useForm } from 'react-hook-form'
import { defaultStatusEnstraceTest } from 'src/constants'

const EntranceTestFilter = ({ count }: { count: number }) => {
  const router = useRouter()
  const { control, watch } = useForm()

  let apiUrl = `/entrance-test`

  const queryString = buildOneChoiceQueryString({
    attempt_status: watch('attempt_status')?.value || '',
  })

  useEffect(() => {
    const userStatus = watch('attempt_status')?.value

    if (userStatus !== undefined) {
      router.push(userStatus !== '' ? `${apiUrl}?${queryString}` : apiUrl)
    }
  }, [apiUrl, queryString, watch('attempt_status')])

  return (
    <div className="filter flex">
      <div className="pr-6 border-r border-gray-1 text-medium-sm font-normal text-gray-1">
        {count} {count > 1 ? 'results' : 'result'}
      </div>
      <div className="filter pl-6 flex self-center">
        <SappHookFormSelect
          control={control}
          name="attempt_status"
          options={defaultStatusEnstraceTest}
          placeholder="Status"
          className="status-course"
          isSearchable={false}
        />
      </div>
    </div>
  )
}

export default EntranceTestFilter
