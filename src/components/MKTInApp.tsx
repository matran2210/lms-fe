import { MKTInAppIcon } from '@assets/icons'
import { Tooltip } from 'antd'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ModalMarketingInApp from './marketing-in-app/ModalMarketingInApp'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const MKTInApp = ({ showMKTInApp }: { showMKTInApp: boolean }) => {
  const [openModalMarketingInApp, setOpenModalMarketingInApp] = useState(false)
  const [iconPulse, setIconPulse] = useState(false)
  const { isMobileView } = useTailwindBreakpoint()
  // Khi modal đóng → trigger hiệu ứng icon "hover"
  useEffect(() => {
    if (!openModalMarketingInApp) {
      setIconPulse(true)
      const timer = setTimeout(() => setIconPulse(false), 300) // thời gian animation
      return () => clearTimeout(timer)
    }
  }, [openModalMarketingInApp])

  return (
    <>
      {showMKTInApp && (
        <>
          <Tooltip
            title={isMobileView ? '' : 'Marketing In App'}
            placement="left"
          >
            <motion.div
              id="floating-button-mkt-in-app"
              onClick={() => setOpenModalMarketingInApp(true)}
              className="bottom-40 right-[16px]"
              animate={{
                scale: iconPulse ? 1.1 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
                duration: 0.2,
              }}
              whileHover={{ scale: 1.1 }}
            >
              <MKTInAppIcon />
            </motion.div>
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
