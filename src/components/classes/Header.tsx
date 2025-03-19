import React from 'react'
import { Typography, Divider } from 'antd'

const { Title } = Typography

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <>
      <Title level={4} className="text-gray-700">
        {title}
      </Title>
      <Divider className="mt-4" />
    </>
  )
}
