import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Daremon – Experimenteel AI Narratief Project",
  description: "Experimenteel project waarin AI gebruikt wordt voor het genereren van metaforische verhalen, baśnie en fictieve analyses. Geen echte bedrijfsactiviteit.",
  keywords: ["AI experiment", "narratief project", "AI verhalen", "fictieve analyses", "metaforische baśnie"],
  authors: [{ name: "Daremon" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    title: "Daremon – Experimenteel AI Narratief Project",
    description: "Experimenteel project waarin AI gebruikt wordt voor het genereren van metaforische verhalen, baśnie en fictieve analyses. Geen echte bedrijfsactiviteit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-NL">
      <body className="font-sans antialiased">
        <Navigation />
        <main>{children}</main>

        {/* Central Site Disclaimer */}
        <section className="site-disclaimer border-t border-cyan-500/30 bg-slate-900/50 mt-20 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Oświadczenie / Verklaring</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Deze website is een <strong>experimenteel narratief project</strong>. Het merendeel van de inhoud is
                gegenereerd door kunstmatige intelligentie (AI) op basis van gesprekken en notities van de gebruiker.
              </p>
              <p>
                De materialen hebben een <strong>fictief, metaforisch en experimenteel karakter</strong>. Ze weerspiegelen
                geen echte bedrijfsactiviteiten en zijn geen plan voor het oprichten van een bedrijf. Beschouw ze als
                verhalen, sprookjes en analyses die zijn gemaakt als onderdeel van een proces om gedachten te ordenen.
              </p>
              <p className="text-sm italic text-slate-400">
                Ta strona jest eksperymentem narracyjnym. Większość treści została wygenerowana przez systemy sztucznej
                inteligencji. Materiały mają charakter fikcyjny, metaforyczny i testowy – nie odzwierciedlają rzeczywistej
                działalności gospodarczej ani planu założenia firmy.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800 bg-slate-950">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-slate-400 text-sm mb-2">
              © {new Date().getFullYear()} Daremon – Experimenteel AI Narratief Project
            </p>
            <p className="text-center text-slate-500 text-xs">
              Elke overeenkomst met echte personen, bedrijven of situaties is toevallig of metaforisch.
              Deze site documenteert geen bedrijfsactiviteiten.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
