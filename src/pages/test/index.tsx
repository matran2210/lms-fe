import { LAYOUT } from '@utils/constants'
import { asBlob } from 'html-docx-js-typescript-papersize-thenn'

// import HTMLtoDOCX from "html-to-docx";
//@ts-ignore
import { saveAs } from 'file-saver'
// const HTMLtoDOCX = require('html-to-docx')
const Test = () => {
  const htmlString = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div>good</div>
  </body>
  </html>`
  const htmlToDoc = async () => {
    const blob = await asBlob(htmlString)
    saveAs(blob, 'test.docx')
  }
  return <button onClick={htmlToDoc}>Test</button>
}

// eslint-disable-next-line import/no-unused-modules
export default Test
Test.layout = LAYOUT.FULLSCREEN_LAYOUT
