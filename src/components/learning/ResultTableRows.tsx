import React, { useState } from 'react'
import ResultRow from './ResultRow'

interface ResultTableRows {
  resultTablerows: any[]
}

const ResultTableRows: React.FC<ResultTableRows> = ({ resultTablerows }) => {
  return (
    <>
      {resultTablerows.map((resultTablerow, index) => (
        <tr key={index + 1} className={`item item-${index + 1}`}>
          <td className="text-base text-bw-1 text-center py-5 border-b border-default border-dashed w-[5.5%]">
            {index + 1}
          </td>
          <ResultRow
            type={resultTablerow.type}
            partName={resultTablerow.partName}
            chapter={resultTablerow.chapter}
            correctStatus={resultTablerow.correctStatus}
            status={resultTablerow.status}
            statusPercentage={resultTablerow.statusPercentage}
            statusIcon={resultTablerow.statusIcon}
            time={resultTablerow.time}
          />
        </tr>
      ))}
    </>
  )
}

export default ResultTableRows
