import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FilterCourse = ({
  totalResult,
  listFilter,
}: {
  totalResult: number
  listFilter: {
    name: string
    placeholder: string
    options: any[]
  }[]
}) => {
  const { control, setValue } = useForm()
  const router = useRouter()

  const filterValues = useWatch({ control })

  useEffect(() => {
    const currentQuery = { ...router.query }

    listFilter?.forEach((filter) => {
      const val = filterValues?.[filter.name]
      if (val) {
        currentQuery[filter.name] = val.value ?? val
      } else {
        delete currentQuery[filter.name]
      }
    })

    router.replace(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true },
    )
  }, [filterValues])

  return (
    <div className="flex items-center gap-4">
      <div className="text-base font-medium text-gray-800">
        {totalResult} Results
      </div>
      <div className="flex gap-4">
        {listFilter?.map((item, index) => (
          <SAPPSelectV2
            key={index}
            control={control}
            name={item.name}
            placeholder={item.placeholder}
            required
            onChange={(e) => setValue(item.name, e)}
            options={item.options ?? []}
            className="min-w-36"
            heightCustom="h-10"
          />
        ))}
      </div>
    </div>
  )
}

export default FilterCourse
