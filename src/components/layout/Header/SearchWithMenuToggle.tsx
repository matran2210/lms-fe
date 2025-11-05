import { ArrowActionSearchIcon, HamburgerMenuLargeIcon } from '@assets/icons'
import SearchForm from '@components/mycourses/Search'
import PopupStep from '@components/user-guide/PopupStep'
import React, { useEffect, useRef, useState } from 'react'
import { PageLink, UserGuide } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import { useAppSelector } from 'src/redux/hook'
import TourGuideStart from 'src/assets/lotties/tour-guide-start.json'
import clsx from 'clsx'
import { CloseIconV2 } from '@components/icons'
import { FormProvider, useForm } from 'react-hook-form'
import { buildQueryString } from '@utils/index'
import { useRouter } from 'next/router'

interface IProps {
  handleOpenSidebar: () => void
  disabledSearch?: boolean
  isShowUserGuide?: boolean
  isShowToggle?: boolean
  className?: string
  isCoursePage?: boolean
}
interface IListIcon {
  icon: React.ReactNode
  action?: (e: React.MouseEvent<HTMLDivElement>) => void
  className?: string
}
const SearchWithMenuToggle = ({
  handleOpenSidebar,
  disabledSearch,
  isShowUserGuide = false,
  isShowToggle = false,
  className,
  isCoursePage = false,
}: IProps) => {
  const {
    status: guideStatus,
    isActive: guideIsActive,
    step: guideStep,
  } = useAppSelector((state) => state.userGuideReducer)
  const { query, push } = useRouter()
  const methods = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
  })
  const [isFocused, setIsFocused] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const queryString = buildQueryString({
    status: query.status || '',
    type: query.type ?? '',
  })

  const handleSubmit = () => {
    // Redirect to the search results page with the query as a query parameter
    push(
      `${PageLink.COURSES}${
        methods.watch('name')?.trim()?.length
          ? `?name=${methods.watch('name')}`
          : ''
      }${queryString}`,
    )
  }
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement?.tagName === 'INPUT') {
        e.preventDefault()
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const renderIcon = ({ listIcon }: { listIcon: IListIcon[] }) => {
    return (
      <div className="flex items-center gap-2">
        {listIcon?.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(
                'inline-flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg bg-gray-200',
                item.className,
              )}
              onMouseDown={item.action}
            >
              <div className="justify-start self-stretch text-center text-base font-normal leading-normal text-gray-600">
                {item.icon}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const ActionIcon = () => {
    return (
      <>
        {methods.watch('name')
          ? renderIcon({
              listIcon: [
                {
                  icon: <ArrowActionSearchIcon />,
                  className: 'p-1',
                  action: () => {
                    methods.handleSubmit(handleSubmit)
                  },
                },
                {
                  icon: <CloseIconV2 />,
                  className: 'p-1',
                  action: () => {
                    methods.setValue('name', '')
                  },
                },
              ],
            })
          : isFocused
            ? renderIcon({
                listIcon: [
                  {
                    icon: 'esc',
                    action: () => {
                      inputRef.current?.blur()
                    },
                    className: 'px-2 py-1',
                  },
                ],
              })
            : renderIcon({
                listIcon: [
                  {
                    icon: '/',
                    action: () => {
                      inputRef.current?.focus()
                    },
                    className: 'w-8 p-1',
                  },
                ],
              })}
      </>
    )
  }

  return (
    <>
      <FormProvider {...methods}>
        <div
          className={clsx(
            'mt-4 flex items-center justify-between gap-2 md:gap-6',
            className,
          )}
        >
          {isShowToggle && (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-2 shadow-small md:h-14 md:w-14 lg:hidden"
              onClick={handleOpenSidebar}
            >
              <HamburgerMenuLargeIcon />
            </div>
          )}
          {!isCoursePage && (
            <div
              className={clsx(
                'border-transparent flex w-full items-center justify-between rounded-lg border border-white bg-white px-2 py-3 shadow-small transition-all duration-300 focus-within:border-primary hover:border-primary active:border-primary md:py-4 md:pl-8 md:pr-4',
                {
                  'z-50': isShowUserGuide && guideStatus && guideStep === 1,
                },
              )}
            >
              <SearchForm
                placeholder={MY_COURSES.placeholderSearchV2}
                formStyle="w-full flex items-center"
                disabled={disabledSearch}
                inputRef={inputRef}
                setIsFocused={setIsFocused}
                isFocused={isFocused}
                handleSubmit={handleSubmit}
                isCoursePage={isCoursePage}
              />
              <div className="hidden lg:block">
                <ActionIcon />
              </div>
            </div>
          )}
        </div>
      </FormProvider>
      {isShowUserGuide && guideStatus && guideStep === 1 && (
        <PopupStep
          content={UserGuide.CONTENT_STEP_1}
          className="left-0"
          title={'Search box'}
          index={1}
          total={7}
          imgSrc={TourGuideStart}
        />
      )}
    </>
  )
}

export default SearchWithMenuToggle
