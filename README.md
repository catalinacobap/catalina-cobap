# Catalina Cobap — Portfolio editorial

Sitio full width en español e inglés. Vite, HTML, CSS y JavaScript; función de contacto Node para Vercel.

## Desarrollo

```sh
npm install
npm run dev
npm run build
npm run preview
npm test
```

## Contenido

`src/content.js` contiene las dos versiones del copy, precios, enlaces y proyectos. Español por defecto; `?lang=en` abre la versión inglesa. Los enlaces de navegación se traducen (`#contacto` / `#contact`, `#precios` / `#pricing`, etc.). Al cambiar de idioma se conservan los campos del formulario.

No se incluyeron los datos pendientes entre corchetes: ni el plazo de respuesta de 24–48 horas ni el pago 50/50. El retrato se reutilizó del proyecto local de Baileyscode. Las previews de trabajo incluyen siete capturas de sitios públicos y una portada de Wonder Wander, disponible en `public/projects/wonderwander.pdf`. Fuentes Google Fonts: Prata, EB Garamond y Parisienne.

## Contacto

El formulario hace POST a `/api/contact`. La función valida datos y usa Resend para enviar a `catalinacobap@gmail.com`, con el correo del visitante como Reply-To. Se informa éxito solo cuando el proveedor acepta el mensaje. No se envían correos durante las pruebas.

Para activar el envío, configurar en Vercel (Production, Preview y Development si quieres probar en todos los entornos):

- `RESEND_API_KEY`: copia el valor secreto de una API key creada en Resend. Empieza por `re_`; no lo publiques ni lo pongas en variables `VITE_`.
- `CONTACT_FROM_EMAIL`: para una primera prueba usa `Catalina Cobap <onboarding@resend.dev>`. En producción usa una dirección de un dominio verificado en Resend, por ejemplo `Catalina Cobap <hola@tudominio.com>`.

El destinatario no se configura en Vercel: está fijado en el servidor como `catalinacobap@gmail.com`. El correo que escribe la persona se envía como `Reply-To`, por lo que puedes responderle directamente desde Gmail.

Sin estas variables, el endpoint devuelve 503 y el formulario ofrece el mensaje de error y el correo directo. No simula envíos ni guarda consultas. El enlace mailto funciona independientemente del formulario. Las credenciales se usan solo en servidor.

Referencias: [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email), [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js).

## Publicación

`vercel.json` configura Vite y la salida `dist/`; Vercel publica la función de `api/`. No se ha desplegado este proyecto ni modificado el sitio público existente. Un hosting puramente estático sirve las páginas, pero necesita implementar el endpoint para enviar el formulario.

## SEO e indexación

El build publica `robots.txt`, `sitemap.xml`, URLs directas para cada servicio, canonicales, enlaces `hreflang` y JSON-LD para Catalina, el negocio, los servicios y las migas de navegación. También publica `llms.txt` como referencia breve para rastreadores y sistemas de respuestas. Esto mejora el descubrimiento y la interpretación, pero no garantiza posiciones ni citas en resultados de IA.

Después del primer deploy de producción:

1. Añade la URL pública como **Domain property** en [Google Search Console](https://search.google.com/search-console).
2. Verifica la propiedad, envía `https://catalinacobap-mauve.vercel.app/sitemap.xml` y solicita indexación para `/`, `/new-website/`, `/full-redesign/`, `/maintenance/` y `/custom-quote/`.
3. Añade el mismo sitio en [Bing Webmaster Tools](https://www.bing.com/webmasters/) y envía allí el sitemap.
4. El dominio canónico de producción es `https://www.catalinacobap.com`. Si cambia en el futuro, reemplázalo en `src/seo.js`, `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` y este README antes de publicar.

Español es la URL por defecto e inglés vive en `?lang=en`; el sitio genera canonicales y `hreflang` para ambas versiones. Mantén las descripciones visibles, precios, proyectos y datos de contacto consistentes con el JSON-LD para que buscadores y sistemas de IA reciban los mismos hechos.

## Páginas de servicios

La portada resume presentación, proyectos, reseñas, servicios, bio y contacto. Las reseñas se conservan completas.

- `/new-website/`: sitio nuevo, enfoque, precio inicial y alcance.
- `/full-redesign/`: rediseño, enfoque, precio inicial y alcance.
- `/maintenance/`: plan mensual/anual y condiciones.
- `/custom-quote/`: consulta gratuita con formulario.

Todas admiten `?lang=en` y `?lang=es`. Los CTA llevan el servicio seleccionado al formulario. Sitio nuevo y rediseño muestran una explicación previa y un único precio inicial de $1,000 USD, sin planes por número de páginas. `src/pages.js` contiene el copy breve de las páginas. `npm run build` genera un `index.html` por ruta, con metadatos propios, para que los enlaces directos y las recargas funcionen también en hosting estático. El envío de correo conserva los requisitos de configuración descritos arriba.
