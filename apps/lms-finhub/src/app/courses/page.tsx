"use client"
import React from 'react'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  const params = router.query
  router.push(`/short-course/?${params}`)
  return <div></div>
}

export default Index
