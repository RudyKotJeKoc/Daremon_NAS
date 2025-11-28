export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-slate-100">Daremon</span>
            <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-normal text-slate-300">
              Bureau voor Technische Analyse & Automatisering
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-cyan-400 font-light tracking-wide mt-6 sm:mt-8">
            Industrieel inzicht. Data. Systemen. Logika.
          </p>
          <p className="text-base sm:text-lg text-slate-400 font-light">
            Bez bullshit-u. Bez szumu.
          </p>
        </div>
      </section>

      {/* Co robimy */}
      <section className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-6 sm:mb-8 border-b border-cyan-500/30 pb-3 sm:pb-4">
            Co robimy
          </h2>

          <ul className="space-y-4 sm:space-y-5 text-slate-200">
            <li className="flex items-start gap-3 sm:gap-4">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100 text-base sm:text-lg">Analizy techniczne maszyn</strong>
                <span className="block text-slate-400 mt-1 text-sm sm:text-base">
                  Diagnostyka, ocena stanu, identyfikacja problemów
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 sm:gap-4">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100 text-base sm:text-lg">Diagnostyka wibracyjna</strong>
                <span className="block text-slate-400 mt-1 text-sm sm:text-base">
                  Monitoring kondycji urządzeń obrotowych
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 sm:gap-4">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100 text-base sm:text-lg">Systemy AI i wizji maszynowej</strong>
                <span className="block text-slate-400 mt-1 text-sm sm:text-base">
                  Computer vision, klasyfikacja, detekcja anomalii
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 sm:gap-4">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100 text-base sm:text-lg">Automatyzacja procesów i produkcji</strong>
                <span className="block text-slate-400 mt-1 text-sm sm:text-base">
                  PLC, SCADA, integracja systemów
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 sm:gap-4">
              <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
              <span>
                <strong className="text-slate-100 text-base sm:text-lg">Projektowanie rozwiązań prototypowych</strong>
                <span className="block text-slate-400 mt-1 text-sm sm:text-base">
                  Od koncepcji do wdrożenia
                </span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Dlaczego Daremon */}
      <section className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/30 rounded-lg p-5 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-6 sm:mb-8 border-b border-cyan-500/30 pb-3 sm:pb-4">
            Dlaczego Daremon?
          </h2>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 text-xl sm:text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  <strong className="text-slate-100">15+ lat doświadczenia</strong> przy skomplikowanych maszynach
                </p>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 text-xl sm:text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Połączenie <strong className="text-slate-100">automatyki, elektroniki, mechaniki i AI</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 text-xl sm:text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Praktyczne rozwiązania, <strong className="text-slate-100">zero korporacyjnych frazesów</strong>
                </p>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-cyan-400 text-xl sm:text-2xl flex-shrink-0">•</span>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  <strong className="text-slate-100">Całkowita przejrzystość</strong> metod i wyników
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status operacyjny */}
      <section className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 py-12 sm:py-16 pb-16 sm:pb-24">
        <div className="backdrop-blur-sm bg-slate-900/50 border border-cyan-500/20 rounded-lg p-5 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-100">Status operacyjny</h3>
          </div>

          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            W fazie formowania firmy <span className="text-cyan-400 font-semibold">(2025–2026)</span>.
          </p>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Stała baza operacyjna: <span className="text-slate-200">Boxtel</span>
          </p>
        </div>
      </section>

      {/* ETS LEGACY section */}
      <section className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 pb-16 sm:pb-24">
        <div className="border border-cyan-500/30 rounded-xl p-5 sm:p-6 md:p-8 bg-slate-900/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-3">
            ETS-systeem & Radio (Legacy Interface)
          </h2>

          <p className="text-slate-300 max-w-2xl mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
            Toegang tot de originele neon-interface met afteltimers, industriële statusmodules,
            visualisaties en het volledige ETS-radiosysteem.
          </p>

          <a
            href="/legacy/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 sm:px-6 py-3 min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-sm sm:text-base rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)] transition"
          >
            Open ETS-systeem
          </a>
        </div>
      </section>

      {/* Techniczny footer akcent */}
      <div className="max-w-4xl mx-auto px-5 sm:px-6 md:px-8 pb-8 sm:pb-12">
        <div className="border-t border-cyan-500/20 pt-6 sm:pt-8 text-center">
          <p className="text-slate-500 text-xs sm:text-sm font-mono break-all sm:break-normal">
            [ DAREMON_SYSTEM_V1 ] [ TECHNICAL_ANALYSIS ] [ AUTOMATION ]
          </p>
        </div>
      </div>
    </div>
  )
}
