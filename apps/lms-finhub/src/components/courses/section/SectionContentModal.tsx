import React from 'react'
import SectionContentAccoridior from './SectionContentAccoridior'
import BaseModal from '@components/courses/popup/BaseModal'
import { SectionContentModalProp } from '@lms/core'

export default function SectionContentModal({
  sections,
  visible,
  onClose,
  class_user_id,
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
      <SectionContentAccoridior
        sections={sections}
        class_user_id={class_user_id}
      />
    </BaseModal>
  )
}
