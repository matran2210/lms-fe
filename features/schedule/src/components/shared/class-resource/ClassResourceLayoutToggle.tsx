'use client'

import { SortGridIcon, SortListIcon } from '@lms/assets'
import clsx from 'clsx'

export interface ClassResourceLayoutToggleProps {
  layout: 'list' | 'grid'
  onSelectList: () => void
  onSelectGrid: () => void
}

const ClassResourceLayoutToggle = ({
  layout,
  onSelectList,
  onSelectGrid,
}: ClassResourceLayoutToggleProps) => (
  <div
    className="flex overflow-hidden rounded-[6px] border border-solid border-[#F1F1F4] bg-white"
    role="group"
    aria-label="Class resource layout"
  >
    <button
      type="button"
      aria-pressed={layout === 'list'}
      aria-label="List view"
      onClick={onSelectList}
      className={clsx(
        'flex h-8.5 flex-1 items-center justify-center px-6 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        layout === 'list'
          ? 'bg-primary text-white'
          : 'bg-primary/5 text-primary',
      )}
    >
      <span className="inline-flex h-4 w-4 shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full">
        <SortListIcon />
      </span>
    </button>
    <button
      type="button"
      aria-pressed={layout === 'grid'}
      aria-label="Grid view"
      onClick={onSelectGrid}
      className={clsx(
        'flex h-8.5 flex-1 items-center justify-center px-6 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        layout === 'grid'
          ? 'bg-primary text-white'
          : 'bg-primary/5 text-primary',
      )}
    >
      <span className="inline-flex h-4 w-4 shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full">
        <SortGridIcon />
      </span>
    </button>
  </div>
)

export default ClassResourceLayoutToggle
