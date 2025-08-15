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
