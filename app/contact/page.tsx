import type { Metadata } from 'next'
import { ContactContent } from './contact-content'

export const metadata: Metadata = {
  title: 'Contact – DAREMON Engineering',
  description: 'Vraag een offerte aan voor technische videomontage, procesanalyse of AI-visualisaties.',
}

export default function ContactPage() {
  return <ContactContent />
}
