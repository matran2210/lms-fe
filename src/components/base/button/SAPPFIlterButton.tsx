import React from 'react'
import ButtonPrimary from 'src/components/base/button/ButtonPrimary'
import ButtonSecondary from 'src/components/base/button/ButtonSecondary'

interface IProps {
  titleReset: string
  resetClick: () => void
  titleSubmit: string
  okClick: () => void
  disabled: boolean
  loading?: boolean
  classNameSubmit?: string
  classNameCancel?: string
}

const SappFilterButton = ({
  okClick,
  resetClick,
  titleReset,
  titleSubmit,
  disabled,
  loading,
  classNameSubmit,
  classNameCancel,
}: IProps) => {
  return (
    <div className="flex">
      <ButtonSecondary
        title={titleReset}
        className={`${classNameCancel ?? ''} me-4 rounded-md`}
        onClick={resetClick}
        disabled={disabled}
        size="small"
      />
      <ButtonPrimary
        title={titleSubmit}
        onClick={okClick}
        disabled={disabled}
        loading={loading}
        size="small"
        className={`${classNameSubmit ?? ''}rounded-md`}
      />
    </div>
  )
}

export default SappFilterButton
