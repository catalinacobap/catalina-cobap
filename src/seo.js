export const siteUrl = 'https://catalinacobap.com';

export function pagePath(page = '', language = 'es') {
  const path = page ? `/${page}/` : '/';
  return language === 'en' ? `${path}?lang=en` : path;
}

export function absoluteUrl(page = '', language = 'es') {
  return `${siteUrl}${pagePath(page, language)}`;
}

export function structuredData({ page = '', language = 'es', pageInfo, personEmail, links, projects }) {
  const isHome = !page;
  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#catalina-cobap`,
    name: 'Catalina Cobap',
    jobTitle: 'Web designer and developer',
    url: siteUrl,
    email: `mailto:${personEmail}`,
    sameAs: [links.linkedin, links.upwork],
    knowsAbout: ['Web design', 'Web development', 'WordPress', 'UI/UX design', 'SEO'],
    knowsLanguage: ['Spanish', 'English'],
  };
  const graph = [person];
  if (isHome) {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#business`,
      name: 'Catalina Cobap — Web design + development',
      url: siteUrl,
      description: language === 'en' ? 'Websites and full redesigns designed and built by Catalina Cobap in Costa Rica.' : 'Sitios web y rediseños completos diseñados y desarrollados por Catalina Cobap en Costa Rica.',
      provider: {'@id': `${siteUrl}/#catalina-cobap`},
      founder: {'@id': `${siteUrl}/#catalina-cobap`},
      areaServed: ['Costa Rica', 'Worldwide'],
      serviceType: ['New website', 'Full website redesign', 'Website maintenance'],
      availableLanguage: ['Spanish', 'English'],
      email: `mailto:${personEmail}`,
      sameAs: projects.map(project => project.url),
    }, {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Catalina Cobap',
      url: siteUrl,
      publisher: {'@id': `${siteUrl}/#catalina-cobap`},
      inLanguage: ['es', 'en'],
    });
  } else {
    const service = {
      '@type': 'Service',
      '@id': `${absoluteUrl(page, language)}#service`,
      name: pageInfo.name,
      description: pageInfo.intro,
      url: absoluteUrl(page, language),
      provider: {'@id': `${siteUrl}/#catalina-cobap`},
      areaServed: ['Costa Rica', 'Worldwide'],
      availableLanguage: ['Spanish', 'English'],
    };
    if (page === 'new-website' || page === 'full-redesign') service.offers = {'@type': 'Offer', price: '1000', priceCurrency: 'USD', url: absoluteUrl(page, language), priceSpecification: {'@type': 'PriceSpecification', minPrice: '1000', priceCurrency: 'USD'}};
    if (page === 'maintenance') service.offers = {'@type': 'Offer', price: '40', priceCurrency: 'USD', url: absoluteUrl(page, language), priceSpecification: {'@type': 'UnitPriceSpecification', price: '40', priceCurrency: 'USD', unitText: 'MONTH'}};
    graph.push(service, {'@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: language === 'en' ? 'Home' : 'Inicio', item: absoluteUrl('', language) }, { '@type': 'ListItem', position: 2, name: pageInfo.name, item: absoluteUrl(page, language) }]});
  }
  return {'@context': 'https://schema.org', '@graph': graph};
}

export function updateSeo({ page = '', language = 'es', title, description, pageInfo, personEmail, links, projects }) {
  document.documentElement.lang = language;
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[property="og:description"]').content = description;
  const canonical = absoluteUrl(page, language);
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) { canonicalLink = document.createElement('link'); canonicalLink.rel = 'canonical'; document.head.append(canonicalLink); }
  canonicalLink.href = canonical;
  document.querySelectorAll('link[data-hreflang]').forEach(link => link.remove());
  for (const [hreflang, href] of [['es', absoluteUrl(page, 'es')], ['en', absoluteUrl(page, 'en')], ['x-default', absoluteUrl(page, 'es')]]) {
    const link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = hreflang; link.href = href; link.dataset.hreflang = hreflang; document.head.append(link);
  }
  let jsonLd = document.querySelector('#structured-data');
  if (!jsonLd) { jsonLd = document.createElement('script'); jsonLd.id = 'structured-data'; jsonLd.type = 'application/ld+json'; document.head.append(jsonLd); }
  jsonLd.textContent = JSON.stringify(structuredData({page, language, pageInfo, personEmail, links, projects}));
}
