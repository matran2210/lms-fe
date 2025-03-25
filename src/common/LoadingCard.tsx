import { Skeleton } from 'antd'

const LoadingCard = () => {
  return (
    <div className="flex flex-wrap">
      <div className="flex-grow">
        <div className="mb-2 flex flex-wrap justify-between">
          <div className="flex flex-col">
            <div className="mb-5 flex items-center">
              <Skeleton.Input active className="h-6 w-32" />
            </div>

            <div className="mb-4 flex flex-wrap text-gray-400">
              <Skeleton.Input active size="small" className="mb-2 mr-5" />
              <Skeleton.Input active size="small" className="mb-2 mr-5" />
              <Skeleton.Input active size="small" className="mb-2" />
            </div>
          </div>

          <div className="my-4 flex space-x-2">
            <Skeleton.Input active size="small" className="mb-2 mr-5" />
          </div>
        </div>

        <div className="flex flex-wrap justify-between">
          <div className="mt-3 flex w-48 flex-col items-center sm:w-72">
            <div className="mb-2 flex w-full justify-between gap-3">
              <Skeleton.Input active size="small" className="w-6" />
              <Skeleton.Input active size="small" className="w-6" />
              <Skeleton.Input active size="small" className="w-6" />
              <Skeleton.Input active size="small" className="w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingCard
