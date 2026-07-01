import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { PageLink } from 'src/constants/routes'

const LogoDefault = ({ className }: { className?: string }) => {
  return (
    <Link href={PageLink.SHORT_COURSE}>
      <Image
        src="/icon.png"
        alt="Logo"
        width={42}
        height={50}
        className={clsx(
          'logo-default h-[50px] w-[42px] shrink-0 cursor-pointer object-contain',
          className,
        )}
      />
    </Link>
  )
}

export default LogoDefault
