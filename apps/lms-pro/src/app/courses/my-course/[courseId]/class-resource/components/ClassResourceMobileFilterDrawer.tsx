'use client'

import { CLASS_SUFFIX_TYPE_FILTER } from '@lms/core'
import { useSelectClassSchedule } from '@lms/hooks'
import {
  CarouselSlideAnimation,
  ListFilterItemMobileBase,
  ListFilterMobileBase,
  SappDrawerV3,
} from '@lms/ui'
import { getSelectOptions } from '@lms/utils'
import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FilterFormValues } from '../FilterClassResource'

export interface ISelectItem {
  label: string
  value: string
}

const LIST_TAB_FILTER = [
  { label: 'Type', value: 'Type' },
  { label: 'Lesson', value: 'Lesson' },
]

export interface ClassResourceMobileFilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  query: Record<string, string>
  setQueryParams: (updater: SetStateAction<FilterFormValues>) => void
}

const ClassResourceMobileFilterDrawer = ({
  open,
  onOpenChange,
  courseId,
  query,
  setQueryParams,
}: ClassResourceMobileFilterDrawerProps) => {
  const [openChooseItem, setOpenChooseItem] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [titleFilterMobile, setTitleFilterMobile] = useState('Filter')
  const [listFilterItem, setListFilterItem] = useState<ISelectItem[]>([])
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, ISelectItem | ISelectItem[]>
  >({
    Type: { label: '', value: '' },
    Lesson: [],
  })
  const isFirstRenderListSchedule = useRef(true)

  const {
    classSchedule,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingClassSchedule,
  } = useSelectClassSchedule(courseId, '', true)

  const scheduleOptions = useMemo(
    () =>
      getSelectOptions(
        classSchedule.map((item) => ({ value: item.id, label: item.name })),
      ),
    [classSchedule],
  )

  const syncFilterStateFromQuery = useCallback(() => {
    const rawIds = query.schedule_ids
    const ids = !rawIds
      ? []
      : rawIds.includes(',')
        ? rawIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : [rawIds]

    const lessonSelections = ids.map((id) => ({
      label: scheduleOptions?.find((o) => o?.value === id)?.label || '',
      value: id,
    }))

    setSelectedFilters({
      Type: {
        label: query.suffix_types
          ? CLASS_SUFFIX_TYPE_FILTER.find(
              (o) => o.value === query.suffix_types,
            )?.label ?? ''
          : '',
        value: query.suffix_types || '',
      },
      Lesson: lessonSelections,
    })
  }, [query.schedule_ids, query.suffix_types, scheduleOptions])

  // Dùng ref để luôn gọi version mới nhất của sync mà không làm dep của open effect
  const syncRef = useRef(syncFilterStateFromQuery)
  useEffect(() => {
    syncRef.current = syncFilterStateFromQuery
  }, [syncFilterStateFromQuery])

  // Sync + reset khi drawer mở
  useEffect(() => {
    if (!open) return
    syncRef.current()
    setOpenChooseItem(false)
    setTitleFilterMobile('Filter')
  }, [open])

  // Sync một lần khi scheduleOptions load lần đầu (để pre-select đúng option từ URL)
  useEffect(() => {
    if (!isFirstRenderListSchedule.current || scheduleOptions.length === 0)
      return
    syncFilterStateFromQuery()
    isFirstRenderListSchedule.current = false
  }, [scheduleOptions, syncFilterStateFromQuery])

  useEffect(() => {
    if (titleFilterMobile === 'Type') {
      setListFilterItem([{ label: 'All', value: '' }, ...CLASS_SUFFIX_TYPE_FILTER])
    } else if (titleFilterMobile === 'Lesson') {
      setListFilterItem(scheduleOptions as ISelectItem[])
    }
  }, [titleFilterMobile, scheduleOptions])

  const handleSelectFilterTab = useCallback((tab: string) => {
    setDirection(1)
    setOpenChooseItem(true)
    setTitleFilterMobile(tab)
  }, [])

  const handleBack = useCallback(() => {
    setDirection(-1)
    setOpenChooseItem(false)
    setTitleFilterMobile('Filter')
  }, [])

  const handleClose = useCallback(() => {
    syncRef.current()
    setOpenChooseItem(false)
    setTitleFilterMobile('Filter')
    onOpenChange(false)
  }, [onOpenChange])

  const handleSelectItemFilter = useCallback(
    (item: object | object[]) => {
      const isMultiSelect = titleFilterMobile === 'Lesson'
      if (isMultiSelect) {
        setSelectedFilters((prev) => ({
          ...prev,
          [titleFilterMobile]: item as ISelectItem[],
        }))
      } else {
        setDirection(-1)
        setOpenChooseItem(false)
        setTitleFilterMobile('Filter')
        setSelectedFilters((prev) => ({
          ...prev,
          [titleFilterMobile]: item as ISelectItem,
        }))
      }
    },
    [titleFilterMobile],
  )

  const handleSubmit = useCallback(() => {
    const lessonValue: string[] = Array.isArray(selectedFilters.Lesson)
      ? selectedFilters.Lesson.map((item) => item.value).filter(
          (v): v is string => Boolean(v),
        )
      : selectedFilters.Lesson?.value
        ? [selectedFilters.Lesson.value]
        : []

    const typeFilter = selectedFilters.Type
    const typeValue =
      typeof typeFilter === 'object' &&
      !Array.isArray(typeFilter) &&
      typeFilter.value
        ? typeFilter.value
        : undefined

    setQueryParams({
      suffix_types: typeValue,
      schedule_ids: lessonValue.length ? lessonValue : undefined,
    })
    setOpenChooseItem(false)
    setTitleFilterMobile('Filter')
    onOpenChange(false)
  }, [selectedFilters, setQueryParams, onOpenChange])

  return (
    <SappDrawerV3
      open={open}
      handleCancel={handleClose}
      isShowBtnBack={openChooseItem}
      handleBack={handleBack}
      title={titleFilterMobile}
      rootClassName={'responsive-drawer-base drawer-bottom-0'}
      isShowBtnClose
      closable
      classNameHeader="mb-4"
      placement="bottom"
      handleSubmit={handleSubmit}
      submitButtonClassName="w-full"
      btnSubmitTile="Confirm"
      isShowFooter
    >
      <CarouselSlideAnimation slideKey={titleFilterMobile} direction={direction}>
        {openChooseItem ? (
          <ListFilterItemMobileBase
            isMultiSelect={titleFilterMobile === 'Lesson'}
            handleSelect={handleSelectItemFilter}
            selected={selectedFilters[titleFilterMobile as 'Type' | 'Lesson']}
            data={listFilterItem}
            handleNextPage={() =>
              !isLoadingClassSchedule && hasNextPage && fetchNextPage()
            }
          />
        ) : (
          <ListFilterMobileBase
            handleClick={handleSelectFilterTab}
            data={LIST_TAB_FILTER}
            selected={selectedFilters}
          />
        )}
      </CarouselSlideAnimation>
    </SappDrawerV3>
  )
}

export default ClassResourceMobileFilterDrawer
