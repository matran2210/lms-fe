import type { NextPage } from 'next'
import ProfilePage from './[page]'

const Home: NextPage = () => {
  return (
    <>
      <ProfilePage page={'myprofile'} />
    </>
  )
}

export default Home
