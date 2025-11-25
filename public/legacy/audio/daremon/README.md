# DAREMON Audio Analyses

This directory contains audio recordings for DAREMON analyses about AZC (Asylum Seeker Centers) policy, housing, and systemic observations.

## Directory Structure

```
audio/daremon/
├── README.md                          # This file
├── intro-deel1-nl.mp3                # Introduction Part 1 (Dutch)
├── intro-deel1-pl.mp3                # Introduction Part 1 (Polish)
├── intro-deel1-en.mp3                # Introduction Part 1 (English)
├── waarheid1-nl.mp3                  # Truth #1 - Economic Ecosystem (Dutch)
├── prawda1-pl.mp3                    # Truth #1 - Economic Ecosystem (Polish)
├── truth1-en.mp3                     # Truth #1 - Economic Ecosystem (English)
├── waarheid2-nl.mp3                  # Truth #2 - Protection Paradox (Dutch)
├── prawda2-pl.mp3                    # Truth #2 - Protection Paradox (Polish)
├── truth2-en.mp3                     # Truth #2 - Protection Paradox (English)
├── waarheid3-nl.mp3                  # Truth #3 - Contribution Priority (Dutch)
├── prawda3-pl.mp3                    # Truth #3 - Contribution Priority (Polish)
├── truth3-en.mp3                     # Truth #3 - Contribution Priority (English)
├── waarheid4-nl.mp3                  # Truth #4 - Cost Analysis (Dutch)
├── prawda4-pl.mp3                    # Truth #4 - Cost Analysis (Polish)
├── truth4-en.mp3                     # Truth #4 - Cost Analysis (English)
├── waarheid5-nl.mp3                  # Truth #5 - Good Intentions to Barricades (Dutch)
├── prawda5-pl.mp3                    # Truth #5 - Good Intentions to Barricades (Polish)
├── truth5-en.mp3                     # Truth #5 - Good Intentions to Barricades (English)
├── 5waarheden-volledig-nl.mp3       # Full 5 Truths narration (Dutch)
├── 5prawdy-pelna-pl.mp3              # Full 5 Truths narration (Polish)
├── 5truths-full-en.mp3               # Full 5 Truths narration (English)
├── kosten-analyse-nl.mp3             # Cost Analysis deep dive (Dutch)
├── analiza-kosztow-pl.mp3            # Cost Analysis deep dive (Polish)
├── cost-analysis-en.mp3              # Cost Analysis deep dive (English)
├── huisvesting-prioriteit-nl.mp3    # Housing Priority deep dive (Dutch)
├── mieszkania-priorytety-pl.mp3     # Housing Priority deep dive (Polish)
├── housing-priority-en.mp3           # Housing Priority deep dive (English)
├── denbosch-casestudy-nl.mp3        # Den Bosch Case Study (Dutch)
├── denbosch-studium-pl.mp3          # Den Bosch Case Study (Polish)
├── denbosch-casestudy-en.mp3        # Den Bosch Case Study (English)
├── ukraine-paradox-nl.mp3            # Ukraine Paradox (Dutch)
├── ukraina-paradoks-pl.mp3           # Ukraine Paradox (Polish)
└── ukraine-paradox-en.mp3            # Ukraine Paradox (English)
```

## Naming Convention

- **Language suffixes:**
  - `-nl` = Nederlands (Dutch)
  - `-pl` = Polski (Polish)
  - `-en` = English

- **File types:**
  - `intro-*` = Introduction to AZC system
  - `waarheid/prawda/truth-*` = Individual truth/observation audio
  - `*-volledig/pelna/full-*` = Full combined narration
  - `*-analyse/analiza/analysis-*` = Deep-dive analysis
  - `*-casestudy/studium-*` = Case study

## Audio Specifications

- **Format:** MP3
- **Bitrate:** 128 kbps (recommended for speech)
- **Sample Rate:** 44.1 kHz
- **Mono/Stereo:** Mono (recommended for speech, smaller file size)
- **Duration:** Varies by content (typically 5-30 minutes)

## Usage in Pages

### 5-waarheden.html
- Each of the 5 "truth cards" has an audio player placeholder
- Files: `waarheid1-nl.mp3` through `waarheid5-nl.mp3` (and PL/EN equivalents)

### audio-analizy.html
- Dedicated page for all audio analyses
- Sections for: Intro, 5 Truths, Cost Analysis, Housing, Den Bosch, Ukraine
- Currently showing "Coming Soon" placeholders

## Recording Guidelines

1. **Tone:** Professional, calm, analytical (not accusatory)
2. **Style:** Clear explanation of data and observations
3. **Structure:**
   - Introduction (context)
   - Main points (data/facts)
   - Reflection questions
   - Conclusion
4. **Language:** Match the written content in each language version
5. **Quality:** Studio or quiet room recording, minimize background noise

## TODO: Audio Production

- [ ] Record Dutch versions (NL)
- [ ] Record Polish versions (PL)
- [ ] Record English versions (EN)
- [ ] Edit and master audio files
- [ ] Upload to this directory
- [ ] Update audio-analizy.html to enable players
- [ ] Update 5-waarheden.html to enable players
- [ ] Test playback on mobile/desktop

## Integration Instructions

Once audio files are ready:

1. Upload MP3 files to this directory
2. Edit `audio-analizy.html` - uncomment the SectionAudioPlayer initialization code
3. Edit `5-waarheden.html` - remove "coming-soon" divs and initialize audio players
4. Test on all browsers and devices

## Contact

For questions about audio production:
- Email: dariusz@adamski.tech
- Project: DAREMON Analysis Platform
