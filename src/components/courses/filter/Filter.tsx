import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { buildQueryString } from '@utils/index'
import { useForm } from 'react-hook-form'
import { IFilterProps } from 'src/type/courses-3-level'
import DesktopFilter3Level from '@components/courses/filter/FilterDesktop'
import MobileFilter3Level from '@components/courses/filter/FilterMobile'
import { PageLink, defaultStatusCourse } from 'src/constants'

export default function Filter3Level({ courses, setPage }: IFilterProps) {
  const router = useRouter()
  const { control, setValue } = useForm()

  const [filterType, setFilterType] = useState<{
    label: string
    value: string
  }>({ label: 'All', value: '' })
  const [filterStatus, setFilterStatus] = useState<{
    label: string
    value: string
  }>({ label: 'All', value: '' })
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [tempType, setTempType] = useState<{ label: string; value: string }>({
    label: 'All',
    value: '',
  })
  const [tempStatus, setTempStatus] = useState<{
    label: string
    value: string
  }>({ label: 'All', value: '' })

  const totalResults = courses?.metadata?.total_records || 0

  const queryString = buildQueryString({
    status: filterStatus.value,
    type: filterType.value,
  })

  useEffect(() => {
    const queryStatus = router.query.status || ''
    const queryType = router.query.type || ''

    const foundStatus = defaultStatusCourse.find(
      (item) => item.value === queryStatus,
    )
    const courseCategories =
      courses?.total?.map((cat) => ({
        label: cat.categoryName,
        value: cat.categoryName,
      })) || []

    const foundType = courseCategories.find((item) => item.value === queryType)

    setFilterStatus(foundStatus || { label: 'All', value: '' })
    setFilterType(foundType || { label: 'All', value: '' })
    setIsFirstRender(false)
  }, [courses])

  useEffect(() => {
    if (!isFirstRender) {
      router.push(
        `${PageLink.SHORT_COURSE}?name=${router.query.name || ''}${queryString}`,
      )
      setPage?.(9)
    }
  }, [filterType, filterStatus])

  useEffect(() => {
    setValue('type', filterType)
    setValue('status', filterStatus)
  }, [filterType, filterStatus, setValue])

  const confirmFilter = () => {
    setFilterType(tempType)
    setFilterStatus(tempStatus)
    setOpenDrawer(false)
  }

  return (
    <>
      <DesktopFilter3Level
        courses={courses}
        filterType={filterType}
        filterStatus={filterStatus}
        setFilterType={setFilterType}
        setFilterStatus={setFilterStatus}
        totalResults={totalResults}
      />

      <MobileFilter3Level
        courses={courses}
        filterType={filterType}
        filterStatus={filterStatus}
        tempType={tempType}
        tempStatus={tempStatus}
        setTempType={setTempType}
        setTempStatus={setTempStatus}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        confirmFilter={confirmFilter}
      />
    </>
  )
}
