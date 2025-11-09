#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_TRACKS = 500;
const DEFAULT_ARTIST = 'DAREMON Radio';
const COVER_COLORS = [
  '4CAF50',
  '2196F3',
  'FF9800',
  'E91E63',
  '9C27B0',
  '673AB7',
  '3F51B5',
  '03A9F4',
  '00BCD4',
  '009688',
  '8BC34A',
  'CDDC39',
  'FFEB3B',
  'FFC107',
  'FF5722',
  '795548',
  '9E9E9E',
  '607D8B'
];
const COVER_COLOR_OFFSET = 1;

// 500 Powiedzonek dla Radia DAREMON
const mottos = [
  // NEDERLANDS (1-125)
  "Clean Room is je juridische schild tegen Rompa",
  "Documenteer elke stap - het is je bewijs van onafhankelijkheid",
  "Geheimhoudingsplicht Art. 11 geldt voor onbepaalde tijd",
  "Boete: €2500 direct, zonder waarschuwing",
  "Je algemene vaardigheden zijn vrij - de rest vereist een Waiver",
  "Gebruik geen CAD-tekeningen van ITB - maak nieuwe vanaf nul",
  "Je PLC-kennis is van jou - documenteer externe bronnen",
  "Art. 11 beschermt alles wat niet publiek is",
  "Volledige schadevergoeding kan €150k overschrijden",
  "Parameters van Cremer cursus, niet van ITB",
  "VSO is je laatste kans voor Art. 11 vrijstelling",
  "Contact geen ITB klanten - bouw eigen B2C basis",
  "Retourneer alle documenten ongevraagd aan Rompa",
  "Art. 10: je uitvindingen op het werk zijn van Rompa",
  "BASF Catamold is veilig, ITB recepten niet",
  "Registreer bij KVK onder neutrale naam",
  "Raadpleeg advocaat - je hebt €650 budget",
  "Gebruik €1500 voor certificaten: SolidWorks en ISO 9001",
  "Beperk schadevergoeding tot 6 maanden bruto salaris",
  "Teken VSO niet binnen 7 dagen - je hebt 14 dagen bedenktijd",
  "Defense File is je juridische pantser",
  "Stilzwijgen van Rompa is geen toestemming",
  "Notification Letter is een verzekering voor €0",
  "Market Carve-Out elimineert 80% juridisch risico",
  "Kopieer nooit bestanden naar privé apparaten",
  "Kapitaal is afvloeiingsregeling - gebruik het voor start, niet juridische strijd",
  "UWV Startersperiode: 6 maanden financiële buffer",
  "Transformeer opleidingsbudget in verkoop- en business vaardigheden",
  "Bied Rompa formeel aan om tooling te kopen voor fractie van boekwaarde",
  "Slopen is rationeel voor Rompa - elimineert concurrentie",
  "Oldtimers zijn je Market Carve-Out strategie",
  "Bouw bedrijf op vertrouwen, niet op Rompa's chaos",
  "Wacht niet op Rompa's hulp - bouw zonder hen",
  "Overtuig team: succes is mogelijk zonder Rompa",
  "Stop met vragen om toestemming - begin met handelen",
  "Verifieer markt: zonder 2-3 klanten heeft business geen zin",
  "Inventariseer machines met serienummers",
  "Als Rompa weigert te verkopen, zoek tweedehands op Machineseeker",
  "B.V. geeft beperkte aansprakelijkheid",
  "B2B verkoop en management zijn cruciale hiaten",
  "Toon Hans: stabiele huur en jij bent Caretaker 24/7",
  "Gebruik betaalde vrije maand voor B.V. registratie",
  "Laat Rompa niet denken dat je voorbereidt op concurrentie",
  "Wekelijkse kernteam meetings: feiten, geen emoties",
  "Realistisch plan: 6-12 maanden tot eerste inkomsten",
  "Snelle kleine overwinningen bouwen teamvertrouwen",
  "ZZP netwerk is flexibel alternatief",
  "Gebruik opleidingsbudget voor KMO Management cursus",
  "Je hebt hun machines niet nodig om geld te verdienen",
  "Hans' klassieker renovatie is Proof of Concept",
  "Voel me beste in industriële automatisering en storing zoeken",
  "Moderniseer PLC controller - oude MIM ovens kunnen nog jaren werken",
  "MIM ovens hebben eenvoudige bouw - repareer met juiste materialen",
  "In vacuümovens betekent vacuüm niet altijd zuiverheid",
  "Ideaal debinding proces vereist actieve gas purge na cyclus",
  "Voeg Cold-Trap en isolatie toe aan gas leiding",
  "Grafiet liner in hot-zone stabiliseert thermische proces",
  "Je rol: Legacy Systems Reviver",
  "Gebruik MIM ovens voor prototyping: €200-600 per cyclus",
  "Repareer niet zoals voor storing - verbeter systemische fout",
  "In MIM ovens is formaldehyde en zuur het probleem",
  "Gebruik Elino PLC controller voor MIM temperatuur controle",
  "Controleer rookgas samenstelling en brander temperatuur",
  "HCHO en dauwpunt sensor in uitlaat kanaal is goedkoop en effectief",
  "MIM ovens zijn laboratorium voor hoge temperatuur",
  "Zie technical constraints en business opportunity in elk project",
  "Thermische reiniging van industriële tooling: stabiel inkomen",
  "Jouw technische kennis + Hans strategische contacten = succes",
  "Wil technologische ideeën ontwikkelen zoals ITB vroeger",
  "Doe geen zinloze dingen - zoek plan met motivatie",
  "CoolFlow: 25% energie besparing in 30 dagen",
  "VibeLog: monitor machine hartslag voordat het stopt",
  "Mijn stack: goedkope ESP32 in plaats van dure server",
  "Automatisering is mijn passie - routine is tijdverspilling",
  "Ik repareer niet - ik moderniseer",
  "Woede en frustratie zijn normaal, maar geen strategie basis",
  "Rompa creëert opzettelijk chaos om jullie te verdelen",
  "Verander narratief: stop met Slachtoffer zijn, word Schepper",
  "ADHD is Pattern Recognition - verbind punten en voorspel hun zetten",
  "Ze praten je waardeloos - dat is Rompa's manipulatie",
  "Hun \"hulp\" betekent: vind werk elders, concurreer niet met Rompa CZ",
  "Je waarde zit niet in gebouw of machines, maar in know-how",
  "Roep reputatie druk op bestuur op voordat ze documenten tonen",
  "Laat je niet in mentale lus trekken - Rompa is niet jouw probleem",
  "Bouw nieuw doel - niet per se eigen bedrijf, maar iets met zin",
  "Zelfs als Rompa alles sloopt, kun je tweedehands machines kopen",
  "Vecht niet met Rompa - negeer hen en bouw alternatief",
  "Georganiseerde actie verlamt bestuur's chaos plan",
  "Werk aan Hans' project om vertrouwen en werkplek te winnen",
  "Wees flexibel - oldtimers zijn start, automatisering is doel",
  "Toon Hans je uitgewerkte scenario's en risico analyse",
  "Je hebt al voorsprong - zij weten niet dat jij hun manipulatie ziet",
  "Jouw succes is enige wat hen verslaat",
  "Als Rompa bewust verliesgevende optie kiest, schendt ze zorgplicht",
  "Afwijzen winstgevend aanbod bewijst: Rompa beschermt CZ, niet ITB NL",
  "Je bent Strategic Problem Solver - ziet business, niet alleen techniek",
  "Heb altijd Plan B klaar: Machineseeker en alternatief gebouw",
  "Formeel voorstel voor activa aankoop via B.V., niet privé personen",
  "Focus op kleine partijen en hoge marge",
  "Als Rompa weigert, eis schriftelijke motivering waarom ze verlies boven winst kiezen",
  "Alleen denken maakt geen prototypen - actie creëert momentum",
  "DAREMON succes: 20% AI strategie, 80% jouw uitvoering",
  "Wacht niet tot iemand zegt wat te doen - leider maakt eigen plan",
  "Verlamming door analyse is valkuil",
  "Uitvoering telt, niet ideeën",
  "Belangrijkste wat je morgen kunt doen: vandaag beginnen",
  "Moed om te starten is grootste verschil tussen succes en falen",
  "Goede ambachtsman met goed gereedschap wint altijd",
  "Als je iets niet snapt, verbeter en fix het",
  "Rompa is langzame Tank, jij en AI zijn snelle Drone",
  "AI is geen bedrog - het democratiseert expert kennis",
  "Solo Founder met AI verslaat corporaties",
  "Onafhankelijkheid: werken aan wat zin heeft",
  "Controle over tijd is waardevoller dan stabiel salaris",
  "Zoek geen werk - zoek problemen om op te lossen",
  "Vrijheid is cruciaal voor innovatie",
  "Beste deals: iedereen wint",
  "Passie > Salaris",
  "Je bent investering in project succes, geen werknemer",
  "Test realiteit: zijn jullie klaar om eigen geld en tijd te investeren?",
  "Over jaar: of je had gelijk over manipulatie, of je hebt bedrijf",
  "Gebruik Art. 31 verlof voor certificaten",
  "Blijf professioneel en kalm, zelfs als Rompa oneerlijk handelt",
  "Bouw op vertrouwen en coördinatie, niet op chaos",
  "Jouw toekomstige versie zal je bedanken dat je vandaag begon",

function loadMottos() {
  const mottosPath = path.join(__dirname, MOTTOS_FILE_NAME);

  let rawContent;
  try {
    rawContent = fs.readFileSync(mottosPath, 'utf-8');
  } catch (error) {
    throw new Error(`Unable to read ${MOTTOS_FILE_NAME}: ${error.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (error) {
    throw new Error(`Unable to parse ${MOTTOS_FILE_NAME} as JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`${MOTTOS_FILE_NAME} must contain an array of mottos.`);
  }

  const normalized = parsed.map((entry, index) => {
    if (typeof entry !== 'string') {
      throw new Error(`Motto at index ${index} must be a string.`);
    }

if (mottos.length !== TOTAL_TRACKS) {
  throw new Error(
    `Expected exactly ${TOTAL_TRACKS} mottos, but received ${mottos.length}.`
  );
}

function resolveCoverUrl(index) {
  const paletteIndex = (index + COVER_COLOR_OFFSET) % COVER_COLORS.length;
  const paletteColor = COVER_COLORS[paletteIndex];
  const trackNumber = index + 1;
  return `https://placehold.co/120x120/${paletteColor}/ffffff?text=${trackNumber}`;
}

function ensurePlaylistTracks(playlistData) {
  const existingById = new Map(
    Array.isArray(playlistData.tracks)
      ? playlistData.tracks.map(track => [track.id, track])
      : []
  );

  const normalizedTracks = [];

  for (let index = 0; index < TOTAL_TRACKS; index++) {
    const trackNumber = index + 1;
    const motto = mottos[index];
    const trackId = `track-${trackNumber}`;
    const defaultTrack = {
      id: trackId,
      title: motto,
      artist: DEFAULT_ARTIST,
      src: `/music/Utwor%20(${trackNumber}).mp3`,
      cover: resolveCoverUrl(index),
      tags: ['music'],
      weight: 1,
      type: 'song',
      golden: false
    };

    const existingTrack = existingById.get(trackId);
    if (existingTrack) {
      normalizedTracks.push({
        ...defaultTrack,
        ...existingTrack,
        id: trackId,
        title: motto
      });
    } else {
      normalizedTracks.push(defaultTrack);
    }
  }

  playlistData.tracks = normalizedTracks;
  return normalizedTracks.length;
}

function ensureTrackMetadata(metadata) {
  const existingByFile = new Map(
    Array.isArray(metadata.tracks)
      ? metadata.tracks.map(entry => [entry.file, entry])
      : []
  );

  const normalizedMetadata = [];

  for (let index = 0; index < TOTAL_TRACKS; index++) {
    const trackNumber = index + 1;
    const motto = mottos[index];
    const fileName = `Utwor (${trackNumber}).mp3`;
    const existingRecord = existingByFile.get(fileName);

    const normalizedRecord = {
      ...existingRecord,
      file: fileName,
      title: motto,
      artist: existingRecord?.artist || DEFAULT_ARTIST
    };

    normalizedMetadata.push(normalizedRecord);
  }

  metadata.tracks = normalizedMetadata;
  return normalizedMetadata.length;
}

const playlistPath = path.join(__dirname, 'playlist.json');
const tracksPath = path.join(__dirname, 'tracks.json');

const playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf-8'));
const tracksMetadata = JSON.parse(fs.readFileSync(tracksPath, 'utf-8'));

const updatedPlaylistCount = ensurePlaylistTracks(playlist);
const updatedMetadataCount = ensureTrackMetadata(tracksMetadata);

fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2), 'utf-8');
fs.writeFileSync(tracksPath, JSON.stringify(tracksMetadata, null, 2), 'utf-8');

console.log(`✅ Updated ${updatedPlaylistCount} track titles in playlist.json`);
console.log(`✅ Updated ${updatedMetadataCount} track titles in tracks.json`);
console.log('📻 Radio DAREMON now plays with motivational mottos!');
