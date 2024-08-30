import Certificate from './Certificate'

interface IProp {
  onOpenTab: () => void
}

const CertificateContent = ({ onOpenTab }: IProp) => {
  return (
    <div className="flex-1 pt-6">
      <Certificate onOpenTab={onOpenTab} />
    </div>
  )
}

export default CertificateContent
