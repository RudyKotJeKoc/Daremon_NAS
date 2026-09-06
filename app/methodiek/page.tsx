import type { Metadata } from 'next'
import { MethodiekContent } from './methodiek-content'

export const metadata: Metadata = {
  title: 'Methodiek & AI – DAREMON Engineering',
  description: 'Hoe we technische analyse, montage en AI-tools combineren tot betrouwbaar videomateriaal.',
}

export default function MethodiekPage() {
  return <MethodiekContent />
}
