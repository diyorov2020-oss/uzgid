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

## Qilingan (2026-07-11 dizayn sessiyasi, 2-qism)
- **Namoz:** Ishroq (Quyosh+20daq) va Tahajjud (kecha Shom→Bomdod, oxirgi 1/3) qo'shildi — xira "nafl" uslubida, islom.uz'ga mos.
- **Bayroq:** hero pastidagi chiziqqa qizil fimbriatsiya qo'shildi (to'liq O'zbek bayrog'i).
- **Til tugmasi** hero'dan **topbar controls**ga ko'chirildi (endi HAR bo'limda ishlaydi — Fable topgan asosiy bug).
- **⭐ «Bugun chizig'i» (todaystrip):** topbar tagida, har bo'limda, jonli 4 segment — 🕐vaqt · 🌤harorat · 💵USD · 🕌keyingi namoz+sanoq. Tagida bayroq chizig'i. Mobilda sticky (asosiy tepa anchor; shu sabab beta-bar sticky qaytarildi). Funksiyalar: `stripWeather/stripPrayer/updateTodayStrip/initStrip`; onCityChange + loadCurrency + 1s interval bilan yangilanadi.
- **DESIGN.md** yaratildi (dizayn tizimi) + **Fable 5** review qildi (natijalar DESIGN.md audit va TODO'da).

## Qilingan (2026-07-11 logo + yoqilg'i sessiyasi)
- **Real brend logolari** (kutilgan qaror #1 — «logo fayl» tanlandi). `public/logos/<host>.png` — lokal beriladi (3-tomon favicon-servisiga bog'liq emas). Avtomatik yuklab olindi: apple-touch-icon (~180px) → bo'lmasa Google favicon. **27/40 host** logolangan (My Gov, Soliq, CBU, OneID, Open Data, Mehnat, ССВ, UzBMB, HEMIS, Railway, Uzairways, Qanot Sharq, Centrum Air, Avtovokzal, Yandex Go, MyTaxi, Click, Payme, Uzum, Paynet, Afisha, Ticket, PFL, UzA, Norma ...). Qolgan 13 tasi (e-imzo, kadastr, customs, silkavia, uzairports, cinema, teatr, championat, ziyouz, ziyonet, kitob, natlib, lex) bot bloklagani/16px favicon sabab **emoji fallback**da qoldi.
  - `renderLinks` yangilandi: `LOGOS` Set + `linkHost()`. Logo bor host → `<img src="/logos/host.png">` (38px, oq fon), yo'q/yuklanmasa → emoji (`onerror`).
  - **Logo qo'shish:** rasmiy fayl bo'lsa → `public/logos/<host>.png` ga tashla + `LOGOS` Set'ga host qo'sh.
- **⛽ Yoqilg'i narxlari kartasi** (kutilgan qaror #2 — tavsiya funksiya). Xizmatlar panelida, tarif kartasidan keyin (`#fuel`, `renderFuel()`, i18n `w_fuel`). Turlar: Benzin (AI-80/91/92/95), Dizel (DT), Avto-gaz (Metan/Propan). **Narxlar hozircha OLIB TASHLANGAN** — har turi yonida «Tez orada» (soxta raqam ko'rsatmaslik uchun; foydalanuvchi so'radi). Aniq narx tayyor bo'lsa → `renderFuel()` ichidagi ro'yxatga qiymat qo'shiladi.
- Deploy qilindi (main push + Render hook).

## Fable 5 review — keyingi ish (prioritet)
1. Tipografiya: 25 xil o'lcham → 7 pog'onali shkala (`--fs-*`).
2. `manba·sana` chip — har jonli kartochkada (ayniqsa ob-havoda yo'q).
3. Mobil pastki tab-bar (nav scrollda ketmasin).
4. Valyuta kartochkasi: "eng foydali bank" tepaga, oltin alohida karta.
5. Ikonka birligi (SVG-line), `:focus-visible`, tap-nishon ≥44px, o'lik CSS tozalash, Yandex xarita lazy-load.
6. DESIGN.md v2: breakpoint/z-index/token/holat-triad/"definition of done".

## KATTA G'OYA — Transport: real-time avtobus xaritasi (kelajak bosqich)
Foydalanuvchi so'rovi: Transport bo'limida Toshkent avtobuslarining **real vaqtda harakatini** ko'rsatuvchi **haqiqiy interaktiv xarita** (Yandex Maps ichidagidek, lekin O'ZIMIZNIKI — havola/embed emas). Marshrutlar, bekatlar, bekat nomlari; foydalanuvchi o'z joylashuvi + atrofini ko'rsin. Pul to'lashga tayyor (juda qimmat bo'lmasa).
**Baho (2 qism):**
- **Xarita + marshrut + bekatlar:** DOABLE & arzon — MapLibre GL yoki Leaflet + OSM tiles (bepul) / MapTiler (bepul tier). Bekat/marshrut = Toshkent GTFS ma'lumoti.
- **Real-time avtobus joylashuvi:** BLOKER — Toshkentda ochiq GTFS-realtime / transport API bor-yo'qligiga bog'liq. Yandex o'z jonli ma'lumotini bermaydi. **1-qadam (davay bo'lganda): Toshshahartransxizmat / smart-transport ochiq API/feed bor-yo'qligini aniqlash.** Bo'lsa — arzon va real; bo'lmasa — hamkorlik/scraping kerak. **Nomzod manbalar (user):** MyBus.uz, 3TM — ochiq olib bo'lsa olamiz, ariza kerak bo'lsa uni ham qilamiz.

## ⏭️ DAVOM — foydalanuvchi tanlashi kerak (2026-07-11 holati)
Hammasi deploy qilingan. ✅ Qaror #1 (logo) va ⛽ yoqilg'i BAJARILDI (yuqoriga qarang). Keyingi funksiya tanlovi:
   - ⛽ **Yoqilg'i narxlarini to'ldirish** (hozir «tez orada» — aniq raqam kerak; manba tekshirish)
   - 🖼 **Qolgan 13 logo** (rasmiy fayl topib qo'shish: e-imzo, customs, teatr, cinema, lex, natlib ...)
   - 🕌 **Namoz eslatma** (PWA push bildirishnoma)
   - 🧭 **"Yo'l ko'rsat"** — "menga yaqin" natijalariga marshrut tugmasi
   - 🇨🇳 **Xitoy tili** to'liq tarjima (~114 UI + data)
   - 🚌 **Avtobus real-time** (MyBus.uz/3TM manba tekshirishdan boshlanadi)
   - 📐 **Fable tizim:** tipografiya 25→7, manba·sana chip, mobil tab-bar

## Keyingi reja (TODO)
- [ ] **Qiymat taklifi (value prop) — "Nega aynan UZGID?"** → hero'ga aniq shior + saytning noyob afzalligini ko'rsatish (jamlash + ishonch + tejash: banklar kesimida "eng foydali kurs", 3 til, betaraf/bepul). Foydalanuvchi buni birinchi ishlamoqchi.
- [ ] **Fitnes / sport zallar** — "Joylar" xaritasiga yangi kategoriya (OSM `leisure=fitness_centre`). Bo'sh placeholder emas, real qidiruv. (Foydalanuvchi tanladi: "keyin davom etamiz".)
- [ ] **Turizm kengaytmasi (tur paketlar)** — alohida sayt EMAS. Turizm panelini "marshrutlar + litsenziyalangan tur-firmalar katalogi" ko'rinishida kengaytirish (UZGID = betaraf gid/katalog, sotuvchi emas). Booking/to'lov kerak bo'lsa — keyin `tur.uzgid.uz` alohida servis.
- [ ] **Jonli qibla kompasi (ixtiyoriy)** — iPhone'da device-orientation bilan telefon burilганда aylanadigan real kompas (iOS ruxsat tugmasi kerak).
- [ ] Deploy: yuqoridagilar tayyor bo'lgach Render hook orqali.

## Namoz vaqti — O'zbekiston rasmiy formulasi (MUHIM)
`loadPrayer()` Aladhan API'dan **quyidagi aniq sozlama bilan** oladi (islom.uz / O'zbekiston musulmonlar idorasiga 100% mos, 11.07.2026 Toshkentda 6/6 vaqt tekshirilgan):
`method=99&methodSettings=15.5,null,15.5&school=1&tune=0,0,0,1,0,4,0,0,0`
- Bomdod/Xufton burchagi: **15.5°**
- Asr: **Hanafiy** (school=1) — Aladhan default Shafiy noto'g'ri edi (~72 daq farq!)
- Ihtiyot: Peshin **+1**, Shom **+4** daqiqa (tune tartibi: Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight)
- Eski `method=2` (ISNA) **noto'g'ri** edi — o'zgartirilmasin.
- ⏳ Boshqa fasllar (qish) ham tekshirish tavsiya (bir necha kun islom.uz bilan solishtirish).

## Muhim eslatmalar
- Barcha UI matni 3 tilda — yangi matn qo'shsang `T.uz/ru/en` uchalasiga qo'sh.
- `index.html` katta bitta fayl — o'zgarishdan keyin JS sintaksisini tekshir (eng katta `<script>` blokini `node --check`).
