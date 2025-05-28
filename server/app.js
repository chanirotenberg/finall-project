import express from 'express';
import cors from 'cors';
import logger from './utils/logger.js';

import authRouter from './routes/auth.js';
import hallRouter from './routes/halls.js';
import bookingRouter from './routes/bookings.js';
import reviewRouter from './routes/reviews.js';
import adminRouter from './routes/admin.js';
import userRouter from './routes/users.js'

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173' // עדכן לכתובת של הקליינט שלך
}));

// רוטים ראשיים
app.use('/auth', authRouter);
app.use('/halls', hallRouter);
app.use('/bookings', bookingRouter);
app.use('/reviews', reviewRouter);
app.use('/admin', adminRouter);
app.use('/users', userRouter);

// לוכד שגיאות גלובלי
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
