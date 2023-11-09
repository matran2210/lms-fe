import type { NextPage } from 'next'
import styles from '@styles/components/Home.module.scss'
import useTrans from '@i18n/index'
import HookFormTextField from 'src/components/base/textfield/HookFormTextField'
import { useForm } from 'react-hook-form'

const Home: NextPage = () => {
  const trans = useTrans()
  const { control } = useForm()
  return (
    <>
      <div className={styles.main}>HomePage</div>
      <div className="p-8">
        <h2 className="text-3xl text-state-error mb-4">Input</h2>
        <HookFormTextField
          label="Default"
          required
          name="name"
          placeholder="Placeholder"
          control={control}
          className="w-full"
        />
      </div>
    </>
  )
}

export default Home
