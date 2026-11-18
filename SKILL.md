---
name: globo-premium
description: Voli di camera su un globo 3D con immagini satellitari vere (dallo spazio al punto esatto), pin con carta, etichette di regione, percorsi animati pieni o tratteggiati, rilievo 3D delle montagne e Terra di notte con le luci delle città, per video verticali 9:16 e orizzontali 16:9. Usala quando un video deve mostrare DOVE si trova qualcosa, un viaggio, una rotta, un volo da un luogo all'altro, una mappa o un globo.
---

# Globo premium

Motore: la cartella `motore/` di questa skill (MapLibre GL in Chromium headless, fotogramma per fotogramma: nessun salto, nessuna tessera mancante).
Esce un MP4 **muto**: voce, effetti e musica si aggiungono nel montaggio.

**Prima volta:** se nella cartella della skill manca `node_modules`, esegui `bash installa.sh` (controlla Node 18+ e ffmpeg,
installa Playwright e il suo Chromium). Le mappe non vanno scaricate né configurate: nessuna chiave, nessun account,
le tessere arrivano da sole dai server pubblici durante il render (serve internet).

```bash
G=~/.claude/skills/globo-premium/motore      # cambia se la skill è altrove
node $G/render.mjs viaggio.json bozza.mp4 --scala 0.5 --fps 15 --foglio foglio.jpg   # SEMPRE prima: bozza + foglio da 16 fotogrammi
node $G/render.mjs viaggio.json clip.mp4                                             # definitivo (w×h del file, 30 fps)
#   --da 3 --a 6  per renderizzare solo un tratto
```
Una bozza di 8 s in 9:16 richiede circa un minuto e inquadra esattamente come il definitivo. **Guarda il foglio** prima del definitivo: pin dentro il quadro, rotta visibile, niente riquadri.

## Il file del viaggio
Esempi pronti in `motore/esempi/`: `notte_roma_tokyo.json` (notte + rotta, 9:16), `marco_polo.json` (percorso a tappe),
`everest.json` (montagna 3D), `derinkuyu.json` (volo + rilievo, 16:9), `derinkuyu_spazio_169.json` (dallo spazio a un punto) e le versioni `_169`.

- `w`, `h`, `fps`, `durata`; nel 9:16 metti `u: 1.45` (scala di scritte e pin).
- `camera`: chiavi `{t, lng, lat, zoom, pitch, bearing}`, interpolate con una curva monotona.
  Zoom 1-1,3 globo intero · 2,85-3,2 globo che riempie il 9:16 · 4-5 nazione · 8 regione · 11-12,5 città. Pitch massimo ~52.
- `etichette`: `pin` (`testo` CORTO, `sotto`, `lng`, `lat`, `da`, `a`, `altezza`) oppure `regione`.
  La carta del pin sta SOPRA il punto: **tieni il centro della camera a nord del pin** (pin nella metà bassa), altrimenti con pitch alto la carta esce dal quadro.
- `percorsi`: `punti` [[lng,lat]…], `da`/`a`, `stile` `pieno`|`tratteggio`, `nota` (pillola) con `nota_da`, `nota_dx`, `nota_dy` e `nota_pos` [lng,lat] (predefinito: a metà tra partenza e arrivo; sulle rotte lunghe mettila su un punto della rotta).
  Per le rotte lunghe usa punti sul cerchio massimo e **fai seguire la testa della rotta alla camera** (chiavi lungo il percorso), altrimenti la linea esce dal 9:16.
- `stile: "notte"`: NASA Black Marble 2016 (luci delle città; zoom massimo 8, quindi niente primi piani di città).
- `terreno`: esagerazione del rilievo (1,4-1,6 montagne, 0 oceani). `ombre: false` sopra l'oceano.
- `blue_marble` (predefinito acceso): da lontano NASA Blue Marble, da vicino Sentinel-2, con dissolvenza tra gli zoom `blue_marble_zoom` (predefinito [7, 8.2]). Toglie i riquadri della mappa satellitare. Sulle montagne dell'Asia (Everest, Tibet) usa [9.4, 10.6]; `blue_marble: false` solo Sentinel-2.
- Le carte dei pin e le note restano sempre dentro il quadro da sole (se non entrano sopra il punto vanno sotto); se il punto esce dal quadro, la carta esce con lui.
- `crediti`: testo dei crediti in basso a sinistra (predefinito in italiano; mettilo in inglese o nella tua lingua se serve, senza togliere le fonti).

## Ricette
- **Volo da A a B** (classifiche, «dove si trova»): A zoom 3,2 pitch 15 → metà strada zoom 1,9 → B zoom 6-6,8 pitch 30, in 3 s.
- **Viaggio storico**: tappe vere come punti, stile `pieno` (il tratteggio chiaro si perde sui deserti), nota con anni o km, camera che segue.
- **Montagna**: partenza da zoom ~3,2 dall'alto, discesa a 8,6 con pitch 38, arrivo a 11 con pitch 50, centro un po' a nord della vetta.
- **Notte**: rotte e pin risaltano molto; ideale per voli intercontinentali.

## Limiti noti
- I riquadri della mappa satellitare (dato EOX) su Tibet/Cina/India sono coperti da Blue Marble fino allo zoom di `blue_marble_zoom`: se si vede ancora un riquadro, alza quei due valori.
- Le isole piccole in mezzo all'oceano oltre zoom ~6 mostrano un riquadro più chiaro: fermati a 5,8-6,6.
- Le etichette lunghe escono dal 9:16: 1-2 parole nel `testo`, il resto in `sotto`.

## Licenze
Vedi `CREDITI.md`. Usa solo lo strato EOX **2016** (CC BY 4.0, uso commerciale con credito); MAI gli strati EOX 2018+ (non commerciali).
Notte: NASA Black Marble 2016. Da lontano: NASA Blue Marble. Rilievo: AWS Terrain Tiles (Mapzen). Copia i crediti nella descrizione del video.
