import type { ReactNode } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import TopStrip from './TopStrip'

interface LayoutProps {
  children: ReactNode
  isHomePage?: boolean
}

function Layout({ children, isHomePage = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopStrip isHomePage={isHomePage} />
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout
