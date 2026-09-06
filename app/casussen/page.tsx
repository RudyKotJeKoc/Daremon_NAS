import type { Metadata } from 'next'
import { CasussenContent } from './casussen-content'

export const metadata: Metadata = {
  title: 'Case Studies – DAREMON Engineering',
  description: 'Projecten in technische videomontage en procesanalyse: MIM, robotica, Arburg en agro.',
}

export default function CasussenPage() {
  return <CasussenContent />
}
