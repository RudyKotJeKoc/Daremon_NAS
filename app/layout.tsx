import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { RadioDock } from "@/components/radio-dock";

export const metadata: Metadata = {
  title: "DAREMON Engineering – Technische Montage & Procesanalyse",
  description:
    "DAREMON Engineering: gespecialiseerde technische videomontage, procesanalyse en AI-visualisaties voor de mechanische, industriële en agrarische sector.",
  keywords: [
    "technische videomontage",
    "procesanalyse",
    "PLC Siemens",
    "Arburg",
    "Yaskawa Motoman",
    "MIM",
    "industriële visualisatie",
  ],
  authors: [{ name: "Daremon" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    title: "DAREMON Engineering – Technische Montage & Procesanalyse",
    description:
      "Gespecialiseerde technische videomontage, procesanalyse en AI-visualisaties voor de mechanische, industriële en agrarische sector.",
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
        <RadioDock />

        <footer className="border-t border-slate-800 bg-slate-950">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center space-y-3">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} DAREMON Engineering
              </p>
              <p className="text-slate-500 text-xs">
                Specialistische technische videomontage, procesanalyse en AI-visualisaties.{" "}
                <a href="/legal" className="underline hover:text-slate-400 transition">Juridische informatie</a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
