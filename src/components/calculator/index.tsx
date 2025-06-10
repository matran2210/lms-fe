import React, { useEffect, useState } from 'react'
import { calculate, isNumber } from './logic/calculate'

import ButtonsContainer from './ButtonsContainer'
import Display from './display'
import Warning from './warning'

const Calculator = () => {
  const [lastExpression, setLastExpression] = useState('')
  const [calc, setCalc] = useState({
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

  const updateState = (obj: any, key: any) => {
    if (obj.next !== null && obj.next.length >= maxLength && isNumber(key)) {
      return
    }

    // Lưu biểu thức trước khi state bị xóa sau khi bấm "="
    if (key === '=' && obj.total && obj.operation && obj.next) {
      setLastExpression(`${obj.total} ${obj.operation} ${obj.next}`)
    }
    if (key === 'AC') {
      setLastExpression('')
    }

    const newObj = calculate(obj, key)

    if (newObj.total === 'Undefined') {
      setBadDivision(true)
      setCalc({ total: null, next: null, operation: null })
    } else {
      setCalc((preObj: any) => ({ ...preObj, ...newObj }))
    }
  }

  const handleClick = (obj: any, e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest('button[data-name]')
    if (!button) return

    const value = button.getAttribute('data-name')
    updateState(obj, value)
  }

  const handleKeyDown = (e: any) => {
    e.preventDefault()
  }

  const { total, next, operation } = calc

  return (
    <div className="calc">
      <Display
        total={total ?? ''}
        next={next ?? ''}
        operation={operation ?? ''}
        lastExpression={lastExpression}
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
