import type { NextPage } from 'next'
import ProfilePage from './profile/[page]'

const Home: NextPage = () => {
  return (
    <>
      <ProfilePage page={'my-profile'} />
    </>
  )
}

export default Home
