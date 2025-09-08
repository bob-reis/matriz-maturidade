import './globals.css'
export const metadata = {
  title: 'Maturidade em Segurança',
  description: 'Avaliação de Maturidade em Segurança da Informação',
}

import Header from '@/components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
