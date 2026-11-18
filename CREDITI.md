# Crediti e licenze dei dati / Data credits and licenses

Il codice è MIT (vedi LICENSE). Le mappe NON sono incluse nel repository: il motore scarica le tessere
dai server pubblici qui sotto mentre renderizza. Chi pubblica un video deve citare le fonti
(il motore le scrive già in basso a sinistra; copiale anche nella descrizione).

| Cosa | Fonte | Licenza | Credito da scrivere |
|---|---|---|---|
| Satellite di giorno | Sentinel-2 cloudless **2016**, EOX IT Services — https://s2maps.eu | CC BY 4.0 (uso commerciale permesso con credito) | «Sentinel-2 cloudless – https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)» |
| Satellite da lontano (zoom bassi) | NASA Blue Marble Next Generation via NASA GIBS — https://earthdata.nasa.gov/gibs | Dati NASA, uso libero (credito consigliato) | «NASA Earth Observatory – Blue Marble» |
| Terra di notte | NASA Black Marble 2016 (VIIRS) via NASA GIBS — https://earthdata.nasa.gov/gibs | Dati NASA, uso libero (credito consigliato) | «NASA Earth Observatory / NASA GIBS – Black Marble 2016» |
| Rilievo 3D | AWS Terrain Tiles (Mapzen / Tilezen joerd) — https://registry.opendata.aws/terrain-tiles/ | Dati aperti, con attribuzione delle fonti | «Terrain Tiles: Mapzen / AWS» + fonti: https://github.com/tilezen/joerd/blob/master/docs/attribution.md |
| Motore mappe | MapLibre GL JS 5.6 (caricato da jsDelivr) | BSD-3-Clause | — |
| Font | Montserrat (motore/font) | SIL Open Font License 1.1 (motore/font/OFL.txt) | — |

**Attenzione:** usare solo lo strato EOX **2016** (`s2cloudless_3857`, già impostato).
Gli strati EOX 2018 e successivi sono CC BY-NC-SA (**non commerciali**): non vanno usati per video monetizzati.
I server di tessere sono servizi gratuiti di terzi: usali con moderazione (le bozze a metà risoluzione bastano per provare).

---
**English:** code is MIT. Imagery is fetched at render time and is not part of this repo.
Daytime imagery: NASA Blue Marble when far away, Sentinel-2 cloudless 2016 by EOX up close (CC BY 4.0, commercial use OK with credit — do NOT switch to
the 2018+ layers, they are non-commercial). Night: NASA Black Marble 2016 (NASA GIBS). Elevation: AWS Terrain Tiles (Mapzen),
attribution list linked above. The engine burns the credit line into the bottom-left corner of every video.
