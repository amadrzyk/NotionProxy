#!/bin/bash

# Script to duplicate the example domain folder for a new domain

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Usage: ./initialize-new-domain.sh <new-domain> <notion-subdomain> <main-page-id> <cloudflare-worker-name>"
    echo "Example: ./initialize-new-domain.sh example.com my-notion-123 abc123def456ghi789jkl012mno345pq my-worker-name"
    echo ""
    echo "Where:"
    echo "  <new-domain>: Your custom domain (e.g., example.com)"
    echo "  <notion-subdomain>: The subdomain part of your Notion URL (e.g., if your Notion URL is"
    echo "                      https://my-notion-123.notion.site, use 'my-notion-123')"
    echo "  <main-page-id>: The Notion page ID for your main/home page"
    echo "  <cloudflare-worker-name>: The name for your Cloudflare Worker (e.g., my-site-worker)"
    exit 1
fi

NEW_DOMAIN=$1
NOTION_SUBDOMAIN=$2
MAIN_PAGE_ID=$3
WORKER_NAME=$4
SOURCE_DIR="example.domain.com"  # Change this to your template domain folder
TARGET_DIR="$NEW_DOMAIN"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory '$SOURCE_DIR' not found!"
    exit 1
fi

# Check if target directory already exists
if [ -d "$TARGET_DIR" ]; then
    echo "Error: Directory '$TARGET_DIR' already exists!"
    echo "Please remove it first or choose a different domain name."
    exit 1
fi

echo "Creating new domain setup for: $NEW_DOMAIN"
echo "Using Notion subdomain: $NOTION_SUBDOMAIN"
echo "Main page ID: $MAIN_PAGE_ID"
echo "Cloudflare Worker name: $WORKER_NAME"
echo ""

# Copy the entire example.domain.com directory
echo "Copying files..."
cp -r "$SOURCE_DIR" "$TARGET_DIR"

# Remove node_modules and .wrangler if they exist
rm -rf "$TARGET_DIR/node_modules"
rm -rf "$TARGET_DIR/.wrangler"
rm -f "$TARGET_DIR/.DS_Store"

# Update wrangler.toml
echo "Updating wrangler.toml..."
# Update the worker name with the user-provided name
sed -i '' "s/name = \".*\"/name = \"$WORKER_NAME\"/g" "$TARGET_DIR/wrangler.toml"

# Update the routes section with the new domain
sed -i '' "s/example\.domain\.com/$NEW_DOMAIN/g" "$TARGET_DIR/wrangler.toml"
sed -i '' "s/www\.example\.domain\.com/www.$NEW_DOMAIN/g" "$TARGET_DIR/wrangler.toml"

# Update site-config.ts
echo "Updating site-config.ts..."
# Get the source domain from the source directory's site-config.ts
SOURCE_DOMAIN=$(grep "domain:" "$SOURCE_DIR/src/site-config.ts" | sed "s/.*domain: '\(.*\)'.*/\1/")
SOURCE_NOTION=$(grep "notionDomain:" "$SOURCE_DIR/src/site-config.ts" | sed "s/.*notionDomain: '\(.*\)'.*/\1/")
SOURCE_PAGE_ID=$(grep "'': '" "$SOURCE_DIR/src/site-config.ts" | sed "s/.*'': '\(.*\)'.*/\1/")

# Replace with new values
sed -i '' "s/$SOURCE_DOMAIN/$NEW_DOMAIN/g" "$TARGET_DIR/src/site-config.ts"
sed -i '' "s/$SOURCE_NOTION/$NOTION_SUBDOMAIN/g" "$TARGET_DIR/src/site-config.ts"
sed -i '' "s/$SOURCE_PAGE_ID/$MAIN_PAGE_ID/g" "$TARGET_DIR/src/site-config.ts"

# Update package.json
echo "Updating package.json..."
sed -i '' "s/$SOURCE_DOMAIN/$NEW_DOMAIN/g" "$TARGET_DIR/package.json"

# Update page-script.js
echo "Updating page-script.js..."
FULL_NOTION_URL="https://$NOTION_SUBDOMAIN.notion.site"
SOURCE_FULL_NOTION="https://$SOURCE_NOTION.notion.site"
sed -i '' "s|$SOURCE_FULL_NOTION|$FULL_NOTION_URL|g" "$TARGET_DIR/src/page-script.js"
sed -i '' "s|$SOURCE_NOTION\.notion\.site|$NOTION_SUBDOMAIN.notion.site|g" "$TARGET_DIR/src/page-script.js"

echo ""
echo "✅ Successfully created $TARGET_DIR!"
echo ""
echo "Next steps:"
echo "1. cd $TARGET_DIR"
echo "2. npm install"
echo "3. Review and update src/site-config.ts with your specific settings:"
echo "   - Update siteName, siteDescription, siteImage"
echo "   - Add any additional page slugs"
echo "   - Configure other options as needed"
echo "4. npm run deploy"