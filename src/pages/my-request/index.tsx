import Layout from '@components/layout'
import FormRequest from '@components/my-request/FormRequest'
import React from 'react'

import { PageLink } from 'src/constants'
import { REQUEST_TYPE } from 'src/constants/my-request'

import { ITabs } from 'src/type'

type Props = {}

function ListRequest({}: Props) {
  return (
    <Layout title="My Request">
      <FormRequest initialRequestType={REQUEST_TYPE.TIMEOFF.value} />
      {/* <RequestDetail requestType={REQUEST_TYPE.WEEKLY_NORM.value} />  */}
      {/* <FormTimeoff/> */}
      {/* <TimeoffDetail/> */}
    </Layout>
  )
}

export default ListRequest
