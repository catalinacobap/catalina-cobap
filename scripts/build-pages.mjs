import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pageKeys, pageCopy } from '../src/pages.js';
const shell = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const key of pageKeys) {
 const page = pageCopy.es.pages[key];
 const html = shell
  .replace(/<title>.*?<\/title>/, `<title>${page.name} — Catalina Cobap</title>`)
  .replace(/(<meta name="description" content=")[^"]*/, `$1${page.intro}`)
  .replace(/(<meta property="og:title" content=")[^"]*/, `$1${page.name} — Catalina Cobap`)
  .replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.intro}`);
 const directory = new URL(`../dist/${key}/`, import.meta.url);
 await mkdir(directory, {recursive:true});
 await writeFile(new URL('index.html', directory), html);
}
console.log(`Built ${pageKeys.length} service pages with direct URLs.`);
