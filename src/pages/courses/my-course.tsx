import SearchForm from '@components/mycourses/Search'
import Tabs from '@components/mycourses/Tabs'
import React from 'react'

// Config Tabs
const tabs = [
  { label: 'All', path: 'tab1', total: 23 },
  { label: 'Cfa', path: 'tab2', total: 9 },
  { label: 'Acca', path: 'tab3', total: 18 },
  { label: 'Cma', path: 'tab4', total: 8 },
]

const MyCourse = () => {
  return (
    <div className="header bg-white">
      <div className="max-w-[69.625rem] my-0 mx-auto flex">
        <Tabs tabs={tabs} />
        <SearchForm />
      </div>
    </div>
  )
}

export default MyCourse
