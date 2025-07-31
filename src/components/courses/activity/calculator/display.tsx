import React from 'react'
import PropTypes from 'prop-types'
import displayLogic from './logic/displayLogic'

interface IProps {
  total?: string
  next?: string
  operation?: string
}

const Display = (props: IProps) => {
  const { total, next, operation } = props
  const { operationChar, holder, display } = displayLogic(
    total,
    next,
    operation,
  )
  let classOperation = 'display__operation'
  if (operationChar === 0) {
    classOperation = 'display__operation opacity-0'
  }
  let classHolder = 'display__holder'
  if (holder === 0) {
    classHolder = 'display__holder opacity-0'
  }
  return (
    <div className="calc__display">
      <div className={classOperation}>{operationChar}</div>
      <div className={classHolder}>{holder}</div>
      <div className="display__next">{display}</div>
    </div>
  )
}

export { Display as default }
