import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pageKeys, pageCopy } from '../src/pages.js';
import { absoluteUrl, structuredData, siteUrl } from '../src/seo.js';
import { links, projects } from '../src/content.js';
const shell = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const key of pageKeys) {
 const page = pageCopy.es.pages[key];
 const canonical = absoluteUrl(key, 'es');
 const english = absoluteUrl(key, 'en');
 const jsonLd = JSON.stringify(structuredData({page:key, language:'es', pageInfo:page, personEmail:links.email, links, projects})).replaceAll('<', '\\u003c');
 const html = shell
  .replace(/<title>.*?<\/title>/, `<title>${page.name} — Catalina Cobap</title>`)
  .replace(/(<meta name="description" content=")[^"]*/, `$1${page.intro}`)
  .replace(/(<meta property="og:title" content=")[^"]*/, `$1${page.name} — Catalina Cobap`)
  .replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.intro}`);
 const routeHtml = html
  .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
  .replace(/<link rel="alternate" hreflang="es"[^>]*>/, `<link rel="alternate" hreflang="es" href="${canonical}" data-hreflang="es" />`)
  .replace(/<link rel="alternate" hreflang="en"[^>]*>/, `<link rel="alternate" hreflang="en" href="${english}" data-hreflang="en" />`)
  .replace(/<link rel="alternate" hreflang="x-default"[^>]*>/, `<link rel="alternate" hreflang="x-default" href="${canonical}" data-hreflang="x-default" />`)
  .replace(/<script id="structured-data" type="application\/ld\+json">.*?<\/script>/, `<script id="structured-data" type="application/ld+json">${jsonLd}</script>`);
 const directory = new URL(`../dist/${key}/`, import.meta.url);
 await mkdir(directory, {recursive:true});
 await writeFile(new URL('index.html', directory), routeHtml);
}
console.log(`Built ${pageKeys.length} service pages with direct URLs.`);
