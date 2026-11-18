#!/usr/bin/env bash
# Installa tutto ciò che serve a globo-premium (una volta sola). Le mappe NON vanno scaricate: arrivano da sole durante il render.
set -e
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Manca Node.js 18+: https://nodejs.org"; exit 1; }
command -v ffmpeg >/dev/null || { echo "Manca ffmpeg: su Mac 'brew install ffmpeg', su Windows/Linux https://ffmpeg.org"; exit 1; }
npm install --no-audit --no-fund
npx playwright install chromium
echo "Pronto. Prova: npm run esempio  (crea prova.mp4 e prova.jpg)"
