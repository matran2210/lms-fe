import React, { Component } from 'react'

const ResultComponent = (props: any) => {
  let { result } = props

  return (
    <div className="result">
      <p>{result}</p>
    </div>
  )
}

export default ResultComponent
