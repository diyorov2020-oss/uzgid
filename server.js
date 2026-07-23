// ============================================================
//  O'zGid backend — CBU rasmiy kursi + bank.uz banklar kesimida
//  olish/sotish kursini yig'ib beradi. Statik saytni ham serve qiladi.
// ============================================================
const http = require("http");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public");

// --- oddiy kesh (bank ma'lumotini har 10 daqiqada yangilaymiz) ---
let cache = { data: null, ts: 0 };
const TTL = 10 * 60 * 1000;

function num(s){ return parseFloat(String(s).replace(/[^\d.]/g,"")) || null; }

function median(arr){ const a=arr.filter(Boolean).sort((x,y)=>x-y); return a.length? a[Math.floor(a.length/2)] : 0; }

// Valyutani kurs kattaligidan aniqlaymiz (eng ishonchli usul)
function detectCur(rates){
  const m = median(rates);
  if(m>=10000 && m<13100) return "USD";
  if(m>=13100 && m<15600) return "EUR";
  if(m>=15600 && m<18500) return "GBP";
  if(m>=1000  && m<3000)  return "CNY";
  if(m>=100   && m<300)   return "RUB";
  if(m>=15    && m<40)    return "KZT";
  return null;
}

// bank.uz sahifasini tahlil qilib, valyuta -> {bank, buy, sell} qaytaradi
function parseBankUz(html){
  const $ = cheerio.load(html);
  const heads = $("span.semibold-text").filter((i,el)=>{
    const t=$(el).text().trim(); return t==="Sotib olish"||t==="Sotish";
  });
  const columns = []; // {type:'buy'|'sell', cur, rows:[{bank,rate}]}
  heads.each((i,el)=>{
    const type = $(el).text().trim()==="Sotib olish" ? "buy" : "sell";
    // ustun konteyneri: kamida 3 ta green-date bor eng yaqin ota-blok
    let box=$(el).parent();
    for(let k=0;k<6;k++){ if(box.find(".green-date").length>=3) break; box=box.parent(); }
    const names=box.find(".medium-text").not(".green-date").map((j,n)=>$(n).text().trim()).get().filter(Boolean);
    const rates=box.find(".green-date").map((j,n)=>num($(n).text())).get();
    const cur = detectCur(rates); // valyutani kurs kattaligidan aniqlaymiz
    const rows=[];
    for(let j=0;j<Math.min(names.length,rates.length);j++)
      if(rates[j]) rows.push({bank:names[j], rate:rates[j]});
    columns.push({type, cur, rows});
  });
  // valyuta bo'yicha guruhlash: bank -> {buy, sell}
  const byCur={};
  for(const c of columns){
    if(!c.cur) continue;
    byCur[c.cur] = byCur[c.cur] || {};
    for(const r of c.rows){
      byCur[c.cur][r.bank] = byCur[c.cur][r.bank] || {bank:r.bank};
      byCur[c.cur][r.bank][c.type] = r.rate;
    }
  }
  const out={};
  for(const cur in byCur){
    let rows = Object.values(byCur[cur]).filter(x=>x.buy||x.sell);
    // shovqinni tozalash: medianadan >12% chetlashgan qiymatlarni olib tashlaymiz
    const mb = median(rows.map(r=>r.buy)), ms = median(rows.map(r=>r.sell));
    rows = rows.filter(r=>{
      if(r.buy && mb && Math.abs(r.buy-mb)/mb > 0.10) return false;   // outlier
      if(r.sell && ms && Math.abs(r.sell-ms)/ms > 0.10) return false; // outlier
      if(r.buy && r.sell && r.buy > r.sell) return false;            // mantiqiy anomaliya (olish>sotish)
      return true;
    });
    out[cur] = rows.sort((a,b)=>(b.sell||b.buy||0)-(a.sell||a.buy||0));
  }
  return out;
}

async function getCBU(){
  const r = await fetch("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
  const d = await r.json();
  const pick = c => { const x=d.find(v=>v.Ccy===c); return x?{code:c,name:x.CcyNm_UZ,rate:num(x.Rate),diff:x.Diff,date:x.Date}:null; };
  return ["USD","EUR","RUB","KZT"].map(pick).filter(Boolean);
}

async function getBanks(){
  const r = await fetch("https://bank.uz/uz/currency",{headers:{"User-Agent":"Mozilla/5.0"}});
  const html = await r.text();
  return parseBankUz(html);
}

async function getCurrency(){
  if(cache.data && Date.now()-cache.ts < TTL) return cache.data;
  const [official, banks] = await Promise.all([
    getCBU().catch(()=>[]),
    getBanks().catch(()=>({}))
  ]);
  const data = { updated: new Date().toISOString(), official, banks };
  cache = { data, ts: Date.now() };
  return data;
}

// --- Yangiliklar: ko'p rasmiy/ishonchli manbadan agregatsiya ---
// UzA = O'zbekiston Milliy axborot agentligi (rasmiy: prezident qarorlari, tayinlovlar).
const NEWS_SOURCES = [
  { name:"UzA",       domain:"uza.uz",    url:{ uz:"https://uza.uz/uz/rss",            ru:"https://uza.uz/ru/rss",            en:"https://uza.uz/en/rss" } },
  { name:"Kun.uz",    domain:"kun.uz",    url:{ uz:"https://kun.uz/uz/news/rss",       ru:"https://kun.uz/ru/news/rss",       en:"https://kun.uz/en/news/rss" } },
  { name:"Gazeta.uz", domain:"gazeta.uz", url:{ uz:"https://www.gazeta.uz/uz/rss/",    ru:"https://www.gazeta.uz/ru/rss/",    en:"https://www.gazeta.uz/en/rss/" } },
  { name:"Xabar.uz",  domain:"xabar.uz",  url:{ uz:"https://xabar.uz/uz/rss",          ru:"https://xabar.uz/ru/rss" } },
  { name:"Review.uz", domain:"review.uz", url:{ uz:"https://review.uz/rss" } },
  { name:"Podrobno",  domain:"podrobno.uz", url:{ ru:"https://podrobno.uz/rss/" } },
];
const newsCache = {}; // lang -> { data, ts }
async function fetchFeed(src, lang){
  const url = src.url[lang] || src.url.uz; // aniq til, bo'lmasa uz; boshqa tilga tushmaymiz
  if(!url) return [];
  const c = new AbortController(); const timer = setTimeout(()=>c.abort(), 9000);
  try{
    const r = await fetch(url,{ headers:{"User-Agent":"Mozilla/5.0"}, signal:c.signal, redirect:"follow" });
    if(!r.ok) return [];
    const xml = await r.text();
    const $ = cheerio.load(xml, {xmlMode:true});
    const out = [];
    $("item").slice(0,8).each((i,el)=>{
      const title = $(el).find("title").first().text().trim();
      let link = $(el).find("link").first().text().trim();
      if(!link){ const g=$(el).find("guid").first().text().trim(); if(/^https?:/.test(g)) link=g; }
      const date = $(el).find("pubDate").first().text().trim();
      if(title && link) out.push({ title, link, date, ts: Date.parse(date)||0, source:src.name, domain:src.domain });
    });
    return out;
  }catch(e){ return []; }
  finally{ clearTimeout(timer); }
}
// Sarlavhalarni tanlangan tilga AI (Anthropic) bilan tarjima — batch, keshlanadi.
async function translateNews(items, lang){
  if(!AI_KEY || !items.length) return items;
  const names = { ru:"Russian", en:"English", zh:"Simplified Chinese" };
  const target = names[lang]; if(!target) return items;
  try{
    const numbered = items.map((n,i)=>`${i+1}. ${n.title}`).join("\n");
    const sys = `You translate Uzbekistan news headlines into ${target}. Keep each translation concise and natural; preserve meaning, proper nouns and numbers. If a headline is already in ${target}, repeat it. Output EXACTLY one line per headline, each prefixed with the same number and a period (e.g. "1. ..."). Output ONLY these ${items.length} numbered lines — no JSON, no quotes around lines, no commentary.`;
    const ctrl = new AbortController(); const tm = setTimeout(()=>ctrl.abort(), 22000);
    const r = await fetch("https://api.anthropic.com/v1/messages",{ method:"POST", signal:ctrl.signal, headers:{ "x-api-key":AI_KEY, "anthropic-version":"2023-06-01", "content-type":"application/json" }, body: JSON.stringify({ model:AI_MODEL, max_tokens:6000, system:sys, messages:[{ role:"user", content:numbered }] }) });
    clearTimeout(tm);
    const j = await r.json();
    const txt = (j.content && j.content[0] && j.content[0].text) || "";
    if(!txt) return items;
    // raqamli satrlar bo'yicha parse — qo'shtirnoqqa chidamli, qisman ham qo'llanadi
    const out = items.map(n=>({ ...n }));
    let hits = 0;
    txt.split(/\r?\n/).forEach(line=>{
      const m = line.match(/^\s*(\d+)[.)\-]\s*(.+\S)\s*$/);
      if(m){ const idx = +m[1]-1; if(idx>=0 && idx<out.length){ out[idx].title = m[2]; hits++; } }
    });
    return hits ? out : items;
  }catch(e){ return items; }
}
async function getNews(langRaw){
  const lang = ["uz","ru","en","zh"].includes(langRaw) ? langRaw : "uz";
  const c = newsCache[lang];
  if(c && Date.now()-c.ts < 15*60*1000) return c.data;
  const results = await Promise.all(NEWS_SOURCES.map(s=>fetchFeed(s, lang)));
  let items = [].concat(...results);
  // eng yangi birinchi
  items.sort((a,b)=> b.ts - a.ts);
  // sarlavha bo'yicha dublikatlarni olib tashlash
  const seen = new Set();
  items = items.filter(n=>{ const k=n.title.toLowerCase().slice(0,60); if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,30);
  // AI tarjima (uz'dan boshqa til tanlanganda)
  if(lang!=="uz") items = await translateNews(items, lang);
  const data = { updated:new Date().toISOString(), sources: NEWS_SOURCES.filter(s=>s.url[lang]||s.url.uz).map(s=>s.name), items, translated: lang!=="uz" };
  newsCache[lang] = { data, ts: Date.now() };
  return data;
}

// --- statik fayllar ---
const MIME={".html":"text/html;charset=utf-8",".js":"text/javascript",".css":"text/css",
  ".json":"application/json",".png":"image/png",".svg":"image/svg+xml",".ico":"image/x-icon",
  ".txt":"text/plain;charset=utf-8",".xml":"application/xml;charset=utf-8",".webmanifest":"application/manifest+json"};
function serveStatic(req,res){
  let p = decodeURIComponent(req.url.split("?")[0]);
  if(p==="/") p="/index.html";
  const file = path.join(PUBLIC, path.normalize(p).replace(/^(\.\.[/\\])+/,""));
  fs.readFile(file,(err,buf)=>{
    if(err){ res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(file);
    const headers = {"Content-Type":MIME[ext]||"application/octet-stream"};
    // Kesh: rasm/ikonka/logo uzoq (o'zgarmaydi), JS/CSS o'rtacha, HTML doim yangilanadi (revalidatsiya)
    if(ext===".html"){ headers["Cache-Control"]="no-cache"; }
    else if([".png",".jpg",".jpeg",".webp",".svg",".ico"].includes(ext)){ headers["Cache-Control"]="public, max-age=604800"; } // 7 kun
    else if([".js",".css",".woff",".woff2"].includes(ext)){ headers["Cache-Control"]="public, max-age=86400"; }       // 1 kun
    else { headers["Cache-Control"]="public, max-age=3600"; }
    res.writeHead(200, headers);
    res.end(buf);
  });
}

// ---------------- AI yordamchi (Anthropic Claude) ----------------
const AI_KEY = process.env.ANTHROPIC_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "claude-haiku-4-5-20251001";
const aiHits = new Map(); // ip -> [timestamps] (oddiy rate-limit)
function aiRateOk(ip){ const now=Date.now(), win=10*60*1000, max=25; const arr=(aiHits.get(ip)||[]).filter(t=>now-t<win); arr.push(now); aiHits.set(ip,arr); return arr.length<=max; }
async function getAI(body){
  if(!AI_KEY) return { error: "AI hozircha sozlanmagan (kalit yo'q)." };
  const msg = String(body.message||"").slice(0,1500).trim();
  if(!msg) return { error: "Bo'sh xabar" };
  const lang = ["uz","ru","en"].includes(body.lang) ? body.lang : "uz";
  const hist = Array.isArray(body.history) ? body.history.slice(-6) : [];
  const sys = `Sen UZGID (uzgid.uz) — O'zbekiston axborot portali (ob-havo, valyuta+oltin, namoz+qibla, xaritalar, turizm, transport, davlat xizmatlari, kommunal tariflar, me'yorlar, tezkor/ishonch raqamlari, yangiliklar) yordamchisisan.
Har doim IMKON QADAR QISQA javob ber — odatda 1-3 gap, ortiqcha gapirma. Do'stona va aniq bo'l.
TIL: foydalanuvchi qaysi tilda yozsa AYNAN o'sha tilda javob ber; noaniq bo'lsa "${lang}" tilida. Suhbat davomida tilni almashtirma.
Foydalanuvchi imlo/yozuv xatosi bilan yozsa ham, maqsadini va mazmunini tushunib, shunga qarab javob ber.
Aniq bugungi raqamlarni (harorat, kurs) to'qima — tegishli bo'limga yo'naltir.
DINIY SAVOLLAR (muhim): diniy hukm, fatvo, oyat/hadis talqini yoki e'tiqodga oid savollarga JAVOB BERMA. Muloyimlik bilan qisqa javob ber: bunday savollar bo'yicha malakali imom yoki dinshunos olimga murojaat qilishni tavsiya qil va saytning "Namoz vaqtlari / qibla" bo'limini eslat. Munozaraga kirishma.`;
  const messages = [...hist.map(h=>({ role: h.role==="assistant"?"assistant":"user", content: String(h.content||"").slice(0,2000) })), { role:"user", content: msg }];
  try{
    const r = await fetch("https://api.anthropic.com/v1/messages",{ method:"POST", headers:{ "x-api-key":AI_KEY, "anthropic-version":"2023-06-01", "content-type":"application/json" }, body: JSON.stringify({ model:AI_MODEL, max_tokens:450, system:sys, messages }) });
    const j = await r.json();
    if(j.error) return { error: j.error.message || "AI xatosi" };
    return { reply: (j.content && j.content[0] && j.content[0].text) || "" };
  }catch(e){ return { error: String(e) }; }
}

// ---------------- Aloqa formasi -> Telegram bot ----------------
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || "";
const cHits = new Map();
function cRateOk(ip){ const now=Date.now(), win=10*60*1000, max=6; const arr=(cHits.get(ip)||[]).filter(t=>now-t<win); arr.push(now); cHits.set(ip,arr); return arr.length<=max; }
async function sendContact(body){
  if(!TG_TOKEN || !TG_CHAT) return { error: "Aloqa hozircha sozlanmagan." };
  const name = String(body.name||"").slice(0,80).trim();
  const contact = String(body.contact||"").slice(0,120).trim();
  const msg = String(body.message||"").slice(0,2000).trim();
  if(!msg) return { error: "Xabar bo'sh" };
  const text = `📩 UZGID — yangi xabar\n\n👤 Ism: ${name||"—"}\n📞 Aloqa: ${contact||"—"}\n\n💬 ${msg}`;
  try{
    const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,{ method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ chat_id: TG_CHAT, text, disable_web_page_preview: true }) });
    const j = await r.json();
    if(!j.ok) return { error: j.description || "Yuborilmadi" };
    return { ok: true };
  }catch(e){ return { error: String(e) }; }
}

http.createServer(async (req,res)=>{
  if(req.url.startsWith("/api/contact") && req.method==="POST"){
    res.setHeader("Access-Control-Allow-Origin","*");
    const ip=String(req.headers["x-forwarded-for"]||req.socket.remoteAddress||"").split(",")[0].trim();
    if(!cRateOk(ip)){ res.writeHead(429,{"Content-Type":"application/json;charset=utf-8"}); return res.end(JSON.stringify({error:"Juda ko'p yuborildi. Biroz kuting."})); }
    let data=""; req.on("data",c=>{ data+=c; if(data.length>12000){ req.destroy(); } });
    req.on("end",async()=>{ try{ const out=await sendContact(JSON.parse(data||"{}")); res.writeHead(200,{"Content-Type":"application/json;charset=utf-8"}); res.end(JSON.stringify(out)); }catch(e){ res.writeHead(500,{"Content-Type":"application/json;charset=utf-8"}); res.end(JSON.stringify({error:String(e)})); } });
    return;
  }
  if(req.url.startsWith("/api/ai") && req.method==="POST"){
    res.setHeader("Access-Control-Allow-Origin","*");
    const ip=String(req.headers["x-forwarded-for"]||req.socket.remoteAddress||"").split(",")[0].trim();
    if(!aiRateOk(ip)){ res.writeHead(429,{"Content-Type":"application/json;charset=utf-8"}); return res.end(JSON.stringify({error:"Juda ko'p so'rov yuborildi. Biroz kuting."})); }
    let data=""; req.on("data",c=>{ data+=c; if(data.length>20000){ req.destroy(); } });
    req.on("end",async()=>{ try{ const out=await getAI(JSON.parse(data||"{}")); res.writeHead(200,{"Content-Type":"application/json;charset=utf-8"}); res.end(JSON.stringify(out)); }catch(e){ res.writeHead(500,{"Content-Type":"application/json;charset=utf-8"}); res.end(JSON.stringify({error:String(e)})); } });
    return;
  }
  if(req.url.startsWith("/api/currency") || req.url.startsWith("/api/news")){
    res.setHeader("Access-Control-Allow-Origin","*");
    try{
      const q = new URL(req.url,"http://x").searchParams;
      const data = req.url.startsWith("/api/news") ? await getNews(q.get("lang")) : await getCurrency();
      res.writeHead(200,{"Content-Type":"application/json;charset=utf-8"});
      res.end(JSON.stringify(data));
    }catch(e){
      res.writeHead(500,{"Content-Type":"application/json"});
      res.end(JSON.stringify({error:String(e)}));
    }
    return;
  }
  serveStatic(req,res);
}).listen(PORT,()=>console.log(`O'zGid server: http://localhost:${PORT}`));
