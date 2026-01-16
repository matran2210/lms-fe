import React, { useEffect, useState } from 'react'
import { buildQueryString } from '@lms/utils'
import { Controller, useForm } from 'react-hook-form'
import { debounce, isEmpty } from 'lodash'
import { IconSearch } from '../icons'
import { ISearchFormProps } from 'src/type/courses-3-level'
import clsx from 'clsx'
import SidebarMobile from '../menu/MenuSideBarMobile'
import { useParams, useRouter } from 'next/navigation'

export default function SearchForm({
  placeholder,
  formStyle,
  setPage,
  className,
}: ISearchFormProps) {
  const router = useRouter()
  const params = useParams()
  const { control, watch, setValue } = useForm()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const queryString = buildQueryString({
    status: params.status || '',
    type: params.type ?? '',
  })
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>

    // Use useEffect to set up a timer to make the API call after 3 seconds
    if (!isFirstRender && watch('name')?.length >= 3) {
      timerId = setTimeout(() => {
        !isSubmitting &&
          router.push(`/short-course?name=${watch('name') ?? ''}${queryString}`)
        setPage && setPage(9)
      }, 2000)
    }

    // Clean up the timer when the component unmounts or when the input value changes
    return () => {
      clearTimeout(timerId)
    }
  }, [watch('name'), isSubmitting])

  useEffect(() => {
    setIsFirstRender(false)
  }, [setIsFirstRender])

  const handleReset = debounce((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsFirstRender(false)
    setIsSubmitting(false)
    // Check if 'name' is empty and perform search immediately
    if (!watch('name')) {
      router.push(`/short-course?name=${watch('name') ?? ''}${queryString}`)
      setPage && setPage(9)
    }
  }, 500)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    setIsFirstRender(false)
    // Redirect to the search results page with the query as a query parameter
    router.push(`/short-course?name=${watch('name') ?? ''}${queryString}`)
    setPage && setPage(9)
  }

  /**
   * @description set lại value của name khi router query rỗng
   */
  useEffect(() => {
    if (isEmpty(params?.name)) {
      setValue('name', '')
    }
  }, [params?.name, setValue])

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-2 md:gap-6',
        className,
      )}
    >
      <SidebarMobile />
      <div
        className={`flex max-w-[1524px] flex-1 items-center justify-between rounded-lg border border-transparent border-white bg-white px-2 py-3 shadow-small transition-all duration-300 focus-within:border-primary focus-within:outline-none hover:border-primary active:border-primary md:py-4 md:pl-8 md:pr-4`}
      >
        <form
          className={`flex w-full items-center ${formStyle}`}
          onSubmit={handleSubmit}
          onChange={handleReset}
        >
          <button type="submit" className="text-secondary">
            <IconSearch />
          </button>
          <Controller
            control={control}
            name="name"
            defaultValue={params.name ?? ''}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder={placeholder}
                className="placeholder-gray-v2-400 h-6 w-full border-0 px-4 text-sm leading-[22px] text-gray-800 focus:border-0 focus:outline-0 focus:ring-0 md:text-base md:leading-6"
              />
            )}
          />
        </form>
      </div>
    </div>
  )
}
