import React from 'react'

interface IProps {
  onClick: () => void
  titleSecondary?: string | undefined
  titlePrimary: string
}

const ActionDiscussion = ({
  onClick,
  titlePrimary,
  titleSecondary = 'Cancel',
}: IProps) => {
  return (
    <div className="relative">
      <div className="flex flex-row items-center">
        <div
          onClick={onClick}
          className="cursor-pointer text-sm text-gray-800 underline"
        >
          {titleSecondary}
        </div>
        <span className="pl-1 text-sm text-gray">{titlePrimary}</span>
      </div>
    </div>
  )
}

export default ActionDiscussion
