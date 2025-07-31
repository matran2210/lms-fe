import React from 'react';
import { Modal } from 'antd';
import { BaseModalProps } from 'src/type/courses-3-level';

export default function BaseModal({
  title = '',
  visible,
  onClose,
  footer = false,
  closable = true,
  centered = true,
  width = 'auto',
  style = {},
  bodyStyle = {},
  wrapClassName = '',
  children
}: BaseModalProps) {

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={footer}
      closable={closable}
      centered={centered}
      width={width}
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0px 4px 12px 0px #2C30000A',
        ...style
      }}
      bodyStyle={{ ...bodyStyle }}
      wrapClassName={wrapClassName}
    >
      {children}
    </Modal>
  )
}
