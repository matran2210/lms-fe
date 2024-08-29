import Certificate from './Certificate'

interface IProp {
  onOpenTab: () => void
}

const CertificateContent = ({ onOpenTab }: IProp) => {
  return (
    <div className="flex-1 bg-white pt-6 shadow-box">
      <Certificate onOpenTab={onOpenTab} />
    </div>
  )
}

export default CertificateContent
