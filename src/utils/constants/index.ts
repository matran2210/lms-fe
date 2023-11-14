const LAYOUT = {
  DEFAULT_LAYOUT: 'DEFAULT_LAYOUT',
  ERROR_LAYOUT: 'ERROR_LAYOUT',
  SINGLE_DIALOG_LAYOUT: 'SINGLE_DIALOG_LAYOUT',
}

const VALIDATION_FILED = 'This field is required'
const VALIDATE_FILED_MIN_LENGTH = (field: string, max: number) =>
  `${field} should be greater than ${max} character`
// const VALIDATE_FILED_MAX_LENGTH = (field: string, max: number) =>
//   `${field} should be less than ${max} character`

export { LAYOUT, VALIDATION_FILED, VALIDATE_FILED_MIN_LENGTH }
