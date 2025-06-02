import React from 'react'
import CalcButton from './calcButton'
import DeleteIcon from '@assets/icons/CalculatorIcons/DeleteIcon'

interface IProps {
  click: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  keyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const ButtonsContainer = (props: IProps) => {
  const { click, keyDown } = props
  return (
    <div
      className="calc__btns-container"
      onClick={click}
      onKeyDown={keyDown}
      aria-hidden="true"
    >
      <CalcButton value="AC" />
      <CalcButton value="+/-" />
      <CalcButton value="%" />
      <CalcButton value="÷" colored />

      <CalcButton value="7" />
      <CalcButton value="8" />
      <CalcButton value="9" />
      <CalcButton value="x" colored />

      <CalcButton value="4" />
      <CalcButton value="5" />
      <CalcButton value="6" />
      <CalcButton value="-" colored />

      <CalcButton value="1" />
      <CalcButton value="2" />
      <CalcButton value="3" />
      <CalcButton value="+" colored />

      <CalcButton value="." />
      <CalcButton value="0" />
      <CalcButton value="delete" />
      <CalcButton value="=" colored />
    </div>
  )
}

export { ButtonsContainer as default }
