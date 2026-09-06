import type { Metadata } from 'next'
import { OverContent } from './over-content'

export const metadata: Metadata = {
  title: 'Over mij – DAREMON Engineering',
  description: 'DAREMON Engineering: mijn engineering-achtergrond en videomontage onder één dak.',
}

export default function OverPage() {
  return <OverContent />
}
