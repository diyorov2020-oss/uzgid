# UZGID — ish holati va reja (handoff)

> Bu fayl istalgan qurilmadan (noutbuk/iPhone) davom ettirish uchun. Telefonda:
> **claude.ai → Claude Code (web) → `diyorov2020-oss/uzgid` reposini ula → shu NOTES.md ni o'qi.**

## Loyiha nima
UZGID (uzgid.uz) — O'zbekiston axborot portali. Bitta SPA: `public/index.html` (butun frontend + i18n uz/ru/en shu yerda) va kichik `server.js` (statik + API proksi).

## Ishga tushirish / deploy
- Lokalda: `node server.js` → http://localhost:3000
- Deploy: `git push` (main) qilingach, **Render deploy hook**iga curl qilinadi (avtomatik emas — qo'lda hook chaqiriladi).

## Tuzilma (panellar, sidebar tartibi)
`bosh → namoz → joylar → turizm → transport → xizmatlar → raqamlar → media → yangiliklar → aloqa → yordam`
(NAVID/NAVIC massivlari `index.html` ichida; tarjimalar `const T={uz,ru,en}`.)

## Shu sessiyada qilingan ishlar (2026-07-10)
1. **Kod tozalash** — 15+ o'lik tarjima kaliti (n_foydali, w_kommunal, w_qibla, app_*, ai_desc, w_sportzal ...) va ishlatilmaydigan `KOMMUNAL` massivi olib tashlandi. Har o'zgarishdan keyin `T` sintaksisi node bilan tekshirildi.
2. **Menyu tartibi** mantiqiy qilindi (yuqoridagi tartib) — Namoz yuqoriga, Joylar+Turizm birga.
3. **Media paneli** — bo'sh "Sport zali" olib tashlandi; "Kurort va bassein" → Turizm'ga ko'chirildi; TV "tez orada" qoldirildi.
4. **Kalendar** — tayyor `renderCalendar()` (CSS ham bor edi) Turizm paneliga ulandi (`#calWrap`).
5. **Qibla vizual kompasi** — tayyor, lekin ulanmagan `loadReligion` kompasi namozdagi `renderPrayer()`ga ko'chirildi (🕋 qibla burchagiga buriladi). O'lik nusxa o'chirildi.

## Qilingan (2026-07-11 UI/mobil sessiyasi)
- GPS tugmasi headerdan olib tashlandi ("menga yaqin" o'zi joylashuvni so'raydi).
- Ob-havo bloki o'lchami kichraytirildi; havo sifati (AQI) chipi tozalandi (🌫 o'rniga rangli nuqta).
- Mobil: topbar (region/city) endi `position:static` (qotib turmaydi); beta testbar `sticky` (tepada qoladi).
- Mobil header: brand (logo/UZGID/tagline) hamburger'dan oldinga; hamburger o'ngga `margin-left:auto` bilan qotdi → til o'zgarganda qimirlamaydi.
- Mobil banner: katta medallion (`.hero::after`) va naqsh (`::before`) yumshatildi (aralashmasligi uchun).
- Mobil sidebar: pastdagi `V1.0` (`.side-ver`) endi ochilganda ko'rinadi.

## Keyingi reja (TODO)
- [ ] **Qiymat taklifi (value prop) — "Nega aynan UZGID?"** → hero'ga aniq shior + saytning noyob afzalligini ko'rsatish (jamlash + ishonch + tejash: banklar kesimida "eng foydali kurs", 3 til, betaraf/bepul). Foydalanuvchi buni birinchi ishlamoqchi.
- [ ] **Fitnes / sport zallar** — "Joylar" xaritasiga yangi kategoriya (OSM `leisure=fitness_centre`). Bo'sh placeholder emas, real qidiruv. (Foydalanuvchi tanladi: "keyin davom etamiz".)
- [ ] **Turizm kengaytmasi (tur paketlar)** — alohida sayt EMAS. Turizm panelini "marshrutlar + litsenziyalangan tur-firmalar katalogi" ko'rinishida kengaytirish (UZGID = betaraf gid/katalog, sotuvchi emas). Booking/to'lov kerak bo'lsa — keyin `tur.uzgid.uz` alohida servis.
- [ ] **Jonli qibla kompasi (ixtiyoriy)** — iPhone'da device-orientation bilan telefon burilганда aylanadigan real kompas (iOS ruxsat tugmasi kerak).
- [ ] Deploy: yuqoridagilar tayyor bo'lgach Render hook orqali.

## Muhim eslatmalar
- Barcha UI matni 3 tilda — yangi matn qo'shsang `T.uz/ru/en` uchalasiga qo'sh.
- `index.html` katta bitta fayl — o'zgarishdan keyin JS sintaksisini tekshir (eng katta `<script>` blokini `node --check`).
