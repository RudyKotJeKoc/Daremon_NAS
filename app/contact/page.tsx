import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact – Daremon',
  description: 'Neem contact op met Daremon voor een vrijblijvend gesprek over uw situatie.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Heeft u een complex systeem dat begrepen moet worden? Neem contact op voor een
          vrijblijvend gesprek.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact informatie */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Neem contact op</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Bij voorkeur starten we met een kort kennismakingsgesprek (telefonisch of per
                videocall) om te bepalen of we kunnen helpen en wat de beste aanpak is.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Wat kunt u verwachten?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Reactie binnen 2 werkdagen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vrijblijvend kennismakingsgesprek</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Geen verplichtingen of commerciële druk</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Duidelijke offerte als we verder gaan</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Vertrouwelijkheid</h3>
                <p className="text-sm">
                  Alle informatie die u deelt wordt strikt vertrouwelijk behandeld. Ook als er
                  uiteindelijk geen opdracht uit voortkomt.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Direct contact</h3>
                <p className="text-sm mb-2">
                  Voor spoedeisende zaken of vragen over lopende projecten:
                </p>
                <p className="text-sm">
                  <strong>E-mail:</strong> info@daremon.nl<br />
                  <strong>Telefoon:</strong> +31 (0)6 12345678
                </p>
              </div>
            </div>
          </div>

          {/* Contact formulier */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Stuur een bericht</h2>
            <ContactForm />
          </div>
        </div>

        {/* Extra info */}
        <section className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Wat zijn typische projectduren?</h3>
              <p className="text-muted-foreground text-sm">
                Dat hangt sterk af van de complexiteit. Een snelle faalanalyse kan in een paar
                dagen, een grondige organisatieanalyse kan enkele weken duren. We bespreken dit
                altijd vooraf.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Werken jullie alleen in Nederland?</h3>
              <p className="text-muted-foreground text-sm">
                Primair wel, maar voor specifieke opdrachten werken we ook internationaal (Engels
                en Pools mogelijk).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Wat zijn de kosten?</h3>
              <p className="text-muted-foreground text-sm">
                We werken met transparante uurtarieven en maken altijd vooraf een offerte. Geen
                verborgen kosten of verrassingen achteraf.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Kan ik een second opinion aanvragen?</h3>
              <p className="text-muted-foreground text-sm">
                Ja, we doen regelmatig second opinions op analyses van anderen. Of u nu twijfelt
                aan een adviesrapport, een technische expertise of een beleidsanalyse – we kijken
                kritisch mee.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
