export interface PortfolioItem {
  id: string
  youtubeId: string
  tytul: string
  kategoria: 'analiza-mechaniczna' | 'short' | 'ai-wizualizacja'
  format: '16:9' | '9:16'
  branza: 'plc' | 'arburg' | 'robotyka' | 'mim' | 'agro'
  opis: string
  data: string
}
