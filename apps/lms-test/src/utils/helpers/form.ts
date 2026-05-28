import { UseFormSetError } from 'react-hook-form'

const display422Errors = (error: any, setError: UseFormSetError<any>) => {
  if (error?.response?.status !== 422) {
    return
  }
  const entitiesErrors = error?.response?.data?.error?.others
  if (!entitiesErrors?.[0]) {
    return
  }
  entitiesErrors.forEach(
    ({
      property,
      errors,
    }: {
      property: string
      errors: {
        code: string
        message: string
      }[]
    }) => {
      if (errors?.[0]?.message) {
        setError(property, { message: errors?.[0]?.message })
      }
    },
  )
}
export { display422Errors }
