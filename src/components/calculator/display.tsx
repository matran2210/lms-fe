import React from 'react'
import displayLogic from './logic/displayLogic'
import { isEmpty } from 'lodash'

interface IProps {
  total?: string
  next?: string
  operation?: string
  lastExpression?: string
}

const Display = (props: IProps) => {
  const { total, next, operation, lastExpression } = props
  const { expression, result } = displayLogic(total, next, operation)

  let classExpression = 'display_expression'
  let classResult = 'display__next'

  if (isEmpty(total) && isEmpty(next) && isEmpty(operation)) {
    classResult = 'display__next opacity-0'
  }

  return (
    <div className="calc__display">
      <div className={classExpression}>{expression || lastExpression}</div>
      <div className={classResult}>{result}</div>
    </div>
  )
}

export { Display as default }
