import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, Burger, Group, Skeleton  } from '@mantine/core';


export const metadata: Metadata = {
  title: 'The Survey App',
  description: 'The Original Survey App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider>
         {children}
        </MantineProvider>
      </body>
    </html>
  )
}
