import { useState } from 'react'
import { IActivityResource } from 'src/type/courses-3-level'
import { Docs, IconDownload } from '../icons'
import PdfModal from '../popup/PdfModal'

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
      <h2 className="mb-6 text-lg font-semibold leading-7 text-bw-15">
        {title}
      </h2>
      <div className="list-active">
        {items.map((item, index) => (
          <div className="item mb-4 last:mb-0" key={index}>
            <div className="content flex gap-3 rounded-md bg-gray-4 px-3 py-2 text-bw-15 hover:bg-secondary hover:text-primary">
              <div>
                <Docs />
              </div>
              <div
                className="cursor-pointer truncate text-ssm md:text-base"
                onClick={() => handleOpenModal(item)}
              >
                {item.title}
              </div>
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
