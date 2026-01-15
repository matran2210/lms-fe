import React from 'react'

export const ActivityLeftSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 lg:w-[65%]">
      {/* Learning Outcome skeleton */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-3 h-10 w-10/12 rounded bg-skeleton" />
        <ul className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="h-4 w-11/12 rounded bg-skeleton" />
          ))}
        </ul>
      </div>

      {/* Video/TextDocument skeleton */}
      <div className="mb-24 rounded-lg bg-white pb-4 shadow md:mx-4 lg:mx-0 lg:mb-10 lg:block lg:rounded-xl">
        <div className="space-y-4 px-4 pt-4 lg:px-6">
          {/* Fake tab documents */}
          <div className="space-y-2">
            <div className="h-10 w-10/12 rounded bg-skeleton" />
            <div className="h-80 w-full rounded bg-skeleton" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ActivityRightSkeleton = () => {
  return (
    <section className="w-[35%] space-y-6">
      {/* SectionContentModal skeleton */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-3 h-10 w-10/12 rounded bg-skeleton" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-11/12 rounded bg-skeleton" />
          ))}
        </div>
      </div>
    </section>
  )
}

export const LoadingSection = () => {
  return (
    <div className="rounded-lg bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-8 w-8/12 rounded bg-skeleton" />
          <div className="flex gap-3">
            <div className="h-6 w-24 rounded bg-skeleton" />
            <div className="h-6 w-16 rounded bg-skeleton" />
            <div className="h-6 w-20 rounded bg-skeleton" />
          </div>
        </div>
        <div className="h-9 w-20 rounded bg-skeleton" />
      </div>

      {/* Activities */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, j) => (
          <div
            key={j}
            className="flex items-center justify-between gap-4 rounded-lg bg-gray-100 p-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-skeleton" />
              <div className="flex flex-col gap-1">
                <div className="h-6 w-80 rounded bg-skeleton" />
                <div className="h-6 w-32 rounded bg-skeleton" />
              </div>
            </div>
            <div className="h-8 w-16 rounded bg-skeleton" />
          </div>
        ))}
      </div>
    </div>
  )
}
