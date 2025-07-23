import React from 'react'

interface IProps {
  value?: string
  colored?: boolean
  span?: number
}

const CalcButton = (props: IProps) => {
  const { value, colored, span } = props
  const classList = `calc__btn
      ${colored ? ' btn--colored' : ''} 
      ${span !== 1 ? ` btn--span-${span}` : ''}`
  return (
    <button type="button" className={classList} data-name={value}>
      {value}
    </button>
  )
}

export { CalcButton as default }
