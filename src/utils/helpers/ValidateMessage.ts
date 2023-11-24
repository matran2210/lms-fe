const VALIDATE_REQUIRED = 'This field is required'

const VALIDATE_MIN = (field: string, least: number) =>
  `${field} must contain at least ${least} character ${least > 1 ? '(s)' : ''}`

const VALIDATE_MAX = (field: string, most: number) =>
  `${field} must contain at most ${most} character ${most > 1 ? '(s)' : ''}`

const VALIDATE_MIN_LENGTH = (field: string, max: number) =>
  `${field} should be greater than ${max} character`

const VALIDATE_PASSWORD_REGEX_MSG =
  'Password must be at least 8 characters, 1 uppercase letter, 1 number'

export {
  VALIDATE_REQUIRED,
  VALIDATE_MIN,
  VALIDATE_MAX,
  VALIDATE_MIN_LENGTH,
  VALIDATE_PASSWORD_REGEX_MSG,
}
