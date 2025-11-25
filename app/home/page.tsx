export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-slate-100">Daremon</span>
            <span className="block mt-2 text-3xl md:text-4xl font-normal text-slate-300">
              Bureau voor Technische Analyse & Automatisering
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide mt-8">
            Industrieel inzicht. Data. Systemen. Logika.
          </p>
          <p className="text-lg text-slate-400 font-light">
            Bez bullshit-u. Bez szumu.
          </p>
        </div>
      </section>

      {/* Co robimy */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <h2 className="text-3xl font-semibold text-slate-100 mb-8 border-b border-cyan-500/30 pb-4">
            Co robimy
          </h2>

          <ul className="space-y-4 text-slate-200">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100">Analizy techniczne maszyn</strong>
                <span className="block text-slate-400 mt-1 text-sm">
                  Diagnostyka, ocena stanu, identyfikacja problemów
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100">Diagnostyka wibracyjna</strong>
                <span className="block text-slate-400 mt-1 text-sm">
                  Monitoring kondycji urządzeń obrotowych
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100">Systemy AI i wizji maszynowej</strong>
                <span className="block text-slate-400 mt-1 text-sm">
                  Computer vision, klasyfikacja, detekcja anomalii
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100">Automatyzacja procesów i produkcji</strong>
                <span className="block text-slate-400 mt-1 text-sm">
                  PLC, SCADA, integracja systemów
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100">Projektowanie rozwiązań prototypowych</strong>
                <span className="block text-slate-400 mt-1 text-sm">
                  Od koncepcji do wdrożenia
                </span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Dlaczego Daremon */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <h2 className="text-3xl font-semibold text-slate-100 mb-8 border-b border-cyan-500/30 pb-4">
            Dlaczego Daremon?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  <strong className="text-slate-100">15+ lat doświadczenia</strong> przy skomplikowanych maszynach
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  Połączenie <strong className="text-slate-100">automatyki, elektroniki, mechaniki i AI</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  Praktyczne rozwiązania, <strong className="text-slate-100">zero korporacyjnych frazesów</strong>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200">
                  <strong className="text-slate-100">Całkowita przejrzystość</strong> metod i wyników
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status operacyjny */}
      <section className="max-w-4xl mx-auto px-4 py-16 pb-24">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
            <h3 className="text-xl font-semibold text-slate-100">Status operacyjny</h3>
          </div>

          <p className="text-slate-300 leading-relaxed">
            W fazie formowania firmy <span className="text-cyan-400 font-semibold">(2025–2026)</span>.
          </p>
          <p className="text-slate-400 mt-2">
            Stała baza operacyjna: <span className="text-slate-200">Boxtel</span>
          </p>
        </div>
      </section>

      {/* Techniczny footer akcent */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="border-t border-cyan-500/20 pt-8 text-center">
          <p className="text-slate-500 text-sm font-mono">
            [ DAREMON_SYSTEM_V1 ] [ TECHNICAL_ANALYSIS ] [ AUTOMATION ]
          </p>
        </div>
      </div>
    </div>
  )
}
