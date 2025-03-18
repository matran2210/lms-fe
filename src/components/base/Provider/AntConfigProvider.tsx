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
          },
          Select: {
            colorPrimaryHover: '#ffb800',
            colorPrimary: '#ffb800',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
          },
          DatePicker: {
            colorPrimaryHover: '#ffb800',
            colorPrimary: '#ffb800',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
          },
          Button: {
            controlOutlineWidth: 0,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntConfigProvider
