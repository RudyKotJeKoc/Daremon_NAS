'use client'

import { useState } from 'react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    onderwerp: '',
    bericht: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // TODO: Implement actual form submission
    // For now, simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitStatus('success')
    setIsSubmitting(false)
    setFormData({ naam: '', email: '', onderwerp: '', bericht: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          ✓ Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via info@daremon.nl
        </div>
      )}

      <div>
        <label htmlFor="naam" className="block text-sm font-medium mb-2">
          Naam *
        </label>
        <input
          type="text"
          id="naam"
          name="naam"
          required
          value={formData.naam}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Uw naam"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          E-mailadres *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="uw@email.nl"
        />
      </div>

      <div>
        <label htmlFor="onderwerp" className="block text-sm font-medium mb-2">
          Onderwerp *
        </label>
        <input
          type="text"
          id="onderwerp"
          name="onderwerp"
          required
          value={formData.onderwerp}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Waar gaat het over?"
        />
      </div>

      <div>
        <label htmlFor="bericht" className="block text-sm font-medium mb-2">
          Uw vraag of situatie *
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          value={formData.bericht}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Beschrijf kort uw situatie of vraag. Hoe meer context, hoe beter we kunnen inschatten of en hoe we kunnen helpen."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Bezig met verzenden...' : 'Verstuur bericht'}
      </button>

      <p className="text-xs text-muted-foreground">
        * Verplichte velden. Uw gegevens worden vertrouwelijk behandeld en niet gedeeld met derden.
      </p>
    </form>
  )
}
