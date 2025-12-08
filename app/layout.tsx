import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Daremon – Persoonlijk Digitaal Laboratorium",
  description: "Experimenteel AI-project voor het ordenen van gedachten en genereren van metaforische verhalen.",
  keywords: ["AI experiment", "digitaal laboratorium", "technische analyses", "persoonlijk project"],
  authors: [{ name: "Daremon" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    title: "Daremon – Persoonlijk Digitaal Laboratorium",
    description: "Experimenteel AI-project voor het ordenen van gedachten en genereren van metaforische verhalen.",
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

        <footer className="border-t border-slate-800 bg-slate-950">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center space-y-3">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Daremon – persoonlijk digitaal laboratorium
              </p>
              <p className="text-slate-500 text-xs">
                Deze website documenteert persoonlijke experimenten en technische analyses.
                Geen commerciële activiteit. <a href="/legal" className="underline hover:text-slate-400 transition">Meer informatie</a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
