import React, { useState, useMemo } from 'react'
import useInfiniteStudentLesson from '../../../hooks/useInfiniteStudentLesson'
import { SappDrawerV3, SAPPRangePicker, SAPPSelect, SappSelectMultiple, Select } from '@lms/ui'
import { DEFAULT_PAGE_NUMBER, IStudentAttendanceListParams } from '@lms/core'
import { ArrowDownIcon, CalendarIconOutline, CheckIconV2, CollapseArrowIcon, FilterCourseIcon } from '@lms/assets'
import dayjs, { Dayjs } from 'dayjs'
import { useForm } from 'react-hook-form'
import { useTailwindBreakpoint } from '@lms/hooks'
import { Calendar, Divider } from 'antd'
import clsx from "clsx";
import { DefaultOptionType } from 'antd/es/select'

interface FilterForm {
    lesson_ids?: string[]
    rangeDate?: any[]
    status?: string
}
type FilterAttendanceTableProps = {
    classId: string
    queryParams: IStudentAttendanceListParams
    setQueryParams: React.Dispatch<React.SetStateAction<IStudentAttendanceListParams>>
}
const FilterAttendanceTable = ({ classId, queryParams, setQueryParams }: FilterAttendanceTableProps) => {
    const { control } = useForm<FilterForm>()
    const { isMobileView } = useTailwindBreakpoint()
    const [openMobileFilter, setOpenMobileFilter] = useState(false)
    const [openRangePickerFilter, setOpenRangePickerFilter] = useState(false)
    const [mobileCalendarValue, setMobileCalendarValue] = useState(dayjs())
    const [mobileRangeDate, setMobileRangeDate] = useState<[Dayjs | null, Dayjs | null]>([
        queryParams.fromDate ? dayjs(queryParams.fromDate) : null,
        queryParams.toDate ? dayjs(queryParams.toDate) : null,
    ])
    const [filters, setFilters] = useState<FilterForm>({
        lesson_ids: queryParams.lesson_ids,
        status: queryParams.status,
    })


    const onOpenMobileFilter = () => {
        setOpenMobileFilter(true)
    }
    const onCloseMobileFilter = () => {
        setOpenMobileFilter(false)
    }
    const onOpenRangePickerFilter = () => {
        const fromDate = queryParams.fromDate ? dayjs(queryParams.fromDate) : null
        const toDate = queryParams.toDate ? dayjs(queryParams.toDate) : null

        setMobileRangeDate([fromDate, toDate])
        setMobileCalendarValue(toDate || fromDate || dayjs())
        setOpenRangePickerFilter(true)
    }
    const onCloseRangePickerFilter = () => {
        setOpenRangePickerFilter(false)
    }

    const onConfirmRangePicker = () => {
        setQueryParams((prev) => ({
            ...prev,
            page_index: DEFAULT_PAGE_NUMBER,
            fromDate: mobileRangeDate[0]?.toISOString(),
            toDate: mobileRangeDate[1]?.toISOString(),
        }))
        onCloseRangePickerFilter()
    }

    const {
        data: studentLessonData,
        refetch: refetchStudentLesson,
        hasNextPage: hasNextPageStudentLesson,
        fetchNextPage: fetchNextPageStudentLesson,
        debounceSearch,
    } = useInfiniteStudentLesson(!!classId, { class_ids: [classId] })

    const listFilter = useMemo(() => {
        const subjectOptions = studentLessonData?.map((lesson) => ({
            label: lesson.class_schedule_user?.schedule_name,
            value: lesson.class_schedule_user?.class_schedule_user_id,
        }));

        return [
            {
                name: "lesson_ids",
                placeholder: "Lesson: all",
                options: subjectOptions,
            },
            {
                name: "status",
                placeholder: "Status: all",
                options: [
                    { label: "Present", value: "PRESENT" },
                    { label: "Absent", value: "ABSENT" },
                ],
            },
        ];
    }, [studentLessonData]);

    const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        setQueryParams((prev) => ({
            ...prev,
            fromDate: dates?.[0]?.toISOString(),
            toDate: dates?.[1]?.toISOString(),
        }))
    }
    const handleMobileCalendarSelect = (selectedDate: Dayjs) => {
        setMobileCalendarValue(selectedDate)
        setMobileRangeDate((prev) => {
            const [fromDate, toDate] = prev

            if (!fromDate || toDate) {
                return [selectedDate, null]
            }

            if (selectedDate.isBefore(fromDate, 'date')) {
                return prev
            }

            return [fromDate, selectedDate]
        })
    }

    const disabledMobileDate = (currentDate: Dayjs) => {
        const [fromDate, toDate] = mobileRangeDate

        if (!fromDate || toDate) {
            return false
        }

        return currentDate.isBefore(fromDate, 'date')
    }
    const handleSelect = (option: DefaultOptionType, name: string) => {
        const newFilters = { ...filters }
        switch (name) {
            case "status":
                newFilters.status = option.value as string
                break;
            case "lesson_ids":
                const lessonIds = filters.lesson_ids || []
            if (lessonIds.includes(option.value as string)) {
                newFilters.lesson_ids = lessonIds.filter((id) => id !== option.value)
            } else {
                newFilters.lesson_ids = [...lessonIds, option.value as string]
            }
                break;
            default:
                break;

        }
       
        setFilters(newFilters);
    };
    const onConfirm = () => {
        const { page_index, ...other } = queryParams
        const newQueryParams = {
            ...other,
            ...filters,
            page_index: DEFAULT_PAGE_NUMBER,
        }
        setQueryParams(newQueryParams)
        onCloseMobileFilter();
    };
    return (
        <div className="mb-6 flex flex-col gap-4">
            <div className="flex justify-end">
                {isMobileView ? (
                    <>
                        <div className="flex items-center justify-end gap-3">
                            <div className="cursor-pointer" onClick={onOpenRangePickerFilter}>
                                <CalendarIconOutline className="w-6 h-6 text-icon" />
                            </div>
                            <Divider type="vertical" className="border-gray-300 m-0" />
                            <div className="cursor-pointer" onClick={onOpenMobileFilter}>
                                <FilterCourseIcon />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex w-full items-center justify-end gap-4 xl:w-2/3">
                        <div className="shrink-0 text-right justify-center text-gray-800 text-sm">24 Results</div>
                        <SappSelectMultiple
                            name="lesson_ids"
                            control={control}
                            className="font-medium"
                            classNameWrapper='min-w-24 w-full '
                            heightCustom="h-10"
                            defaultValue={[]}
                            size="middle"
                            placeholder="Lesson"
                            options={[
                                // { label: 'All', value: '' },
                                ...((studentLessonData || []).map((lesson) => ({
                                    label: lesson.class_schedule_user?.schedule_name,
                                    value: lesson.class_schedule_user?.class_schedule_user_id,
                                })))
                            ]}
                            onSearch={(text) => {
                                debounceSearch(text)
                            }}
                            onMenuScrollToBottom={hasNextPageStudentLesson ? fetchNextPageStudentLesson : undefined}
                            onDropdownVisibleChange={(open) => {
                                if (open && !studentLessonData) {
                                    refetchStudentLesson()
                                    return
                                }
                            }}
                            onChange={(value) => {
                                const lessonIds = value.filter((v) => v !== '')
                                setQueryParams((prev) => ({
                                    ...prev,
                                    lesson_ids: lessonIds, // lessonIds,
                                }))
                            }}
                            suffixIcon={<ArrowDownIcon className="text-gray-500" />}
                        />
                        <SAPPSelect
                            className="min-w-24 w-full"
                            name="status"
                            control={control}
                            size="middle"
                            placeholder="Status"
                            allowClear
                            options={[
                                // { label: 'All', value: '' },
                                { label: 'Present', value: 'PRESENT' },
                                { label: 'Absent', value: 'ABSENT' },
                            ]}
                            onChange={(value) => {
                                setQueryParams((prev) => ({
                                    ...prev,
                                    status: value === '' ? undefined : value,
                                }))
                            }}
                            suffixIcon={<ArrowDownIcon className="text-gray-500" />}
                        />
                        <SAPPRangePicker
                            name="rangeDate"
                            control={control}
                            size="small"
                            onChange={handleDateChange}
                            className="min-w-48 max-w-56 shrink-0"
                            suffixIcon={<CalendarIconOutline className="text-gray-500" />}
                        />
                    </div>)}
            </div>

            {isMobileView && (
                <>
                    <SappDrawerV3
                        open={openMobileFilter}
                        handleCancel={onCloseMobileFilter}
                        title="Filter"
                        rootClassName={"responsive-drawer-base drawer-bottom-0"}
                        isShowBtnClose
                        closable
                        classNameHeader="mb-4"
                        titleClassName="!ml-0"
                        placement="bottom"
                        handleSubmit={onConfirm}
                        submitButtonClassName="w-fit"
                        btnSubmitTile="Confirm"
                        isShowFooter
                    >
                        <div className="flex h-full max-h-[200px] flex-col justify-between overflow-y-auto">
                            {listFilter?.map((item, index) => (
                                <div key={index}>
                                    <div>
                                        <div className="mb-2 text-base font-semibold text-gray-800">
                                            {item.placeholder}
                                        </div>
                                        <div>
                                            {(item.options ?? []).map((el) => {
                                                
                                                const isSelected = filters?.[item.name as keyof typeof filters]?.includes(el.value) ?? false;
                                                const defaultSelected = filters?.[item.name as keyof typeof filters] === el.value;
                                                return (
                                                    <div
                                                        key={el.value}
                                                        className="flex items-center justify-between py-2"
                                                        onClick={() => handleSelect(el, item.name)}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                "text-sm text-gray-800",
                                                                (isSelected || defaultSelected) && "text-primary",
                                                            )}
                                                        >
                                                            {el.label}
                                                        </div>
                                                        <div>
                                                            {(isSelected || defaultSelected) && <CheckIconV2 />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {index < listFilter.length - 1 && (
                                        <Divider className="my-4 bg-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </SappDrawerV3>

                    <SappDrawerV3
                        open={openRangePickerFilter}
                        handleCancel={onCloseRangePickerFilter}
                        handleSubmit={onConfirmRangePicker}
                        title=""
                        rootClassName="responsive-drawer-base drawer-bottom-0 drawer-height-450"
                        isShowBtnClose={false}
                        isShowFooter
                        btnSubmitTile="Confirm"

                        submitButtonClassName="w-fit"
                        closable
                        isShowHeader={false}
                        placement="bottom"
                        disabledSubmitButton={!mobileRangeDate[0] || !mobileRangeDate[1]}
                    >
                        <Calendar
                            fullscreen={false}
                            value={mobileCalendarValue}
                            onSelect={handleMobileCalendarSelect}
                            disabledDate={disabledMobileDate}
                            // className={[
                            //     'rounded-xl bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)]',
                            //     '[&_.ant-picker-panel]:border-0 [&_.ant-picker-panel]:bg-transparent',
                            //     '[&_.ant-picker-body]:p-0 [&_.ant-picker-content]:table-fixed',
                            //     '[&_.ant-picker-content_th]:pb-4 [&_.ant-picker-content_th]:text-center [&_.ant-picker-content_th]:text-sm [&_.ant-picker-content_th]:font-normal [&_.ant-picker-content_th]:leading-[22px] [&_.ant-picker-content_th]:text-gray-500',
                            //     '[&_.ant-picker-cell]:py-1 [&_.ant-picker-cell]:text-center',
                            //     '[&_.ant-picker-cell::before]:hidden [&_.ant-picker-cell-inner::before]:hidden',
                            // ].join(' ')}
                            headerRender={({ value, onChange }) => {
                                const year = value.year()
                                const month = value.month()

                                const yearOptions = Array.from({ length: 20 }, (_, i) => {
                                    const optionYear = year - 10 + i
                                    return { label: optionYear, value: optionYear }
                                })

                                const monthOptions = value
                                    .localeData()
                                    .months()
                                    .map((label, index) => ({
                                        label,
                                        value: index,
                                    }))

                                return (
                                    <div className="mb-4 flex items-center justify-between">
                                        <button
                                            type="button"
                                            className="flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-gray-800"
                                            onClick={() => {
                                                const nextValue = value.clone().subtract(1, 'month')
                                                setMobileCalendarValue(nextValue)
                                                onChange(nextValue)
                                            }}
                                        >
                                            <CollapseArrowIcon className="rotate-90 h-5 w-5" />
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <Select
                                                size="small"
                                                bordered={false}
                                                value={month}
                                                options={monthOptions}
                                                suffixIcon={<ArrowDownIcon className="h-[18px] w-[18px] text-gray-800" />}
                                                className="!h-auto [&_.ant-select-arrow]:end-0 [&_.ant-select-selector]:!min-h-0 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-0 [&_.ant-select-selector]:!py-0 [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!pr-5 [&_.ant-select-selection-item]:!text-base [&_.ant-select-selection-item]:!font-medium [&_.ant-select-selection-item]:!leading-6 [&_.ant-select-selection-item]:!text-gray-800"
                                                onChange={(newMonth) => {
                                                    const now = value.clone().month(newMonth)
                                                    setMobileCalendarValue(now)
                                                    onChange(now)
                                                }}
                                            />
                                            <Select
                                                size="small"
                                                bordered={false}
                                                value={year}
                                                options={yearOptions}
                                                suffixIcon={<ArrowDownIcon className="h-[18px] w-[18px] text-gray-800" />}
                                                className="!h-auto [&_.ant-select-arrow]:end-0 [&_.ant-select-selector]:!min-h-0 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-0 [&_.ant-select-selector]:!py-0 [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!pr-5 [&_.ant-select-selection-item]:!text-base [&_.ant-select-selection-item]:!font-medium [&_.ant-select-selection-item]:!leading-6 [&_.ant-select-selection-item]:!text-gray-800"
                                                onChange={(newYear) => {
                                                    const now = value.clone().year(newYear)
                                                    setMobileCalendarValue(now)
                                                    onChange(now)
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-gray-800"
                                            onClick={() => {
                                                const nextValue = value.clone().add(1, 'month')
                                                setMobileCalendarValue(nextValue)
                                                onChange(nextValue)
                                            }}
                                        >
                                            <CollapseArrowIcon className="-rotate-90 h-5 w-5" />
                                        </button>
                                    </div>
                                )
                            }}
                            fullCellRender={(currentDate) => {
                                const [fromDate, toDate] = mobileRangeDate
                                const isStartDate = !!fromDate && currentDate.isSame(fromDate, 'date')
                                const isEndDate = !!toDate && currentDate.isSame(toDate, 'date')
                                const isSelected = isStartDate || isEndDate
                                const isInRange = !!fromDate && !!toDate && currentDate.isAfter(fromDate, 'date') && currentDate.isBefore(toDate, 'date')
                                const isCurrentMonth = currentDate.isSame(mobileCalendarValue, 'month')
                                const isDisabled = disabledMobileDate(currentDate)

                                return (
                                    <div
                                        className={[
                                            'mx-auto flex h-[33px] w-[33px] items-center justify-center rounded-lg text-sm font-normal leading-[22px]',
                                            isSelected ? 'bg-primary text-white' : '',
                                            !isSelected && isInRange ? 'bg-primary/10 text-primary' : '',
                                            !isSelected && isCurrentMonth ? 'text-gray-800' : '',
                                            !isSelected && !isCurrentMonth ? 'text-gray-400' : '',
                                            isDisabled ? 'cursor-not-allowed text-gray-300' : '',
                                        ].join(' ')}
                                    >
                                        {currentDate.date()}
                                    </div>
                                )
                            }}
                        />
                    </SappDrawerV3>
                </>
            )}
        </div>
    )
}

export default FilterAttendanceTable
