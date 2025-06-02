import DeleteIcon from '@assets/icons/CalculatorIcons/DeleteIcon'
import React from 'react'

interface IProps {
  value?: string | React.ReactNode
  colored?: boolean
  span?: number
}

const CalcButton = (props: IProps) => {
  const { value, colored, span } = props
  const classList = `calc__btn
      ${colored ? ' btn--colored' : ''} 
      ${span !== 1 ? ` btn--span-${span}` : ''}`

  const convertValueToIcon = (val: any) => {
    if (val === 'delete') return <DeleteIcon />
    return val
  }

  return (
    <button type="button" className={classList} data-name={value}>
      {convertValueToIcon(value)}
    </button>
  )
}

export { CalcButton as default }
