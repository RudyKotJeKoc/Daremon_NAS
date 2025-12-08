import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal & Disclaimer – Daremon',
  description: 'Juridische informatie en disclaimer over het Daremon AI-experiment.',
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Legal & Disclaimer</h1>
          <p className="text-xl text-cyan-400 font-light">
            Juridische informatie over dit experimentele AI-project
          </p>
        </div>

        {/* Juridische Status */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Juridische Status
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Daremon is een <strong>persoonlijk experimenteel project</strong> en geen geregistreerde
                onderneming, handelsnaam of bedrijfsactiviteit.
              </p>
              <p>
                Er zijn geen commerciële diensten, geen zakelijke activiteiten en geen aanbod van
                professionele dienstverlening. Dit project valt niet onder artikel 11 van het
                Nederlandse handelsrecht dat betrekking heeft op commerciële activiteiten.
              </p>
              <p>
                De eigenaar van dit project verricht geen beroepsmatige of bedrijfsmatige handelingen
                via deze website en heeft geen intentie een bedrijf te starten.
              </p>
            </div>
          </div>
        </section>

        {/* Aard van de Content */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Aard van de Content
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Het grootste deel van de content op deze website is gegenereerd door kunstmatige
                intelligentie (AI-systemen) op basis van persoonlijke gesprekken, notities en gedachten.
              </p>
              <p>
                Alle materialen hebben een <strong>fictief, metaforisch en experimenteel karakter</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Beschrijvingen van "diensten" zijn hypothetische scenario's, geen aanbod van werkelijke
                  diensten
                </li>
                <li>
                  "Casussen" en "projecten" zijn fictieve verhalen (baśnie/fabels), geen documentatie van
                  echte opdrachten
                </li>
                <li>
                  "Analyses" en "rapporten" zijn AI-gegenereerde teksten zonder claim op professionele
                  expertise
                </li>
                <li>
                  Technische beschrijvingen zijn gebaseerd op persoonlijke ervaringen en AI-patronen, niet
                  op gecertificeerde kennis
                </li>
              </ul>
              <p>
                De website dient als een <strong>digitaal laboratorium</strong> voor het ordenen van
                gedachten, experimenteren met AI en creëren van metaforische verhalen.
              </p>
            </div>
          </div>
        </section>

        {/* Geen Zakelijke Relatie */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Geen Zakelijke Relatie
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Door het bezoeken van deze website, het lezen van de content of het opnemen van contact
                ontstaat <strong>geen enkele zakelijke relatie, contractuele verplichting of
                dienstverleningsovereenkomst</strong>.
              </p>
              <p>
                Er kunnen geen diensten worden afgenomen, geen offertes worden aangevraagd en geen
                opdrachten worden gegeven. Contact is uitsluitend mogelijk voor informele gesprekken over
                het project zelf.
              </p>
              <p>
                Elk gebruik van of verwijzing naar deze website mag niet worden geïnterpreteerd als een
                commerciële intentie of zakelijk aanbod.
              </p>
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
                De eigenaar van deze website aanvaardt geen aansprakelijkheid voor:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Juistheid, volledigheid of actualiteit van de gepubliceerde informatie</li>
                <li>Beslissingen genomen op basis van de content op deze website</li>
                <li>Schade of verlies voortvloeiend uit het gebruik van deze website</li>
                <li>Interpretatie van fictieve content als feitelijke informatie of professioneel advies</li>
              </ul>
              <p>
                Alle informatie wordt verstrekt "as is" zonder enige garantie of claim op correctheid.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectueel Eigendom */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Intellectueel Eigendom
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                De content op deze website is een combinatie van:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Persoonlijke gedachten en notities van de eigenaar</li>
                <li>AI-gegenereerde teksten op basis van bovenstaande input</li>
                <li>Openbare technische documentatie (waar van toepassing)</li>
              </ul>
              <p>
                Het gebruik van AI-gegenereerde content brengt specifieke overwegingen met zich mee
                omtrent auteursrecht. De eigenaar maakt geen claims op exclusief eigendom van
                AI-gegenereerde teksten, maar behoudt zich het recht voor om de content te gebruiken,
                aanpassen en verwijderen naar eigen inzicht.
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
                Deze website verzamelt geen persoonlijke gegevens via tracking, cookies of analytics,
                tenzij uitdrukkelijk vermeld bij specifieke functies (zoals het contactformulier).
              </p>
              <p>
                Eventuele communicatie via e-mail wordt vertrouwelijk behandeld en niet gedeeld met
                derden. Er is geen commerciële verwerking van persoonsgegevens.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-cyan-500/30 pb-4">
              Contact & Vragen
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Voor vragen over deze disclaimer of het project in het algemeen:
              </p>
              <p>
                <strong className="text-cyan-400">E-mail:</strong> info@daremon.nl
              </p>
              <p className="text-sm text-slate-400">
                Let op: Dit is geen zakelijk contactadres. Vragen met commerciële intenties kunnen
                niet beantwoord worden.
              </p>
            </div>
          </div>
        </section>

        {/* Laatste Update */}
        <section className="mb-12">
          <div className="text-center text-sm text-slate-500">
            <p>Laatste update: December 2025</p>
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
