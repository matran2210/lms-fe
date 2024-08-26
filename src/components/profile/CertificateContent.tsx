import Certificate from './Certificate'

interface IProp {
  onOpenTab: () => void
}

const CertificateContent = ({ onOpenTab }: IProp) => {
  return <Certificate onOpenTab={onOpenTab} />
}

export default CertificateContent
