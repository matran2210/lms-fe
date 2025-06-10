import { Tabs, TabsProps } from 'antd'
import React from 'react'

const RequirementsTab: React.FC<TabsProps> = (props) => {
  return <Tabs {...props} className="requirement-tabs" />
}

export default RequirementsTab
