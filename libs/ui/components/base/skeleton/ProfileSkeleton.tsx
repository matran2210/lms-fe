import { Skeleton } from 'antd'
import { SkeletonProps } from './type'

const ProfileSkeleton = ({ children, loading }: SkeletonProps) => {
  return <>{loading ? <Skeleton.Input /> : children}</>
}

export default ProfileSkeleton
