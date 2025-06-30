import React, { PropsWithChildren } from 'react'

const BottomMenu = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed bottom-8 left-1/2 mx-auto w-max max-w-sm -translate-x-1/2 transform lg:hidden">
      <div className="flex justify-center gap-5 rounded-xl bg-primary px-4 py-2 shadow-card md:gap-0 md:px-6">
        {children}
      </div>
    </div>
  )
}

export default BottomMenu
