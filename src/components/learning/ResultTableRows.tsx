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
          <td className="w-[5.5%] min-w-62px border-b border-dashed border-[#DCDDDD] py-5 text-center text-base text-bw-1">
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
