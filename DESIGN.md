# UZGID — Dizayn Konteksti (Design System)

> Maqsad: butun sayt **bitta mantiq** bilan tuzilsin — foydalanuvchi miyasi har bo'limni bir qarashda "o'qiy" olsin. Bu hujjat — barcha UI qarorlari uchun yagona manba. Yangi komponent qo'shishdan oldin shu yerga qara.

---

## 1. Vizion / pozitsiya (nega UZGID?)
UZGID — "havolalar to'plami" emas, **O'zbekiston bo'yicha ishonchli, joriy, mahalliylashtirilgan JAVOB manbasi**. Google izlaydi — **biz javob beramiz**: bugungi, foydalanuvchi viloyati bo'yicha, uning tilida, **manba + sana** bilan.
Har dizayn qarori shu pozitsiyani kuchaytirishi kerak: *aniqlik, ishonch, tezlik*.

## 2. Asosiy tamoyillar (6 ta)
1. **Iyerarxiya (eng muhim tamoyil).** Har ekranda 1 ta fokus — eng katta/rangli. Qolgani tinch. Miya ro'yxatni emas, "eng katta narsa"ni ilg'aydi.
2. **Bitta kartochka andozasi.** Har kartochka = `1 katta JAVOB + kichik tafsilotlar + (manba·sana)`. Bir marta o'rganilsa — hamma joyda avtomatik o'qiladi.
3. **Ishonch signali.** Jonli/rasmiy ma'lumot yonida doim **manba · sana** (kichik, muted). Bu — nusxa ko'chirib bo'lmaydigan afzallik.
4. **Mobil-birinchi.** Aksar foydalanuvchi telefonda, arzon qurilma, zaif internet. Tap-nishonlar ≥44px, matn ≥13px, skeleton-yuklash.
5. **3 til teng.** Har matn `T.uz/ru/en`da. Uzunlik farqi layout'ni buzmasin (barqaror joylashuv).
6. **Tinchlik.** Kam rang, ko'p bo'sh joy, kam animatsiya. Portal — bezak emas, xizmat.

## 3. Dizayn tokenlari (mavjud — CSS o'zgaruvchilar)
**Rang (light / dark):**
| Token | Light | Dark | Ishlatilishi |
|-------|-------|------|--------------|
| `--bg` | #eef2f9 | #0b1220 | Fon |
| `--card` | #ffffff | #141d30 | Kartochka foni |
| `--card2` | #f4f7fc | #1c2740 | Ichki blok / chip foni |
| `--txt` | #152238 | #eef3fc | Asosiy matn |
| `--muted` | #64708a | #8b97b0 | Ikkinchi darajali matn |
| `--line` | #e3e9f3 | #253248 | Chegara |
| `--accent` | #1f6fe5 | (bir xil) | Asosiy harakat / fokus |
| `--good` | #16a34a | | Ijobiy (eng foydali kurs, toza havo) |
| `--bad` | #dc2626 | | Xato / ogohlantirish |

**Bayroq ranglari:** ko'k `#1eb4d4` · qizil `#ce1126` · oq `#f4f7fb` · yashil `#1eb53a`.
**Radius:** `--radius:16px` (kartochka), 12px (ichki tile/link), 16px (chip/badge — pill).
**Shadow:** `--shadow` (yumshoq, ko'k tusli).

## 4. Tipografiya (⚠️ hozir tarqoq — konsolidatsiya kerak)
Hozir 20+ xil font-size ishlatilgan (8.5→38px). **Taklif — 7 pog'onali shkala:**
`11 (micro/manba) · 13 (asosiy matn) · 15 (kuchli matn) · 18 (kichik sarlavha) · 22 (fokus raqam) · 30 (katta raqam) · 42 (hero)`.
- Kartochka sarlavhasi (`h2`): 13px, weight 800, UPPER emas — icon + matn + `badge`(o'ngda).
- Vazn: 800 (sarlavha/fokus), 700 (yarim-kuchli), 500/400 (matn).

## 5. Masofalar (spacing)
Shkala: `4 · 8 · 12 · 16 · 18 · 26`. Kartochka padding 18, grid gap 16, ichki gap 8-12.

## 6. Layout
- **Chap sidebar** (desktop: 66px→hover 238px; mobil: o'ngdan ochiladi, hamburger o'ngda). NAVID tartibi: `bosh→namoz→joylar→turizm→transport→xizmatlar→raqamlar→media→yangiliklar→aloqa→yordam`.
- **Topbar:** brand (logo+UZGID+tagline) + controls (til/tema/region/shahar). Mobil: `static` (qotmaydi), beta-bar `sticky`.
- **Hero (faqat Bosh):** gradient banner + bayroq chizig'i + qidiruv. Mobil: naqsh yumshoq.
- **Panel grid:** `repeat(auto-fill,minmax(300px,1fr))`, gap 16. `.card.full`/`.w2` — kenglik.

## 7. Komponent andozalari
| Komponent | Struktura | Qoida |
|-----------|-----------|-------|
| **Kartochka** (`.card`) | `h2`(icon+nom+badge) → kontent | 1 fokus + tafsilot |
| **Fokus blok** (masalan `next-prayer`) | katta rangli raqam + label + progress | Ekranda 1 ta |
| **Ro'yxat qatori** (`.trow`,`.pr-row`) | chapda nom, o'ngda qiymat (tabular) | Ko'z pastga skan qiladi |
| **Havola-tile** (`.govgrid`/`.govlink`) | icon + nom + izoh | Bir xil o'lcham, grid |
| **Filtr chip** (`.cat`) | pill, `.on`=accent | Faol holat aniq |
| **Badge** (`.badge`) | kichik pill, o'ngda | Meta/holat (2026, rasmiy) |
| **Manba·sana** | 11px muted, blok tagida | Ishonch signali |
| **Nafl (namoz)** | opacity .5, "· nafl" | Ikkinchi daraja |

## 8. Mobil qoidalari
- Menyu o'ngdan; hamburger o'ngda (brand chapda, barqaror).
- Topbar qotmaydi; beta-bar tepada.
- Sidebar tagida `V1.0` ko'rinadi.
- Hero naqsh/medallion yumshoq.

## 9. Kirish qulayligi (a11y) & i18n
- Kontrast: `--muted` fon ustida ≥4.5:1 tekshirilsin (light rejimda #64708a/#fff ~ OK).
- Tap-nishon ≥44px. `tel:` havolalar to'g'ri.
- Har matn 3 tilda; qidiruv imlo/kirill/apostrofga chidamli (`norm`/`smatch`).

## 10. Ohang (voice)
Sodda, aniq, do'stona, betaraf. Va'da bermaydi ("eng zo'r" emas), fakt beradi. Diniy/siyosiy hukm chiqarmaydi.

---

## 11. AUDIT — hozir yaxshilash kerak bo'lganlar (fokus ro'yxat)
1. **Tipografiya shkalasi** — 20+ o'lchamni 7 pog'onaga keltirish (eng katta ta'sir).
2. **"Manba·sana" chiplari** — ob-havo/kurs/tarif/me'yorlarda izchil qo'yish (ishonch).
3. **Namoz fokusi** — "keyingi namoz + qolgan vaqt"ni vizual bosh element qilish (+ progress bar); farz/nafl guruhlash (nafl qo'shildi).
4. **Hero shior** — "So'rang — O'zbekiston bo'yicha aniq javob" (pozitsiyani ko'rsatuvchi).
5. **Bo'sh/xato holatlar** — bir xil, do'stona (hozir joy-joyda `loaderr`).
6. **Skeleton yuklash** — hamma kartochkada bir xil (`pulse`).
7. **Ikonka izchilligi** — sidebar SVG-line uslubi bor; kartochka sarlavhalarida emoji — bittasiga qaror qilish.
8. **Rang ma'nosi** — accent faqat "harakat/fokus", good/bad faqat status; bezak uchun ishlatilmasin.
