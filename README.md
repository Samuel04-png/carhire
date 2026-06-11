# Dots Car Hire

Premium car hire website and admin dashboard for Dots Car Hire.

## Local development

Prerequisites:
- Node.js 20+

Run locally:
1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Start the API server with `npm run server:start` if you want MTN MoMo endpoints
4. Start the frontend with `npm run dev`
5. Open `http://localhost:3000`

## Firebase backend setup

This project is now wired for:
- Firebase Auth client setup
- Firestore app-state persistence
- Firebase Storage vehicle image uploads
- Express server for MTN MoMo payment endpoints

### Firestore document

The app persists operational state into:
- Collection: `dotsCarHire`
- Document: `primary`

Stored state includes:
- vehicles
- clients
- drivers
- bookings
- bookingDraft
- customerSessionId
- adminRole
- adminSettings

### Storage paths

Vehicle uploads are stored under:
- `vehicle-images/{vehicle-name}/{timestamp}-{vehicle-name}.{ext}`

### Recommended Firebase rules for initial testing

Use temporary authenticated/dev-friendly rules first, then tighten them before production.
At minimum, ensure the frontend can:
- read/write the `dotsCarHire/primary` Firestore document
- upload/read files under `vehicle-images/`

## Scripts

- `npm run dev` starts the Vite dev server on port `3000`
- `npm run dev:server` starts the Express API in watch mode
- `npm run server:start` starts the Express API once
- `npm run build` creates the production build
- `npm run preview` previews the production build locally
- `npm run lint` runs TypeScript checks

## Notes

- Firebase web config is read from Vite env vars and currently seeded in `.env.example`.
- Firestore hydrates the Zustand app state on startup and persists changes after edits.
- Fleet admin now supports uploading vehicle images directly to Firebase Storage.
- MTN MoMo secrets must remain server-side and should not be moved into client code.
- If hot reload is unstable in your local environment, set `DISABLE_HMR="true"` in `.env.local`.
