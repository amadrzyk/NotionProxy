# NotionProxy Guide

NotionProxy is a free, open-source tool that enables you to serve your Notion website through your custom domain using Cloudflare Workers, providing URL rewriting and fast edge performance without any hosting costs.

## Step 1: Setup your Cloudflare account

1. Add your domain to Cloudflare. Make sure to click 'Manually enter DNS records". Also make sure that DNS doesn't have `A` records for your domain and no `CNAME` alias for `www`
2. Follow the steps to update your domain's nameservers to Cloudflare's. Steps may vary depending on which domain service you used to buy it. Changing the nameservers will ensure that any DNS routing goes through Cloudflare rather than your domain service. This step _may_ take a few hours, but usually it works within 10 minutes.
3. Create a new worker on Cloudflare. This is found under **Workers Routes > Manage Workers > Create > Start with Hello World**. Give it a meaningful name, e.g. `yourdomain-com-notion-proxy`.
4. Keep the default example worker code, we will overwrite it anyway during deploy (see below)

> [!TIP]
> A bit outdated but detailed description on how to add your domain to Cloudflare and create a worker is [here](https://stephenou.notion.site/stephenou/Fruition-Free-Open-Source-Toolkit-for-Building-Websites-with-Notion-771ef38657244c27b9389734a9cbff44).
>
> Search for "Step 1: Set up your Cloudflare account".

## Step 2: Set Up Necessary Files

Use the provided script to quickly set up your customized domain:

```bash
./initialize-new-domain.sh <new-domain> <notion-subdomain> <main-page-id> <cloudflare-worker-name>
```

**Example:**

```bash
./initialize-new-domain.sh mynewdomain.com my-notion-123 abc123def456ghi789jkl012mno345pq yourdomain-com-notion-proxy
```

**Parameters:**

- `new-domain`: Your custom domain (e.g., example.com)
- `notion-subdomain`: The subdomain part of your Notion URL (e.g., if your Notion URL is https://my-notion-123.notion.site, use 'my-notion-123')
- `main-page-id`: The Notion page ID for your main/home page
- `cloudflare-worker-name`: The name for your Cloudflare Worker (e.g., yourdomain-com-notion-proxy), the part before any periods

## Step 3: Configure Variables And Deploy!

1. Navigate to your new domain folder
2. Run `npm install`
3. Update `src/site-config.ts` with your specific metadata
4. Deploy with `npm run deploy`

## Important Notes

- The URL rewriting happens at the edge, ensuring fast performance
- All Notion pages are accessible via their page IDs automatically
