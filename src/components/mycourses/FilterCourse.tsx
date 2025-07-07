import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DefaultOptionType } from 'antd/es/select'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { FilterCourseIcon } from 'src/assets/icons'
import SappModalV3 from '../base/modal/SappModalV3'

const FilterCourse = ({
  totalResult,
  listFilter,
}: {
  totalResult: number
  listFilter: {
    name: string
    placeholder: string
    options: DefaultOptionType[]
  }[]
}) => {
  const { control, setValue } = useForm()
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const [open, setOpen] = useState(false)
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

  const ContentFilterCourse = () => {
    return (
      <div>
        <div>Filter Course</div>
      </div>
    )
  }

  return (
    <>
      {isMobileView ? (
        <>
          <div
            className="flex items-center justify-end gap-2"
            onClick={() => setOpen(true)}
          >
            <div>
              <FilterCourseIcon />
            </div>
            <div className="text-base font-normal text-gray-800">Filter</div>
          </div>
          <SappModalV3
            open={open}
            handleCancel={() => setOpen(false)}
            onOk={() => {}}
            title="Filter Course"
            showCloseIcon
            content={<ContentFilterCourse />}
            showFooter
            okButtonCaption="Apply"
            fullWidthBtn
            buttonSize="extra"
          />
        </>
      ) : (
        <div className="flex items-center md:gap-2 lg:gap-4">
          <div className="text-base font-medium text-gray-800">
            {totalResult} Results
          </div>
          <div className="flex md:gap-2 lg:gap-4">
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
      )}
    </>
  )
}

export default FilterCourse
