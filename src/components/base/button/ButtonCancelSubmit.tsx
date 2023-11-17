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
      <ButtonText
        title={cancel.title}
        onClick={cancel.onClick}
        className={cancel.className}
        link={cancel.link}
        disabled={cancel.disabled}
        size={cancel.size}
        full={cancel.full}
        name={cancel.name}
        type={cancel.type}
        isPaddingHorizontal={cancel.isPaddingHorizontal}
      ></ButtonText>
      <ButtonPrimary
        title={submit.title}
        onClick={submit.onClick}
        className={submit.className}
        link={submit.link}
        disabled={submit.disabled}
        size={submit.size}
        full={submit.full}
        name={submit.name}
        type={submit.type}
        isPaddingHorizontal={submit.isPaddingHorizontal}
      ></ButtonPrimary>
    </div>
  )
}

export default ButtonCancelSubmit
