#!/bin/bash
# UZGID — bir bosishda deploy: git push (main) + Render deploy hook
# Finder'da ikki marta bosib ishga tushirsa bo'ladi.
cd "$(dirname "$0")" || exit 1

echo "==> O'zgarishlar GitHub'ga (main) yuborilyapti..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
fi
git push origin main || { echo "❌ git push xato"; read -r; exit 1; }

# .env dan hook URL'ni o'qish
HOOK=$(grep -E '^RENDER_DEPLOY_HOOK=' .env 2>/dev/null | cut -d= -f2-)
if [ -z "$HOOK" ]; then
  echo "❌ RENDER_DEPLOY_HOOK .env faylida topilmadi"; read -r; exit 1
fi

echo "==> Render deploy hook chaqirilyapti..."
RESP=$(curl -s -X POST "$HOOK" -w "\nHTTP:%{http_code}")
echo "$RESP"
echo ""
echo "✅ Deploy boshlandi. ~1-2 daqiqada uzgid.uz yangilanadi."
echo "Yopish uchun Enter bos."
read -r
