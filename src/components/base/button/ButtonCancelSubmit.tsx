import { IButtonCancelSubmitProps } from 'src/type'
import SappButton from './SappButton'
import ButtonText from './ButtonText'

const ButtonCancelSubmit = ({
  submit,
  cancel,
  className = 'flex align-middle justify-between',
  color = 'primary',
}: IButtonCancelSubmitProps) => {
  return (
    <div className={className}>
      <ButtonText {...cancel}></ButtonText>
      <SappButton color={color} {...submit}></SappButton>
    </div>
  )
}

export default ButtonCancelSubmit
