export type ButtonSize = 'small' | 'medium' | 'large'

export const getTextSizeClass = (size: ButtonSize): string => {
  switch (size) {
    case 'small':
      return 'text-[0.875rem] leading-4'
    case 'medium':
      return 'text-[1rem] leading-6'
    default:
      return 'text-lg leading-6.5'
  }
}

export const getPaddingVerticalClass = (size: ButtonSize): string => {
  return size === 'large' ? 'py-2.8' : 'py-2'
}

export const getPaddingHorizontalClass = (size: ButtonSize): string => {
  switch (size) {
    case 'small':
      return 'px-7'
    case 'medium':
      return 'px-8'
    default:
      return 'px-9'
  }
}
