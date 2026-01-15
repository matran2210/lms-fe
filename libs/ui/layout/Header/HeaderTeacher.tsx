import React from 'react'
import { Typography, Divider } from 'antd'

const { Title } = Typography

interface IHeaderProps {
  title: string
}

export default function HeaderTeacher({ title }: IHeaderProps) {
  return (
    <>
      <Title level={4} className="text-gray-700">
        {title}
      </Title>
      <Divider className="mt-4" />
    </>
  )
}
