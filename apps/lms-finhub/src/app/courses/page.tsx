'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

const Index = () => {
  const params = useParams()
  const router = useRouter()
  router.push(`/short-course/?${params}`)
  return <div></div>
}

export default Index
