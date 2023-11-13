import useTrans from '@i18n/index'
import React from 'react'

type HeaderProps = {
  isOpened: boolean
  toggleDrawer: () => void
}

export default function Header({ isOpened, toggleDrawer }: HeaderProps) {
  const trans = useTrans()
  return (
    <div>
      <div onClick={toggleDrawer}>{isOpened ? 'show' : 'hidden'}</div>
      <h1 className="text-5xl text-black">Location: {trans.location}</h1>
      <div>Header</div>
    </div>
  )
}
