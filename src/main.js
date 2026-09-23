import './style.css';
import { content, links, projects, reviews } from './content.js';
import { pageKeys, pageCopy } from './pages.js';
import { updateSeo } from './seo.js';

const app = document.querySelector('#app');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const requestedLanguage = new URL(location.href).searchParams.get('lang');
const englishHash = Object.values(content.en.ids).includes(location.hash.slice(1));
let language = requestedLanguage === 'en' || (!requestedLanguage && englishHash) ? 'en' : 'es';
const currentPage = location.pathname.split('/').filter(Boolean)[0] || '';
const isServicePage = pageKeys.includes(currentPage);
let observer;
const number = value => String(value).padStart(2, '0');
const external = 'target="_blank" rel="noopener noreferrer"';
const list = items => `<ul class="editorial-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const textLink = (href, text, attributes = '') => `<a class="text-link" href="${href}" ${attributes}>${text}${href === links.upwork && text === content[language].upwork ? '<span aria-hidden="true">↗</span>' : ''}</a>`;
const homeUrl = () => language === 'en' ? '/?lang=en' : '/';
const pageUrl = (page, parameters = {}) => {
 const search = new URLSearchParams({lang:language,...parameters});
 return `/${page}/?${search}`;
};

function render() {
 const t = content[language];
 const short = pageCopy[language];
 const page = short.pages[currentPage];
 const id = key => t.ids[key];
 const kicker = (index) => `<p class="label kicker">${number(index + 1)} / ${t.sectionLabels[index]}</p>`;
 const title = isServicePage ? `${page.name} — Catalina Cobap` : t.title;
 const description = isServicePage ? page.intro : short.sub;
 updateSeo({page: currentPage, language, title, description, pageInfo: page, personEmail: links.email, links, projects});
 const navigation = ` <nav class="navigation" aria-label="${t.menu}">
   <a class="nav-mark" href="${homeUrl()}#inicio" aria-label="Catalina Cobap">Catalina <em>Cobap</em></a>
   <div class="nav-links"><a href="${homeUrl()}#${id('work')}">${t.nav[0]}</a><a href="${homeUrl()}#${id('pricing')}">${short.services}</a><a href="${homeUrl()}#${id('about')}">${t.nav[3]}</a><a href="${pageUrl('custom-quote')}">${t.nav[4]}</a></div>
   <div class="language-switch" role="group" aria-label="${t.language}"><button type="button" data-language="es" lang="es" aria-label="Español" aria-pressed="${language === 'es'}">ES</button><span aria-hidden="true">/</span><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="${language === 'en'}">EN</button></div>
 </nav>`;
 app.innerHTML = `
 <a class="skip-link" href="#main">${t.skip}</a>
 ${navigation}
 ${isServicePage ? '' : ` <header class="hero" id="inicio">
   <div class="hero-copy"><div class="hero-message"><p class="label hero-eyebrow">${t.eyebrow}</p><h1>${short.hero}</h1><p class="hero-sub">${short.sub}</p><a class="outline-button" href="${pageUrl('custom-quote')}">${t.cta}</a></div><aside class="hero-ornament" aria-hidden="true"><div class="hero-monogram">CC<span>.</span></div><p class="label">${language === 'es' ? 'DISEÑO · DESARROLLO · DIRECCIÓN' : 'DESIGN · DEVELOPMENT · DIRECTION'}</p></aside></div>
 </header>`}
 <main id="main">
 ${isServicePage ? servicePage(t, short, page) : `<section class="editorial-statement section bone"><h2 class="reveal">${short.statement}</h2><a class="text-link" href="#${id('pricing')}">${short.viewServices}</a></section>
   <section class="work section bone" id="${id('work')}">
     <div class="section-heading reveal"><div>${kicker(0)}<h2>${t.work}</h2></div><p>${t.workSub}</p></div>
     <div class="work-grid" aria-label="${t.work}">${projects.map((project, index) => `<article class="project"><a class="project-image" href="${project.url}" ${external} aria-label="${t.visit}: ${project.name}"><img src="/images/work-${project.image}.jpg" alt="${t.screenshot} ${project.name}" loading="lazy" width="1440" height="1050" /><span class="project-open">${t.visit}</span></a><div class="project-meta"><span class="project-number">${number(index + 1)}</span><div><p class="label">${t.projectCopy[index][0]}</p><h3><a href="${project.url}" ${external}>${project.name}</a></h3><a class="project-domain label" href="${project.url}" ${external}>${new URL(project.url).hostname}</a></div></div></article>`).join('')}</div>
     <div class="work-controls"><button type="button" id="work-prev" aria-label="${t.prev}">${language === 'es' ? 'Anterior' : 'Previous'}</button><span class="label" id="work-count" aria-live="polite">01 / 04</span><button type="button" id="work-next" aria-label="${t.next}">${language === 'es' ? 'Siguiente' : 'Next'}</button></div>
   </section>
   <section class="reviews section dark">
     <div class="section-heading reveal"><div>${kicker(1)}<h2>${t.reviews}</h2></div>${textLink(links.upwork, t.upwork, external)}</div>
     <div class="review-grid">${reviews.map((review, index) => `<figure class="review reveal"><span class="review-mark" aria-hidden="true">“</span><blockquote lang="en">${review}</blockquote><figcaption><span class="label">${t.reviewer}${index ? `<br />${t.reviewService}` : ''}</span><span class="rating" aria-label="5.0 / 5">★ 5.0</span></figcaption></figure>`).join('')}</div><p class="label review-note">${t.reviewsNote}</p>
   </section>
   <section class="starting section forest" id="${id('pricing')}"><div class="section-heading reveal"><div>${kicker(3)}<h2>${t.start}</h2></div></div><div class="route-list">${t.routes.map(([quote, label], index) => `<a href="${pageUrl(pageKeys[index])}"><span class="route-quote">“${quote}”</span><span class="label">${label}<span class="route-index" aria-hidden="true">${number(index+1)}</span></span></a>`).join('')}</div></section>
   <section class="about dark" id="${id('about')}"><div class="about-image"><img src="/images/catalina.jpg" alt="${t.portrait}" loading="lazy" width="763" height="1011" /></div><div class="about-copy reveal">${kicker(7)}<h2>${language === 'es' ? 'Hola, soy' : 'Hi, I’m'}<br /><em>Catalina.</em></h2><p>${short.bio}</p><p class="label bio-languages">${t.languages}</p>${textLink(links.linkedin, 'LinkedIn', external)}</div></section>

 <section class="home-contact section forest" id="${id('contact')}"><p class="label kicker">${t.contactLabel}</p><h2>${short.contact}</h2><div class="home-contact-links"><a class="outline-button" href="${pageUrl('custom-quote')}">${t.cta}</a><a class="text-link" href="mailto:${links.email}">${links.email}</a></div></section>`}
 </main>
 <footer class="footer forest"><a class="footer-brand" href="${homeUrl()}#inicio">CATALINA COBAP</a><div><p class="label">© 2026 Catalina Cobap · ${t.eyebrow}</p><a class="label" href="${homeUrl()}#inicio">${t.back}</a></div></footer>`;
 wireInteractions();
 syncNavigationHeight();
}

function servicePage(t, short, page) {
 const custom = currentPage === 'custom-quote';
 const maintenance = currentPage === 'maintenance';
 const quoteUrl = pageUrl('custom-quote', {service:currentPage});
 const intro = `<header class="service-hero section forest" id="inicio"><a class="label breadcrumb" href="${homeUrl()}">${short.home}</a><p class="label kicker">${page.name} / Catalina Cobap</p><h1>${page.title}</h1><div class="service-hero-bottom"><p>${page.intro}</p><a class="outline-button" href="${custom ? '#'+t.ids.contact : quoteUrl}">${page.cta}</a></div></header>`;
 if (custom) return intro + contactSection(t, short);
 if (maintenance) return intro + `<section class="maintenance section bone"><div><p class="label kicker">${t.plan}</p><p class="maintenance-price">$40 <span class="label">${t.month}</span></p><p class="annual">${t.annual}</p></div><div class="maintenance-copy">${list(t.maintenanceIncludes)}<p>${t.extra}</p><p>${t.without}</p></div></section>${serviceClose(short,page,quoteUrl)}`;
 return intro + `<section class="service-story section bone" id="${t.ids.pricing}"><div class="service-reading"><p class="label kicker">${page.name}</p><h2>${short.approach}</h2><div class="service-explanation"><p>${page.explanation}</p><p>${page.technology}</p></div><div class="service-investment"><p class="label">${short.investment}</p><p class="starting-price"><span>${short.startingAt}</span> $1,000 <span>USD</span></p><p>${short.priceNote}</p>${textLink(quoteUrl,page.cta)}</div><div class="service-practical"><div><h3>${short.includes}</h3><details><summary>${language === 'es' ? 'Diseño, textos y desarrollo' : 'Design, copy, and development'}</summary>${list(t.includes)}</details></div><div><h3>${short.prepare}</h3><p>${language === 'es' ? 'Tu identidad visual, imágenes y la información de tu negocio.' : 'Your visual identity, images, and business information.'}</p></div><div><h3>${language === 'es' ? 'Tiempo estimado' : 'Estimated timeline'}</h3><p>${t.timeline.replace(/^Tiempo: |^Timeline: /,'')}</p></div><div><h3>${short.limits}</h3><details><summary>${language === 'es' ? 'Ver los detalles del alcance' : 'See the scope details'}</summary>${list(t.excludes)}<p>${t.faqs[1][1]}</p><p>${t.without}</p></details></div></div></div></section>${serviceClose(short,page,quoteUrl)}`;
}
function serviceClose(short,page,quoteUrl) {
 return `<section class="service-close section forest"><h2>${page.cta}.</h2><div class="home-contact-links"><a class="outline-button" href="${quoteUrl}">${content[language].cta}</a>${textLink(homeUrl(),short.back)}</div></section>`;
}
function contactSection(t, short) {
 const id = key => t.ids[key];
 return `   <section class="contact section bone" id="${id('contact')}"><div class="contact-heading reveal"><h2>${t.cta}</h2><p>${short.contactSub}</p></div><div class="contact-grid"><div class="contact-info"><p class="label">${t.contactLabel}</p><p>${t.prefer}</p><a class="contact-email" href="mailto:${links.email}">${links.email}</a><div class="social-links">${textLink(links.linkedin, 'LinkedIn', external)}${textLink(links.upwork, 'Upwork', external)}</div></div><form id="contact-form"><div class="form-row"><label>${t.name}<input name="name" autocomplete="name" required maxlength="100" /></label><label>${t.email}<input name="email" type="email" autocomplete="email" required maxlength="254" /></label></div><fieldset><legend>${t.need}</legend><div class="radio-options">${t.needs.map((need, index) => `<label><input type="radio" name="need" value="${['new','redesign','unsure'][index]}" ${index === 2 ? 'checked' : ''} />${need}</label>`).join('')}</div></fieldset><label>${t.website}<input name="website" type="text" inputmode="url" autocomplete="url" maxlength="500" placeholder="example.com" /></label><label>${t.message}<textarea name="message" rows="3" required maxlength="5000"></textarea></label><div class="honeypot" aria-hidden="true"><label>Company<input name="company" tabindex="-1" autocomplete="off" /></label></div><button class="outline-button" id="send-message" type="submit">${t.send}</button><p id="form-status" role="status" aria-live="polite"></p></form></div></section>
`;
}

let navigationObserver;
function syncNavigationHeight() {
 navigationObserver?.disconnect();
 const nav = document.querySelector('.navigation');
 const update = () => document.documentElement.style.setProperty('--navigation-height', `${nav.getBoundingClientRect().height}px`);
 update();
 navigationObserver = new ResizeObserver(update);
 navigationObserver.observe(nav);
}

function wireInteractions() {
 const t = content[language];
 document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
  const next = button.dataset.language;
  if (next === language) return;
  const oldIds = content[language].ids;
  const currentSection = Object.keys(oldIds).find(key => oldIds[key] === location.hash.slice(1));
  const previousForm = document.querySelector('#contact-form');
  const formValues = previousForm ? Object.fromEntries(new FormData(previousForm)) : {};
  language = next;
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  if (currentSection) url.hash = content[language].ids[currentSection];
  history.replaceState(null, '', url);
  render();
  const form = document.querySelector('#contact-form');
  Object.entries(formValues).forEach(([key, value]) => { if (form?.elements.namedItem(key)) form.elements.namedItem(key).value = value; });
  document.querySelector(`[data-language="${language}"]`).focus({preventScroll:true});
  if (currentSection) document.getElementById(content[language].ids[currentSection])?.scrollIntoView({behavior:'instant'});
 }));
 const gallery = document.querySelector('.work-grid');
 if (gallery) {
 const cards = [...gallery.children];
 let active = 0;
 function go(direction) {
  active = Math.max(0, Math.min(cards.length - 1, active + direction));
  gallery.scrollTo({left:cards[active].offsetLeft - cards[0].offsetLeft,behavior:reducedMotion.matches?'instant':'smooth'});
 }
 document.querySelector('#work-prev').addEventListener('click', () => go(-1));
 document.querySelector('#work-next').addEventListener('click', () => go(1));
 const updateGallery = () => {
  active = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - cards[0].offsetLeft - gallery.scrollLeft) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - gallery.scrollLeft) ? index : best, 0);
  document.querySelector('#work-count').textContent = `${number(active+1)} / 04`;
  document.querySelector('#work-prev').disabled = active === 0;
  document.querySelector('#work-next').disabled = active === cards.length - 1;
 };
 gallery.addEventListener('scroll',updateGallery,{passive:true});
 updateGallery();
 }
 observer?.disconnect();
 if ('IntersectionObserver' in window && !reducedMotion.matches) {
  observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }),{threshold:0.06});
  document.querySelectorAll('.reveal').forEach(node=>{node.classList.add('will-reveal');observer.observe(node);});
 }
 const contactForm = document.querySelector('#contact-form');
 if (contactForm) prefillContact(contactForm);
 contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if(form.dataset.sending) return;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#form-status');
  const payload = {...Object.fromEntries(new FormData(form)),language};
  form.dataset.sending = 'true';
  button.disabled = true;
  button.textContent = t.sending;
  status.textContent = '';
  try {
   const response = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
   const result = await response.json();
   if(!response.ok || !result.ok) throw new Error('Message not accepted');
   status.textContent = t.success;
   form.reset();
  } catch {
   status.textContent = t.error;
  } finally {
   delete form.dataset.sending;
   button.disabled = false;
   button.innerHTML = `${t.send}`;
  }
 });
}
function prefillContact(form) {
 const params = new URLSearchParams(location.search);
 const service = params.get('service');
 if (!pageKeys.includes(service) || service === 'custom-quote') return;
 const t = content[language];
 form.elements.need.value = service === 'new-website' ? 'new' : service === 'full-redesign' ? 'redesign' : 'unsure';
 const name = pageCopy[language].pages[service].name;
 form.elements.message.value = language === 'es' ? `Me interesa: ${name}.\n\n` : `I’m interested in: ${name}.\n\n`;
}
render();
if(location.hash) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));
