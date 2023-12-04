// components/SearchForm.tsx

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Icon from '@components/icons'

interface IProps {
  placeholder: string
  formStyle: string
}

const SearchForm = ({ placeholder, formStyle }: IProps) => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Redirect to the search results page with the query as a query parameter
    router.push(`courses?name=${encodeURIComponent(query)}&type=${router.query.type}`)
  }

  return (
    <form onSubmit={handleSubmit} className={formStyle}>
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
