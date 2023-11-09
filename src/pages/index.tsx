import type { NextPage } from 'next'
import styles from '@styles/components/Home.module.scss'
import useTrans from '@i18n/index'
import HookFormTextField from 'src/components/base/textfield/HookFormTextField'
import { useForm } from 'react-hook-form'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonIcon from '@components/base/button/ButtonIcon'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ButtonText from '@components/base/button/ButtonText'
import ButtonOutlined from '@components/base/button/ButtonOutlined'

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
      <div className="flex flex-col items-center px-5 py-3 mx-3 border border-4 border-bw-1 border-dashed">
        <div>
          <ButtonPrimary
            title="ButtonPrimary lager"
            full={false}
            size={'lager'}
          />
          <span className="px-2"></span>
          <ButtonPrimary
            title="ButtonPrimary medium"
            full={false}
            size={'medium'}
          />
          <span className="px-2"></span>
          <ButtonPrimary
            title="ButtonPrimary small"
            full={false}
            size={'small'}
          />
          <span className="px-2"></span>
          <ButtonIcon>+</ButtonIcon>
        </div>
        <br />
        <br />
        <div>
          <ButtonSecondary
            title="ButtonSecondary lager"
            full={false}
            size={'lager'}
          />
          <span className="px-2"></span>
          <ButtonSecondary
            title="ButtonSecondary medium"
            full={false}
            size={'medium'}
          />
          <span className="px-2"></span>
          <ButtonSecondary
            title="ButtonSecondary small"
            full={false}
            size={'small'}
          />
        </div>
        <br />
        <br />
        <div>
          <ButtonOutlined
            title="ButtonOutlined lager"
            full={false}
            size={'lager'}
          />
          <span className="px-2"></span>
          <ButtonOutlined
            title="ButtonOutlined medium"
            full={false}
            size={'medium'}
          />
          <span className="px-2"></span>
          <ButtonOutlined
            title="ButtonOutlined small"
            full={false}
            size={'small'}
          />
        </div>
        <br />
        <br />
        <div>
          <ButtonText title="ButtonText lager" full={false} size={'lager'} />
          <span className="px-2"></span>
          <ButtonText title="ButtonText medium" full={false} size={'medium'} />
          <span className="px-2"></span>
          <ButtonText title="ButtonText small" full={false} size={'small'} />
        </div>
        <br />
        <br />
        <br />
        <div>
          <ButtonPrimary
            title="ButtonPrimary link medium"
            link="#"
            full={false}
            size={'medium'}
          />
          <span className="px-2"></span>
          <ButtonSecondary
            title="ButtonSecondary link medium"
            link="#"
            full={false}
            size={'medium'}
          />
          <span className="px-2"></span>
          <ButtonOutlined
            title="ButtonOutlined link medium"
            link="#"
            full={false}
            size={'medium'}
          />
          <span className="px-2"></span>
          <ButtonText
            title="ButtonText link medium"
            link="#"
            full={false}
            size={'medium'}
          />
        </div>
        <br />
        <br />
        <br />
        <ButtonPrimary
          title="ButtonPrimary full width lager"
          full={true}
          size={'lager'}
        />
        <br />
        <ButtonSecondary
          title="ButtonSecondary full width lager"
          full={true}
          size={'lager'}
        />
        <br />
        <ButtonOutlined
          title="ButtonOutlined full width lager"
          full={true}
          size={'lager'}
        />
        <br />
        <ButtonText
          title="ButtonText full width lager"
          full={true}
          size={'lager'}
        />
        <br />
        <br />
        <br />
        <ButtonPrimary
          title="ButtonPrimary link full width lager"
          link="#"
          full={true}
          size={'lager'}
        />
        <br />
        <ButtonSecondary
          title="ButtonSecondary link full width lager"
          link="#"
          full={true}
          size={'lager'}
        />
        <br />
        <ButtonOutlined
          title="ButtonOutlined link full width lager"
          link="#"
          full={true}
          size={'lager'}
        />
        <br />
        <ButtonText
          title="ButtonText link full width lager"
          link="#"
          full={true}
          size={'lager'}
        />
        <br />
      </div>
    </>
  )
}

export default Home
