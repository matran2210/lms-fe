import { Skeleton } from 'antd'
import { SkeletonProps } from './type'

const ProfileSkeleton = ({ children, loading }: SkeletonProps) => {
  return (
    <>
      {loading ? (
        <div className="h-8 w-full animate-pulse rounded-md bg-skeleton" />
      ) : (
        children
      )}
    </>
  )
}

export default ProfileSkeleton
