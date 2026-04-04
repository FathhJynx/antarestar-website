const https = require('https');

https.get('https://antarestar.com/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const regex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const urls = new Set();
    while ((match = regex.exec(data)) !== null) {
      if(match[1].includes('http')) urls.add(match[1]);
    }
    console.log("Images:");
    console.log(Array.from(urls).join('\n'));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
