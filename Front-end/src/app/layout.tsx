import './globals.css'

import Header from '../components/header'
import Footer from '../components/footer'

export const metadata = {
  title: 'Peer-To-Peer Rental Marketplace',
  description: 'Peer-To-Peer Rental Marketplace',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
         <Header/> {/*instad of doing the function Header() to make this a server component, we put <></> */}
        {children}
        <Footer/>
      </body>
    </html>
  )
}
