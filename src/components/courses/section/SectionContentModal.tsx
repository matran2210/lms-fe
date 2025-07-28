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
      title={title}
      closable={true}
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
      <SectionContentAccoridior sections={sections} />
    </BaseModal>
  )
}
