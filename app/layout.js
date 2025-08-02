import '../styles/globals.css'

export const metadata = {
  title: 'Learning Journal System',
  description: 'A modern learning journal system for tracking your educational journey',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
