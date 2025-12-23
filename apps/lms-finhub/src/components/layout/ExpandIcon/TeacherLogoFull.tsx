import { LogoSappIcon } from '@lms/assets'
import { PageLink } from 'src/constants/routes'
import Link from 'next/link'

const TeacherLogoFull = () => {
  return (
    <Link href={PageLink.TEACHERS}>
      <LogoSappIcon />
    </Link>
  )
}

export default TeacherLogoFull
