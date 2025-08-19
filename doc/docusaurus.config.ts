import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import path from 'path';
import type * as Preset from '@docusaurus/preset-classic';
// import type { ScalarOptions } from '@scalar/docusaurus';
// import ServeWithoutI18NContext from './plugins/serve-without-i18n';
// import serveWithoutI18n from './plugins/serve-without-i18n';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Appwrite Function Router',
  tagline: 'A simple router for Appwrite Functions',
  favicon: 'img/afr-logo-maze.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://appwrite-fn-router.kaibun.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kaibun', // Usually your GitHub org/user name.
  projectName: 'appwrite-fn-router', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
      fr: {
        label: 'Français',
        htmlLang: 'fr-FR',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/kaibun/appwrite-fn-router/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/kaibun/appwrite-fn-router/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            './src/css/custom.css',
            require.resolve('@scalar/api-reference-react/style.css'),
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Appwrite Function Router',
      logo: {
        alt: 'Appwrite Function Router Logo',
        src: 'img/afr-logo-maze.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          to: '/scalar',
          label: 'Live Tests',
          position: 'left',
        },
        { type: 'localeDropdown', position: 'right' },
        {
          label: 'GitHub',
          href: 'https://github.com/kaibun/appwrite-fn-router',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     // {
        //     //   label: 'Stack Overflow',
        //     //   href: 'https://stackoverflow.com/questions/tagged/appwrite-fn-router',
        //     // },
        //     // {
        //     //   label: 'Discord',
        //     //   href: 'https://discordapp.com/invite/kaibun',
        //     // },
        //     {
        //       label: 'X',
        //       href: 'https://x.com/docusaurus',
        //     },
        //   ],
        // },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/kaibun/appwrite-fn-router',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kaibun. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.vsLight, // Thème clair moderne (ou essayez prismThemes.palenight, prismThemes.oneLight...)
      darkTheme: prismThemes.dracula, // Thème sombre populaire
      magicComments: [
        // Conserver le highlight classique
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        // Ligne ajoutée (vert)
        {
          className: 'code-block-added-line',
          line: 'added-next-line',
          block: { start: 'added-start', end: 'added-end' },
        },
        // Ligne modifiée (bleu)
        {
          className: 'code-block-modified-line',
          line: 'modified-next-line',
          block: { start: 'modified-start', end: 'modified-end' },
        },
        // Ligne supprimée (rouge, style barré)
        {
          className: 'code-block-removed-line',
          line: 'removed-next-line',
          block: { start: 'removed-start', end: 'removed-end' },
        },
        // Ligne non modifiée
        {
          className: 'code-block-unchanged-line',
          line: 'unchanged-next-line',
          block: { start: 'unchanged-start', end: 'unchanged-end' },
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    require.resolve('./plugins/webpack-alias.js'),
    // serveWithoutI18n,
    [
      'docusaurus-plugin-typedoc',

      // Options
      {
        entryPoints: ['../src/main.ts', '../types/index.d.ts'],
        tsconfig: 'tsconfig.json',
        out: 'api',
        readme: 'none',
        sidebar: {
          typescript: true,
          pretty: true,
        },
      },
    ],
    // [
    //   '@scalar/docusaurus',
    //   {
    //     label: 'Live Tests',
    //     route: '/scalar',
    //     showNavLink: true, // optional, default is true
    //     configuration: {
    //       url:
    //         process.env.NODE_ENV === 'production'
    //           ? 'https://raw.githubusercontent.com/kaibun/appwrite-fn-router/refs/heads/docusaurus-scalar/openapi/tsp-output/schema/openapi.0.1.0.yaml'
    //           : 'http://localhost:3001/static/openapi.yaml',
    //       proxyUrl: 'https://proxy.scalar.com',
    //     },
    //   } as ScalarOptions,
    // ],
  ],
};

export default config;
