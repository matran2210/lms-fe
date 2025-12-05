import React from 'react'
import ButtonSecondary from './ButtonSecondary'
import ButtonPrimary from './ButtonPrimary'

interface IProps {
  titleReset: string
  resetClick: () => void
  titleSubmit: string
  okClick: () => void
  disabled: boolean
  loading?: boolean
}

const SappFilterButton = ({
  okClick,
  resetClick,
  titleReset,
  titleSubmit,
  disabled,
  loading,
}: IProps) => {
  return (
    <div className="flex">
      <ButtonSecondary
        title={titleReset}
        className="me-4 h-10"
        onClick={resetClick}
        disabled={disabled}
        size="small"
      />
      <ButtonPrimary
        title={titleSubmit}
        onClick={okClick}
        disabled={disabled}
        loading={loading}
        className="h-10"
      />
    </div>
  )
}

export default SappFilterButton
