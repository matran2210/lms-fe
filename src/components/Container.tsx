import React, { HTMLAttributes } from 'react'

type GridColumn = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  span: GridColumn
  start?: GridColumn
  margin?: number
  children: React.ReactNode
}

// Explicitly declare all possible grid classes
const GRID_CLASSES = {
  colSpan: {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
  },
  colStart: {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
  },
} as const

/**
 * Container component for building a 12-column grid layout.
 *
 * Props:
 * - span (1–12): Required. Defines how many columns the content should span.
 * - start (1–12): Optional. Defines the starting column for the content. If not provided,
 *   the content is automatically centered based on the span.
 * - margin (number): Optional. Horizontal margin (in pixels) applied via `width: calc(100% - margin * 2)`.
 *   This ensures the content has consistent space on both sides, even on wider screens.
 *
 * Example usage:
 * <Container span={8} margin={24}>
 *   <YourContent />
 * </Container>
 *
 * Tailwind grid classes are pre-defined and safely included to ensure they are not purged.
 */
export default function Container({
  span,
  children,
  margin = 0,
  start,
  className = '',
  style,
  ...divProps
}: ContainerProps) {
  const calculatedStart = (Math.floor((12 - span) / 2) + 1) as GridColumn
  const colSpanClass = GRID_CLASSES.colSpan[span]
  const colStartClass = GRID_CLASSES.colStart[start ?? calculatedStart]

  return (
    <div
      className={`mx-auto grid grid-cols-12 gap-6 ${className}`}
      style={{ width: `calc(100% - ${margin * 2}px)`, ...style }}
      {...divProps}
    >
      <div className={`${colSpanClass} ${colStartClass}`}>{children}</div>
    </div>
  )
}
