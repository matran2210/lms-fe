import { IActivityResource } from 'src/type/courses-3-level'
import { Docs, IconDownload } from '../icons'

export default function ActivityResourceDesktop({
  title,
  items,
  setDataModal,
  setIsOpen,
}: IActivityResource) {
  const handleOpenModal = (item: IActivityResource['items'][number]) => {
    setDataModal(item)
    setIsOpen(true)
  }

  return (
    <div className="hidden overflow-hidden rounded-xl bg-white p-6 shadow-search lg:block">
      <h2 className="mb-6 text-lg font-semibold leading-7 text-gray-800">
        {title}
      </h2>
      <div className="list-active">
        {items.map((item, index) => (
          <div
            className="item mb-4 cursor-pointer last:mb-0"
            key={index}
            onClick={() => handleOpenModal(item)}
          >
            <div className="content flex gap-3 rounded-md bg-gray-100 px-3 py-2 text-gray-800 hover:bg-secondary-50 hover:text-primary">
              <div>
                <Docs />
              </div>
              <div className="truncate text-xs md:text-base">{item.title}</div>
              <div className="ml-auto cursor-pointer" onClick={item.download}>
                <IconDownload />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
