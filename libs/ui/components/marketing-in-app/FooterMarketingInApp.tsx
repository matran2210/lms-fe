import { useRouter } from 'next/navigation'
const FooterMarketingInApp = () => {
  const router = useRouter()
  return (
    <div className="absolute left-0 right-0 hidden items-center justify-center sm:bottom-6 md:bottom-8 md:flex lg:bottom-10 xl:bottom-16 3xl:bottom-24">
      <div
        className="pointer-events-auto cursor-pointer rounded-lg bg-white px-2 py-1 font-semibold text-primary shadow-md sm:text-sm md:px-6 md:py-2 md:text-base lg:px-8 lg:py-4 lg:text-lg"
        onClick={() => {
          router.push('/')
          localStorage.setItem('openModalMarketingInApp', 'true')
        }}
      >
        Khám phá ngay
      </div>
    </div>
  )
}

export default FooterMarketingInApp
