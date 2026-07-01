import LogoDefault from '@components/layout/ExpandIcon/LogoDefault'
import dynamic from 'next/dynamic'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  {
    ssr: false,
  },
)

const SappLoading = ({ className }: { className?: string }) => {
  return (
    <div
      className={`fixed z-[9999] block h-full w-full bg-white backdrop-blur-[2000px] ${className ?? ''}`}
    > 
    <LogoDefault/>
    </div>
  )
}

export default SappLoading
