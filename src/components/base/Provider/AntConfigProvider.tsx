import { ConfigProvider } from 'antd'

const AntConfigProvider = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Roboto, sans-serif',
        },
        components: {
          Input: {
            colorPrimaryHover: '#ffb800',
            colorPrimary: '#ffb800',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
            fontWeightStrong: 500,
          },
          Select: {
            colorPrimaryHover: '#ffb800',
            colorPrimary: '#ffb800',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
            optionSelectedBg: '#ffbb0012',
            optionSelectedColor: '#ffb800',
            controlItemBgHover: '#ffbb0012',
            colorPrimaryTextHover: '#ffb800',
          },
          DatePicker: {
            colorPrimaryHover: '#ffb800',
            colorPrimary: '#ffb800',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
          },
          Button: {
            controlOutlineWidth: 0,
            colorBorder: 'transparent',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntConfigProvider
