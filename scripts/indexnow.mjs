// 새로 올린 URL을 IndexNow(Bing 등)와 네이버 서치어드바이저에 알린다
//   node scripts/indexnow.mjs https://agenwiki.online/posts/a/ https://agenwiki.online/posts/b/
const KEY = '7f701a246cb6b3b350e4ca0e2903fa3e';
const urlList = process.argv.slice(2);
if (!urlList.length) { console.error('URL을 1개 이상 넘겨 주세요'); process.exit(1); }
const body = JSON.stringify({ host: 'agenwiki.online', key: KEY, keyLocation: `https://agenwiki.online/${KEY}.txt`, urlList });
for (const ep of ['https://api.indexnow.org/indexnow', 'https://searchadvisor.naver.com/indexnow']) {
  const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body });
  console.log(ep, r.status);
}
