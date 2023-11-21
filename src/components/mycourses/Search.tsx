// components/SearchForm.tsx

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import SAPP_Search from '@assets/images/sapp_search.svg'
import Icon from '@components/icons'

const SearchForm: React.FC = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Redirect to the search results page with the query as a query parameter
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full ml-12 flex items-center">
      <button type="submit" className="flex">
        <Icon type="search" className="text-primary" />
      </button>
      <input
        type="text"
        placeholder="Enter name of course..."
        className="border-0 h-6 px-4 text-gray-1 focus:border-0 focus:outline-0 focus:ring-0 placeholder-text-gray-1"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

export default SearchForm
