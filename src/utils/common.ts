import dayjs from 'dayjs'

export const formatDate = (
  date: Date | string,
  formatStr: string = 'DD/MM/YYYY',
) => {
  return dayjs(date).format(formatStr)
}

export const cleanParams = <T extends Record<string, any>>(
  params: T,
): {
  [K in keyof T]: NonNullable<T[K]>
} => {
  const result: any = {}
  for (const [key, value] of Object.entries(params)) {
    if (
      ![null, undefined, ''].includes(value) ||
      (Array.isArray(value) && value.length)
    ) {
      result[key] = value
    }
  }
  return result
}
