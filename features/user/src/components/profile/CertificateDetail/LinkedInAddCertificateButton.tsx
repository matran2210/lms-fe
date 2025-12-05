// components/LinkedInAddCertificateButton.tsx
import React from 'react'

interface LinkedInAddCertificateButtonProps {
  certName: string
  orgName: string
  issueYear: number
  issueMonth: number
  certUrl: string
  certId: string
}

const LinkedInAddCertificateButton: React.FC<
  LinkedInAddCertificateButtonProps
> = ({ certName, orgName, issueYear, issueMonth, certUrl, certId }) => {
  const linkedInUrl =
    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent(certName)}` +
    `&organizationName=${encodeURIComponent(orgName)}` +
    `&issueYear=${issueYear}` +
    `&issueMonth=${issueMonth}` +
    `&certUrl=${encodeURIComponent(certUrl)}` +
    `&certId=${encodeURIComponent(certId)}`

  return (
    <a
      href={linkedInUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 font-medium text-white shadow-md"
    >
      Add to LinkedIn
    </a>
  )
}

export default LinkedInAddCertificateButton
