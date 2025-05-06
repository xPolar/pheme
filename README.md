# notion about page proxy

a cloudflare worker that serves as a proxy for fetching and formatting about page data from a notion database. this service provides a clean api endpoint that returns formatted team member information, making it easy to integrate notion-managed team data into our website.

## features

- fetches team member data from a notion database
- handles pagination automatically for large datasets
- returns clean, formatted json data including:
  - display name
  - bio
  - profile image (webp format)
  - social links (twitter, github, linkedin)
  - runpod mixtape url
- built with typescript for type safety
- runs on cloudflare workers for optimal performance

## prerequisites

- node.js (v16 or higher recommended)
- pnpm
- a notion integration token
- a notion database with the required structure

## setup

1. clone the repository:

```bash
git clone https://github.com/runpod/notion-about-page-proxy
cd notion-about-page-proxy
```

2. install dependencies:

```bash
pnpm install
```

3. create a `.dev.vars` file in the root directory with your notion token:

```
NOTION_TOKEN=your_notion_integration_token
```

4. configure your notion database:
   - ensure your database has the following properties:
     - display name (title)
     - bio (rich text)
     - image (.webp only) (files)
     - twitter (url)
     - runpod mixtape (url)
     - linkedin (url)
     - github (url)

## development

start the development server:

```bash
wrangler dev
```

## deployment

deploy to cloudflare workers:

```bash
wrangler deploy
```

don't forget to set your `NOTION_TOKEN` in the cloudflare workers environment variables.

## api response format

```typescript
[
  {
    name: string;
    bio: string;
    image: string;
    twitter: string | null;
    runpodMixtape: string | null;
    linkedin: string | null;
    github: string | null;
  }
]
