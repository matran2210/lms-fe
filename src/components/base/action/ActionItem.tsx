import React from 'react'

interface IProps {
  title: string
  onClick?: () => void
  isShow?: boolean
}
const ActionItem = ({ title, onClick = () => {}, isShow = false }: IProps) => {
  return (
    <div>
      {isShow && (
        <div className="cursor-pointer px-3 py-2 transition" onClick={onClick}>
          <div className="px-3 text-sm font-medium text-gray-700 hover:text-primary">
            {title}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionItem
