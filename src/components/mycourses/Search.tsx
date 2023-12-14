// components/SearchForm.tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Icon from '@components/icons'

interface IProps {
  placeholder: string
  formStyle: string
}

const SearchForm = ({ placeholder, formStyle }: IProps) => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    let timerId: any

    // Use useEffect to set up a timer to make the API call after 3 seconds
    if (query.length > 2) {
      timerId = setTimeout(() => {
        router.push(
          `/courses?name=${encodeURIComponent(query)}&type=${
            router.query.type ?? ''
          }&status=${router.query.status ?? ''}`,
        )
      }, 2000)
    }

    // Clean up the timer when the component unmounts or when the input value changes
    return () => {
      clearTimeout(timerId)
    }
  }, [query])

  useEffect(() => {
    if (query.length === 0 && router.pathname === '/courses') {
      router.push(
        `/courses?name=&type=${router.query.type ?? ''}&status=${
          router.query.status ?? ''
        }`,
      )
    }
  }, [query])

  return (
    <div className={formStyle}>
      <button type="submit" className="flex">
        <Icon type="search" className="text-primary" />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        className="border-0 h-6 px-4 text-gray-1 focus:border-0 focus:outline-0 focus:ring-0 placeholder-text-gray-1"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchForm
