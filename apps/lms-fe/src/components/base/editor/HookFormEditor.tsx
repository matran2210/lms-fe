import { Skeleton } from 'antd'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import dynamic from 'next/dynamic'

export const DEFAULT_EDITOR_VALUE = ''

interface Props {
  name: string
  control: Control<any>
  defaultValue?: any
  className?: string
  height?: number
  skeleton?: boolean
  math?: boolean
  placeholder?: string
  required?: boolean
  label?: string
  labelClass?: string
  guideline?: string[]
  handleChange?: any
  disabled?: boolean
  key?: number | string
}

const DynamicBundledEditor = dynamic(() => import('../../form/editor'), {
  ssr: false,
})

const HookFormEditor = ({
  name,
  control,
  defaultValue = DEFAULT_EDITOR_VALUE,
  className,
  height,
  skeleton,
  math,
  placeholder,
  label,
  required,
  guideline,
  handleChange,
  // labelClass = 'd-flex align-items-center fs-6 fw-bold form-label',
  disabled,
  key,
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <>
            {label && (
              <label className={'mb-2 block text-base font-medium'}>
                {label} {`${required ? '*' : ''}`}
              </label>
            )}{' '}
            {!skeleton ? (
              <div>
                <DynamicBundledEditor
                  onChange={(e) => {
                    onChange(e)
                    handleChange && handleChange(e)
                  }}
                  key={key}
                  valueText={defaultValue}
                  className={`${className} ${error ? 'tox-tinymce_error' : ''}`}
                  height={height}
                  math={math}
                  placeholder={placeholder}
                  disabled={disabled}
                />
                <div>
                  {/* <GuidelineField guideline={guideline} /> */}
                  <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                </div>
              </div>
            ) : (
              <Skeleton.Input
                size="large"
                active
                className="hook-form-editors_skeleton"
              ></Skeleton.Input>
            )}
          </>
        )
      }}
    />
  )
}

export default HookFormEditor
