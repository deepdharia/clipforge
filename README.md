# ClipForge Video Studio

ClipForge is a browser-based video splitting workspace for turning long videos into short-form clips. Upload a local video, choose a crop ratio, trim a source range, split it into clips, and export locally in the browser.

## Run locally

Install dependencies with pnpm, then run the ClipForge web package with the workflow environment variables:

    pnpm install
    PORT=5173 BASE_PATH=/ pnpm --filter @workspace/clipforge run dev

Uploaded videos stay in the browser during editing.
