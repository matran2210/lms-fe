import { MKTInAppIcon } from '@assets/icons'
import { Tooltip } from 'antd'
import { useState } from 'react'
import ModalMarketingInApp from './marketing-in-app/ModalMarketingInApp'
const MKTInApp = ({ showMKTInApp }: { showMKTInApp: boolean }) => {
  const [openModalMarketingInApp, setOpenModalMarketingInApp] = useState(false)
  return (
    <>
      {showMKTInApp && (
        <>
          <Tooltip title={'Marketing In App'} placement="left">
            <div
              id="floating-button-mkt-in-app"
              onClick={() => setOpenModalMarketingInApp(true)}
              className="bottom-40 right-[16px]"
            >
              <div className="over:opacity-100 delay-300">
                <MKTInAppIcon />
              </div>
            </div>
          </Tooltip>
          <ModalMarketingInApp
            open={openModalMarketingInApp}
            setOpen={setOpenModalMarketingInApp}
          />
        </>
      )}
    </>
  )
}
export default MKTInApp
