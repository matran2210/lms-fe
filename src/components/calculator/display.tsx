import React from 'react'
import displayLogic, {
  formatExpression,
  formatResult,
} from './logic/displayLogic'
import { isEmpty } from 'lodash'
import { formatNumber } from '@utils/formatNumber'

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
      <div className={classExpression}>
        {formatExpression(expression || lastExpression)}
      </div>
      <div className={classResult}>{formatResult(result)}</div>
    </div>
  )
}

export { Display as default }
