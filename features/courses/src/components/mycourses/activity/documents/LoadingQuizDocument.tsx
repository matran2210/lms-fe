import clsx from 'clsx'

const LoadingQuizDocument = () => {
  return (
    <div className="text-black-1 h-full space-y-6" aria-busy="true">
      {/* Blurred notification / locked state placeholder */}
      <div className="h-10 w-full animate-pulse rounded bg-skeleton" />

      {/* Question title */}
      <div className="space-y-3">
        <div
          className={clsx('animate-pulse rounded-md bg-skeleton', 'h-8 w-full')}
        />
        <div
          className={clsx('animate-pulse rounded-md bg-skeleton', 'h-8 w-full')}
        />
      </div>

      {/* Question body (paragraphs) */}
      <div className="space-y-2">
        <div
          className={clsx('animate-pulse rounded-md bg-skeleton', 'h-8 w-full')}
        />
        <div
          className={clsx('animate-pulse rounded-md bg-skeleton', 'h-8 w-full')}
        />
      </div>

      {/* Options skeleton (4 choices) */}
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={clsx(
                'animate-pulse rounded-md bg-skeleton',
                'h-8 w-full',
              )}
            />
            <div
              className={clsx(
                'animate-pulse rounded-md bg-skeleton',
                'h-8 w-full',
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingQuizDocument
