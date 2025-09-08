import MaturidadeApp from '@/components/tools/MaturidadeApp'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Maturidade em Segurança',
}

export default function MaturidadePage() {
  return (
    <main className="relative">
      <MaturidadeApp />
    </main>
  )
}

