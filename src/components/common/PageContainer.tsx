import { Card } from 'antd'
import React from 'react'
import { IBreadcrumb } from 'src/type'

interface PageContainerProps {
  titlePage: string
  breadcrumbs: IBreadcrumb[]
  children: React.ReactNode
}

const PageContainer = ({
  titlePage,
  breadcrumbs,
  children,
}: PageContainerProps) => {
  return (
    <div className="flex flex-col gap-6 pb-[90px] pl-[160px] pr-8 pt-6 xl:pr-[80px] 2xl:pr-[240px]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-[5px]">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <div className="text-base">
                <a
                  key={index}
                  href={breadcrumb.link}
                  className={
                    index === breadcrumbs.length - 1
                      ? 'font-medium not-italic text-primary'
                      : 'font-normal text-secondary'
                  }
                >
                  {breadcrumb.title}
                </a>
              </div>
              {index !== breadcrumbs.length - 1 && <span>|</span>}
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-2xl font-medium">{titlePage}</h2>
      </div>
      <Card
        styles={{
          body: {
            padding: '0px',
          },
        }}
      >
        {children}
      </Card>
    </div>
  )
}

export default PageContainer
