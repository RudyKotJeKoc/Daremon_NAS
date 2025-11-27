import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Casussen – Daremon',
  description: 'Concrete voorbeelden van systeemanalyses: van fabriekssluitingen tot verzekeringsclaims en AZC-problematiek.',
}

const casussen = [
  {
    titel: 'Fabrieksluiting en onderhoudsstrategie',
    categorie: 'Technische systeemanalyse',
    samenvatting:
      'Een productiebedrijf staat op het punt een fabriek te sluiten wegens "onbetrouwbare machines". Hoge onderhoudskosten en frequente storingen maken de locatie onrendabel.',
    bevindingen: [
      'De machines zelf zijn technisch in orde',
      'De onderhoudsstrategie is gebaseerd op verouderde aannames uit de jaren 90',
      'Onderhoudsintervallen zijn te kort, waardoor juist extra slijtage ontstaat',
      'Documentatie is slecht bijgehouden, waardoor elke storing lang duurt',
    ],
    resultaat:
      'Door aanpassing van de onderhoudsstrategie en verbetering van de documentatie dalen de kosten met 40%. De fabriek blijft open.',
  },
  {
    titel: 'Schadeclaim en verzekeraar',
    categorie: 'Institutionele analyse',
    samenvatting:
      'Een bedrijf krijgt na een brand een schadeclaim afgewezen door de verzekeraar. Reden: "onvoldoende onderhoud". Het bedrijf beweert juist bovengemiddeld goed onderhouden te hebben.',
    bevindingen: [
      'Verzekeraar hanteert een definitie van "onderhoud" die nergens officieel is vastgelegd',
      'Het bedrijf volgde branche-standaarden, maar dat is volgens verzekeraar "onvoldoende"',
      'In de polisvoorwaarden staat geen eenduidige norm',
      'Er is een belangenconflict: verzekeraar bespaart geld door claims af te wijzen',
    ],
    resultaat:
      'Met een analyse van de polisvoorwaarden, branche-standaarden en institutionele logica wordt aangetoond dat de afwijzing onterecht is. Claim wordt alsnog uitbetaald.',
  },
  {
    titel: 'AZC, huisvesting en lokale weerstand',
    categorie: 'Narratieve analyse',
    samenvatting:
      'Een gemeente wil een asielzoekerscentrum (AZC) openen, maar stuift op heftig verzet van omwonenden. De verhalen over "overlast", "veiligheid" en "leefbaarheid" lopen wild uiteen.',
    bevindingen: [
      'Gemeente communiceert vooral in juridische en beleidsmatige taal ("we moeten")',
      'Omwonenden gebruiken emotionele en ervaringsgerichte taal ("onze wijk")',
      'Landelijke media versterken een specifiek frame: "boze burgers vs. elite"',
      'Lokale belangengroepen hebben economische motieven (vastgoedwaarde) maar framen het als "veiligheid"',
    ],
    resultaat:
      'Door alle verhalen naast elkaar te leggen ontstaat inzicht in de werkelijke spanningen. Dit helpt de gemeente om gerichter te communiceren en reële zorgen te onderscheiden van strategische framing.',
  },
  {
    titel: 'IT-implementatie die faalt',
    categorie: 'Institutionele en technische analyse',
    samenvatting:
      'Een organisatie heeft miljoenen geïnvesteerd in een nieuw IT-systeem. Na twee jaar werkt het nog steeds niet. Het softwarebedrijf wijst naar de klant, de klant wijst naar de software.',
    bevindingen: [
      'Het systeem is technisch prima, maar sluit niet aan op de werkprocessen',
      'Bij aanbesteding zijn cruciale vragen niet gesteld over interne procedures',
      'De organisatie heeft geen helder beeld van haar eigen processen',
      'Softwareleverancier heeft standaard-oplossing verkocht zonder maatwerk',
    ],
    resultaat:
      'Analyse toont aan dat beide partijen verantwoordelijk zijn. Er wordt een stappenplan gemaakt om eerst de interne processen helder te krijgen, daarna de software daarop aan te passen.',
  },
  {
    titel: 'Energietransitie en belangenverstrengeling',
    categorie: 'Narratieve en institutionele analyse',
    samenvatting:
      'Een provincie wil versneld overstappen op duurzame energie, maar elke beslissing leidt tot conflict. Windmolens, zonneparken, biomassa – alles stuit op verzet of juridische procedures.',
    bevindingen: [
      'Er zijn minstens vijf verschillende definities van "duurzaam" in omloop',
      'Verschillende partijen hebben tegenstrijdige belangen maar gebruiken dezelfde taal',
      'Provinciale procedures zijn zo ingericht dat elke partij een veto heeft',
      'Landelijke doelen worden lokaal als "opgelegd" ervaren, wat weerstand veroorzaakt',
    ],
    resultaat:
      'Door de belangenkaart helder te maken en procedures te analyseren, ontstaat inzicht in waarom besluitvorming vastloopt. Dit helpt de provincie om realistischer doelen te stellen en beter te communiceren.',
  },
]

export default function CasussenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Casussen</h1>
          <p className="text-xl text-cyan-400 font-light">
            Concrete voorbeelden van hoe wij complexe systemen analyseren. Namen en details zijn
            geanonimiseerd, maar de analyses zijn echt.
          </p>
        </div>

        <div className="space-y-12">
          {casussen.map((casus, index) => (
            <article key={index} className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full mb-3">
                  {casus.categorie}
                </span>
                <h2 className="text-3xl font-bold text-slate-100 mb-3">{casus.titel}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Situatie</h3>
                  <p className="text-slate-300">{casus.samenvatting}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Bevindingen</h3>
                  <ul className="space-y-2">
                    {casus.bevindingen.map((bevinding, i) => (
                      <li key={i} className="flex items-start text-slate-300">
                        <span className="mr-3 text-cyan-400 flex-shrink-0">▸</span>
                        <span>{bevinding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/40">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Resultaat</h3>
                  <p className="text-slate-300">{casus.resultaat}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        <section className="mt-12">
          <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/40 backdrop-blur-md">
            <h3 className="font-semibold text-slate-100 mb-2">Over deze casussen</h3>
            <p className="text-sm text-slate-400">
              Alle hier beschreven casussen zijn gebaseerd op werkelijke analyses. Namen,
              locaties en specifieke details zijn aangepast om vertrouwelijkheid te waarborgen.
              De methodologische aanpak en conclusies zijn authentiek.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mt-12">
          <div className="border border-cyan-500/30 rounded-lg p-8 bg-slate-900/40 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Een vergelijkbare situatie?</h2>
            <p className="text-slate-300 mb-6">
              Neem contact op om te bespreken hoe wij kunnen helpen.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
            >
              Neem contact op
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
