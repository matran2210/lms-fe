// components/SearchForm.tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Icon from '@components/icons'
import { buildQueryString } from '@utils/index'

interface IProps {
  placeholder: string
  formStyle: string
}

const SearchForm = ({ placeholder, formStyle }: IProps) => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const queryString = buildQueryString({
    status: router.query.status || '',
    type: router.query.type ?? '',
  })

  useEffect(() => {
    let timerId: any

    // Use useEffect to set up a timer to make the API call after 3 seconds
    if (query.length > 2) {
      timerId = setTimeout(() => {
        router.push(`/courses?name=${encodeURIComponent(query) ?? ''}${queryString}`)
      }, 2000)
    }

    // Clean up the timer when the component unmounts or when the input value changes
    return () => {
      clearTimeout(timerId)
    }
  }, [query])

  useEffect(() => {
    if(router.pathname === '/courses'){
      router.push(`/courses`)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Redirect to the search results page with the query as a query parameter
    router.push(
      `courses?${queryString}`,
    )
  }

  return (
    <form className={formStyle} onSubmit={handleSubmit}>
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
    </form>
  )
}

export default SearchForm
