import { Tag, Typography } from 'antd'
import Header from '@components/classes/Header'

const { Text } = Typography

export default function Overview({
  certificateData,
}: {
  certificateData: any[]
}) {
  return (
    <>
      <Header title="Overview" />
      <div className="grid grid-cols-1 gap-y-4">
        {certificateData?.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-5 items-center">
            <div className="col-span-1">
              <Text className="text-sm font-normal text-gray-400">
                {item.label}
              </Text>
            </div>
            <div className="col-span-2">
              {item.isTag ? (
                <Tag
                  className={`text-xs mr-6 rounded border border-transparent bg-[#01711f]/5 font-semibold text-[${item.color}]`}
                >
                  {item.value}
                </Tag>
              ) : (
                <Text strong>{item.value}</Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
