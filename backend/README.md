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
