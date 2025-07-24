import React, { useEffect, useState } from 'react'
import { isNumber, calculate } from './logic/calculate'

import Display from './display'
import Warning from './warning'
import ButtonsContainer from './ButtonsContainer'
import { CalcState } from 'src/type/courses-3-level'

const Calculator = () => {
  const [calc, setCalc] = useState<CalcState>({
    total: null,
    next: null,
    operation: null,
  })

  const [badDivision, setBadDivision] = useState(false)
  useEffect(() => {
    if (badDivision) {
      setTimeout(() => {
        setBadDivision(false)
      }, 3000)
    }
  }, [badDivision])

  const maxLength = 20

  const updateState = (obj: CalcState, key: string) => {
    if (obj.next !== null && obj.next.length >= maxLength && isNumber(key)) {
      return
    }

    const newObj = calculate(obj, key)

    if (newObj.total === 'Undefined') {
      setBadDivision(true)
      setCalc({ total: null, next: null, operation: null })
    } else {
      setCalc((preObj) => ({ ...preObj, ...newObj }))
    }
  }

  const handleClick = (obj: CalcState, e: React.MouseEvent<HTMLElement>) => {
    updateState(obj, (e.target as HTMLElement).dataset.name || '')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const { total, next, operation } = calc

  return (
    <div className="calc">
      <Display
        total={total ?? ''}
        next={next ?? ''}
        operation={operation ?? ''}
      />
      <ButtonsContainer
        click={(e) => handleClick(calc, e)}
        keyDown={handleKeyDown}
      />
      <Warning warning={badDivision} />
    </div>
  )
}

export default Calculator
