import React, { ReactNode, useEffect } from 'react'
import SappLoading from './SappLoading'

interface IProps {
  loading: boolean
  children: ReactNode
}
const SappLoadingGlobal = ({ children, loading }: IProps) => {
  // /**
  //  * @description logic nếu loading = true sẽ bỏ className = "lg:ml-20 ml-0" còn nếu loading = false sẽ add className = "lg:ml-20 ml-0"
  //  */
  // useEffect(() => {
  //   const loadingElements = document.getElementsByClassName('sapp-loading')

  //   for (let i = 0; i < loadingElements.length; i++) {
  //     const element = loadingElements[i] as HTMLElement
  //     if (element) {
  //       if (loading) {
  //         // Remove 'lg:ml-20' and 'ml-0' classes when loading is true
  //         element.classList.remove('lg:ml-20', 'ml-0')
  //       } else {
  //         // Add 'lg:ml-20' and 'ml-0' classes when loading is false
  //         element.classList.add('lg:ml-20', 'ml-0')
  //       }
  //     }
  //   }
  // }, [loading])

  return <>{loading ? <SappLoading /> : <>{children}</>}</>
}

export default SappLoadingGlobal
