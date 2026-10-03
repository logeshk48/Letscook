# Let's cook Technologies — website

Next.js 15 (App Router) + TypeScript + GSAP/ScrollTrigger + Lenis.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit content
All text lives in `content/site.ts`. Add project screenshots to `public/work/` and set `image: "/work/name.webp"` on a project.

## Contact form email
Copy `.env.example` to `.env.local` and add a Resend API key. Without it, the form hands the message to WhatsApp.

## Deploy
Push to GitHub → import the repo on vercel.com → add the same env vars → connect your domain.
