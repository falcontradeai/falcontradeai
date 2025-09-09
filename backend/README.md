# FalconTrade Backend

Express backend for FalconTrade platform.

## Database

Run migrations to create database tables:

```bash
npm run migrate
```

Populate the database with sample data:

```bash
npm run seed
```

This loads initial market data from `data/marketData.json` so scheduled refreshes have historical prices to build on.

## Environment Variables

The backend expects configuration via environment variables. Copy `.env.example` to `.env` and provide values. In particular:

- `FRONTEND_URL` — base URL of the frontend application used in verification and password reset emails and for CORS.
- `CORS_ORIGINS` — optional comma-separated list of allowed origins for CORS. Defaults to `FRONTEND_URL`.
- `TRADING_ECONOMICS_KEY` — credentials for the TradingEconomics API in the form `username:password` (defaults to `guest:guest`).
- `DATABASE_URL` — connection string for the PostgreSQL database.
- `JWT_SECRET` — secret used to sign JWT tokens.
- `STRIPE_SECRET_KEY` — Stripe API key for processing payments.
- `EMAIL_USER` and `EMAIL_PASS` — credentials for the email account used to send notifications.
