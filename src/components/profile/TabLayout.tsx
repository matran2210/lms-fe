import React from 'react'

interface TabheaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  headerButtons: React.ReactNode
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

const TabLayout: React.FC<TabheaderProps> = ({
  children,
  title,
  headerButtons,
  onScroll,
  ...props
}) => {
  return (
    <div className="relative">
      <div
        className="sticky top-0 flex items-center justify-between border-b border-[#F1F1F1] bg-white"
        {...props}
      >
        <div className="ml-6 pb-5 pt-6 text-xl font-medium">{title}</div>
        <span className="mr-6">{headerButtons}</span>
      </div>
      <div onScroll={onScroll} className="h-[calc(604px-70px)] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default TabLayout
