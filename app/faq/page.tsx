import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen – Daremon',
  description: 'Antwoorden op veelgestelde vragen over onze diensten, werkwijze, kosten en projecten.',
}

const faqCategories = [
  {
    category: 'Algemeen',
    questions: [
      {
        question: 'Wat voor soort organisatie is Daremon?',
        answer: 'Daremon is een analytisch kantoor gespecialiseerd in systeemanalyse. We analyseren technische systemen (fabrieken, machines), organisaties (procedures, besluitvorming) en verhalen (discours, belangen). We combineren technische expertise met een kritische blik op macht en structuren.'
      },
      {
        question: 'Voor wie werken jullie?',
        answer: 'We werken voor bedrijven met technische problemen, overheden met vastgelopen trajecten, organisaties met strategische vragen, partijen in juridische procedures en journalisten/onderzoekers die complexe systemen moeten begrijpen.'
      },
      {
        question: 'Wat maakt jullie anders dan andere adviesbureaus?',
        answer: 'We gebruiken geen vaag jargon of standaardsjablonen. We kijken naar hoe systemen werkelijk functioneren, inclusief machtsstructuren en belangen. We leveren concrete analyses die daadwerkelijk uitvoerbaar zijn, niet dikke rapporten vol opvulling.'
      }
    ]
  },
  {
    category: 'Diensten & Aanpak',
    questions: [
      {
        question: 'Welke diensten bieden jullie aan?',
        answer: 'We bieden vier hoofddiensten: (1) Analyse van technische systemen (faalanalyse, onderhoudsstrategie, procesoptimalisatie), (2) Analyse van instituties en procedures, (3) Narratieve en belangenanalyse, en (4) Strategische adviesrapporten.'
      },
      {
        question: 'Hoe ziet een typisch project eruit?',
        answer: 'Elk project is maatwerk. Meestal starten we met een kennismakingsgesprek om de situatie te begrijpen. Daarna maken we een projectvoorstel met concrete doelen, aanpak en tijdsinschatting. We werken iteratief: regelmatige updates en bijsturing waar nodig.'
      },
      {
        question: 'Werken jullie on-site of remote?',
        answer: 'Beide. Voor technische analyses en procesobservatie werken we vaak on-site. Voor documentanalyse, interviews en rapportage kan veel remote. We bespreken per project wat het meest effectief is.'
      },
      {
        question: 'Leveren jullie ook implementatie of alleen analyse?',
        answer: 'Primair leveren we analyses en adviezen. We kunnen wel begeleiden bij implementatie, maar uitvoering ligt meestal bij de klant of andere partijen. Onze kracht ligt in het begrijpen van systemen, niet in projectmanagement of uitvoering.'
      }
    ]
  },
  {
    category: 'Kosten & Planning',
    questions: [
      {
        question: 'Wat zijn de kosten?',
        answer: 'We werken met transparante uurtarieven. De totale kosten hangen af van de scope: een snelle faalanalyse kan een paar dagen duren, een grondige organisatieanalyse enkele weken. We maken altijd vooraf een offerte met inschatting van uren en kosten.'
      },
      {
        question: 'Zijn er verborgen kosten?',
        answer: 'Nee. Onze offerte bevat alle verwachte kosten. Als tijdens het project blijkt dat meer werk nodig is, bespreken we dit vooraf en passen de offerte aan. Geen verrassingen achteraf.'
      },
      {
        question: 'Wat zijn typische projectduren?',
        answer: 'Dit varieert sterk: een technische quick scan kan 2-3 dagen zijn, een faalanalyse 1-2 weken, een grondige organisatieanalyse 4-8 weken, een due diligence onderzoek 2-4 weken. We bespreken dit altijd vooraf.'
      },
      {
        question: 'Kunnen jullie met spoed projecten oppakken?',
        answer: 'Soms wel. Voor acute situaties (dreigende fabrieksluiting, juridische deadline) proberen we ruimte te maken. Dit hangt af van onze beschikbaarheid en de complexiteit van het vraagstuk.'
      }
    ]
  },
  {
    category: 'Werkwijze & Samenwerking',
    questions: [
      {
        question: 'Hoe vertrouwelijk zijn jullie analyses?',
        answer: 'Volledig vertrouwelijk. We tekenen NDAs waar nodig. Alle informatie die u deelt blijft binnen het project. Case studies op onze website zijn altijd geanonimiseerd. Ook als er geen opdracht uit voortkomt, delen we niets.'
      },
      {
        question: 'Werken jullie alleen in Nederland?',
        answer: 'Primair in Nederland, maar voor specifieke opdrachten ook internationaal. We kunnen werken in Nederlands, Engels en Pools.'
      },
      {
        question: 'Kunnen jullie een second opinion geven?',
        answer: 'Ja, we doen regelmatig second opinions op analyses van anderen. Of u nu twijfelt aan een adviesrapport, een technische expertise of een beleidsanalyse – we kijken kritisch mee en geven een onafhankelijk oordeel.'
      },
      {
        question: 'Wat als we het niet eens zijn met de analyse?',
        answer: 'Dat kan gebeuren. We leveren altijd onderbouwing voor onze conclusies. Als er disagreement is, bespreken we dit inhoudelijk. Soms betekent dat extra onderzoek, soms betekent dat dat we het gewoon niet eens zijn. We forceren geen consensus.'
      },
      {
        question: 'Werken jullie samen met andere bureaus?',
        answer: 'We kunnen samenwerken met gespecialiseerde bureaus waar nodig (juridisch, financieel, communicatie). We hebben geen vaste partnerships – we kiezen per project wat het beste past.'
      }
    ]
  },
  {
    category: 'Technische Projecten',
    questions: [
      {
        question: 'Welke industrieën hebben jullie ervaring?',
        answer: 'Vooral productie-industrie, procesindustrie, energie en infrastructuur. Specifiek: metaalbewerking, chemie, voedsel, automotive, machinebuilding. Maar onze aanpak is toepasbaar op alle technische systemen.'
      },
      {
        question: 'Kunnen jullie ook software/IT systemen analyseren?',
        answer: 'Ja, maar niet primair. We kijken naar IT-systemen vanuit organisatieperspectief (waarom werkt implementatie niet, waar zitten de bottlenecks). Voor diepgaande software-architectuur of code-audits zijn andere partijen beter.'
      },
      {
        question: 'Wat als jullie het antwoord niet weten?',
        answer: 'Dan zeggen we dat. We doen geen educated guesses of vage adviezen. Als we iets niet weten of niet kunnen analyseren met beschikbare informatie, benoemen we dat expliciet.'
      }
    ]
  },
  {
    category: 'Contact & Aanvraag',
    questions: [
      {
        question: 'Hoe start ik een project?',
        answer: 'Neem contact op via het contactformulier, e-mail of telefoon. We plannen een kennismakingsgesprek (telefonisch of per videocall) om uw situatie te bespreken. Dit gesprek is vrijblijvend. Als het past, maken we een projectvoorstel.'
      },
      {
        question: 'Hoe snel krijg ik reactie?',
        answer: 'Binnen 2 werkdagen. Voor urgente zaken kunt u bellen. Als we niet direct beschikbaar zijn voor een project, geven we een eerlijke inschatting wanneer wel.'
      },
      {
        question: 'Moet ik veel voorbereiden voor het kennismakingsgesprek?',
        answer: 'Nee. Een globale beschrijving van de situatie is voldoende. We stellen vragen om te begrijpen wat er speelt. Na het gesprek kunnen we inschatten of en hoe we kunnen helpen.'
      },
      {
        question: 'Wat als mijn vraag te klein is voor een project?',
        answer: 'Er zijn geen "te kleine" vragen. Soms is een kort adviesgesprek voldoende, soms een quick scan van een paar uur. We schalen de aanpak naar de behoefte, niet andersom.'
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main id="main-content" role="main">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100">
              Veelgestelde Vragen
            </h1>
            <p className="text-lg sm:text-xl text-cyan-400 font-light leading-relaxed max-w-3xl mx-auto">
              Antwoorden op de meest gestelde vragen over onze diensten, aanpak en werkwijze.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8 sm:space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <section key={categoryIndex} className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-5 sm:mb-6 border-b border-cyan-500/30 pb-3 sm:pb-4">
                  {category.category}
                </h2>

                <div className="space-y-5 sm:space-y-6">
                  {category.questions.map((item, index) => (
                    <div key={index} className="border-l-4 border-cyan-500/30 pl-4 sm:pl-5">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-2 flex items-start gap-2">
                        <span className="text-cyan-400 flex-shrink-0">Q:</span>
                        <span>{item.question}</span>
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed ml-6">
                        <span className="text-cyan-400 font-semibold">A:</span> {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Niet gevonden */}
          <section className="mt-12 sm:mt-16">
            <div className="border border-cyan-500/30 rounded-lg p-6 sm:p-8 bg-slate-900/40 backdrop-blur-md text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 sm:mb-4">
                Staat uw vraag er niet bij?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed max-w-2xl mx-auto">
                Neem gerust contact op. We beantwoorden alle vragen graag in een vrijblijvend gesprek.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-block px-5 sm:px-6 py-3 min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-sm sm:text-base rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Neem contact op
                </Link>
                <Link
                  href="/diensten"
                  className="inline-block px-5 sm:px-6 py-3 min-h-[44px] border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 font-semibold text-sm sm:text-base rounded-lg transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Bekijk onze diensten
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
