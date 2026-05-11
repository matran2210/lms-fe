'use client'
import { DownloadIcon, FolderIcon } from '@lms/assets'
import { IResource } from '@lms/core'
import { ActionCellWithPopover, Tooltip } from '@lms/ui'

interface IFolderItemProps {
  folder: IResource
  onFolderClick?: (folderId: string) => void
}

const FolderItem = ({ folder, onFolderClick }: IFolderItemProps) => {
  const handleOpenFolder = () => {
    if (folder?.id) onFolderClick?.(folder.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpenFolder}
      className="flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg bg-gray-100 px-2 md:px-4 py-2 md:py-3 shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] transition-colors border border-transparent hover:border-primary-400"
    >
      <span className="shrink-0">
        <FolderIcon />
      </span>
      <Tooltip
        placement="topLeft"
        title={folder.name}
      >
        <span className="text-secondary min-w-0 flex-1 truncate text-left text-sm font-medium leading-[22px]">
          {folder.name}
        </span>
      </Tooltip>
      <div
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      >
        <ActionCellWithPopover
          className=""
          listAction={[
            {
              icon: <DownloadIcon className="h-5 w-5" />,
              nameAction: 'Download',
              action: () => { },
            },
          ]}
        />
      </div>
    </div>
  )
}

export default FolderItem
