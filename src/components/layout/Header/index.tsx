import useTrans from '@i18n/index'
import React from 'react'

const Header = () => {
  const trans = useTrans()
  return (
    <div>
      <h1>Location: {trans.location}</h1>
      <p>Header</p>
    </div>
  )
}

export default Header
