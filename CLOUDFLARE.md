# Cloudflare deployment

This project deploys to Cloudflare Workers with OpenNext. Admin reviews, customer moments, orders, store data, and uploaded product images are stored in the `khmer-tattoo-studio` R2 bucket through the `STUDIO_STORAGE` binding.

## First-time setup

1. Authenticate and create the R2 bucket:

   ```powershell
   npx wrangler login
   npx wrangler r2 bucket create khmer-tattoo-studio
   ```

2. In Cloudflare R2, enable a public custom domain for the bucket, such as `media.khmerbamboosakyant.com`.

3. Add Worker variables/secrets. Do not commit their real values:

   ```powershell
   npx wrangler secret put ADMIN_UPLOAD_TOKEN
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler secret put R2_PUBLIC_URL
   ```

   `R2_PUBLIC_URL` is the public R2 origin without a trailing slash, for example `https://media.khmerbamboosakyant.com`.

4. Deploy:

   ```powershell
   npm run deploy
   ```

5. Attach `www.khmerbamboosakyant.com` as the Worker's custom domain, then update the domain's DNS in Cloudflare.

## Existing Vercel data

Creating the R2 bucket does not copy existing Vercel Blob objects. Before changing DNS, copy these prefixes from the existing Blob store into R2 while keeping their object keys:

- `reviews/`
- `review-moments/`
- `store/`
- `orders/`

The old JSON files can contain Vercel image URLs. Re-upload those images from the admin dashboard or update the URLs in the copied JSON after the image objects are transferred.

## Local verification

`npm run dev` uses local R2 emulation. `npm run preview` runs the complete app in the Cloudflare Workers runtime and is the closest check to production.
