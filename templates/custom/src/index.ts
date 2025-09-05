import { initializeReverseProxy, reverseProxy } from 'notehost'
import { SITE_CONFIG, NOTION_SITE_URL } from './site-config'

initializeReverseProxy(SITE_CONFIG)

export default {
  async fetch(request: Request): Promise<Response> {
    const response = await reverseProxy(request)
    
    // Only rewrite HTML responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
      return response
    }
    
    // Get the current domain from the request
    const url = new URL(request.url)
    const currentDomain = `${url.protocol}//${url.host}`
    
    // Use HTMLRewriter to parse and modify HTML
    const rewriter = new HTMLRewriter()
      .on('a', {
        element(element) {
          const href = element.getAttribute('href')
          const notionDomain = NOTION_SITE_URL.replace('https://', '')
          if (href && href.includes(notionDomain)) {
            // Replace Notion domain with current domain
            const newHref = href
              .replace(NOTION_SITE_URL, currentDomain)
              .replace(NOTION_SITE_URL.replace('https://', 'http://'), currentDomain)
            element.setAttribute('href', newHref)
          }
        }
      })
      .on('link', {
        element(element) {
          const href = element.getAttribute('href')
          const notionDomain = NOTION_SITE_URL.replace('https://', '')
          if (href && href.includes(notionDomain)) {
            // Also handle link elements (stylesheets, etc.)
            const newHref = href
              .replace(NOTION_SITE_URL, currentDomain)
              .replace(NOTION_SITE_URL.replace('https://', 'http://'), currentDomain)
            element.setAttribute('href', newHref)
          }
        }
      })
      // Also rewrite any inline styles or scripts that might contain the domain
      .on('*', {
        element(element) {
          // Check for onclick or other attributes that might have URLs
          const onclick = element.getAttribute('onclick')
          const notionDomain = NOTION_SITE_URL.replace('https://', '')
          if (onclick && onclick.includes(notionDomain)) {
            const newOnclick = onclick
              .replace(NOTION_SITE_URL, currentDomain)
              .replace(NOTION_SITE_URL.replace('https://', 'http://'), currentDomain)
            element.setAttribute('onclick', newOnclick)
          }
        }
      })
    
    return rewriter.transform(response)
  },
}