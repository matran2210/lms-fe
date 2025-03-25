import ClassDetail from 'src/pages/teachers/my-class/components/ClassDetail'

import { useState } from 'react'
import Overview from 'src/pages/teachers/my-class/components/OverView'

export default function WrapperOverview() {
  const [certificateData, setCertificateData] = useState<any>([])
  return (
    <ClassDetail setDataOverView={setCertificateData}>
      <Overview certificateData={certificateData} />
    </ClassDetail>
  )
}
