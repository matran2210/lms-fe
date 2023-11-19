import { IButtonCancelSubmitProps } from 'src/type'
import ButtonPrimary from './ButtonPrimary'
import ButtonText from './ButtonText'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      <ButtonText {...cancel}></ButtonText>
      <ButtonPrimary {...submit}></ButtonPrimary>
    </div>
  )
}

export default ButtonCancelSubmit
