# SplitVideo Deployment Guide

## Quick Start on Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Connect your repository to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select "Import Git Repository"
   - Paste: `https://github.com/deepdharia/clipforge`
   - Click "Continue"

2. **Configure the project**
   - Project name: `splitvideo` (or your preference)
   - Framework: `Other` (Vite handles it)
   - Root directory: `./artifacts/clipforge`
   - Build command: `pnpm run build`
   - Output directory: `dist/public`
   - Install command: `pnpm install`
   - **NO environment variables needed** — defaults are built in

3. **Add custom domain**
   - Go to project Settings → Domains
   - Add `splitvideo.in`
   - Follow DNS configuration steps

4. **Deploy**
   - Click "Deploy"
   - Vercel will auto-deploy on every push to `main`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project root
vercel

# Follow prompts, accept defaults, link to splitvideo.in
```

---

## Why This Setup Works

✅ **No Environment Variables Required**
- `vite.config.ts` uses sensible defaults (PORT=5173, BASE_PATH=/)
- Replit-specific plugins only load in Replit environment
- Works instantly on Vercel, local dev, or any platform

✅ **SPA Routing Configured**
- `vercel.json` redirects all unknown routes to `/index.html`
- Wouter client-side router handles path-based navigation

✅ **Static Assets Cached**
- JS, CSS, images cached immutably for 1 year
- HTML cached for 1 hour (busts on deploy)

✅ **Monorepo-Ready**
- Root `package.json` handles TypeScript build
- Workspace packages referenced correctly
- All dependencies resolved by pnpm

---

## Local Testing Before Deploy

### Build Locally

```bash
cd artifacts/clipforge

# Install deps
pnpm install

# Build
pnpm run build

# Output goes to: artifacts/clipforge/dist/public
```

### Test Production Build

```bash
# From artifacts/clipforge directory
pnpm run serve

# Open http://localhost:5173
# Test video upload, splitting, download
```

---

## Troubleshooting

### "Build command failed"

**Check the build logs:**
- Vercel shows logs in the deployment dashboard
- Look for TypeScript errors or missing dependencies

**Common fixes:**
```bash
# Ensure all workspace deps are installed
pnpm install

# Clear cache
rm -rf node_modules
pnpm install

# Rebuild
pnpm run build
```

### "Page not found" (routing broken)

**Verify `vercel.json` exists** at repo root:
```json
{
  "routes": [
    {
      "src": "^/(?!.*\\.(js|css|ico|svg|webp|png|jpg|jpeg|gif|woff|woff2|eot|ttf|otf|webmanifest)).*$",
      "destination": "/index.html"
    }
  ]
}
```

### Video upload not working

- Check browser console for errors
- Ensure you're on HTTPS (Vercel enforces this)
- Test with a small video file first

---

## Environment Variables (Not Required)

If you ever need to override defaults:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5173` | Dev server port (ignored on Vercel) |
| `BASE_PATH` | `/` | URL prefix (only if deploying to subpath) |
| `NODE_ENV` | `production` | Build mode (auto-set by Vercel) |

**You don't need to set these for Vercel deployment.**

---

## DNS Setup for splitvideo.in

After adding custom domain in Vercel:

### Step 1: Update nameservers at domain registrar
Change nameservers to Vercel's:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

### Step 2: Verify in Vercel
- Go to project Settings → Domains
- Vercel shows status (typically takes 15-60 minutes)

### Step 3: Test
```bash
# Verify DNS resolves
nslookup splitvideo.in

# Should show Vercel's IPs
```

---

## Monitoring & Logs

### View Build Logs
```
Vercel Dashboard → Project → Deployments → Click deploy → Logs
```

### View Runtime Logs
```
Vercel Dashboard → Project → Logs → Runtime
```

### Analytics
```
Vercel Dashboard → Project → Analytics
- Shows build time, response times, regions
```

---

## Scaling & Performance

SplitVideo is a **static site** after build—Vercel serves it globally via edge cache.

### Expected Performance
- Build time: ~45-60 seconds
- Time to First Byte (TTFB): <100ms (global)
- JavaScript size: ~600KB gzipped
- Fully cached assets: instant

### If Performance Degrades
1. Check Vercel's status dashboard
2. Review recent code changes in logs
3. Test with production build locally
4. Clear Vercel cache: Project Settings → Advanced → Clear Build Cache

---

## Continuous Deployment

**Auto-deploy on every push to `main`:**

1. Vercel webhook auto-triggers on GitHub push
2. Runs build command: `pnpm run build`
3. Deploys to production if build succeeds
4. Rollback available via Deployment history

**Preview deployments:**
- Every pull request gets auto-preview URL
- Test before merging to main

---

## Custom Domain SSL Certificate

Vercel automatically:
- Generates free SSL via Let's Encrypt
- Redirects HTTP → HTTPS
- Renews certificates automatically

**No action needed from you.**

---

## Backup & Rollback

### View Deployment History
```
Vercel Dashboard → Project → Deployments
```

### Rollback to Previous Deploy
```
Vercel Dashboard → Deployments → Click past deploy → "Redeploy"
```

---

## Cleanup & Costs

**Vercel Hobby Plan (Free tier includes):**
- Unlimited deployments
- Edge caching globally
- Custom domains
- SSL certificates
- Serverless functions (not used here)

**No costs for static sites.**

---

## Next Steps

1. ✅ Ensure `vercel.json` is in repo root
2. ✅ Ensure `vite.config.ts` has no required env vars
3. ✅ Connect GitHub repo to Vercel
4. ✅ Add custom domain
5. ✅ Deploy & test
6. ✅ Update DNS at registrar

**That's it. You're live.**

---

## Support

- Vercel docs: https://vercel.com/docs
- Vite deployment: https://vitejs.dev/guide/build.html
- Questions: Check GitHub Issues or Vercel support

