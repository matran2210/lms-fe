import React from 'react'
import { Link } from 'react-router-dom'
import { ITabs } from 'src/type'

const SappBreadCrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: ITabs[] | undefined
}) => {
  const count_items = breadcrumbs && breadcrumbs.length - 1

  return (
    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-base my-1">
      {breadcrumbs &&
        breadcrumbs.map((breadcrumb, index) => (
          <div key={index} className="d-flex">
            <li
              className="breadcrumb-item text-gray-500"
              key={breadcrumb.title}
            >
              <Link
                to={index !== count_items ? breadcrumb.link : '#'}
                className={`${
                  index !== count_items
                    ? 'text-gray-500 text-hover-primary'
                    : 'sapp-btn-color bg-transparent'
                } `}
              >
                {breadcrumb.title}
              </Link>
            </li>
            {index !== count_items && (
              <li className="breadcrumb-item" style={{ marginRight: '5px' }}>
                <span className="text-gray-500">/</span>
              </li>
            )}
          </div>
        ))}
    </ul>
  )
}

export default SappBreadCrumbs
