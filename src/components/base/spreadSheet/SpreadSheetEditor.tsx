import React from 'react'
import XSpreadsheet from './spreadsheet'
const SpreadsheetEditor = () => {
  return (
    <div className="reponse-area-essay">
      <XSpreadsheet
        height="100%"
        // height="80%"
        // data={exampleData}
        options={{
          mode: 'read',
          showToolbar: false,
          showGrid: false,
          showContextmenu: false,
        }}
      />
    </div>
  )
}
export default SpreadsheetEditor
