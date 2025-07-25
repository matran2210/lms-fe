import { IButtonTabProps } from 'src/type/courses-3-level/button'
import BaseButton from './BaseButton'

export default function TabButton({ items }: IButtonTabProps) {
  return (
    items.length > 0 && (
      <div className="sapp-tab-button inline-block">
        <div className="flex flex-row-reverse gap-2 rounded-md bg-gray-4 p-1 md:flex-row">
          {items.map((item, index) => (
            <BaseButton
              key={index}
              variant={item.active ? 'primary' : 'secondary'}
              title={item.title}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    )
  )
}
