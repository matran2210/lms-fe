'use client'

import { SortGridIcon, SortListIcon } from '@lms/assets'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@lms/core'
import { buildQueryString } from '@lms/utils'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface ClassResourceLayoutToggleProps {
  layout: 'list' | 'grid'
  onSelectList: () => void
  onSelectGrid: () => void
}

const ClassResourceLayoutToggle = ({
  layout,
  onSelectList,
  onSelectGrid,
}: ClassResourceLayoutToggleProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = Object.fromEntries(searchParams.entries())

  return (
    <div className="rounded-[7px] border border-gray-300 bg-white p-1 transition-colors">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onSelectList()
            router.push(
              `${pathname}?${buildQueryString({
                ...query,
                layout: 'list',
                page_index: DEFAULT_PAGE_NUMBER,
                page_size: DEFAULT_PAGE_SIZE,
              })}`,
            )
          }}
          className={clsx(
            'flex items-center rounded px-2 py-1 transition-colors',
            layout === 'list' ? 'bg-primary font-semibold text-white' : 'hover:bg-gray-100',
          )}
        >
          <div
            className={clsx(
              'flex items-center justify-center gap-2.5',
              layout === 'list' ? 'text-white' : 'text-gray-800',
            )}
          >
            <SortListIcon />
            <span className="text-sm leading-[22px]">List Layout</span>
          </div>
        </button>
        <button
          type="button"
          aria-pressed={layout === 'grid'}
          onClick={() => {
            onSelectGrid()
            const { page_index, page_size, layout: _layout, ...gridRestQuery } =
              query
            router.push(
              `${pathname}?${buildQueryString(gridRestQuery)}`,
            )
          }}
          className={clsx(
            'flex items-center rounded px-2 py-1 transition-colors',
            layout === 'grid' ? 'bg-primary font-semibold text-white' : 'hover:bg-gray-100',
          )}
        >
          <div
            className={clsx(
              'flex items-center justify-center gap-2.5',
              layout === 'grid' ? 'text-white' : 'text-gray-800',
            )}
          >
            <SortGridIcon />
            <span className="text-sm leading-[22px]">Grid Layout</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default ClassResourceLayoutToggle
