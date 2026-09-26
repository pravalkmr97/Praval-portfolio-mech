# Praval Kumar Portfolio

Portfolio site built with React, TypeScript, and Vite.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm ci
npm run dev
```

## Deploy with Cloudflare Pages

This is a static single-page app. Connect this Git repository to Cloudflare Pages and set:

- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

Cloudflare Pages will build and publish each push to the selected production branch, and create preview deployments for other branches and pull requests. The included `wrangler.jsonc` also describes the static assets and SPA fallback for Wrangler deployments.

## Firebase configuration

The app includes a Firebase client configuration in `firebase-applet-config.json`. Firebase web configuration is included in the client bundle, so access control must be enforced with Firebase Authentication and Firestore Security Rules. Review `firestore.rules` and deploy the intended rules to Firebase before enabling database access.

No Gemini API key is needed for the current portfolio UI. Never put private API keys in client-side environment variables or commit them to Git.
