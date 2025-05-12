// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';
import Icons from 'unplugin-icons/vite';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'unplugin-icons/nuxt'],
  icons: {
    autoInstall: true,
    compiler: 'vue3',
  },
  typescript: {
    tsConfig: {
      include: [
        "./types/**/*"
      ]
    }
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
    },
  },
  nitro: {
    hooks: {
      "prerender:generate"(route) {
        const routesToSkip = ['/200.html', '/404.html']; 
        if (routesToSkip.includes(route.route) ) {
          route.skip = true;
        }
      },
    },
    output: {
      publicDir: path.join(__dirname, './dist')
    }
  },
  experimental: {
    payloadExtraction: false
  }
})
