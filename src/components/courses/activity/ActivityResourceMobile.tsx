import { IActivityResourceProps } from 'src/type/courses-3-level'
import { Docs, IconDownload } from '../icons'
import BaseModal from '@components/courses/popup/BaseModal'

export default function ActivityResourcesMobile({
  title,
  items,
  visible,
  onClose,
}: IActivityResourceProps) {
  return (
    <BaseModal
      title={title}
      visible={visible}
      onClose={onClose}
      width={'auto'}
      bodyStyle={{
        maxHeight: '65vh',
        overflowY: 'auto',
      }}
      wrapClassName="activity-resource-modal"
    >
      {items.map((item, index) => (
        <div className="item mb-2 last:mb-0" key={index}>
          <div className="content flex gap-2 rounded-md bg-gray-4 px-3 py-2 hover:bg-secondary">
            <div>
              <Docs className="h-5 w-5" />
            </div>
            <div className="truncate text-ssm text-bw-15">{item.title}</div>
            <div className="ml-auto cursor-pointer" onClick={() => {}}>
              <IconDownload />
            </div>
          </div>
        </div>
      ))}
    </BaseModal>
  )
}
