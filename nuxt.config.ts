// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
  plugins: ['~/plugins/socket.client'],
  nitro: {
    entry: process.env.NODE_ENV == 'production' ? undefined : "../preset/entry.dev",
    preset: "./preset",
  },
})
