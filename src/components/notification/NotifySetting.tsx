// components/SearchForm.tsx

import React, { useState } from 'react'

interface NotifySettingProps {
  message: string
}

const NotifySetting = ({ message }: NotifySettingProps) => {
  return <>{message}</>
}

export default NotifySetting
