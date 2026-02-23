# Deployment Guide

This application is set up to be deployed on platforms like Netlify, Vercel, or any Node.js hosting.

## Database Setup (Netlify / Serverless)

The application uses **LibSQL** (compatible with SQLite), which allows it to run:
1.  **Locally:** Using a local file (`server/data/app.db`).
2.  **In Production (Netlify):** Using a remote database like **Turso**.

### Steps to Deploy with Database:

1.  **Create a Turso Database:**
    *   Sign up at [turso.tech](https://turso.tech).
    *   Create a new database.
    *   Get the **Database URL** (e.g., `libsql://...`) and **Auth Token**.

2.  **Configure Environment Variables:**
    In your Netlify site settings (Site Configuration > Environment variables), add:

    *   `TURSO_DATABASE_URL`: Your Turso Database URL.
    *   `TURSO_AUTH_TOKEN`: Your Turso Auth Token.
    *   `JWT_SECRET`: A strong secret key for authentication.
    *   `NODE_ENV`: Set to `production`.

3.  **Build Command:**
    *   `npm run build`

4.  **Start Command (if using a long-running server):**
    *   `npm start`

    *Note: If deploying as Serverless Functions on Netlify, you may need to adapt the `server/server.ts` to export a handler compatible with Netlify Functions (e.g., using `serverless-http`), as the current setup is a standalone Express server.*

## Local Development

1.  Copy `.env.example` to `.env`.
2.  Run `npm run dev`.
3.  The app will use the local SQLite file by default.
