import type { Metadata } from 'next'
import { OverContent } from './over-content'

export const metadata: Metadata = {
  title: 'Over ons – DAREMON Engineering',
  description: 'DAREMON Engineering: engineering-achtergrond en videomontage onder één dak.',
}

export default function OverPage() {
  return <OverContent />
}
