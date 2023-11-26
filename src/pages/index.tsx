import type { NextPage } from 'next'
import ProfilePage from './profile/[page]'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import confirmDialogThunk from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { confirmDialogReducer } from 'src/redux/slice/ConfirmDialog/ConfirmDialogSlice'

const Home: NextPage = () => {
  return (
    <>
      <ProfilePage page={'my_profile'} />
    </>
  )
}

export default Home
