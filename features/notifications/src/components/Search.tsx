// components/SearchForm.tsx

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@lms/assets'

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
    router.push(`courses?name=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={formStyle}>
      <button type="submit" className="flex">
        <Icon type="search" className="text-primary" />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        className="placeholder-text-[#A1A1A1] h-6 border-0 px-4 text-[#A1A1A1] focus:border-0 focus:outline-0 focus:ring-0"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

export default SearchForm
