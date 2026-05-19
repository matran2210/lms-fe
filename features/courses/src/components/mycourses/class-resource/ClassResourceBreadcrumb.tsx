'use client'

import { BreadcrumbChevronIcon } from '@lms/assets'
import clsx from 'clsx'

export type ClassResourceBreadcrumbNode = {
  id?: string
  name?: string
}

export interface ClassResourceBreadcrumbProps {
  displayFolderChain: ClassResourceBreadcrumbNode[]
  isAtResourceRoot: boolean
  onNavigateToFolder: (parentId: string | undefined) => void
}

const ClassResourceBreadcrumb = ({
  displayFolderChain,
  isAtResourceRoot,
  onNavigateToFolder,
}: ClassResourceBreadcrumbProps) => (
  <nav
    className={clsx(
      'mb-4 mt-4 flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg px-4 py-3',
      'bg-primary/5 text-sm font-medium text-primary',
    )}
    aria-label="Đường dẫn thư mục class resource"
  >
    {isAtResourceRoot ? (
      <span>Class Resource</span>
    ) : (
      <button
        type="button"
        className="rounded px-0.5 transition-colors hover:bg-primary/10 hover:underline"
        onClick={() => onNavigateToFolder(undefined)}
      >
        Class Resource
      </button>
    )}
    {displayFolderChain.map((node, index) => {
      const isLast = index === displayFolderChain.length - 1
      return (
        <span
          key={node.id ?? `crumb-${index}`}
          className="inline-flex items-center gap-x-1"
        >
          <span className="inline-flex shrink-0" aria-hidden>
            <BreadcrumbChevronIcon />
          </span>
          {isLast ? (
            <span>{node.name}</span>
          ) : (
            <button
              type="button"
              className="rounded px-0.5 transition-colors hover:bg-primary/10 hover:underline"
              onClick={() => node.id && onNavigateToFolder(node.id)}
            >
              {node.name}
            </button>
          )}
        </span>
      )
    })}
  </nav>
)

export default ClassResourceBreadcrumb
