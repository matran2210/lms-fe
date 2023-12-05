import { useEffect, useRef } from 'react'

interface DataItem {
  id: number
  title: string
  value: number
}

interface Props {
  data: DataItem[]
}

const Chart: React.FC<Props> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const columnWidth = width / (data.length + 1) // +1 để dành một phần để vẽ trục hoành

    // Margin từ border đến biểu đồ
    const yAxisMargin = 30 // Margin bên trái cho trục hoành
    const xAxisMargin = 10 // Margin bên dưới cho trục tung

    ctx.beginPath()
    ctx.moveTo(yAxisMargin, 0)
    ctx.lineTo(yAxisMargin, height - xAxisMargin)
    ctx.stroke()
    ctx.fillStyle = '#141414'

    for (let i = 0; i <= 100; i += 10) {
      const yPos = height - (i / 100) * (height - xAxisMargin) + 5
      ctx.fillText(`${i}`, 5, yPos)
    }

    const yPositions = [50, 70] // Các mốc giá trị trục tung
    yPositions.forEach((pos) => {
      const yPos = height - (pos / 100) * (height - xAxisMargin)
      ctx.beginPath()
      ctx.moveTo(yAxisMargin, yPos)
      ctx.lineTo(width, yPos)
      ctx.strokeStyle = '#141414' // Màu đỏ cho thanh ngang
      ctx.stroke()
    })

    // Vẽ trục hoành (title)
    data.forEach((item, index) => {
      const xPos = columnWidth * (index + 1) + yAxisMargin

      const yPos = height - (item.value / 100) * (height - xAxisMargin)

      // Vẽ thanh ngang
      ctx.fillStyle = '#FFB800'
      ctx.fillRect(xPos - 25, yPos, 50, 5)
    })
  }, [data])

  return (
    <canvas
      ref={canvasRef}
      width={950}
      height={400}
      style={{ margin: '20px' }}
    />
  )
}

export default Chart
