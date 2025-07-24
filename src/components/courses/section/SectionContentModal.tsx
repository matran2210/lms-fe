import React from 'react'
import { SectionContentModalProp } from 'src/type/courses-3-level'
import SectionContentAccoridior from './SectionContentAccoridior'
import BaseModal from '@components/courses/popup/BaseModal'

export default function SectionContentModal({
  sections,
  visible,
  onClose,
  title = 'Section Content',
}: SectionContentModalProp & { title?: string }) {
  return (
    <BaseModal
      closable={false}
      visible={visible}
      onClose={onClose}
      footer={false}
      centered={false}
      width={'auto'}
      bodyStyle={{
        maxHeight: '65vh',
        overflowY: 'auto',
      }}
      wrapClassName="activity-resource-modal"
    >
      <h2 className="mb-4 text-xl font-semibold text-bw-15">{title}</h2>
      <SectionContentAccoridior sections={sections} />
    </BaseModal>
  )
}
