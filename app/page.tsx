import Link from 'next/link'

export default function StartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero sectie */}
      <section className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-5xl font-bold mb-6">
          Daremon
        </h1>
        <p className="text-2xl text-muted-foreground mb-4">
          Bureau voor Systeem- en Narratieve Analyse
        </p>
        <p className="text-xl text-muted-foreground mb-12">
          Techniek, instituties en verhalen geanalyseerd alsof het complexe machines zijn.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/diensten"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Bekijk onze diensten
          </Link>
          <Link
            href="/methodiek"
            className="px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
          >
            Hoe wij werken
          </Link>
        </div>
      </section>

      {/* Over sectie */}
      <section className="max-w-4xl mx-auto py-20 border-t">
        <h2 className="text-3xl font-bold mb-8">Wat wij doen</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed mb-6">
            Daremon is een analytisch bureau dat complexe systemen ontleedt met de precisie van een
            ingenieur en de scherpte van een kritische onderzoeker. Of het nu gaat om technische
            installaties, institutionele procedures of maatschappelijke verhalen – wij benaderen ze
            als machines die begrepen kunnen worden.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Geen verhullende taal. Geen marketing-bullshit. Alleen heldere analyse die laat zien
            hoe dingen werkelijk in elkaar zitten en wat daaraan gedaan kan worden.
          </p>
        </div>
      </section>

      {/* Diensten overzicht */}
      <section className="max-w-6xl mx-auto py-20 border-t">
        <h2 className="text-3xl font-bold mb-12 text-center">Onze diensten</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Analyse van technische systemen</h3>
            <p className="text-muted-foreground mb-4">
              Onderzoek van fabrieken, processen en technische installaties. Van onderhoudsstrategie
              tot faalanalyse.
            </p>
            <Link href="/diensten" className="text-primary hover:underline">
              Meer informatie →
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Analyse van instituties en procedures</h3>
            <p className="text-muted-foreground mb-4">
              Hoe werken organisaties werkelijk? Waar lopen procedures vast? Wat is de logica
              achter beslissingen?
            </p>
            <Link href="/diensten" className="text-primary hover:underline">
              Meer informatie →
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Narratieve en belangenanalyse</h3>
            <p className="text-muted-foreground mb-4">
              Welke verhalen worden verteld? Door wie? Met welk doel? En wat zegt dat over
              machtsstructuren?
            </p>
            <Link href="/diensten" className="text-primary hover:underline">
              Meer informatie →
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Strategische adviesrapporten</h3>
            <p className="text-muted-foreground mb-4">
              Concrete aanbevelingen gebaseerd op grondige analyse. Helder, praktisch, zonder
              omhaal.
            </p>
            <Link href="/diensten" className="text-primary hover:underline">
              Meer informatie →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA sectie */}
      <section className="max-w-4xl mx-auto py-20 border-t text-center">
        <h2 className="text-3xl font-bold mb-6">Een complex systeem dat begrepen moet worden?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Neem contact op voor een vrijblijvend gesprek.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Neem contact op
        </Link>
      </section>
    </div>
  )
}
