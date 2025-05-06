# pheme

a cloudflare worker that serves as a webhook forwarding service. this service provides a simple way to forward incoming webhooks to multiple destinations, making it easy to broadcast notifications and events to various endpoints.

## prerequisites

- node.js (v16 or higher recommended)
- pnpm
- access to cloudflare workers
- a d1 database instance

## setup

1. clone the repository:

```bash
git clone https://github.com/xpolar/pheme
cd pheme
```

2. install dependencies:

```bash
pnpm install
```

3. ensure your wrangler.toml is configured with your d1 database instance

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

## api response format

```typescript
[
  {
    success: boolean,
    success_count: number,
    error_count: number,
    errors: {
      destination: string;
      status: number;
      statusText: string;
      body: string;
    }[],
  }
]
```
