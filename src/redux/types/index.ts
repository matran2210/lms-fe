export interface IResponse<T> {
  success: boolean
  data: T
  error: IResponseError
}

export interface IResponseError {
  code: string
  message: string
  others: any
}
