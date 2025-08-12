export interface BaseResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ISvg {
  className?: string
}
