import { IButtonCancelSubmitProps } from 'src/type'
import ButtonDanger from './ButtonDanger'
import ButtonPrimary from './ButtonPrimary'
import ButtonText from './ButtonText'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
  state = 'primary',
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      <ButtonText {...cancel}></ButtonText>
      {state === 'primary' && <ButtonPrimary {...submit}></ButtonPrimary>}
      {state === 'danger' && <ButtonDanger {...submit}></ButtonDanger>}
    </div>
  )
}

export default ButtonCancelSubmit
