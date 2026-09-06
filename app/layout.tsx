import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { RadioDock } from "@/components/radio-dock";
import { SiteFooter } from "@/components/site-footer";
import { LanguageProvider } from "@/components/language-provider";

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
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <RadioDock />
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
