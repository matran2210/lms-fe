import type { NextPage } from 'next'
import styles from '@styles/components/Home.module.scss'
import useTrans from '@i18n/index'

const Home: NextPage = () => {
  const trans = useTrans()
  return <div className={styles.main}>HomePage</div>
}

export default Home
