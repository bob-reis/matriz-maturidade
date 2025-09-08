export const metadata = {
  title: 'Maturidade em Segurança',
  description: 'Avaliação de Maturidade em Segurança da Informação',
}

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

