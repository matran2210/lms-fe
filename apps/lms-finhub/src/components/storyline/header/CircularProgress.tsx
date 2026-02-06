import { motion } from 'framer-motion'

interface CircularProgressProps {
  progress: number // 0 - 100
  size?: number
  strokeWidth?: number
}

const CircularProgress = ({
  progress,
  size = 24,
  strokeWidth = 4,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const clamped = Math.min(100, Math.max(0, progress))
  const offset = circumference * (1 - clamped / 100)

  const isDone = clamped === 100

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#D9D9D9"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={false}
        animate={{
          strokeDashoffset: offset,
          stroke: isDone ? '#22c55e' : '#626262', // xanh khi 100%
        }}
        transition={{
          strokeDashoffset: { duration: 0.5, ease: 'easeOut' },
          stroke: { duration: 0.2 },
        }}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  )
}

export default CircularProgress
