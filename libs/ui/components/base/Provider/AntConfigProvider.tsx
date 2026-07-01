import { ConfigProvider } from 'antd'

const AntConfigProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'var(--font-roboto), Roboto, sans-serif',
          colorPrimary: '#EF5941',
        },
        components: {
          Input: {
            colorPrimaryHover: '#EF5941',
            colorPrimary: '#EF5941',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
            colorTextDisabled: '#99A1B7',
            colorBgContainerDisabled: '#ffffff',
          },
          Select: {
            colorPrimaryHover: '#EF5941',
            colorPrimary: '#EF5941',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
            optionSelectedBg: '#EF594112',
            optionSelectedColor: '#EF5941',
            optionActiveBg: '#EF594112',
            controlItemBgHover: '#EF594112',
            colorPrimaryTextHover: '#EF5941',
            colorTextDisabled: '#99A1B7',
            colorBgContainerDisabled: '#ffffff',
          },
          DatePicker: {
            colorPrimaryHover: '#EF5941',
            colorPrimary: '#EF5941',
            colorTextPlaceholder: '#9CA3AF',
            controlOutlineWidth: 0,
          },
          Button: {
            controlOutlineWidth: 0,
            colorBorder: 'transparent',
          },
          Modal: {
            zIndexPopupBase: 1050,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntConfigProvider
