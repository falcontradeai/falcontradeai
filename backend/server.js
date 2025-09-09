const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sequelize, WatchlistItem, NewsItem, User } = require('./models');
const { scheduleMarketDataRefresh } = require('./services/marketDataService');

const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offers');
const rfqRoutes = require('./routes/rfqs');
const marketDataRoutes = require('./routes/marketData');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const watchlistRoutes = require('./routes/watchlist');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const forecastRoutes = require('./routes/forecast');
const contactRoutes = require('./routes/contact');
const contentRoutes = require('./routes/content');
const stripeWebhook = require('./webhooks/stripe');

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());

// Quick health check routes for Render
app.get('/', (req, res) => {
  res.status(200).send('FalconTrade backend is alive 🚀');
});

app.get('/docs', (req, res) => {
  res.status(200).json({ message: 'Docs placeholder' });
});

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors());

app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

app.get('/api/health/auth', (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(401);
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/rfqs', rfqRoutes);
app.use('/api/v1/market-data', marketDataRoutes);
app.use('/api/v1/forecast', forecastRoutes);
app.use('/api/v1/messages', messageRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/watchlist', watchlistRoutes);
  app.use('/api/v1/news', newsRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/contact', contactRoutes);
  app.use('/api/v1/content', contentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(async () => {
  console.log('Database synced ✅');

  // Ensure default admin user exists
  const [user, created] = await User.findOrCreate({
    where: { id: 1 },
    defaults: {
      username: "admin",
      password: "dummyhash", // You can later replace with bcrypt hash
      role: "admin", // role is required to satisfy model constraints
      status: "active",
      subscriptionStatus: "inactive",
    },
  });

  if (created) {
    console.log('Default admin user created with id=1');
  } else {
    console.log('Admin user already exists');
  }

  if (await WatchlistItem.count() === 0) {
    await WatchlistItem.bulkCreate([
      { userId: 1, symbol: 'AAPL', price: 150 },
      { userId: 1, symbol: 'GOOGL', price: 2800 },
    ]);
  }
  if (await NewsItem.count() === 0) {
    await NewsItem.bulkCreate([
      {
        title: 'Welcome to FalconTrade',
        content: 'Stay tuned for updates',
        publishedAt: new Date(),
      },
      {
        title: 'Trading Tips',
        content: 'Remember to diversify your portfolio.',
        publishedAt: new Date(),
      },
    ]);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  scheduleMarketDataRefresh();
});
