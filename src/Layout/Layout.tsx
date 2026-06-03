import { memo } from 'react'
import Header from '../components/Header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const Layout = memo(() => {
  const location = useLocation();

  return (
    <>
      <Header/>
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          <Outlet/>
        </motion.main>
      </AnimatePresence>
      {['/', '/login', '/register'].includes(location.pathname) && <Footer/>}
    </>
  )
})

export default Layout