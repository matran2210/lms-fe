import React from 'react'
//import XSpreadsheet from "x-data-spreadsheet";
// import XSpreadsheet from "../spreadsheet/src";
import Spreadsheet from 'x-data-spreadsheet'

export default function XSpreadsheet(props: any) {
  const sheetEl = React.useRef<any>(null)
  const sheetRef = React.useRef<any>(null)
  React.useEffect(() => {
    const element = sheetEl.current as any
    const sheet = new Spreadsheet('#x-spreadsheet-demo', {
      view: {
        height: () =>
          (element && element.clientHeight) ||
          document.documentElement.clientHeight,
        width: () =>
          (element && element.clientWidth) ||
          document.documentElement.clientWidth,
      },
      ...props.options,
    })
    sheetRef.current = sheet
    return () => {
      element.innerHTML = ''
    }
  }, [props.options])
  return (
    <div
      style={{ height: props.height || '100%', width: props.width || '100%' }}
      id="x-spreadsheet-demo"
      ref={sheetEl}
    ></div>
  )
}
