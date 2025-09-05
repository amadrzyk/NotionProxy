/* eslint-disable func-names */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

// Configure the Notion site URL - this should match the value in site-config.ts
const NOTION_SITE_URL = 'https://example-notion-subdomain.notion.site'
const NOTION_DOMAIN = 'example-notion-subdomain.notion.site'

// This script is injected into the Notion page and runs on every page load.
window.onload = function () {
  // Intercept all click events on links
  document.addEventListener('click', function(e) {
    // Find the closest anchor tag
    const link = e.target.closest('a')

    if (link && link.href && link.href.includes(NOTION_DOMAIN)) {
      e.preventDefault()
      e.stopPropagation()

      const currentDomain = window.location.origin
      const newUrl = link.href.replace(NOTION_SITE_URL, currentDomain)

      window.location.href = newUrl
    }
  }, true) // Use capture phase to intercept before Notion's handlers

  setInterval(() => {
    // Remove all Notion tooltips on images
    document
      .querySelectorAll('div[style*="position: absolute; top: 4px;"]')
      ?.forEach((el) => (el.style.display = 'none'))

    // Remove hidden properties dropdown
    const propertiesDropdown = document.querySelector('div[aria-label="Page properties"]')?.nextElementSibling

    if (propertiesDropdown) {
      propertiesDropdown.style.display = 'none'
    }

    // Rewrite all Notion links to use the current domain
    document.querySelectorAll('a[href*="' + NOTION_DOMAIN + '"]').forEach((link) => {
      const currentDomain = window.location.origin

      link.href = link.href.replace(NOTION_SITE_URL, currentDomain)
    })
  }, 1000)
}
