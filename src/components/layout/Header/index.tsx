import useTrans from '@i18n/index'
import React from 'react'

const Header = () => {
  const trans = useTrans()
  return (
    <div>
      <h1 className="text-5xl text-black">Location: {trans.location}</h1>
      <p>Header</p>
    </div>
  )
}

export default Header
