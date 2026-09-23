import { defineConfig, loadEnv } from 'vite';
import contact from './api/contact.js';

export default defineConfig(({mode}) => {
 const env = loadEnv(mode, process.cwd(), '');
 for (const key of ['RESEND_API_KEY','CONTACT_FROM_EMAIL']) {
  if (env[key]) process.env[key] = env[key];
 }
 const middleware = server => { server.middlewares.use('/api/contact', contact); };
 return {
  plugins:[{name:'local-contact-api',configureServer:middleware,configurePreviewServer:middleware}],
 };
});
