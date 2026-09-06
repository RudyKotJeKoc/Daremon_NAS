'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/language-provider'

export function ContactForm() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    bedrijf: '',
    onderwerp: '',
    bericht: '',
    website: '', // Honeypot field (hidden)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'success' | 'error'
    message: string
  }>({
    type: 'idle',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: 'idle', message: '' })

    try {
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, language }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Er is iets misgegaan bij het verzenden.')
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: data.message || 'Bedankt voor uw bericht! Ik neem zo snel mogelijk contact met u op.'
      })

      // Reset form
      setFormData({
        naam: '',
        email: '',
        bedrijf: '',
        onderwerp: '',
        bericht: '',
        website: '',
      })

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setSubmitStatus({ type: 'idle', message: '' })
      }, 10000)

    } catch (error) {
      // Error
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error
          ? error.message
          : 'Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via info@daremon.nl'
      })

      // Auto-hide error message after 10 seconds
      setTimeout(() => {
        setSubmitStatus({ type: 'idle', message: '' })
      }, 10000)

    } finally {
      setIsSubmitting(false)
    }
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
      {/* Success Message */}
      {submitStatus.type === 'success' && (
        <div className="p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm animate-fadeIn">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus.type === 'error' && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm animate-fadeIn">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      {/* Honeypot field (hidden from users, catches bots) */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="naam" className="block text-sm font-medium text-slate-100 mb-2">
          Naam *
        </label>
        <input
          type="text"
          id="naam"
          name="naam"
          required
          maxLength={100}
          value={formData.naam}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          placeholder="Uw naam"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-100 mb-2">
          E-mailadres *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={100}
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          placeholder="uw@email.nl"
        />
      </div>

      <div>
        <label htmlFor="bedrijf" className="block text-sm font-medium text-slate-100 mb-2">
          Bedrijf <span className="text-slate-500 font-normal">(optioneel)</span>
        </label>
        <input
          type="text"
          id="bedrijf"
          name="bedrijf"
          maxLength={150}
          value={formData.bedrijf}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          placeholder="Naam van uw bedrijf"
        />
      </div>

      <div>
        <label htmlFor="onderwerp" className="block text-sm font-medium text-slate-100 mb-2">
          Onderwerp *
        </label>
        <input
          type="text"
          id="onderwerp"
          name="onderwerp"
          required
          maxLength={200}
          value={formData.onderwerp}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          placeholder="Waar gaat het over?"
        />
      </div>

      <div>
        <label htmlFor="bericht" className="block text-sm font-medium text-slate-100 mb-2">
          Uw vraag of situatie *
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          minLength={10}
          maxLength={5000}
          value={formData.bericht}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={6}
          className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none transition"
          placeholder="Beschrijf kort uw situatie of vraag. Hoe meer context, hoe beter ik kan inschatten of en hoe ik kan helpen."
        />
        <div className="mt-1 text-xs text-slate-500">
          {formData.bericht.length} / 5000 tekens
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Bezig met verzenden...
          </>
        ) : (
          'Verstuur bericht'
        )}
      </button>

      <p className="text-xs text-slate-400">
        * Verplichte velden. Uw gegevens worden vertrouwelijk behandeld en niet gedeeld met derden.
      </p>
    </form>
  )
}
