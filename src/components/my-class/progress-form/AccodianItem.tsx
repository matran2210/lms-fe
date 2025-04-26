import React, { useState } from 'react'
import { ArrowCollapseIcon } from 'src/assets/icons'
import './Accodian.module.scss'
import SAPPCheckbox from 'src/components/base/checkbox/SAPPCheckbox'
import ProgressTooltip from '@components/my-class/progress-form/ProgressTooltip'
import { IExplorerNode } from 'src/type/progress'

interface AccodianProps {
  explorer: IExplorerNode
  type: string
  action: (id: string, checked: boolean) => void
}

function Accodian({ explorer, type, action }: AccodianProps) {
  const [expand, setExpand] = useState(false)

  return (
    <div className="sapp-parent-wrapper">
      <div className="justify-content-between mb-8 flex items-center">
        <div className="flex items-center gap-3">
          <div
            className={`sapp-collapse-wrapper flex items-center ${expand ? 'expanded' : ''}`}
            onClick={() => setExpand((prev) => !prev)}
          >
            <ArrowCollapseIcon />
          </div>

          <SAPPCheckbox
            checked={explorer.checked}
            onChange={() => action(explorer.id, !explorer.checked)}
            state="primary"
          />

          <div className="sapp-text-truncate-1 sapp-text-primary fw-semibold fs-6">
            <ProgressTooltip
              title={`${explorer?.name} ${
                (explorer?.children?.length ?? 0) > 0
                  ? `(${explorer.children?.length})`
                  : ''
              }`}
              max_length={130}
            />
          </div>
        </div>
      </div>

      {/* ✅ Chỉ render nội dung con nếu expand === true */}
      {expand &&
        explorer.children?.map((child) => (
          <div style={{ marginLeft: '20px' }} key={child.id}>
            <Accodian explorer={child} type={type} action={action} />
          </div>
        ))}
    </div>
  )
}

export default Accodian
