import { DEFAULT_PAGE_NUMBER } from '@lms/core'
import { buildQueryString } from '@lms/utils'

export const cleanQuery = (query: Record<string, any>) => {
  const result: Record<string, any> = {}

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
    ) {
      result[key] = value
    }
  })

  return result
}

type RouterLike = {
  push: (href: string) => void
}

export const pushQueryClassResource = (
  router: RouterLike,
  pathname: string,
  query: Record<string, any>,
  next: Record<string, any>,
) => {
  router.push(
    `${pathname}?${buildQueryString(
      cleanQuery({
        ...query,
        ...next,
        page_index: DEFAULT_PAGE_NUMBER,
      }),
    )}`,
  )
}
