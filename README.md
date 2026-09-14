# SplitVideo — Split Videos Into Clips Online

**Fast, free, browser-based video splitter. No signup. No server uploads. Works entirely in your browser.**

Visit: **[splitvideo.in](https://splitvideo.in)**

## What It Does

Upload a video, select the parts you want, split it into equal-length clips, and download them instantly. Perfect for:
- Creating short clips from long-form videos
- Extracting highlights for social media
- Splitting lecture recordings or podcasts
- Trimming videos for specific platforms (Instagram Reels, TikTok, YouTube Shorts, etc.)

## Key Features

✅ **Upload & Preview** — Drag-and-drop or select your video  
✅ **Smart Timeline** — Select exact time ranges with precise controls  
✅ **Flexible Splitting** — Preset durations (15s, 30s, 60s) or custom lengths  
✅ **Multiple Formats** — Export as Portrait (9:16), Square (1:1), or Landscape (16:9)  
✅ **Batch Download** — Export single clips or all at once as ZIP  
✅ **100% Private** — All processing happens in your browser—nothing uploaded to servers  
✅ **No Registration** — Start using immediately, no account needed  
✅ **WebM Output** — Modern, high-quality video format with audio  

## How to Use

1. **Upload** a video (or load the demo to try it out first)
2. **Select** your time range on the timeline using the IN/OUT markers
3. **Choose** your output aspect ratio (Portrait, Square, or Landscape)
4. **Set** your split duration and click "Split into clips"
5. **Download** your clips individually or all together

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS + Radix UI
- **Video Processing**: Canvas API + MediaRecorder (client-side only)
- **Deployment**: Vercel
- **Routing**: Wouter (lightweight SPA router)

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Run development server (no env vars needed)
pnpm --filter @workspace/clipforge run dev

# Build for production
pnpm run build

# Preview production build
pnpm --filter @workspace/clipforge run serve
```

### Project Structure

```
artifacts/clipforge/
├── src/
│   ├── App.tsx              # Main app component with all video logic
│   ├── main.tsx             # Entry point
│   ├── components/          # Reusable UI components (Radix UI + custom)
│   ├── pages/               # Route pages
│   └── index.css            # Global styles
├── index.html               # HTML template with SEO meta tags
├── vite.config.ts           # Vite configuration (no env vars required)
├── tsconfig.json            # TypeScript config
└── package.json
```

## Deployment

### Vercel (Recommended)

```bash
# Connect your repo to Vercel
# No environment variables needed—defaults are built in
# Deploy on every push to main
```

The `vercel.json` config handles:
- SPA routing (all unknown paths → `/index.html`)
- Static asset caching (immutable, 1 year)
- HTML cache control (1 hour)

### Local Testing

```bash
# Build
pnpm --filter @workspace/clipforge run build

# Preview production build
cd artifacts/clipforge
pnpm run serve
# Open http://localhost:5173
```

## Browser Support

Works on any modern browser that supports:
- [Canvas API](https://caniuse.com/canvas)
- [MediaRecorder API](https://caniuse.com/mediarecorder)
- [WebM codec](https://caniuse.com/webm)

**Tested on:**
- Chrome/Chromium 90+
- Edge 90+
- Firefox 88+
- Safari 15+ (with video/webm support)

## Known Limitations

- **Video Duration**: Works best with videos up to 2 hours
- **Browser Memory**: Very large videos (4GB+) may exceed available browser memory
- **Format Support**: WebM output only (modern, efficient format; convert separately if needed)
- **Audio**: Audio is preserved from the original video
- **Mobile**: Full-featured on mobile, but timeline editing works better on desktop

## Privacy & Data

✅ **Zero Data Retention** — Videos are never uploaded or stored  
✅ **No Tracking** — No cookies, analytics, or user profiling  
✅ **No Ads** — Clean, focused experience  
✅ **Works Offline** — Once loaded, works without internet (video files are local)

## Roadmap

Planned improvements:
- [ ] MP4 export (in addition to WebM)
- [ ] Batch clip naming before export
- [ ] Drag-to-resize clips on timeline
- [ ] Clip preview before export
- [ ] Dark/Light mode toggle
- [ ] Keyboard shortcuts (← → to move timeline, etc.)
- [ ] ZIP download with custom folder structure

## Contributing

This project is built for production use. Bug reports and feature requests are welcome via GitHub Issues.

## License

MIT License — Use freely, modify, and redistribute.

## Support

- 📧 Questions? Open an issue on GitHub
- 🐛 Found a bug? Report it with browser/video details
- 💡 Have an idea? Suggest it in Discussions

---

**Made to be simple, fast, and honest.**

Built with care for creators, editors, and anyone who needs to split videos.

