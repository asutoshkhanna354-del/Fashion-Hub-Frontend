# Solanki Vastra - Deployment Guide

This guide contains the instructions and environment variables required to deploy the Solanki Vastra application. The application consists of a Next.js frontend (to be deployed on Netlify) and a Node.js/Express backend (to be deployed on Render).

## 1. Backend Deployment (Render)

### Pre-requisites
1. A Render account (https://render.com).
2. A Neon PostgreSQL database URL.
3. A Brevo API key for sending emails.
4. A Pay0 Merchant account for UPI payments.

### Deployment Steps
1. Create a new **Web Service** on Render connected to your Git repository.
2. Set the root directory to `Solanki-Vastra-sarees-backend` (or wherever the backend code resides).
3. Set the Environment to `Node`.
4. Build Command: `npm install && npx prisma generate && npx tsc`
5. Start Command: `npm start`
6. Add the following Environment Variables in the Render dashboard:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Port for the server (Render sets this automatically) | `3001` |
| `DATABASE_URL` | Neon Postgres Database URL | `postgresql://user:pass@ep-rest-of-url.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_very_long_secure_random_string` |
| `BREVO_API_KEY` | API key from Brevo for OTP emails | `xkeysib-...` |
| `PAY0_MERCHANT_ID` | Merchant ID from Pay0 | `your_merchant_id` |
| `PAY0_SECRET_KEY` | Secret Key from Pay0 | `your_secret_key` |
| `FRONTEND_URL` | URL of the deployed frontend (for CORS and redirects) | `https://your-netlify-url.netlify.app` |

### Post-Deployment
After deploying, the database needs to be synced. You can run `npx prisma db push` or `npx prisma migrate deploy` locally pointing to the remote DB to apply the schema, or you can add a script in your `package.json` to run it automatically on build.

## 2. Frontend Deployment (Netlify)

### Pre-requisites
1. A Netlify account (https://netlify.com).
2. The URL of your deployed backend on Render.
3. A Google Maps API key (for address autocomplete - *feature ready to be enabled*).

### Deployment Steps
1. Create a new site on Netlify from your Git repository.
2. Set the base directory to `Solanki-Vastra-sarees` (or wherever the frontend code resides).
3. Build Command: `npm run build`
4. Publish directory: `.next` (Netlify will automatically detect Next.js and use the Essential Next.js plugin).
5. Add the following Environment Variables in the Netlify dashboard:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the deployed backend on Render | `https://your-backend-url.onrender.com/api` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for address autocomplete | `AIzaSy...` |

### Note on Dynamic Routes
The Next.js configuration has been updated to remove `output: 'export'` because the application relies heavily on dynamic routes (e.g., `/sarees/[id]`, `/collections/[id]`) and dynamic search parameters (`/checkout/status?order_id=...`). Netlify's Next.js adapter handles this natively, turning your application into a fully functional Server-Side Rendered (SSR) app where necessary.

## 3. Initial Setup

Once both frontend and backend are deployed:
1. Access the frontend URL.
2. Navigate to the Admin Login (`/admin/login`).
3. If no admin users exist, you might need to seed the database initially using the `/src/seed.ts` script in the backend, or by manually inserting a user in the Neon database to act as the first `main_admin`.

**Seed Script execution (Local):**
```bash
# In the backend directory with DATABASE_URL set
npx ts-node src/seed.ts
```
Default credentials from seed:
- Username: `Noor_Admin`
- Password: `Noor@Silks`

