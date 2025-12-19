This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Power Apps / Power Automate (Flow) Integration

This project exposes a proxy API at `GET/POST /api/powerapp` which forwards requests to a Power Automate Flow (trigger: **When an HTTP request is received**).

### Environment variables

Set these environment variables (see `env.example.txt`):

- `POWERAPP_FLOW_URL`: the Flow HTTP trigger URL (recommended: without secret key if possible)
- `POWERAPP_FLOW_KEY` (optional): appended as `?sig=...` (or `?code=...`) if your Flow requires a key and you don't want to hardcode it in the URL
- `POWERAPP_FLOW_KEY_PARAM` (optional): defaults to `sig` (use `code` if your Flow uses `code=...`)

### Local setup

Create `.env.local` (manually) and add:

```bash
POWERAPP_FLOW_URL="https://2cbaa891d220ed2a81dd0de71ec0b6.b0.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/7bb0663f5aab4d2ba5cd2b288ad35820/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hnKHyfaRvbv09syYAU0U2wAgeVhETwxN8ER2qIWwSlU"
POWERAPP_FLOW_KEY="optional"
POWERAPP_FLOW_KEY_PARAM="sig"
```

Then restart dev server: `npm run dev`.

### Vercel setup

In Vercel Project → **Settings** → **Environment Variables**, add:

- `POWERAPP_FLOW_URL`
- `POWERAPP_FLOW_KEY` (optional)
- `POWERAPP_FLOW_KEY_PARAM` (optional)

Redeploy after saving.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
