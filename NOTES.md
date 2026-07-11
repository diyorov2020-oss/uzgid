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

## Qilingan (2026-07-11 yangiliklar + ticket + kino sessiyasi)
- **Yangiliklar — ko'p rasmiy manba agregatori** (server.js `getNews`/`fetchFeed`, `NEWS_SOURCES`). Faqat Gazeta.uz emas: **UzA** (davlat agentligi — prezident qarorlari/vazir tayinlovlari), **Kun.uz, Gazeta.uz, Xabar.uz, Review.uz** (iqtisod), **Podrobno** (faqat `ru`). Har manbadan ≤8, eng yangi tartibda, sarlavha bo'yicha dedupe, top 30. Kesh 15 daq **til bo'yicha** (`newsCache[lang]`). Bir manba yiqilsa qolganlari ishlaydi (Promise.all + 9s timeout + try/catch).
  - `/api/news?lang=uz|ru|en` — handler `lang`ni uzatadi. Manba tanlash: `url[lang] || url.uz` (boshqa tilga tushmaydi — shuning uchun `uz`da Podrobno chiqmaydi).
  - Frontend `loadNews` yangilandi: har xabar **sarlavha + pastida `manba · vaqt`** (`.news-t/.news-m/.news-src`, `fmtNewsDate` relativ vaqt uz/ru/en). Badge: `UzA·Kun·Gazeta·Xabar·Review`.
  - ⚠️ president.uz'da RSS yo'q (404), gov.uz/kun.uz/rss/daryo/norma turli manzillari 0 — ishlayotganlari yuqoridagilar. Rasmiy tayinlov/qaror = UzA orqali keladi.
  - **Manba qo'shish:** `NEWS_SOURCES`ga `{name,domain,url:{uz,ru,en}}` qo'sh (RSS `<item>` qaytishini avval `curl`da tekshir).
- **ticket.uz TUZATILDI:** u aslida endi **BCD Travel** (biznes-sayohat) sayti edi — logo ham BCD'niki. AFISHA'da → **iTicket.uz** (https://iticket.uz) ga almashtirildi; `ticket.uz.png` o'chirildi, `iticket.uz.png` qo'shildi, `LOGOS`da `ticket.uz`→`iticket.uz`.
- **Kino kengaytirildi:** KINO'ga **Kinoman.uz** (🍿) + **Kinopoisk** (⭐, host `www.kinopoisk.ru`) qo'shildi. Kinopoisk logo bor; Kinoman sifatli logo topilmadi → 🍿 emoji.
- Deploy qilindi (main push + Render hook).

## Qilingan (2026-07-11 Xitoy tili sessiyasi)
- **中文 (zh) to'liq qo'shildi** — `T.zh` bloki (**115 kalit**, uz/ru/en bilan 1:1 mos; `dirs·8, seasons·4, prayers·6, cats·14, tips·6`). Til tanlagichdan `zh`ning `class="soon"` va onclick guard'i olib tashlandi → endi ishlaydi. `locale()`ga `zh→zh-CN` (Intl sana/oy/hafta xitoycha).
- **Muhim:** kodda ko'p joyda `{uz,ru,en}[lang]` inline lug'atlar **fallback'siz** edi — zh'da `undefined` chiqarardi. Node-skript bilan HAR birini topib zh qo'shildi: me'yor manba (582), «Batafsil →» (585/588), namoz nafl/Ishroq/Tahajjud (719), kalendar hafta kunlari (751) + «bayram yo'q» (761), shahar yorliqlari (738), feedback savol/Ha/Yo'q (872), `fmtNewsDate` vaqt+locale (799-801), FAQ til-javobi. Tekshiruv: fallback'siz til-lug'atlarning hammasida `zh:` bor (skript ✓).
  - **Yangi til qo'shganda:** (1) `T`ga blok, (2) `locale()`, (3) til tanlagich span, (4) Node-skript bilan fallback'siz `[lang]`/`[L]` lug'atlarni skanerlab har biriga til kalitini qo'sh.
- **Data (zh emas, uz-fallback):** ~~FAQ, POI, WXD, HOLIDAYS, linklar...~~ → **BAJARILDI (pastga qarang).**

## Qilingan (2026-07-11 Xitoy tili DATA sessiyasi)
- **Barcha data zh'ga o'tkazildi.** Node-skript (`scratchpad/zhfill.js`) `en:"..."}` bilan tugaydigan **170 tarjima obyektiga** `zh` qo'shdi: POI (28 joy tavsifi), GOV/PAY/EDU/TRANS/KINO/TEATR/AFISHA/SPORT/EBOOK/OFFNEWS/NUMS/ISHONCH/TV linklari, tarif/me'yor/yoqilg'i inline matnlari, NEARCATS, FAQ_DATA (savol+javob), bayramlar (HOLIDAYS). Qo'shimcha: `FACTS.zh` (8 fakt), `WXD.zh` (ob-havo tavsifi, 19 kod), `PHRASES` 3-element (so'zlashgich xitoycha, `renderPhrasebook` `lang==="zh"` da zh ko'rsatadi).
- Tekshiruv: `en:"..."}` (zh'siz) qoldi = **0**. JS toza. Jonli render tasdiqlandi (政府服务, POI, bayram, fakt, ob-havo).
- **Qoldi (kichik):** `STATS` (shahar aholi/asos/balandlik) — `~2.9 mln / Mil.av. III asr / 455 m` — barcha tillar uchun bir xil (uz birlik so'zlari); ru/en'da ham shunday edi. Xohlansa keyin zh birlik so'zlariga o'giriladi.
- **Yangi til qo'shishda data ham:** `zhfill.js`dagidek `en`→yangi-til xaritasi bilan skript ishlat.
- Deploy qilindi (main push + Render hook).

## Qilingan (2026-07-11 footer + PWA install sessiyasi)
- **To'liq footer** (sayt eng pastida, 4 kolonka): brend+tagline+📲install tugmasi+til tanlagich · Asosiy (bosh/namoz/joylar/transport/xizmatlar) · Ma'lumot (turizm/raqamlar/media/yangiliklar) · UZGID (yordam/aloqa/Telegram). Pastida manba+copyright+`#updated`. CSS `.site-footer/.foot-*` (720px'da 2 ustun). Eski oddiy footer o'rniga.
- **Til tanlagich footer'da ham** — selektor `#langSeg span` → `.langseg span` (applyStatic highlight + onclick binding), footer switcher `class="langseg foot-langseg"` (id yo'q). Ikkalasi sinxron ishlaydi.
- **Haqiqiy PWA install:** header'da 📲 `#installIcon` + footer tugma → `doInstall()`. `beforeinstallprompt` ushlanadi (Android/desktop native oyna); yo'q bo'lsa (iPhone) `install_help` yo'riqnoma alert. Standalone rejimda header ikonka yashiriladi.
- **Service worker** `public/sw.js` — **keshsiz** (fetch interceptsiz, faqat installability uchun; sayt tez yangilangani uchun eskirmasin). `index.html` load'da ro'yxatdan o'tadi. Manifest allaqachon bor (icon 192/512+maskable).
- **FAQ**ga 2 yangi savol (4 tilda): ⛽ yoqilg'i narxlari, yangilik manbalari (UzA/Kun/Gazeta/Xabar/Review). i18n: `install/foot_main/foot_info/install_help` (uz/ru/en/zh).
- Deploy qilindi (main push + Render hook).

## Qilingan (2026-07-11 to'liq til qamrovi sessiyasi)
- **Maqsad:** qaysi til tanlansa — sayt TO'LIQ o'sha tilda (hech qayerda boshqa til qolmasin). Statik audit + tuzatish.
- **Topilgan «uz-leak» (zh'da o'zbekcha chiqardigan) `||uz` fallbackli helperlar:** `trafficInfo`, `aqiInfo` (`(u,r,e)=>({uz,ru,en})[lang]||u`) → `(u,r,e,z)` + zh qo'shildi. (Avvalgi zh-audit faqat fallback'sizlarni qidirgan — bularni o'tkazib yuborgan edi.)
- **STATS birliklari** (`~2.9 mln / Mil.av. III asr / 455 m`) → `locStat()` funksiyasi til bo'yicha o'giradi (mln/ming/yil/asr/Mil.av. → ru/en/zh). Yorliqlar (Aholi/Founded/...) allaqachon lokal edi.
- **Masofa** (menga yaqin) `" m"/" km"` → `t("unit_m")/t("unit_km")` (zh: 米/公里).
- **Reklama** (2 adslot) va **«rasmiy»** badge → `data-i="ad"/"official_badge"`. Yangi i18n kalitlar (4 til): `ad, official_badge, unit_km, unit_m`.
- **Wikipedia tili** (shahar «haqida») zh tanlanganda `zh.wikipedia.org` (2 joyda `wl`).
- **`<html lang>`** applyStatic'da allaqachon dinamik. Placeholderlar `data-ph`/`t()` bilan ✓. Feedback rahmati zh bor ✓.
- **T jami: 123 kalit × 4 til (teng).** JS toza, 0 ta 3-tilli helper qoldi.
- **Qolgan (tashqi/atoqli — tabiiy, tuzatilmaydi):** yangilik SARLAVHALARI (uz manba feedlaridan — jonli, tarjima qilib bo'lmaydi); Yandex xarita yorliqlari (API uz/zh'ni qo'llamaydi — hozir ru_RU); shahar/viloyat NOMLARI va bank brendlari (atoqli ot, lotin); kichik shaharda zh.wikipedia bo'lmasa bo'sh (uz'dagidek).
- Deploy qilindi (main push + Render hook).

## Qilingan (2026-07-11 yangiliklar AI tarjima sessiyasi)
- **Yangilik sarlavhalari AI bilan tarjima** (server.js `translateNews`). Tanlangan til uz'dan boshqa bo'lsa (ru/en/zh) — barcha ~30 sarlavha **bitta batch** Anthropic (`AI_MODEL`=Haiku, mavjud `AI_KEY`) chaqiruvida tarjima qilinadi. Natija JSON massiv. `getNews` keshi (15 daq, til bo'yicha) tarjimani ham saqlaydi → arzon (til boshiga 15 daqda 1 chaqiruv), tez (keshdan).
- **MUHIM tuzatish:** `getNews` ilgari faqat `uz/ru/en` qabul qilardi — **zh yo'q edi** (xitoyda uz yangilik chiqardi). Endi `["uz","ru","en","zh"]`. zh feed yo'q → uz olinadi → AI xitoychaga o'giradi.
- Xatoga chidamli: `AI_KEY` yo'q yoki xato/timeout (22s) bo'lsa — asl sarlavha qaytadi (`try/catch`).
- Frontend: `d.translated` bo'lsa yangilik ro'yxati tepasida `🌐 AI tarjima` eslatmasi (`news_ai`, 4 til) — shaffoflik.
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
   - 🖼 **Qolgan logolar** (rasmiy fayl topib qo'shish: e-imzo, customs, teatr, cinema, lex, natlib, kinoman ...)
   - 🕌 **Namoz eslatma** (PWA push bildirishnoma)
   - 🧭 **"Yo'l ko'rsat"** — "menga yaqin" natijalariga marshrut tugmasi
   - 🇨🇳 **Xitoy tili DATA** (UI tayyor ✅; qolgani: FAQ, POI, shahar/ob-havo tavsifi, bayram nomlari — zh'ga)
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
