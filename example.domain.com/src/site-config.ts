import { NoteHostSiteConfig, googleTag } from 'notehost'
import { PAGE_SCRIPT_JS_STRING } from './_page-script-js-string'

// Set this to your Google Tag ID from Google Analytics
const GOOGLE_TAG_ID = ''

// Centralized Notion site URL
export const NOTION_SITE_URL = 'https://example-notion-subdomain.notion.site'

export const SITE_CONFIG: NoteHostSiteConfig = {
  domain: 'example.domain.com',

  // Metatags, optional
  // For main page link preview
  siteName: 'Example Domain',
  siteDescription: 'Example website powered by Notion',
  siteImage: 'https://example.com/preview.jpg',

  // Twitter handle, optional
  // twitterHandle: '',

  // URL to custom favicon.ico
  // siteIcon: '',

  // Additional safety: avoid serving extraneous Notion content from your website
  // Use the value from your Notion settings => Workspace => Settings => Domain
  notionDomain: 'example-notion-subdomain',

  // Map slugs (short page names) to Notion page IDs
  // Empty slug is your main page
  slugToPage: {
    '': 'abc123def456ghi789jkl012mno345pq',
    // All other pages will use their Notion IDs directly in the URL
  },

  // Rewrite meta tags for specific pages
  // Use the Notion page ID as the key
  // pageMetadata: {
  //   'NOTION_PAGE_ID': {
  //     title: 'My Custom Page Title',
  //     description: 'My custom page description',
  //     image: 'https://imagehosting.com/images/page_preview.jpg',
  //     author: 'My Name',
  //   },
  // },

  // Subdomain redirects are optional
  // But it is recommended to have one for www
  subDomains: {
    www: {
      redirect: 'https://example.domain.com',
    },
  },

  // The 404 (not found) page is optional
  // If you don't have one, the default 404 page will be used
  // fof: {
  //   page: "NOTION_PAGE_ID",
  //   slug: "404", // default
  // },

  // Google Font name, you can choose from https://fonts.google.com
  googleFont: 'Roboto',

  // Custom JS for head and body of a Notion page
  customHeadCSS: ``,
  customHeadJS: googleTag(GOOGLE_TAG_ID),
  customBodyJS: PAGE_SCRIPT_JS_STRING,
}
