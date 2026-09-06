import type { Metadata } from 'next'
import { MethodiekContent } from './methodiek-content'

export const metadata: Metadata = {
  title: 'Methodiek & AI – DAREMON Engineering',
  description: 'Hoe ik technische analyse, montage en AI-tools combineer tot betrouwbaar videomateriaal.',
}

export default function MethodiekPage() {
  return <MethodiekContent />
}
