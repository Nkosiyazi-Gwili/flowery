import './globals.css'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'Flowery - Beautiful Flowers Delivered',
  description: 'Fresh flowers delivered to your doorstep from local florists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}