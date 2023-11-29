// components/SearchForm.tsx

import React, { useState } from 'react'

interface NotifySettingProps {
  message: string
}

const NotifySetting = ({ message }: NotifySettingProps) => {
  return (
    <div className="py-3 border-b border-gray-2 last:border-0 text-medium-sm text-bw-1">
      {message}
    </div>
  )
}

export default NotifySetting
