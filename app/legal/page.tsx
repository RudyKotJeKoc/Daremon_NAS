import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Juridische informatie – DAREMON Engineering',
  description: 'Juridische informatie, disclaimer en privacyverklaring van DAREMON Engineering.',
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Juridische informatie</h1>
          <p className="text-xl text-cyan-400 font-light">
            Disclaimer, aansprakelijkheid en privacy van DAREMON Engineering
          </p>
        </div>

        {/* Over deze pagina */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-amber-500/30 rounded-lg p-6">
            <p className="text-slate-300 leading-relaxed text-sm">
              <strong className="text-amber-300">Let op:</strong> deze pagina is een redactionele
              plaatshouder die de eerdere disclaimer ("geen bedrijf, geen diensten") vervangt nu
              DAREMON Engineering als reële B2B-dienstverlener opereert. Laat de definitieve tekst —
              inclusief KVK-nummer, BTW-gegevens en vestigingsadres — controleren door een jurist
              voordat de site publiek live gaat.
            </p>
          </div>
        </section>

        {/* Diensten */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Over DAREMON Engineering
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                DAREMON Engineering levert gespecialiseerde technische videomontage, procesanalyse
                en AI-ondersteunde visualisaties voor de mechanische, industriële en agrarische sector.
              </p>
              <p>
                Aanvragen via het contactformulier worden behandeld als een vrijblijvende offerteaanvraag.
                Een overeenkomst komt pas tot stand na schriftelijke bevestiging door beide partijen.
              </p>
            </div>
          </div>
        </section>

        {/* Aard van de content */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Aard van de content
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Portfolio-items zijn voorbeelden van technische montage- en analysewerk.</li>
                <li>
                  Visualisaties in de sectie "Audio Lab" tonen de gebruikte technologie (Three.js /
                  Web Audio API) en zijn geen weergave van een specifiek klantproject, tenzij anders
                  vermeld.
                </li>
                <li>
                  Case studies op deze website worden waarheidsgetrouw beschreven; details kunnen op
                  verzoek van de klant zijn geanonimiseerd.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Aansprakelijkheid */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Aansprakelijkheid
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Aan de informatie op deze website kunnen geen rechten worden ontleend. DAREMON
                Engineering aanvaardt geen aansprakelijkheid voor schade voortvloeiend uit het gebruik
                van deze website, behoudens voor zover dwingend recht anders bepaalt.
              </p>
              <p>
                Concrete afspraken over levering, kwaliteit en aansprakelijkheid voor projecten worden
                vastgelegd in de offerte of overeenkomst per opdracht.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectueel eigendom */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Intellectueel eigendom
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Alle op deze website getoonde materialen (video, audio, code, ontwerp) zijn eigendom
                van DAREMON Engineering of worden met toestemming van de rechthebbende getoond. Audio
                gebruikt in eigen producties is auteursrechtelijk vrij van Content ID-claims.
              </p>
              <p>
                Overname of hergebruik van materiaal zonder voorafgaande schriftelijke toestemming is
                niet toegestaan.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Privacy
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Gegevens ingevuld via het contactformulier worden uitsluitend gebruikt om de
                offerteaanvraag te behandelen en worden niet gedeeld met derden zonder toestemming.
              </p>
              <p>
                Deze website plaatst geen trackingcookies buiten wat technisch noodzakelijk is voor
                de werking van Radio ETS (o.a. lokale opslag van taal- en afspeelvoorkeuren).
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Contact
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>Voor vragen over deze pagina of een offerteaanvraag:</p>
              <p>
                <Link href="/contact" className="text-cyan-400 hover:underline transition">
                  Ga naar het contactformulier →
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="text-center text-sm text-slate-500">
            <p>Laatste update: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' })}</p>
            <p className="mt-2">
              <Link href="/" className="text-cyan-400 hover:underline transition">
                ← Terug naar home
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
