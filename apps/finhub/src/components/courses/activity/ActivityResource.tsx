import ActivityResourceDesktop from '@components/courses/activity/ActivityResourceDesktop'
import ActivityResourcesMobile from '@components/courses/activity/ActivityResourceMobile'
import { IActivityResourceProps } from 'src/type/courses-3-level'

export default function ActivityResources({
  title,
  items,
  visible,
  onClose,
  setDataModal,
  setIsOpen,
}: IActivityResourceProps) {
  return (
    <>
      <ActivityResourceDesktop
        title={title}
        items={items}
        setDataModal={setDataModal}
        setIsOpen={setIsOpen}
      />
      <ActivityResourcesMobile
        title={title}
        items={items}
        visible={visible}
        onClose={onClose}
        setDataModal={setDataModal}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
