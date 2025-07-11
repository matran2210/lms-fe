import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DefaultOptionType } from 'antd/es/select'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { CheckIconV2, FilterCourseIcon } from 'src/assets/icons'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { Button, Divider } from 'antd'
import clsx from 'clsx'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

interface IFilters {
  [name: string]: React.Key | null | undefined
}
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
  const { control, setValue, getValues, reset } = useForm()
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [filters, setFilters] = useState<IFilters>()
  const filterValues = useWatch({ control })

  const onOpenMobileFilter = () => {
    setOpenMobileFilter(true)
  }
  const onCloseMobileFilter = () => {
    setOpenMobileFilter(false)
  }

  const handleSelect = (option: DefaultOptionType, name: string) => {
    // Neu value ton tai thi xoa
    if (filters?.[name] === option.value) {
      delete filters?.[name]
      // setFilters({ ...filters })
    } else {
      // Neu value khong ton tai thi them vao
      setFilters({
        ...filters,
        [name]: option.value,
      })
    }
  }
  const onConfirm = () => {
    reset(filters)
    onCloseMobileFilter()
  }
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
    <>
      {isMobileView ? (
        <>
          <div
            className="flex cursor-pointer items-center justify-end gap-2"
            onClick={onOpenMobileFilter}
          >
            <div>
              <FilterCourseIcon />
            </div>
            <div className="text-base font-normal text-gray-800">Filter</div>
          </div>
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

      {isMobileView && openMobileFilter && (
        <SappDrawerV3
          open={openMobileFilter}
          handleCancel={onCloseMobileFilter}
          title={<span className="text-xl">Filter</span>}
          rootClassName={'responsive-drawer-center'}
          isShowBtnClose
          closable
          classNameHeader="mb-4"
        >
          <div className="relative flex h-full flex-col justify-between">
            <div>
              {listFilter?.map((item, index) => (
                <div key={index}>
                  <div>
                    <div className="mb-2 text-base font-semibold text-gray-800">
                      {item.placeholder}
                    </div>
                    <div>
                      {(item.options ?? []).map((el) => {
                        const isSelected = filters?.[item.name] === el.value
                        const defaultSelected =
                          !filters?.[item.name] && !el.value
                        return (
                          <div
                            key={el.id}
                            className="flex items-center justify-between py-2"
                            onClick={() => handleSelect(el, item.name)}
                          >
                            <div
                              className={clsx(
                                'text-sm text-gray-800',
                                (isSelected || defaultSelected) &&
                                  'text-primary',
                              )}
                            >
                              {el.label}
                            </div>
                            <div>
                              {(isSelected || defaultSelected) && (
                                <CheckIconV2 />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {index < listFilter.length - 1 && (
                    <Divider className="my-4 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white py-4">
              <ButtonPrimary title="Confirm" full onClick={onConfirm} />
            </div>
          </div>
        </SappDrawerV3>
      )}
    </>
  )
}

export default FilterCourse
