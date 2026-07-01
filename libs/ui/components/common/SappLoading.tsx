import { LogoDefault } from '@lms/assets'

const SappLoading = ({ className }: { className?: string }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white ${className ?? ''}`}
      >
        <LogoDefault />

        <div className="mt-8 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full bg-[#EF5941] animate-loading-dot"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="h-3 w-3 rounded-full bg-[#EF5941] animate-loading-dot"
            style={{ animationDelay: '0.3s' }}
          />
          <div
            className="h-3 w-3 rounded-full bg-[#EF5941] animate-loading-dot"
            style={{ animationDelay: '0.6s' }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-dot {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-loading-dot {
          animation: loading-dot 0.9s infinite ease-in-out;
          will-change: transform, opacity;
        }
      `}</style>
    </>
  )
}

export default SappLoading