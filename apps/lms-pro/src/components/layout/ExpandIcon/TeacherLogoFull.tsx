import { LogoSappIcon } from '@assets/icons'
import Link from 'next/link'
import { PageLink } from '@lms/core'

const TeacherLogoFull = () => {
  return (
    <Link href={PageLink.TEACHERS}>
      <LogoSappIcon />
    </Link>
  )
}

export default TeacherLogoFull
