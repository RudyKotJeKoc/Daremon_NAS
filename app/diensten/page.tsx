import type { Metadata } from 'next'
import { DienstenContent } from './diensten-content'

export const metadata: Metadata = {
  title: 'Diensten – DAREMON Engineering',
  description:
    'Technische videomontage, shorts, AI-visualisaties en een eigen Audio Lab voor de mechanische, industriële en agrarische sector.',
}

export default function DienstenPage() {
  return <DienstenContent />
}
