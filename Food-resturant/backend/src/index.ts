import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import mediaRoutes from './routes/mediaRoutes';
import settingsRoutes from './routes/settingsRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import homePageRoutes from './routes/homePageRoutes';
import aboutPageRoutes from './routes/aboutPageRoutes';
import contactRoutes from './routes/contactRoutes';
import stripeRoutes from './routes/stripeRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production allow only the known frontend origin.
// In development allow all origins for convenience.
const allowedOrigins = IS_PROD
  ? ['https://bongou.devnode.amgdigitalagency.com']
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (!IS_PROD || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (development only) ────────────────────────────────────────
if (!IS_PROD) {
  app.use((req, _res, next) => {
    console.log(`[DEV] ${req.method} ${req.url}`);
    next();
  });
}

// ── Static files for uploads ──────────────────────────────────────────────────
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
// Also serve uploads under the sub-path prefix (production Passenger)
app.use('/bongou-api/uploads', express.static(uploadsPath));

// ── API Routes ────────────────────────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/media', mediaRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/testimonials', testimonialRoutes);
apiRouter.use('/home-page', homePageRoutes);
apiRouter.use('/about-page', aboutPageRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/stripe', stripeRoutes);

// Mount under /api (local dev) AND /bongou-api/api (production Passenger — prefix not stripped)
app.use('/api', apiRouter);
app.use('/bongou-api/api', apiRouter);

// ── Dashboard stats ───────────────────────────────────────────────────────────
import { ProductModel } from './models/productModel';
import { CategoryModel } from './models/categoryModel';
import { UserModel } from './models/userModel';
import { authMiddleware, adminMiddleware, AuthRequest } from './middleware/auth';

apiRouter.get('/dashboard/stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const productStats = await ProductModel.getProductStats();
    const categoryStats = await CategoryModel.getCategoryStats();
    const orderStats = await ProductModel.getOrderStats();
    const users = await UserModel.getAll();

    res.json({
      stats: {
        products: productStats,
        categories: categoryStats,
        orders: orderStats,
        users: { total: users.length },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Bongou Food Restaurant API',
    env: process.env.NODE_ENV || 'development',
  });
});

// Health check under Passenger sub-path prefix
app.get('/bongou-api', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Bongou Food Restaurant API',
    env: process.env.NODE_ENV || 'development',
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Never leak stack traces to the client in production
  const message = IS_PROD ? 'Internal server error' : (err.message || 'Internal server error');
  if (!IS_PROD) console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[${process.env.NODE_ENV || 'development'}] Server running on port ${PORT}`);
});
