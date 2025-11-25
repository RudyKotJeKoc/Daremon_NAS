import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Daremon – Bureau voor Systeem- en Narratieve Analyse",
  description: "Techniek, instituties en verhalen geanalyseerd alsof het complexe machines zijn.",
  keywords: ["systeemanalyse", "narratieve analyse", "technische analyse", "instituties", "advies"],
  authors: [{ name: "Daremon" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    title: "Daremon – Bureau voor Systeem- en Narratieve Analyse",
    description: "Techniek, instituties en verhalen geanalyseerd alsof het complexe machines zijn.",
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
        <footer className="border-t mt-20">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} Daremon – Bureau voor Systeem- en Narratieve Analyse
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
