# Quick Start Guide

## For Users

### Online (Production)
1. Visit **[splitvideo.in](https://splitvideo.in)**
2. Click "Upload video" or "Load demo"
3. Select your time range on the timeline
4. Click "Split into clips"
5. Download individual clips or all at once

**That's it. No signup, no account, no tracking.**

---

## For Developers

### Local Development

**Prerequisites:**
- Node.js 18+
- pnpm 8+

**Setup (5 minutes):**

```bash
# 1. Clone the repo
git clone https://github.com/deepdharia/clipforge.git
cd clipforge

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm --filter @workspace/clipforge run dev

# 4. Open browser
# Visit: http://localhost:5173
```

**That's it. No environment variables to set up.**

### Build for Production

```bash
# Build all packages
pnpm run build

# Output: artifacts/clipforge/dist/public

# Test production build locally
cd artifacts/clipforge
pnpm run serve
# Visit: http://localhost:5173 (production build)
```

### Code Structure

```
artifacts/clipforge/
├── src/
│   ├── App.tsx              ← Main component (all video logic here)
│   ├── main.tsx             ← Entry point
│   ├── components/          ← Reusable UI components
│   ├── pages/               ← Route pages
│   └── index.css            ← Global styles
├── index.html               ← HTML template with SEO tags
├── vite.config.ts           ← Build config (no env vars required)
├── tsconfig.json            ← TypeScript config
└── package.json
```

### Make a Change

```bash
# 1. Edit src/App.tsx or other files

# 2. Dev server auto-refreshes (HMR)

# 3. Test your changes

# 4. Commit and push
git add .
git commit -m "feat: your change here"
git push origin feat/production-ready-splitvideo

# 5. Create PR on GitHub
# Vercel auto-generates preview URL for testing
```

---

## For DevOps / Deployment

### Deploy to Production

**Option 1: GitHub + Vercel (Recommended)**

```bash
# 1. Push to main branch
git push origin main

# 2. Vercel auto-deploys
# Watch: https://vercel.com/dashboard

# 3. Configure domain at registrar
# Point nameservers to Vercel (see DEPLOYMENT.md)
```

**Option 2: Vercel CLI**

```bash
# Install
npm install -g vercel

# Deploy
vercel

# Link to splitvideo.in when prompted
```

### Environment Variables

**None required.**

The app includes sensible defaults:
- `PORT` defaults to `5173`
- `BASE_PATH` defaults to `/`
- `NODE_ENV` auto-set by Vercel

If you need to override (rare), you can set them, but it's not necessary.

### Monitoring

**Vercel Dashboard:**
- Deployments, build logs, analytics
- https://vercel.com/dashboard

**Local testing:**
```bash
pnpm --filter @workspace/clipforge run serve
# Open http://localhost:5173
# Test video upload, split, download
```

---

## Troubleshooting

### "npm ERR! Unsupported engine"

```bash
# Use pnpm, not npm
pnpm install
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Build fails locally

```bash
# Clear cache and rebuild
pnpm run build --force
```

### Video upload not working

- Check browser console (F12)
- Ensure you're testing with HTTPS on production
- Try a smaller video file first
- Ensure browser supports MediaRecorder API (Chrome, Firefox, Edge)

### "Page not found" after deploy

- Verify `vercel.json` exists at repo root
- Verify `base` in `vite.config.ts` is correct
- Check Vercel build logs for errors

---

## Key Files

| File | Purpose |
|------|---------|
| `artifacts/clipforge/src/App.tsx` | Main video splitting logic and UI |
| `artifacts/clipforge/vite.config.ts` | Build configuration (no env vars required) |
| `artifacts/clipforge/index.html` | HTML template with SEO meta tags |
| `vercel.json` | Vercel deployment config (SPA routing, caching) |
| `README.md` | User-facing documentation |
| `DEPLOYMENT.md` | Deployment guide for production |
| `CHANGELOG.md` | What changed and why |

---

## Common Tasks

### Add a new feature

1. Edit `artifacts/clipforge/src/App.tsx`
2. Test locally (`pnpm --filter @workspace/clipforge run dev`)
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin main`
5. Vercel auto-deploys

### Fix a bug

1. Reproduce locally
2. Edit the relevant file
3. Test the fix
4. Commit: `git commit -m "fix: description"`
5. Push: `git push origin main`

### Update documentation

1. Edit `.md` files
2. Commit: `git commit -m "docs: description"`
3. Push: `git push origin main`

### Check deployment status

```bash
# View build logs
# https://vercel.com/dashboard → project → Deployments

# View live site
# https://splitvideo.in
```

---

## Resources

- **Vite docs**: https://vitejs.dev
- **React docs**: https://react.dev
- **Vercel docs**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/docs

---

## Questions?

- Check `DEPLOYMENT.md` for deployment questions
- Check `README.md` for feature questions
- Check `CHANGELOG.md` for what changed
- Open a GitHub Issue for bugs or suggestions

---

**Happy coding!**
