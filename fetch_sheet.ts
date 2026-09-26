async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1ppqFW-ATQjaKEEbd8t6sRJcf_Y_QVHPdNO3DZAzyYJk/edit?usp=sharing';
  try {
    const res = await fetch(url);
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Length:', text.length);
    console.log('Page Title:', text.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('Snippet:', text.substring(0, 1000));
  } catch (err: any) {
    console.error('Fetch failed:', err.message || err);
  }
}

main();
