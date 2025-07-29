import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import Icon from '@components/icons'
import { buildQueryString } from '@utils/index'
import { Controller, useForm } from 'react-hook-form'
import { debounce, isEmpty } from 'lodash'
import { PageLink } from 'src/constants'

interface IProps {
  placeholder: string
  formStyle: string
  setPage?: Dispatch<SetStateAction<number>>
  isTeacher?: boolean
}

const SearchForm = ({ placeholder, formStyle, setPage, isTeacher }: IProps) => {
  const router = useRouter()
  const { control, watch, setValue } = useForm()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const queryString = buildQueryString({
    status: router.query.status || '',
    type: router.query.type ?? '',
  })
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

  useEffect(() => {
    let timerId: any

    // Use useEffect to set up a timer to make the API call after 3 seconds
    if (!isFirstRender && watch('name')?.length >= 3) {
      timerId = setTimeout(() => {
        !isSubmitting &&
          router.push(
            `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}?name=${watch('name') ?? ''}${queryString}`,
          )
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
      router.push(
        `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}?name=${watch('name') ?? ''}${queryString}`,
      )
      setPage && setPage(9)
    }
  }, 500)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    setIsFirstRender(false)
    // Redirect to the search results page with the query as a query parameter
    router.push(
      `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}?name=${watch('name') ?? ''}${queryString}`,
    )
    setPage && setPage(9)
  }

  /**
   * @description set lại value của name khi router query rỗng
   */
  useEffect(() => {
    if (isEmpty(router?.query?.name)) {
      setValue('name', '')
    }
  }, [router?.query?.name, setValue])

  return (
    <form className={formStyle} onSubmit={handleSubmit} onChange={handleReset}>
      <button type="submit" className="flex">
        <Icon type="search" className="text-primary" />
      </button>
      <Controller
        control={control}
        name="name"
        defaultValue={router.query.name ?? ''}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder={placeholder}
            className="placeholder-text-gray-1 h-6 w-full border-0 px-4 text-bw-1 focus:border-0 focus:outline-0 focus:ring-0"
          />
        )}
      />
    </form>
  )
}

export default SearchForm
