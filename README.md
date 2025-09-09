# FalconTrade

FalconTrade is a full-stack trading platform combining an Express backend and a Next.js frontend.

## Project Structure
- `backend/` – Express API server. See the [backend setup guide](./backend/README.md).
- `frontend/` – Next.js client application. See the [frontend setup guide](./frontend/README.md).

## Environment Setup

Copy the example environment files and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Deployment

### Render (Backend)
Deploy the Express API to [Render](https://render.com):
1. Create a new Web Service and connect the `backend` directory.
2. Set the build command to `npm install` and the start command to `npm start`.
3. Configure the following environment variables:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ID`
   - `FRONTEND_URL` – base URL of the frontend application
   - `CORS_ORIGINS` – optional comma-separated list of allowed origins for CORS
   - `JWT_SECRET`
   - `ALPHAVANTAGE_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `PORT` (optional)

### Vercel (Frontend)
Deploy the Next.js app to [Vercel](https://vercel.com):
1. Import the repository and select the `frontend` directory.
2. Set the build command to `npm run build` and the output directory to `.next`.
3. Configure the following environment variables:
   - `NEXT_PUBLIC_API_URL` – base URL of the backend API
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`

Environment variables on Vercel must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.
