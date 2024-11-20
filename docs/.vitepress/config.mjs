import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/guts-explorer-frontend/docs/",
  title: "Explorer Docs",
  description: "Developer Documentation",
  head: [['link', { rel: 'icon', href: '/guts-explorer-frontend/docs/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo_guts.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get started', link: '/overview' }
    ],

    sidebar: [
      {
        items: [
          { text: 'Overview', link: '/overview' },
        ]
      },
      {
        text: 'Design',
        items: [
          { text: 'Application design', link: '/design' },
          { text: 'The backend', link: '/backend' },
          { text: 'The frontend', link: '/frontend' },
        ]
      },
      {
        text: 'Development setup (TODO)',
        items: [
        ]
      },
      {
        text: 'Deployment (TODO)',
        items: [
        ]
      },
      {
        text: 'Backend API Docs (TODO)',
        items: [
        ]
      },
      {
        text: 'Contributing (TODO)',
        link: '/contributing'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/guts-consortium/guts-explorer-frontend' }
    ]
  }
})
